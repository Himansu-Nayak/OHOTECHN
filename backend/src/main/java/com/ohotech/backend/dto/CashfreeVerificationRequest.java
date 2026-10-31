package com.ohotech.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CashfreeVerificationRequest {
    @NotNull(message = "Order ID is required")
    private Long orderId;

    @NotBlank(message = "Cashfree Order ID is required")
    private String cashfreeOrderId;
}
