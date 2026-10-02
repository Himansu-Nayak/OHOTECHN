package com.ohotech.backend.service.payment;

import com.ohotech.backend.dto.GatewayHealthDto;
import com.ohotech.backend.dto.PaymentGatewayDto;
import com.ohotech.backend.dto.PaymentGatewaySummaryDto;
import com.ohotech.backend.entity.Payment;
import com.ohotech.backend.entity.PaymentStatus;
import com.ohotech.backend.exception.BadRequestException;
import com.ohotech.backend.repository.PaymentRepository;
import com.ohotech.backend.service.AuditService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentGatewayRegistry {

    private final RazorpayGateway razorpayGateway;
    private final DirectUpiGateway directUpiGateway;
    private final CashOnDeliveryGateway cashOnDeliveryGateway;
    private final PaymentRepository paymentRepository;
    private final AuditService auditService;

    // Honest catalog of non-implemented providers
    private static final List<PaymentGatewayDto> UNIMPLEMENTED_GATEWAYS = List.of(
            PaymentGatewayDto.builder()
                    .providerId("STRIPE")
                    .name("Stripe Global Merchant Gateway")
                    .status("NOT_CONFIGURED")
                    .environment("INTEGRATION REQUIRED")
                    .implemented(false)
                    .configured(false)
                    .enabled(false)
                    .supportedCurrencies(List.of("USD", "EUR", "GBP", "INR"))
                    .supportedMethods(List.of("International Cards", "Apple Pay", "Google Pay"))
                    .maskedKeyId("Not implemented")
                    .webhookStatus("NOT_SUPPORTED")
                    .build(),
            PaymentGatewayDto.builder()
                    .providerId("PHONEPE")
                    .name("PhonePe Payment Gateway Switch")
                    .status("NOT_CONFIGURED")
                    .environment("INTEGRATION REQUIRED")
                    .implemented(false)
                    .configured(false)
                    .enabled(false)
                    .supportedCurrencies(List.of("INR"))
                    .supportedMethods(List.of("PhonePe Switch", "UPI AutoPay"))
                    .maskedKeyId("Not implemented")
                    .webhookStatus("NOT_SUPPORTED")
                    .build(),
            PaymentGatewayDto.builder()
                    .providerId("PAYPAL")
                    .name("PayPal International Commercial Payments")
                    .status("NOT_CONFIGURED")
                    .environment("INTEGRATION REQUIRED")
                    .implemented(false)
                    .configured(false)
                    .enabled(false)
                    .supportedCurrencies(List.of("USD", "EUR", "AUD"))
                    .supportedMethods(List.of("PayPal Wallet", "Pay in 4"))
                    .maskedKeyId("Not implemented")
                    .webhookStatus("NOT_SUPPORTED")
                    .build(),
            PaymentGatewayDto.builder()
                    .providerId("PAYU")
                    .name("PayU Enterprise India Gateway")
                    .status("NOT_CONFIGURED")
                    .environment("INTEGRATION REQUIRED")
                    .implemented(false)
                    .configured(false)
                    .enabled(false)
                    .supportedCurrencies(List.of("INR"))
                    .supportedMethods(List.of("Net Banking", "Cards", "UPI"))
                    .maskedKeyId("Not implemented")
                    .webhookStatus("NOT_SUPPORTED")
                    .build()
    );

    public List<PaymentGatewayDto> getAllGateways() {
        List<PaymentGatewayDto> list = new ArrayList<>();

        // 1. Razorpay
        PaymentGatewayDto rzpDto = razorpayGateway.toDto();
        populateGatewayStats(rzpDto, "RAZORPAY");
        list.add(rzpDto);

        // 2. Direct Bank Transfer / UPI
        PaymentGatewayDto upiDto = directUpiGateway.toDto();
        populateGatewayStats(upiDto, "BANK_TRANSFER");
        list.add(upiDto);

        // 3. Cash on Delivery
        PaymentGatewayDto codDto = cashOnDeliveryGateway.toDto();
        populateGatewayStats(codDto, "COD");
        list.add(codDto);

        // 4. Honest un-implemented placeholders
        list.addAll(UNIMPLEMENTED_GATEWAYS);

        return list;
    }

    private void populateGatewayStats(PaymentGatewayDto dto, String providerKey) {
        List<Payment> payments = paymentRepository.findAll();
        long success = 0;
        long failed = 0;
        BigDecimal volume = BigDecimal.ZERO;

        for (Payment p : payments) {
            boolean matches = false;
            if ("RAZORPAY".equals(providerKey)) {
                matches = "RAZORPAY".equalsIgnoreCase(p.getProvider()) ||
                        (p.getRazorpayPaymentId() != null && !p.getRazorpayPaymentId().isBlank());
            } else if ("BANK_TRANSFER".equals(providerKey)) {
                matches = "BANK_TRANSFER".equalsIgnoreCase(p.getProvider()) ||
                        "UPI".equalsIgnoreCase(p.getMethod());
            } else if ("COD".equals(providerKey)) {
                matches = "COD".equalsIgnoreCase(p.getProvider()) ||
                        "CASH_ON_DELIVERY".equalsIgnoreCase(p.getMethod());
            }

            if (matches) {
                if (p.getStatus() == PaymentStatus.SUCCESSFUL) {
                    success++;
                    if (p.getAmount() != null) {
                        volume = volume.add(p.getAmount());
                    }
                } else if (p.getStatus() == PaymentStatus.FAILED) {
                    failed++;
                }
            }
        }

        dto.setSuccessfulTransactions(success);
        dto.setFailedTransactions(failed);
        dto.setTotalVolume(volume);
    }

    public PaymentGatewaySummaryDto getSummaryMetrics() {
        List<Payment> allPayments = paymentRepository.findAll();

        long success = 0;
        long pending = 0;
        long failed = 0;
        long refunded = 0;
        BigDecimal totalVolume = BigDecimal.ZERO;
        LocalDateTime lastSuccessful = null;

        for (Payment p : allPayments) {
            if (p.getStatus() == PaymentStatus.SUCCESSFUL) {
                success++;
                if (p.getAmount() != null) {
                    totalVolume = totalVolume.add(p.getAmount());
                }
                if (lastSuccessful == null || (p.getCreatedAt() != null && p.getCreatedAt().isAfter(lastSuccessful))) {
                    lastSuccessful = p.getCreatedAt();
                }
            } else if (p.getStatus() == PaymentStatus.PENDING) {
                pending++;
            } else if (p.getStatus() == PaymentStatus.FAILED) {
                failed++;
            } else if (p.getStatus() == PaymentStatus.REFUNDED) {
                refunded++;
            }
        }

        int activeCount = 0;
        if (razorpayGateway.isEnabled() && razorpayGateway.isConfigured()) activeCount++;
        if (directUpiGateway.isEnabled() && directUpiGateway.isConfigured()) activeCount++;
        if (cashOnDeliveryGateway.isEnabled()) activeCount++;

        String env = razorpayGateway.getEnvironment();

        return PaymentGatewaySummaryDto.builder()
                .totalPaymentVolume(totalVolume)
                .successfulPayments(success)
                .pendingPayments(pending)
                .failedPayments(failed)
                .refundedPayments(refunded)
                .activeGatewayCount(activeCount)
                .environment(env)
                .lastSuccessfulTransactionAt(lastSuccessful)
                .lastGatewayHealthCheckAt(LocalDateTime.now())
                .build();
    }

    public GatewayHealthDto checkGatewayHealth(String providerId) {
        String upper = providerId != null ? providerId.trim().toUpperCase() : "";
        if ("RAZORPAY".equals(upper)) {
            return razorpayGateway.healthCheck();
        } else if ("BANK_TRANSFER".equals(upper) || "UPI".equals(upper) || "UPI_DIRECT".equals(upper)) {
            return directUpiGateway.healthCheck();
        } else if ("COD".equals(upper)) {
            return cashOnDeliveryGateway.healthCheck();
        }

        return GatewayHealthDto.builder()
                .providerId(providerId)
                .status("NOT_CONFIGURED")
                .healthy(false)
                .latencyMs(0)
                .message("Provider '" + providerId + "' is not implemented on server.")
                .checkedAt(LocalDateTime.now())
                .build();
    }

    public PaymentGatewayDto toggleGateway(String providerId, boolean enable, Long adminUserId) {
        String upper = providerId != null ? providerId.trim().toUpperCase() : "";
        PaymentGateway target;
        if ("RAZORPAY".equals(upper)) {
            target = razorpayGateway;
        } else if ("BANK_TRANSFER".equals(upper) || "UPI".equals(upper) || "UPI_DIRECT".equals(upper)) {
            target = directUpiGateway;
        } else if ("COD".equals(upper)) {
            target = cashOnDeliveryGateway;
        } else {
            throw new BadRequestException("Gateway provider '" + providerId + "' cannot be toggled because integration is not implemented.");
        }

        target.setEnabled(enable);
        auditService.logEvent("PAYMENT_GATEWAY_TOGGLED", "PaymentGateway", upper,
                "Admin #" + adminUserId + " changed status of gateway " + upper + " to enabled=" + enable);

        log.info("Admin #{} toggled gateway {} to enabled={}", adminUserId, upper, enable);
        PaymentGatewayDto dto = target.toDto();
        populateGatewayStats(dto, target.getProviderId());
        return dto;
    }
}
