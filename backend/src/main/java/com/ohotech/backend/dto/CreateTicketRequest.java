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
public class CreateTicketRequest {
    @NotBlank(message = "Subject is required")
    private String subject;

    @NotBlank(message = "Description is required")
    private String description;

    private String department; // TECHNICAL, BILLING, SALES, LICENSING, GENERAL
    private String priority;   // LOW, MEDIUM, HIGH, URGENT

    private String clientName;
    private String clientEmail;
    private String clientPhone;
    private Long orderId;
}
