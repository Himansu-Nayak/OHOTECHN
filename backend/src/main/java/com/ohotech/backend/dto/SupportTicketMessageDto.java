package com.ohotech.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SupportTicketMessageDto {
    private Long id;
    private Long ticketId;
    private Long senderId;
    private String senderName;
    private String senderRole;
    private String message;
    private boolean internalNote;
    private LocalDateTime createdAt;
}
