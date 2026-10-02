package com.ohotech.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String slug;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    private BigDecimal providerCost; // Internal wholesale cost from provider

    private BigDecimal resellerMargin; // Internal OHO TECH markup

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "provider_id")
    private Provider provider;

    @Builder.Default
    private String integrationStatus = "Integration pending provider/API information";

    @Builder.Default
    private String deploymentType = "MANAGED_CLOUD"; // MANAGED_CLOUD, SELF_HOSTED, SAAS, DESKTOP_INSTALL, MANUAL_SETUP

    private String demoUrl;

    private String documentationUrl;

    @Builder.Default
    private boolean featured = false;

    @Builder.Default
    private Integer stock = 100;

    private String imageUrl;

    private String serviceType; // e.g. Hardware, Software, Service

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private Category category;

    @Builder.Default
    private boolean active = true;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (integrationStatus == null || integrationStatus.isBlank()) {
            integrationStatus = "Integration pending provider/API information";
        }
        if (deploymentType == null || deploymentType.isBlank()) {
            deploymentType = "MANAGED_CLOUD";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
