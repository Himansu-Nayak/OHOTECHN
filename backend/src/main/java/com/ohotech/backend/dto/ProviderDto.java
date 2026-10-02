package com.ohotech.backend.dto;

import jakarta.validation.constraints.NotBlank;
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
public class ProviderDto {
    private Long id;

    @NotBlank(message = "Provider name is required")
    private String name;

    private String companyName;
    private String contactPerson;
    private String contactEmail;
    private String contactPhone;
    private String website;
    private String commercialTerms;
    private BigDecimal commissionRate;
    private String technicalIntegrationType;
    private String integrationStatus;
    private String supportResponsibility;
    private String deploymentResponsibility;
    private String contractStatus;
    private String notes;
    private boolean active;
    private Integer productsCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
