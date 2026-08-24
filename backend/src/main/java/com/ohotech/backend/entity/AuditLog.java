package com.ohotech.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs", indexes = {
    @Index(name = "idx_audit_actor", columnList = "actor_user_id"),
    @Index(name = "idx_audit_action", columnList = "action"),
    @Index(name = "idx_audit_created", columnList = "createdAt")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long actorUserId;
    private String actorName;
    private String actorEmail;
    private String actorRole;

    @Column(nullable = false)
    private String action;

    private String entityType;
    private String entityId;

    @Column(columnDefinition = "VARCHAR(2000)")
    private String description;

    @Column(columnDefinition = "VARCHAR(2000)")
    private String previousValue;

    @Column(columnDefinition = "VARCHAR(2000)")
    private String newValue;

    private String ipAddress;
    private String userAgent;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
