package com.ohotech.backend.dto;

import com.ohotech.backend.entity.WebhookEventStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WebhookEventDto {
    private Long id;
    private String provider;
    private String externalEventId;
    private String externalLeadId;
    private String eventType;
    private LocalDateTime receivedAt;
    private WebhookEventStatus status;
    private Integer attemptCount;
    private LocalDateTime processedAt;
    private String errorReason;
    private String payloadSummary;
}
