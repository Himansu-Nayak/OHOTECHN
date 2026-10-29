package com.ohotech.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpiCheckoutResponseDto {
    private Long paymentId;
    private Long orderId;
    private String merchantVpa;
    private String merchantName;
    private BigDecimal amount;
    private String currency;
    private String transactionNote;
    private String transactionRef;
    private String upiUri;
    private Map<String, String> intentLinks;
    private String status;
    private LocalDateTime leaseExpiresAt;
    private long expiresInSeconds;
    private boolean slotAcquired;
    private int queuePosition;
    private Integer slotNumber;
}
