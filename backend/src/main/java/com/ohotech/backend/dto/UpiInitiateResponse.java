package com.ohotech.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpiInitiateResponse {
    private Long orderId;
    private Long paymentId;
    private BigDecimal amount;
    private String currency;
    private String upiId;
    private String merchantName;
    private String bankName;
    private String upiIntentUri;
    private String transactionRef;
}
