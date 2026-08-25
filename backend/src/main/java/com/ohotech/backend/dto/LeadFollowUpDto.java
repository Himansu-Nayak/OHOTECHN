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
public class LeadFollowUpDto {
    private Long id;
    private Long leadId;
    private String leadName;
    private String leadEmail;
    private String companyName;
    private Long assignedUserId;
    private String assignedUserName;
    private String assignedUserEmail;
    private LocalDateTime scheduledAt;
    private String title;
    private String notes;
    private FollowUpStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
}
