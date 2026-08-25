package com.ohotech.backend.controller;

import com.ohotech.backend.dto.*;
import com.ohotech.backend.security.UserPrincipal;
import com.ohotech.backend.service.Customer360Service;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/crm")
@RequiredArgsConstructor
public class Customer360Controller {

    private final Customer360Service customer360Service;

    @GetMapping("/customers")
    public ResponseEntity<ApiResponse<PageResponse<UserDto>>> getCustomersList(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<UserDto> customersPage = customer360Service.getCustomersList(search, pageable);
        return ResponseEntity.ok(ApiResponse.success("Customer list retrieved successfully", PageResponse.of(customersPage)));
    }

    @GetMapping("/customers/{userId}")
    public ResponseEntity<ApiResponse<Customer360Dto>> getCustomer360(@PathVariable Long userId) {
        Customer360Dto customer360 = customer360Service.getCustomer360(userId);
        return ResponseEntity.ok(ApiResponse.success("Customer 360 view retrieved", customer360));
    }

    @GetMapping("/leads/{leadId}/customer-match")
    public ResponseEntity<ApiResponse<CustomerMatchResultDto>> findCustomerMatch(@PathVariable Long leadId) {
        CustomerMatchResultDto matchResult = customer360Service.findCustomerMatch(leadId);
        return ResponseEntity.ok(ApiResponse.success("Customer match evaluated", matchResult));
    }

    @PostMapping("/leads/{leadId}/link-customer")
    public ResponseEntity<ApiResponse<LeadDto>> linkCustomerToLead(
            @PathVariable Long leadId,
            @Valid @RequestBody LinkCustomerRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        Long actorId = userPrincipal != null ? userPrincipal.getId() : null;
        LeadDto updated = customer360Service.linkCustomerToLead(leadId, request, actorId);
        return ResponseEntity.ok(ApiResponse.success("Lead successfully linked to customer account", updated));
    }

    @PostMapping("/leads/{leadId}/convert")
    public ResponseEntity<ApiResponse<LeadDto>> convertLeadToCustomer(
            @PathVariable Long leadId,
            @RequestBody(required = false) ConvertLeadRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        Long actorId = userPrincipal != null ? userPrincipal.getId() : null;
        LeadDto converted = customer360Service.convertLeadToCustomer(leadId, request, actorId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.success("Lead successfully converted to Customer", converted));
    }
}
