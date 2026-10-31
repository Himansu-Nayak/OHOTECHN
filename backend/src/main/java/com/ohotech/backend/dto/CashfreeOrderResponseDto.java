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
public class CashfreeOrderResponseDto {
    private Long orderId;
    private String cashfreeOrderId;
    private String paymentSessionId;
    private String environment; // "sandbox" or "production"
    private BigDecimal amount;
    private String currency;
}
