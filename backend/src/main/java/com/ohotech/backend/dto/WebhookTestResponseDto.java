package com.ohotech.backend.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WebhookTestResponseDto {
    private String targetUrl;
    private int statusCode;
    private long latencyMs;
    private boolean success;
    private String responseSummary;
    private LocalDateTime dispatchedAt;
}
