package com.ohotech.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Customer Product Representation:
 * Contains purchased product details, deployment progress, and access URL.
 * NEVER contains provider credentials, wholesale cost, or internal notes.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerProductDto {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private BigDecimal purchasePrice;
    private String deploymentType;
    private String demoUrl;
    private String documentationUrl;
    private String imageUrl;
    private String serviceType;
    private Long categoryId;
    private String categoryName;
    private Long orderId;
    private Long deploymentId;
    private String deploymentStatus;
    private String accessUrl;
    private String licenseKey;
}
