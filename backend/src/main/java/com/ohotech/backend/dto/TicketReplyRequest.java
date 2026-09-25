package com.ohotech.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketReplyRequest {
    @NotBlank(message = "Message cannot be empty")
    private String message;

    private boolean internalNote; // true if private note between support staff
    private String newStatus;     // optional status change on reply (e.g. IN_PROGRESS, RESOLVED)
}
