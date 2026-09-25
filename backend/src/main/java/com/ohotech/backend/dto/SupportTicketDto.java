package com.ohotech.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SupportTicketDto {
    private Long id;
    private String ticketCode;
    private String subject;
    private String description;
    private String department;
    private String priority;
    private String status;
    private Long customerId;
    private String clientName;
    private String clientEmail;
    private String clientPhone;
    private Long assignedToId;
    private String assignedToName;
    private String assignedToEmail;
    private Long orderId;
    private LocalDateTime slaDueAt;
    private Double slaHoursRemaining;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;
    private String lastReply;
    private List<SupportTicketMessageDto> messages;
}
