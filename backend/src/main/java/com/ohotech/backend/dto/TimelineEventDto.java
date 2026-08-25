package com.ohotech.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TimelineEventDto {
    private String eventType;
    private String title;
    private String description;
    private String category; // CRM, COMMERCE, PAYMENT, LICENSE, SYSTEM
    private LocalDateTime timestamp;
    private String actorName;
    private String metadata;
}
