package com.ohotech.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WebhookTestRequest {
    @NotBlank(message = "Destination target URL is required")
    private String targetUrl;

    @NotBlank(message = "Event type is required")
    private String eventType;
}
