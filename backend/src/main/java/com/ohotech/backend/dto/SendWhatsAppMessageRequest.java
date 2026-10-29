package com.ohotech.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SendWhatsAppMessageRequest {

    @NotBlank(message = "Recipient phone number is required")
    private String recipientPhone;

    private String recipientName;

    @NotBlank(message = "Template name is required")
    private String templateName;

    private String languageCode;

    private List<String> parameters;

    private Long leadId;

    private String idempotencyKey;

    @Builder.Default
    private String category = "MARKETING"; // MARKETING, TRANSACTIONAL, UTILITY

    @Builder.Default
    private boolean overrideConsent = false;
}
