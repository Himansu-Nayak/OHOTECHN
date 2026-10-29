package com.ohotech.backend.service;

import com.ohotech.backend.entity.*;
import com.ohotech.backend.exception.BadRequestException;
import com.ohotech.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentObservationService {

    private final ObserverDeviceRepository observerDeviceRepository;
    private final BankCreditAlertRepository bankCreditAlertRepository;
    private final PaymentSlotLeaseRepository slotLeaseRepository;
    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final PaymentService paymentService;
    private final AuditService auditService;

    @Transactional
    public ObserverDevice authenticateObserverDevice(String rawToken) {
        if (rawToken == null || rawToken.isBlank()) {
            throw new BadRequestException("Observer bearer token is required in X-Observer-Token header.");
        }

        String hash = hashToken(rawToken.trim());
        ObserverDevice device = observerDeviceRepository.findByTokenHash(hash)
                .orElseThrow(() -> new BadRequestException("Invalid or unregistered observer device token."));

        if (!device.isActive()) {
            throw new BadRequestException("This observer device token has been revoked by an administrator.");
        }

        device.setLastSeenAt(LocalDateTime.now());
        return observerDeviceRepository.save(device);
    }

    @Transactional
    public BankCreditAlert ingestBankAlert(
            ObserverDevice device,
            BigDecimal amount,
            String rrn,
            String payerUpi,
            String rawMessage) {

        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Valid positive credit amount is required.");
        }

        String cleanRrn = (rrn != null && !rrn.isBlank()) ? rrn.trim() : "RRN-" + System.currentTimeMillis();
        LocalDateTime now = LocalDateTime.now();

        // 1. Replay / Deduplication Check
        if (bankCreditAlertRepository.existsByRrn(cleanRrn)) {
            log.warn("Duplicate bank credit alert received for RRN: {}", cleanRrn);
            return bankCreditAlertRepository.findByRrn(cleanRrn).orElse(null);
        }

        BankCreditAlert alert = BankCreditAlert.builder()
                .deviceId(device != null ? device.getId() : null)
                .rrn(cleanRrn)
                .amount(amount)
                .currency("INR")
                .payerUpi(payerUpi)
                .rawMessage(rawMessage)
                .receivedAt(now)
                .status("PENDING")
                .confidenceScore(BigDecimal.ZERO)
                .build();

        alert = bankCreditAlertRepository.saveAndFlush(alert);

        // 2. Automated Matching Algorithm
        // Priority A: Check if a payment has this exact transactionReference (UTR)
        Optional<Payment> matchingByUtr = paymentRepository.findAll().stream()
                .filter(p -> p.getStatus() == PaymentStatus.PENDING && cleanRrn.equalsIgnoreCase(p.getTransactionReference()))
                .findFirst();

        if (matchingByUtr.isPresent()) {
            Payment payment = matchingByUtr.get();
            if (payment.getAmount().compareTo(amount) == 0) {
                fulfillMatchedPayment(alert, payment, "OBSERVER_EXACT_RRN", new BigDecimal("100.00"));
                return alert;
            }
        }

        // Priority B: Check active slot leases on receiving VPA within lease window
        List<PaymentSlotLease> activeLeases = slotLeaseRepository.findExpiredActiveLeases(now.plusHours(1)).stream()
                .filter(l -> "ACTIVE".equals(l.getStatus()) && l.getExpiresAt().isAfter(now))
                .toList();

        Payment matchingPayment = null;
        for (PaymentSlotLease lease : activeLeases) {
            Optional<Payment> pOpt = paymentRepository.findById(lease.getPaymentId());
            if (pOpt.isPresent() && pOpt.get().getStatus() == PaymentStatus.PENDING) {
                if (pOpt.get().getAmount().compareTo(amount) == 0) {
                    if (matchingPayment == null) {
                        matchingPayment = pOpt.get();
                    } else {
                        // Ambiguity! Multiple orders with the exact same amount in active slot
                        matchingPayment = null;
                        break;
                    }
                }
            }
        }

        if (matchingPayment != null) {
            fulfillMatchedPayment(alert, matchingPayment, "OBSERVER_SLOT_MATCH", new BigDecimal("95.00"));
            return alert;
        }

        // Priority C: No unique match found. Route to AMBIGUOUS / UNCLAIMED for manual admin reconciliation
        alert.setStatus("UNCLAIMED");
        alert.setConfidenceScore(BigDecimal.ZERO);
        alert = bankCreditAlertRepository.save(alert);
        log.warn("Unclaimed bank alert for amount ₹{} with RRN: {}. Routed to manual reconciliation.", amount, cleanRrn);

        return alert;
    }

    private void fulfillMatchedPayment(BankCreditAlert alert, Payment payment, String mechanism, BigDecimal confidence) {
        Order order = payment.getOrder();
        LocalDateTime now = LocalDateTime.now();

        alert.setStatus("MATCHED");
        alert.setMatchedPaymentId(payment.getId());
        alert.setConfidenceScore(confidence);
        bankCreditAlertRepository.save(alert);

        payment.setStatus(PaymentStatus.SUCCESSFUL);
        payment.setVerifiedAt(now);
        payment.setVerifiedBy(mechanism);
        if (alert.getPayerUpi() != null && !alert.getPayerUpi().isBlank()) {
            payment.setPayerUpiId(alert.getPayerUpi());
        }
        paymentRepository.save(payment);

        order.setStatus(OrderStatus.PAID);
        orderRepository.save(order);

        // Release slot lease
        slotLeaseRepository.findByOrderId(order.getId()).ifPresent(lease -> {
            lease.setStatus("SETTLED");
            lease.setReleasedAt(now);
            slotLeaseRepository.save(lease);
        });

        // Auto-provision entitlements
        paymentService.createEntitlementsForOrder(order);

        auditService.logUserEvent(order.getUser(), "UPI_SETTLED_OBSERVER", "Payment", String.valueOf(payment.getId()),
                "Payment auto-settled via observer alert #" + alert.getId() + " [RRN: " + alert.getRrn() + "]");

        log.info("Payment #{} for Order #{} confirmed and entitlements provisioned via {}", payment.getId(), order.getId(), mechanism);
    }

    public String hashToken(String raw) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(raw.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 not available", e);
        }
    }
}
