package com.ohotech.backend.service.provisioning;

import com.ohotech.backend.entity.DeploymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProvisioningResult {
    private boolean success;
    private DeploymentStatus targetStatus;
    private String message;
    private String accessUrl;
    private String customerInstructions;
    private Map<String, Object> telemetry;
}
