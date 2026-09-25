package com.ohotech.backend.controller;

import com.ohotech.backend.dto.*;
import com.ohotech.backend.entity.ContactEnquiry;
import com.ohotech.backend.repository.ContactRepository;
import com.ohotech.backend.security.UserPrincipal;
import com.ohotech.backend.service.SupportTicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/support")
@RequiredArgsConstructor
public class SupportController {

    private final SupportTicketService supportTicketService;
    private final ContactRepository contactRepository;

    /* =========================================================================
       STAFF / HELP DESK ENDPOINTS (ROLE_SUPPORT, ROLE_ADMIN, ROLE_DEVELOPER)
       ========================================================================= */

    @GetMapping("/tickets")
    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN', 'DEVELOPER')")
    public ResponseEntity<ApiResponse<List<SupportTicketDto>>> getStaffTickets(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) String search) {
        List<SupportTicketDto> tickets = supportTicketService.getStaffTickets(status, department, priority, search);
        return ResponseEntity.ok(ApiResponse.success("Tickets retrieved successfully", tickets));
    }

    @GetMapping("/tickets/{id}")
    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN', 'DEVELOPER')")
    public ResponseEntity<ApiResponse<SupportTicketDto>> getTicketDetailsForStaff(@PathVariable Long id) {
        SupportTicketDto ticket = supportTicketService.getTicketDetailsForStaff(id);
        return ResponseEntity.ok(ApiResponse.success("Ticket details retrieved", ticket));
    }

    @PostMapping("/tickets/{id}/reply")
    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN', 'DEVELOPER')")
    public ResponseEntity<ApiResponse<SupportTicketDto>> addStaffReply(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id,
            @Valid @RequestBody TicketReplyRequest request) {
        SupportTicketDto ticket = supportTicketService.addStaffReply(currentUser.getId(), id, request);
        return ResponseEntity.ok(ApiResponse.success("Reply posted successfully", ticket));
    }

    @PutMapping("/tickets/{id}/status")
    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN', 'DEVELOPER')")
    public ResponseEntity<ApiResponse<SupportTicketDto>> updateTicketStatus(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id,
            @Valid @RequestBody TicketStatusUpdateRequest request) {
        SupportTicketDto ticket = supportTicketService.updateTicketStatus(currentUser.getId(), id, request);
        return ResponseEntity.ok(ApiResponse.success("Ticket status updated", ticket));
    }

    @PutMapping("/tickets/{id}/assign")
    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN', 'DEVELOPER')")
    public ResponseEntity<ApiResponse<SupportTicketDto>> assignTicket(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id,
            @RequestParam Long targetStaffId) {
        SupportTicketDto ticket = supportTicketService.assignTicket(currentUser.getId(), id, targetStaffId);
        return ResponseEntity.ok(ApiResponse.success("Ticket assigned successfully", ticket));
    }

    @PostMapping("/tickets/convert-enquiry/{enquiryId}")
    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN', 'DEVELOPER')")
    public ResponseEntity<ApiResponse<SupportTicketDto>> convertEnquiryToTicket(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long enquiryId) {
        SupportTicketDto ticket = supportTicketService.convertEnquiryToTicket(enquiryId, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Enquiry converted to support ticket", ticket));
    }

    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN', 'DEVELOPER')")
    public ResponseEntity<ApiResponse<SupportStatsDto>> getSupportStats() {
        SupportStatsDto stats = supportTicketService.getSupportStats();
        return ResponseEntity.ok(ApiResponse.success("Support statistics retrieved", stats));
    }

    @GetMapping("/enquiries")
    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN', 'DEVELOPER')")
    public ResponseEntity<ApiResponse<List<ContactEnquiry>>> getEnquiries() {
        List<ContactEnquiry> enquiries = contactRepository.findAllByOrderByCreatedAtDesc();
        return ResponseEntity.ok(ApiResponse.success("Contact inquiries retrieved", enquiries));
    }

    /* =========================================================================
       CUSTOMER PORTAL ENDPOINTS (ROLE_CUSTOMER, ROLE_ADMIN, ROLE_DEVELOPER, ROLE_SUPPORT)
       ========================================================================= */

    @PostMapping("/customer/tickets")
    public ResponseEntity<ApiResponse<SupportTicketDto>> createCustomerTicket(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody CreateTicketRequest request) {
        SupportTicketDto ticket = supportTicketService.createCustomerTicket(currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Support ticket created successfully", ticket));
    }

    @GetMapping("/customer/tickets")
    public ResponseEntity<ApiResponse<List<SupportTicketDto>>> getCustomerTickets(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        List<SupportTicketDto> tickets = supportTicketService.getCustomerTickets(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Customer tickets retrieved", tickets));
    }

    @GetMapping("/customer/tickets/{id}")
    public ResponseEntity<ApiResponse<SupportTicketDto>> getCustomerTicketDetails(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id) {
        SupportTicketDto ticket = supportTicketService.getTicketDetailsForCustomer(currentUser.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Ticket details retrieved", ticket));
    }

    @PostMapping("/customer/tickets/{id}/reply")
    public ResponseEntity<ApiResponse<SupportTicketDto>> addCustomerReply(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id,
            @Valid @RequestBody TicketReplyRequest request) {
        SupportTicketDto ticket = supportTicketService.addCustomerReply(currentUser.getId(), id, request);
        return ResponseEntity.ok(ApiResponse.success("Reply submitted to support team", ticket));
    }

    /* =========================================================================
       PUBLIC GUEST QUERY SUBMISSION
       ========================================================================= */

    @PostMapping("/public/ticket")
    public ResponseEntity<ApiResponse<SupportTicketDto>> createPublicTicket(
            @Valid @RequestBody CreateTicketRequest request) {
        SupportTicketDto ticket = supportTicketService.createGuestTicket(request);
        return ResponseEntity.ok(ApiResponse.success("Ticket submitted successfully", ticket));
    }
}
