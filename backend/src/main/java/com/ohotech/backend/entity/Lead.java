package com.ohotech.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "crm_leads", indexes = {
    @Index(name = "idx_lead_email", columnList = "email"),
    @Index(name = "idx_lead_status", columnList = "status"),
    @Index(name = "idx_lead_source", columnList = "source"),
    @Index(name = "idx_lead_priority", columnList = "priority"),
    @Index(name = "idx_lead_assigned", columnList = "assigned_to_user_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lead {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String lastName;

    @Column(nullable = false)
    private String email;

    private String phone;
    private String companyName;
    private String designation;
    private String industry;
    private String city;
    private String state;
    private String country;

    private String interestedProduct;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "interested_product_id")
    private Product interestedProductRef;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private LeadSource source = LeadSource.WEBSITE;

    private String sourceDetails;
    private String campaign;
    private String medium;
    private String landingPage;

    private String utmSource;
    private String utmMedium;
    private String utmCampaign;
    private String utmTerm;
    private String utmContent;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private LeadStatus status = LeadStatus.NEW;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private LeadPriority priority = LeadPriority.MEDIUM;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to_user_id")
    private User assignedTo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contact_enquiry_id")
    private ContactEnquiry contactEnquiry;

    private BigDecimal estimatedValue;

    @Column(columnDefinition = "TEXT")
    private String notes;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime lastContactedAt;
    private LocalDateTime nextFollowUpAt;

    private LocalDateTime convertedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "converted_by_user_id")
    private User convertedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "converted_user_id")
    private User convertedUser;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
