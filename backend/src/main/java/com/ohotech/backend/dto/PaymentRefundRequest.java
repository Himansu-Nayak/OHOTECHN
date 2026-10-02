package com.ohotech.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRefundRequest {
    @NotBlank(message = "Refund reason is required")
    private String reason;

    private BigDecimal amount; // null indicates full refund
    private String adminNotes;
}
