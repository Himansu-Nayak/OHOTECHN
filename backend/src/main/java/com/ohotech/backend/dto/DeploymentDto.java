package com.ohotech.backend.dto;

import com.ohotech.backend.entity.DeploymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeploymentDto {
    private Long id;
    private Long orderId;
    private Long productId;
    private String productName;
    private Long userId;
    private String userEmail;
    private String userName;
    private Long licenseId;
    private String licenseKey;
    private DeploymentStatus status;
    private String targetEnvironment;
    private String accessUrl;
    private String assignedEngineer;
    private String adminNotes;
    private String customerNotes;
    private LocalDateTime completedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
