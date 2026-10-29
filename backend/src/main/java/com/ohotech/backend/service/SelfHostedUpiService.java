package com.ohotech.backend.service;

import com.ohotech.backend.dto.UpiCheckoutResponseDto;
import com.ohotech.backend.dto.UpiCheckoutStatusDto;
import com.ohotech.backend.entity.*;
import com.ohotech.backend.exception.BadRequestException;
import com.ohotech.backend.exception.ResourceNotFoundException;
import com.ohotech.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class SelfHostedUpiService {

    @Value("${app.upi.merchant-name:OHO TECH SOLUTIONS PVT LTD}")
    private String defaultMerchantName;

    @Value("${app.upi.id:9937591330@indianbk}")
    private String defaultUpiId;

    @Value("${app.upi.slot-lease-minutes:10}")
    private int slotLeaseMinutes;

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final PaymentSlotLeaseRepository slotLeaseRepository;
    private final BankCreditAlertRepository bankCreditAlertRepository;
    private final PaymentService paymentService;
    private final AuditService auditService;

    @Transactional
    public UpiCheckoutResponseDto initiateOrResumeCheckout(Long userId, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        if (order.getUser() == null || !order.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Order", "id", orderId);
        }

        if (order.getStatus() == OrderStatus.PAID || order.getStatus() == OrderStatus.CONFIRMED) {
            throw new BadRequestException("Order #" + orderId + " is already paid.");
        }

        if (order.getTotalAmount() == null || order.getTotalAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Order amount must be greater than zero.");
        }

        LocalDateTime now = LocalDateTime.now();
        String merchantVpa = defaultUpiId.trim();
        String merchantName = defaultMerchantName.trim();

        // 1. Check or create payment attempt with pessimistic locking
        Payment payment = paymentRepository.findByOrderId(orderId).orElse(null);

        if (payment == null) {
            payment = Payment.builder()
                    .order(order)
                    .amount(order.getTotalAmount())
                    .status(PaymentStatus.PENDING)
                    .provider("DIRECT_UPI")
                    .method("UPI_QR")
                    .currency("INR")
                    .build();
            payment = paymentRepository.saveAndFlush(payment);
        } else {
            // If already successful, reject
            if (payment.getStatus() == PaymentStatus.SUCCESSFUL ) {
                throw new BadRequestException("Order #" + orderId + " has already been paid successfully.");
            }
            // Update to DIRECT_UPI provider if pending
            payment.setProvider("DIRECT_UPI");
            payment.setMethod("UPI_QR");
            payment.setAmount(order.getTotalAmount());
            payment = paymentRepository.saveAndFlush(payment);
        }

        // 2. Clean up any expired slot leases
        List<PaymentSlotLease> expired = slotLeaseRepository.findExpiredActiveLeases(now);
        for (PaymentSlotLease exp : expired) {
            exp.setStatus("EXPIRED");
            exp.setReleasedAt(now);
            slotLeaseRepository.save(exp);
        }

        // 3. Acquire or resume exclusive settlement lease slot for this order
        Optional<PaymentSlotLease> existingLease = slotLeaseRepository.findActiveByOrderId(orderId, now);
        PaymentSlotLease activeSlot;

        if (existingLease.isPresent()) {
            activeSlot = existingLease.get();
        } else {
            // Check if slot on this VPA is currently occupied by another order
            List<PaymentSlotLease> activeLeases = slotLeaseRepository.findActiveLeasesWithLock(merchantVpa, now);
            if (!activeLeases.isEmpty()) {
                PaymentSlotLease currentOccupant = activeLeases.get(0);
                if (!currentOccupant.getOrderId().equals(orderId)) {
                    // Queue situation: active lease is held by another customer
                    long waitSeconds = Math.max(1, Duration.between(now, currentOccupant.getExpiresAt()).getSeconds());
                    return UpiCheckoutResponseDto.builder()
                            .paymentId(payment.getId())
                            .orderId(orderId)
                            .merchantVpa(merchantVpa)
                            .merchantName(merchantName)
                            .amount(order.getTotalAmount())
                            .currency("INR")
                            .status("QUEUED")
                            .slotAcquired(false)
                            .queuePosition(activeLeases.size())
                            .expiresInSeconds(waitSeconds)
                            .build();
                } else {
                    activeSlot = currentOccupant;
                }
            } else {
                // Acquire new lease slot
                LocalDateTime leaseExpiry = now.plusMinutes(slotLeaseMinutes);
                activeSlot = PaymentSlotLease.builder()
                        .merchantVpa(merchantVpa)
                        .orderId(orderId)
                        .paymentId(payment.getId())
                        .acquiredAt(now)
                        .expiresAt(leaseExpiry)
                        .status("ACTIVE")
                        .build();
                activeSlot = slotLeaseRepository.saveAndFlush(activeSlot);
            }
        }

        // 4. Construct NPCI-compliant UPI URI and Mobile Intent links
        String transactionRef = "OHO-" + payment.getId();
        String note = "Order " + orderId + " OHO TECH";
        String amountStr = order.getTotalAmount().setScale(2, RoundingMode.UNNECESSARY).toPlainString();

        String rawUpiUri = String.format(
                "upi://pay?pa=%s&pn=%s&am=%s&cu=INR&tn=%s&tr=%s",
                urlEncode(merchantVpa),
                urlEncode(merchantName),
                urlEncode(amountStr),
                urlEncode(note),
                urlEncode(transactionRef)
        );

        Map<String, String> intentLinks = new LinkedHashMap<>();
        intentLinks.put("generic", rawUpiUri);
        intentLinks.put("gpay", "gpay://upi/pay?" + rawUpiUri.substring("upi://pay?".length()));
        intentLinks.put("phonepe", "phonepe://pay?" + rawUpiUri.substring("upi://pay?".length()));
        intentLinks.put("paytm", "paytmmp://pay?" + rawUpiUri.substring("upi://pay?".length()));
        intentLinks.put("bhim", "bhim://upi/pay?" + rawUpiUri.substring("upi://pay?".length()));
        intentLinks.put("cred", "cred://upi/pay?" + rawUpiUri.substring("upi://pay?".length()));

        long remainingSeconds = Math.max(0, Duration.between(now, activeSlot.getExpiresAt()).getSeconds());

        int slotNum = 1;
        List<PaymentSlotLease> allAct = slotLeaseRepository.findActiveLeasesWithLock(merchantVpa, now);
        for (int i = 0; i < allAct.size(); i++) {
            if (allAct.get(i).getId().equals(activeSlot.getId())) {
                slotNum = i + 1;
                break;
            }
        }

        return UpiCheckoutResponseDto.builder()
                .paymentId(payment.getId())
                .orderId(orderId)
                .merchantVpa(merchantVpa)
                .merchantName(merchantName)
                .amount(order.getTotalAmount())
                .currency("INR")
                .transactionNote(note)
                .transactionRef(transactionRef)
                .upiUri(rawUpiUri)
                .intentLinks(intentLinks)
                .status("AWAITING_PAYMENT")
                .leaseExpiresAt(activeSlot.getExpiresAt())
                .expiresInSeconds(remainingSeconds)
                .slotAcquired(true)
                .queuePosition(slotNum)
                .slotNumber(slotNum)
                .build();
    }

    @Transactional
    public UpiCheckoutStatusDto getPaymentStatus(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "id", paymentId));

        Order order = payment.getOrder();
        LocalDateTime now = LocalDateTime.now();

        // Check if lease expired
        Optional<PaymentSlotLease> leaseOpt = slotLeaseRepository.findByOrderId(order.getId());
        boolean isExpired = false;

        if (payment.getStatus() == PaymentStatus.PENDING && leaseOpt.isPresent()) {
            PaymentSlotLease lease = leaseOpt.get();
            if ("ACTIVE".equals(lease.getStatus()) && lease.isExpired()) {
                lease.setStatus("EXPIRED");
                lease.setReleasedAt(now);
                slotLeaseRepository.save(lease);
                isExpired = true;
            }
        }

        boolean isPaid = payment.getStatus() == PaymentStatus.SUCCESSFUL ;

        String message = isPaid ? "Payment confirmed. Entitlements provisioned." :
                (isExpired ? "Payment lease slot has expired. Please refresh to start a new session." : "Awaiting payment settlement.");

        return UpiCheckoutStatusDto.builder()
                .paymentId(payment.getId())
                .orderId(order.getId())
                .paymentStatus(payment.getStatus().name())
                .orderStatus(order.getStatus().name())
                .amount(payment.getAmount())
                .transactionReference(payment.getTransactionReference())
                .verifiedAt(payment.getVerifiedAt())
                .isPaid(isPaid)
                .isExpired(isExpired)
                .message(message)
                .build();
    }

    @Transactional
    public UpiCheckoutStatusDto submitCustomerUtr(Long paymentId, String utr, String payerUpi, String payerName) {
        if (utr == null || utr.trim().length() < 6) {
            throw new BadRequestException("A valid UTR or banking transaction reference is required (minimum 6 characters).");
        }

        String cleanUtr = utr.trim();

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "id", paymentId));

        Order order = payment.getOrder();

        if (payment.getStatus() == PaymentStatus.SUCCESSFUL ) {
            return getPaymentStatus(paymentId);
        }

        payment.setTransactionReference(cleanUtr);
        if (payerUpi != null && !payerUpi.isBlank()) payment.setPayerUpiId(payerUpi.trim());
        if (payerName != null && !payerName.isBlank()) payment.setPayerName(payerName.trim());

        // Check if an auxiliary bank credit alert with this RRN already arrived in the database!
        Optional<BankCreditAlert> alertOpt = bankCreditAlertRepository.findByRrn(cleanUtr);

        if (alertOpt.isPresent()) {
            BankCreditAlert alert = alertOpt.get();
            // Validate amount matches
            if (alert.getAmount().compareTo(payment.getAmount()) == 0) {
                // High confidence instant settlement!
                alert.setStatus("MATCHED");
                alert.setMatchedPaymentId(payment.getId());
                alert.setConfidenceScore(new BigDecimal("100.00"));
                bankCreditAlertRepository.save(alert);

                payment.setStatus(PaymentStatus.SUCCESSFUL);
                payment.setVerifiedAt(LocalDateTime.now());
                payment.setVerifiedBy("OBSERVER_RRN_MATCH");
                payment = paymentRepository.saveAndFlush(payment);

                order.setStatus(OrderStatus.PAID);
                orderRepository.save(order);

                // Release slot lease
                slotLeaseRepository.findByOrderId(order.getId()).ifPresent(lease -> {
                    lease.setStatus("SETTLED");
                    lease.setReleasedAt(LocalDateTime.now());
                    slotLeaseRepository.save(lease);
                });

                // Auto-provision entitlements
                paymentService.createEntitlementsForOrder(order);

                auditService.logUserEvent(order.getUser(), "UPI_AUTO_SETTLED_RRN", "Payment", String.valueOf(payment.getId()),
                        "Payment auto-settled matching RRN #" + cleanUtr);

                log.info("Self-hosted UPI payment #{} auto-settled via matching RRN #{}", payment.getId(), cleanUtr);

                return getPaymentStatus(paymentId);
            }
        }

        // Otherwise mark as pending verification for manual or subsequent observer ingestion
        payment.setStatus(PaymentStatus.PENDING);
        payment = paymentRepository.saveAndFlush(payment);

        return UpiCheckoutStatusDto.builder()
                .paymentId(payment.getId())
                .orderId(order.getId())
                .paymentStatus(payment.getStatus().name())
                .orderStatus(order.getStatus().name())
                .amount(payment.getAmount())
                .transactionReference(cleanUtr)
                .isPaid(false)
                .isExpired(false)
                .message("UTR reference recorded. Reconciling with bank ledger...")
                .build();
    }

    @Transactional
    public void cancelCheckout(Long paymentId, Long userId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "id", paymentId));

        Order order = payment.getOrder();
        if (order.getUser() == null || !order.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Payment", "id", paymentId);
        }

        if (payment.getStatus() == PaymentStatus.PENDING) {
            payment.setStatus(PaymentStatus.FAILED);
            payment.setFailureReason("Cancelled by customer");
            paymentRepository.save(payment);
        }

        // Release slot lease immediately
        slotLeaseRepository.findByOrderId(order.getId()).ifPresent(lease -> {
            lease.setStatus("RELEASED");
            lease.setReleasedAt(LocalDateTime.now());
            slotLeaseRepository.save(lease);
        });
    }

    private String urlEncode(String val) {
        return URLEncoder.encode(val, StandardCharsets.UTF_8);
    }
}
