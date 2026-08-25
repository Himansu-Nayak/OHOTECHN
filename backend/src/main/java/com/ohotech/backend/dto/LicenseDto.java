package com.ohotech.backend.dto;

import com.ohotech.backend.entity.LicenseStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LicenseDto {
    private Long id;
    private Long userId;
    private Long productId;
    private String productName;
    private Long productPlanId;
    private String productPlanName;
    private Long subscriptionId;
    private String licenseKey;
    private LicenseStatus status;
    private Integer activationLimit;
    private Integer activationCount;
    private LocalDateTime issuedAt;
    private LocalDateTime expiresAt;
    private LocalDateTime revokedAt;
}
