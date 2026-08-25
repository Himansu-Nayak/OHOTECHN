package com.ohotech.backend.controller;

import com.ohotech.backend.dto.*;
import com.ohotech.backend.entity.LeadPriority;
import com.ohotech.backend.entity.LeadSource;
import com.ohotech.backend.entity.LeadStatus;
import com.ohotech.backend.service.LeadService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/admin/crm/leads")
@RequiredArgsConstructor
public class LeadController {

    private final LeadService leadService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<LeadDto>>> getLeads(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) LeadStatus status,
            @RequestParam(required = false) LeadSource source,
            @RequestParam(required = false) LeadPriority priority,
            @RequestParam(required = false) Long assignedToId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<LeadDto> leads = leadService.getLeads(search, status, source, priority, assignedToId, startDate, endDate, pageable);
        return ResponseEntity.ok(ApiResponse.success("CRM Leads retrieved successfully", leads));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LeadDto>> getLeadById(@PathVariable Long id) {
        LeadDto lead = leadService.getLeadById(id);
        return ResponseEntity.ok(ApiResponse.success("Lead details retrieved", lead));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<LeadDto>> createLead(@Valid @RequestBody CreateLeadRequest request) {
        LeadDto created = leadService.createLead(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("CRM Lead created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<LeadDto>> updateLead(
            @PathVariable Long id,
            @Valid @RequestBody UpdateLeadRequest request
    ) {
        LeadDto updated = leadService.updateLead(id, request);
        return ResponseEntity.ok(ApiResponse.success("CRM Lead updated successfully", updated));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<LeadDto>> updateLeadStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateLeadStatusRequest request
    ) {
        LeadDto updated = leadService.updateLeadStatus(id, request.getStatus());
        return ResponseEntity.ok(ApiResponse.success("Lead status updated successfully", updated));
    }

    @PatchMapping("/{id}/assign")
    public ResponseEntity<ApiResponse<LeadDto>> assignLead(
            @PathVariable Long id,
            @RequestBody AssignLeadRequest request
    ) {
        LeadDto updated = leadService.assignLead(id, request.getAssignedToId());
        return ResponseEntity.ok(ApiResponse.success("Lead assignment updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteLead(@PathVariable Long id) {
        leadService.deleteLead(id);
        return ResponseEntity.ok(ApiResponse.success("CRM Lead deleted successfully", null));
    }
}
