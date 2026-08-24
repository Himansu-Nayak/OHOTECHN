package com.ohotech.backend.dto;

import com.ohotech.backend.entity.BillingType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductPlanDto {
    private Long id;
    private Long productId;
    private String productName;

    @NotBlank(message = "Plan name is required")
    private String name;

    private String description;

    @NotNull(message = "Price is required")
    private BigDecimal price;

    @Builder.Default
    private String currency = "INR";

    @NotNull(message = "Billing type is required")
    private BillingType billingType;

    private Integer durationDays;
    private Integer activationLimit;
    private Integer trialDays;
    private Boolean active;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
