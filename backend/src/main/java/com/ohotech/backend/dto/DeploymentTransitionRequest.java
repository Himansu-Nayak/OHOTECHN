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
public class DeploymentTransitionRequest {

    /**
     * Action type:
     * ASSIGN, START_CONFIGURATION, MARK_TESTING, MARK_READY, MARK_LIVE, SUSPEND, CANCEL
     */
    @NotBlank(message = "Transition action is required")
    private String action;

    private String assignedEngineer;
    private String accessUrl;
    private String customerNotes;
    private String adminNotes;
}
