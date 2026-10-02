package com.ohotech.backend.service.payment;

import com.ohotech.backend.dto.GatewayHealthDto;
import com.ohotech.backend.dto.PaymentGatewayDto;
import java.util.List;

public interface PaymentGateway {
    String getProviderId();
    String getDisplayName();
    boolean isImplemented();
    boolean isConfigured();
    boolean isEnabled();
    void setEnabled(boolean enabled);
    String getEnvironment();
    String getMaskedIdentifier();
    List<String> getSupportedMethods();
    List<String> getSupportedCurrencies();
    String getWebhookStatus();
    GatewayHealthDto healthCheck();
    PaymentGatewayDto toDto();
}
