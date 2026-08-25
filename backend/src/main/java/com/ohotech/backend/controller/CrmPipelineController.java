package com.ohotech.backend.controller;

import com.ohotech.backend.dto.*;
import com.ohotech.backend.security.UserPrincipal;
import com.ohotech.backend.service.CrmPipelineService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/crm")
@RequiredArgsConstructor
public class CrmPipelineController {

    private final CrmPipelineService pipelineService;

    @GetMapping("/pipeline")
    public ResponseEntity<ApiResponse<List<PipelineStageDto>>> getPipelineBoard() {
        List<PipelineStageDto> pipeline = pipelineService.getPipelineBoard();
        return ResponseEntity.ok(ApiResponse.success("Sales pipeline retrieved successfully", pipeline));
    }

    @GetMapping("/leads/{id}/activities")
    public ResponseEntity<ApiResponse<List<LeadActivityDto>>> getLeadActivities(@PathVariable Long id) {
        List<LeadActivityDto> activities = pipelineService.getLeadActivities(id);
        return ResponseEntity.ok(ApiResponse.success("Lead activities retrieved", activities));
    }

    @PostMapping("/leads/{id}/activities")
    public ResponseEntity<ApiResponse<LeadActivityDto>> createLeadActivity(
            @PathVariable Long id,
            @Valid @RequestBody CreateActivityRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        Long actorId = userPrincipal != null ? userPrincipal.getId() : null;
        LeadActivityDto created = pipelineService.createLeadActivity(id, request, actorId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Activity logged successfully", created));
    }

    @GetMapping("/leads/{id}/follow-ups")
    public ResponseEntity<ApiResponse<List<LeadFollowUpDto>>> getLeadFollowUps(@PathVariable Long id) {
        List<LeadFollowUpDto> followUps = pipelineService.getLeadFollowUps(id);
        return ResponseEntity.ok(ApiResponse.success("Lead follow-ups retrieved", followUps));
    }

    @PostMapping("/leads/{id}/follow-ups")
    public ResponseEntity<ApiResponse<LeadFollowUpDto>> createLeadFollowUp(
            @PathVariable Long id,
            @Valid @RequestBody CreateFollowUpRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        Long actorId = userPrincipal != null ? userPrincipal.getId() : null;
        LeadFollowUpDto created = pipelineService.createLeadFollowUp(id, request, actorId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Follow-up scheduled successfully", created));
    }

    @PatchMapping("/follow-ups/{id}")
    public ResponseEntity<ApiResponse<LeadFollowUpDto>> updateFollowUp(
            @PathVariable Long id,
            @RequestBody UpdateFollowUpRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        Long actorId = userPrincipal != null ? userPrincipal.getId() : null;
        LeadFollowUpDto updated = pipelineService.updateFollowUp(id, request, actorId);
        return ResponseEntity.ok(ApiResponse.success("Follow-up updated successfully", updated));
    }

    @GetMapping("/follow-ups/dashboard")
    public ResponseEntity<ApiResponse<FollowUpDashboardDto>> getFollowUpDashboard() {
        FollowUpDashboardDto dashboard = pipelineService.getFollowUpDashboard();
        return ResponseEntity.ok(ApiResponse.success("Follow-up dashboard summary retrieved", dashboard));
    }
}
