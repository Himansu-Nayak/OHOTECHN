package com.ohotech.backend.dto;

import com.ohotech.backend.entity.SubscriptionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubscriptionDto {
    private Long id;
    private Long userId;
    private Long productId;
    private String productName;
    private Long productPlanId;
    private String productPlanName;
    private Long orderId;
    private SubscriptionStatus status;
    private LocalDateTime startDate;
    private LocalDateTime expiryDate;
    private boolean autoRenew;
    private LocalDateTime createdAt;
}
