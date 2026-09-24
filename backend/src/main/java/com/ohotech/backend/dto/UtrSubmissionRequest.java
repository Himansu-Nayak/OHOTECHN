package com.ohotech.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UtrSubmissionRequest {

    @NotNull(message = "Order ID is required")
    private Long orderId;

    @NotBlank(message = "UTR / Transaction Reference number is required")
    @Size(min = 6, max = 50, message = "UTR reference must be between 6 and 50 characters")
    private String utr;

    private String payerUpiId;

    private String payerName;

    private String notes;
}
