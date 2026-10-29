package com.ohotech.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "email_outbox", indexes = {
        @Index(name = "idx_email_outbox_status", columnList = "status"),
        @Index(name = "idx_email_outbox_recipient", columnList = "recipient"),
        @Index(name = "idx_email_outbox_created_at", columnList = "createdAt")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmailOutbox {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String recipient;

    @Column(nullable = false)
    private String subject;

    @Column(length = 100)
    private String templateKey;

    @Column(length = 30)
    private String category; // TRANSACTIONAL, MARKETING, ANNOUNCEMENT

    @Column(nullable = false, length = 30)
    private String status; // QUEUED, PROCESSING, SENT, FAILED, SUPPRESSED

    @Column(nullable = false)
    @Builder.Default
    private int attempts = 0;

    @Column(nullable = false)
    @Builder.Default
    private int maxAttempts = 3;

    @Column(length = 1000)
    private String errorMessage;

    @Column(length = 255)
    private String providerMessageId;

    @Column(length = 100)
    private String idempotencyKey;

    private LocalDateTime nextRetryAt;

    private LocalDateTime sentAt;

    @Column(columnDefinition = "TEXT")
    private String contentPreview;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
