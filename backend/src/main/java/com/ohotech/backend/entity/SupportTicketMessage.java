package com.ohotech.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "support_ticket_messages", indexes = {
        @Index(name = "idx_ticket_msgs_ticket", columnList = "ticket_id"),
        @Index(name = "idx_ticket_msgs_created", columnList = "created_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class SupportTicketMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id", nullable = false)
    @JsonIgnoreProperties("messages")
    private SupportTicket ticket;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_user_id")
    @JsonIgnoreProperties({"passwordHash", "roles", "hibernateLazyInitializer", "handler"})
    private User sender;

    @Column(name = "sender_name", nullable = false)
    private String senderName;

    @Column(name = "sender_role", nullable = false, length = 50)
    private String senderRole; // CUSTOMER, SUPPORT, ADMIN, SYSTEM

    @Column(length = 4000, nullable = false)
    private String message;

    @Column(name = "internal_note", nullable = false)
    @Builder.Default
    private boolean internalNote = false;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
