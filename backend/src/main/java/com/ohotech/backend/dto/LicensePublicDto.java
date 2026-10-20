package com.ohotech.backend.dto;

import com.ohotech.backend.entity.LicenseStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Publicly exposable representation of a software license.
 * Omits customer personal identity, email, phone, physical address, and payment credentials.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LicensePublicDto {
    private String licenseKey;
    private Long productId;
    private String productName;
    private Long productPlanId;
    private String productPlanName;
    private LicenseStatus status;
    private Integer activationLimit;
    private Integer activationCount;
    private LocalDateTime issuedAt;
    private LocalDateTime expiresAt;
}
