package com.ohotech.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpiCheckoutStatusDto {
    private Long paymentId;
    private Long orderId;
    private String paymentStatus;
    private String orderStatus;
    private BigDecimal amount;
    private String transactionReference;
    private LocalDateTime verifiedAt;

    @JsonProperty("isPaid")
    private boolean isPaid;

    @JsonProperty("isExpired")
    private boolean isExpired;

    private String message;
}
