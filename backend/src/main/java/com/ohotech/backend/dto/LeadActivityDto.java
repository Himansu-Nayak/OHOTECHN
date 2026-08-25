package com.ohotech.backend.dto;

import com.ohotech.backend.entity.ActivityType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeadActivityDto {
    private Long id;
    private Long leadId;
    private ActivityType type;
    private String description;
    private Long performedById;
    private String performedByName;
    private String performedByEmail;
    private LocalDateTime scheduledAt;
    private LocalDateTime createdAt;
}
