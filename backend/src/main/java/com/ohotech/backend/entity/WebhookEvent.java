package com.ohotech.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "crm_webhook_events", uniqueConstraints = {
    @UniqueConstraint(name = "uk_provider_event_id", columnNames = {"provider", "externalEventId"})
}, indexes = {
    @Index(name = "idx_webhook_provider_lead", columnList = "provider, externalLeadId"),
    @Index(name = "idx_webhook_status", columnList = "status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WebhookEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String provider;

    private String externalEventId;
    private String externalLeadId;
    private String eventType;

    private LocalDateTime receivedAt;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private WebhookEventStatus status = WebhookEventStatus.RECEIVED;

    private LocalDateTime processedAt;

    @Column(columnDefinition = "TEXT")
    private String errorReason;

    @Column(columnDefinition = "TEXT")
    private String payloadSummary;

    @PrePersist
    protected void onCreate() {
        if (receivedAt == null) {
            receivedAt = LocalDateTime.now();
        }
    }
}
