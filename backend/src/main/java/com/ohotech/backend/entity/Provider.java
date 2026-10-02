package com.ohotech.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "providers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Provider {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String companyName;

    private String contactPerson;

    private String contactEmail;

    private String contactPhone;

    private String website;

    @Column(length = 2000)
    private String commercialTerms;

    private BigDecimal commissionRate; // e.g. default margin percentage or agreed wholesale discount

    @Builder.Default
    private String technicalIntegrationType = "PENDING_SPECS"; // API, WEBHOOK, SOURCE_CODE, DEDICATED_INSTANCE, HOSTED_SAAS, PENDING_SPECS

    @Builder.Default
    private String integrationStatus = "PENDING_API_INFO"; // ACTIVE, IN_REVIEW, SUSPENDED, ONBOARDING, PENDING_API_INFO

    @Builder.Default
    private String supportResponsibility = "OHO_TECH"; // OHO_TECH, PROVIDER, SHARED

    @Builder.Default
    private String deploymentResponsibility = "OHO_TECH_VPS"; // OHO_TECH_VPS, PROVIDER_CLOUD, CUSTOMER_SELF_HOSTED

    @Builder.Default
    private String contractStatus = "DRAFT"; // DRAFT, ACTIVE, RENEWAL_DUE, TERMINATED

    @Column(length = 2000)
    private String notes;

    @Builder.Default
    private boolean active = true;

    @OneToMany(mappedBy = "provider", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.LAZY)
    @JsonIgnore
    @Builder.Default
    private List<Product> products = new ArrayList<>();

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (integrationStatus == null || integrationStatus.isBlank()) {
            integrationStatus = "Integration pending provider/API information";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
