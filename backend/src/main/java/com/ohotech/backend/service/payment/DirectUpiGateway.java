package com.ohotech.backend.service.payment;

import com.ohotech.backend.dto.GatewayHealthDto;
import com.ohotech.backend.dto.PaymentGatewayDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
public class DirectUpiGateway implements PaymentGateway {

    @Value("${app.upi.merchant-name:KAMPA INFRA AND RENEWABLE ENERGY DEVELOPERS PVT L}")
    private String upiMerchantName;

    @Value("${app.upi.id:9937591330@indianbk}")
    private String upiId;

    @Value("${app.upi.bank-name:Indian Bank}")
    private String upiBankName;

    @Value("${app.payment.bank-transfer-enabled:true}")
    private boolean enabled;

    private LocalDateTime lastHealthCheckAt;
    private Long lastHealthLatencyMs;

    @Override
    public String getProviderId() {
        return "BANK_TRANSFER";
    }

    @Override
    public String getDisplayName() {
        return "Institutional Bank Transfer / Dynamic UPI";
    }

    @Override
    public boolean isImplemented() {
        return true;
    }

    @Override
    public boolean isConfigured() {
        return upiId != null && !upiId.isBlank() && upiMerchantName != null && !upiMerchantName.isBlank();
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }

    @Override
    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    @Override
    public String getEnvironment() {
        return isConfigured() ? "LIVE MODE" : "NOT CONFIGURED";
    }

    @Override
    public String getMaskedIdentifier() {
        if (upiId == null || upiId.isBlank()) return "Not configured";
        int atIdx = upiId.indexOf('@');
        if (atIdx > 3) {
            return upiId.substring(0, 3) + "••••" + upiId.substring(atIdx);
        }
        return upiId;
    }

    @Override
    public List<String> getSupportedMethods() {
        return Arrays.asList("Direct UPI (VPA)", "QR Intent Resolution", "IMPS Immediate Settlement", "NEFT / RTGS Treasury Wire");
    }

    @Override
    public List<String> getSupportedCurrencies() {
        return List.of("INR");
    }

    @Override
    public String getWebhookStatus() {
        return "MANUAL_RECONCILIATION_UTR";
    }

    @Override
    public GatewayHealthDto healthCheck() {
        long start = System.currentTimeMillis();
        boolean healthy = isConfigured() && enabled;
        long latency = System.currentTimeMillis() - start;
        this.lastHealthCheckAt = LocalDateTime.now();
        this.lastHealthLatencyMs = latency;

        String status = !enabled ? "DISABLED" : (isConfigured() ? "CONNECTED" : "NOT_CONFIGURED");
        String message = healthy
                ? "Merchant VPA active (" + upiId + " at " + upiBankName + ")."
                : (!enabled ? "Bank transfer payment channel is disabled." : "UPI / Bank configurations missing.");

        return GatewayHealthDto.builder()
                .providerId(getProviderId())
                .status(status)
                .healthy(healthy)
                .latencyMs(latency)
                .message(message)
                .checkedAt(this.lastHealthCheckAt)
                .build();
    }

    @Override
    public PaymentGatewayDto toDto() {
        String statusStr = !enabled ? "DISABLED" : (isConfigured() ? "CONNECTED" : "NOT_CONFIGURED");

        return PaymentGatewayDto.builder()
                .providerId(getProviderId())
                .name(getDisplayName())
                .status(statusStr)
                .environment(getEnvironment())
                .implemented(isImplemented())
                .configured(isConfigured())
                .enabled(isEnabled())
                .supportedCurrencies(getSupportedCurrencies())
                .supportedMethods(getSupportedMethods())
                .maskedKeyId(getMaskedIdentifier())
                .lastHealthCheckAt(lastHealthCheckAt)
                .healthLatencyMs(lastHealthLatencyMs)
                .webhookStatus(getWebhookStatus())
                .build();
    }
}
