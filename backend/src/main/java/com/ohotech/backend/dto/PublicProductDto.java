package com.ohotech.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Public Product Representation:
 * Strictly contains NO wholesale pricing, NO provider identity, and NO margin economics.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PublicProductDto {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private BigDecimal price;
    private String integrationStatus;
    private String deploymentType;
    private String demoUrl;
    private String documentationUrl;
    private boolean featured;
    private Integer stock;
    private String imageUrl;
    private String serviceType;
    private Long categoryId;
    private String categoryName;
    private boolean active;
}
