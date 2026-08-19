package com.ohotech.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PaymentOrderRequest {
    @NotNull(message = "Order ID is required")
    private Long orderId;
}
