package com.ohotech.backend.controller;

import com.ohotech.backend.dto.ApiResponse;
import com.ohotech.backend.dto.DeploymentDto;
import com.ohotech.backend.security.UserPrincipal;
import com.ohotech.backend.service.DeploymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deployments")
@RequiredArgsConstructor
public class CustomerDeploymentController {

    private final DeploymentService deploymentService;

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<DeploymentDto>>> getMyDeployments(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<DeploymentDto> deployments = deploymentService.getUserDeployments(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("User deployments fetched successfully", deployments));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DeploymentDto>> getDeploymentById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        DeploymentDto deployment = deploymentService.getDeploymentById(id);
        
        // Authorization check: User must own deployment or have admin rights
        boolean isAdmin = currentUser.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!isAdmin && !deployment.getUserId().equals(currentUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("You are not authorized to view this deployment"));
        }

        if (!isAdmin) {
            deployment.setAdminNotes(null); // Never leak internal admin notes
        }

        return ResponseEntity.ok(ApiResponse.success("Deployment retrieved successfully", deployment));
    }
}
