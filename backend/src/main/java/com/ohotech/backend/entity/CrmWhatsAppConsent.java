package com.ohotech.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "crm_whatsapp_consents", indexes = {
        @Index(name = "idx_wa_consent_phone", columnList = "phone", unique = true),
        @Index(name = "idx_wa_consent_optin", columnList = "optIn")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CrmWhatsAppConsent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String phone; // Normalized E.164 (e.g., +917684054872)

    @Column(nullable = false)
    @Builder.Default
    private boolean optIn = true; // true = consented, false = opted out

    @Column(length = 100)
    private String source; // WEBSITE_CHECKOUT, CONTACT_FORM, LEAD_SUBMISSION, MANUAL_ADMIN, INBOUND_KEYWORD

    @Column(length = 100)
    @Builder.Default
    private String purpose = "ALL"; // ALL, MARKETING, TRANSACTIONAL

    private LocalDateTime optedInAt;

    private LocalDateTime optedOutAt;

    @Column(length = 255)
    private String revocationReason; // e.g., Inbound 'STOP' keyword, Customer requested

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
