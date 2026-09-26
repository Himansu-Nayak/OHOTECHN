package com.ohotech.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "support_tickets", indexes = {
        @Index(name = "idx_tickets_code", columnList = "ticket_code", unique = true),
        @Index(name = "idx_tickets_status", columnList = "status"),
        @Index(name = "idx_tickets_dept", columnList = "department"),
        @Index(name = "idx_tickets_priority", columnList = "priority"),
        @Index(name = "idx_tickets_email", columnList = "client_email")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class SupportTicket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ticket_code", nullable = false, unique = true, length = 50)
    private String ticketCode;

    @Column(nullable = false, length = 255)
    private String subject;

    @Column(length = 4000, nullable = false)
    private String description;

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String department = "TECHNICAL"; // TECHNICAL, BILLING, SALES, LICENSING, GENERAL

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String priority = "MEDIUM"; // LOW, MEDIUM, HIGH, URGENT

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String status = "OPEN"; // OPEN, IN_PROGRESS, ON_HOLD, RESOLVED, CLOSED

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_user_id")
    @JsonIgnoreProperties({"passwordHash", "roles", "hibernateLazyInitializer", "handler"})
    private User customer;

    @Column(name = "client_name", nullable = false)
    private String clientName;

    @Column(name = "client_email", length = 255)
    private String clientEmail;

    @Column(name = "client_phone", length = 50)
    private String clientPhone;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to_user_id")
    @JsonIgnoreProperties({"passwordHash", "roles", "hibernateLazyInitializer", "handler"})
    private User assignedTo;

    @Column(name = "order_id")
    private Long orderId;

    @Column(name = "sla_due_at")
    private LocalDateTime slaDueAt;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("createdAt ASC")
    @Builder.Default
    @JsonIgnoreProperties("ticket")
    private List<SupportTicketMessage> messages = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = "OPEN";
        }
        if (priority == null) {
            priority = "MEDIUM";
        }
        if (department == null) {
            department = "TECHNICAL";
        }
        if (slaDueAt == null) {
            // Default SLA: 24 hours for medium, 4 hours for urgent, 8 hours for high
            int hours = "URGENT".equalsIgnoreCase(priority) ? 4 : "HIGH".equalsIgnoreCase(priority) ? 8 : 24;
            slaDueAt = createdAt.plusHours(hours);
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
