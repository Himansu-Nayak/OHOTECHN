package com.ohotech.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "crm_whatsapp_messages", indexes = {
        @Index(name = "idx_whatsapp_status", columnList = "status"),
        @Index(name = "idx_whatsapp_recipient", columnList = "recipientPhone"),
        @Index(name = "idx_whatsapp_wamid", columnList = "wamid")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CrmWhatsAppMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String recipientPhone;

    @Column(length = 150)
    private String recipientName;

    @Column(nullable = false, length = 100)
    private String templateName;

    @Column(length = 20)
    @Builder.Default
    private String languageCode = "en";

    @Column(columnDefinition = "TEXT")
    private String parametersJson;

    @Column(nullable = false, length = 30)
    private String status; // QUEUED, SENT, DELIVERED, READ, FAILED

    @Column(length = 255)
    private String wamid; // Meta WhatsApp Message ID

    @Column(length = 1000)
    private String errorMessage;

    @Column(length = 100)
    private String dispatchedBy;

    private Long leadId;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
