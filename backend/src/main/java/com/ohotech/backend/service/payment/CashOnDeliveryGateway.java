package com.ohotech.backend.service.payment;

import com.ohotech.backend.dto.GatewayHealthDto;
import com.ohotech.backend.dto.PaymentGatewayDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class CashOnDeliveryGateway implements PaymentGateway {

    @Value("${app.payment.cod-enabled:true}")
    private boolean enabled;

    private LocalDateTime lastHealthCheckAt;
    private Long lastHealthLatencyMs;

    @Override
    public String getProviderId() {
        return "COD";
    }

    @Override
    public String getDisplayName() {
        return "Cash on Delivery (Physical Turnkey Hardware Delivery)";
    }

    @Override
    public boolean isImplemented() {
        return true;
    }

    @Override
    public boolean isConfigured() {
        return true;
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
        return "LIVE MODE";
    }

    @Override
    public String getMaskedIdentifier() {
        return "Physical Settlement";
    }

    @Override
    public List<String> getSupportedMethods() {
        return List.of("Cash on Delivery (Post-Inspection)");
    }

    @Override
    public List<String> getSupportedCurrencies() {
        return List.of("INR");
    }

    @Override
    public String getWebhookStatus() {
        return "LOGISTICS_CONFIRMATION";
    }

    @Override
    public GatewayHealthDto healthCheck() {
        long start = System.currentTimeMillis();
        long latency = System.currentTimeMillis() - start;
        this.lastHealthCheckAt = LocalDateTime.now();
        this.lastHealthLatencyMs = latency;

        return GatewayHealthDto.builder()
                .providerId(getProviderId())
                .status(enabled ? "CONNECTED" : "DISABLED")
                .healthy(enabled)
                .latencyMs(latency)
                .message(enabled ? "Cash on delivery channel operational." : "Cash on delivery disabled.")
                .checkedAt(this.lastHealthCheckAt)
                .build();
    }

    @Override
    public PaymentGatewayDto toDto() {
        return PaymentGatewayDto.builder()
                .providerId(getProviderId())
                .name(getDisplayName())
                .status(enabled ? "CONNECTED" : "DISABLED")
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
