package com.ohotech.backend.dto;

import com.ohotech.backend.entity.FollowUpStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateFollowUpRequest {
    private FollowUpStatus status;
    private String notes;
    private LocalDateTime scheduledAt;
    private Long assignedUserId;
}
