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
public class TicketStatusUpdateRequest {
    @NotBlank(message = "Status cannot be empty")
    private String status; // OPEN, IN_PROGRESS, ON_HOLD, RESOLVED, CLOSED

    private String note;
}
