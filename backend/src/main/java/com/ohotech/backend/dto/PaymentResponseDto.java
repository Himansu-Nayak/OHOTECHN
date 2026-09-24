package com.ohotech.backend.dto;

import com.ohotech.backend.entity.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponseDto {
    private Long id;
    private Long orderId;
    private BigDecimal amount;
    private PaymentStatus status;
    private String provider;
    private String method;
    private String currency;
    private String transactionReference;
    private String payerUpiId;
    private String payerName;
    private String failureReason;
    private String adminNotes;
    private String verifiedBy;
    private LocalDateTime verifiedAt;
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
