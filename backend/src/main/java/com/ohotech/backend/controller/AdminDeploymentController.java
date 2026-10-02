package com.ohotech.backend.controller;

import com.ohotech.backend.dto.ApiResponse;
import com.ohotech.backend.dto.DeploymentDto;
import com.ohotech.backend.entity.DeploymentStatus;
import com.ohotech.backend.service.DeploymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/deployments")
@RequiredArgsConstructor
@Slf4j
public class AdminDeploymentController {

    private final DeploymentService deploymentService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<DeploymentDto>>> getDeployments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) DeploymentStatus status) {
        Page<DeploymentDto> deployments = deploymentService.getDeploymentsAdmin(page, size, status);
        return ResponseEntity.ok(ApiResponse.success("Deployments retrieved successfully", deployments));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DeploymentDto>> getDeploymentById(@PathVariable Long id) {
        DeploymentDto deployment = deploymentService.getDeploymentById(id);
        return ResponseEntity.ok(ApiResponse.success("Deployment retrieved successfully", deployment));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<DeploymentDto>> createDeployment(@Valid @RequestBody DeploymentDto dto) {
        DeploymentDto created = deploymentService.createDeployment(dto);
        log.info("Admin scheduled new software deployment for product #{} to user #{}", dto.getProductId(), dto.getUserId());
        return ResponseEntity.ok(ApiResponse.success("Deployment initialized successfully", created));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<DeploymentDto>> updateDeploymentStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        String statusStr = payload.get("status");
        String adminNotes = payload.get("adminNotes");
        String accessUrl = payload.get("accessUrl");
        String assignedEngineer = payload.get("assignedEngineer");

        DeploymentStatus status = null;
        if (statusStr != null && !statusStr.trim().isEmpty()) {
            try {
                status = DeploymentStatus.valueOf(statusStr.trim().toUpperCase());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Invalid deployment status: " + statusStr));
            }
        }

        DeploymentDto updated = deploymentService.updateDeploymentStatus(id, status, adminNotes, accessUrl, assignedEngineer);
        log.info("Admin updated deployment #{} status to {}", id, status);
        return ResponseEntity.ok(ApiResponse.success("Deployment status updated successfully", updated));
    }

    @PutMapping("/{id}/customer-notes")
    public ResponseEntity<ApiResponse<DeploymentDto>> updateCustomerNotes(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        String customerNotes = payload.get("customerNotes");
        DeploymentDto updated = deploymentService.updateDeploymentCustomerNotes(id, customerNotes);
        return ResponseEntity.ok(ApiResponse.success("Customer instructions updated successfully", updated));
    }
}
