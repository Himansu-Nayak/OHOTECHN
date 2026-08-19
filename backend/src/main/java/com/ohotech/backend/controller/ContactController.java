package com.ohotech.backend.controller;

import com.ohotech.backend.dto.ApiResponse;
import com.ohotech.backend.dto.ContactRequest;
import com.ohotech.backend.entity.ContactEnquiry;
import com.ohotech.backend.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    @PostMapping
    public ResponseEntity<ApiResponse<ContactEnquiry>> submitContactForm(@Valid @RequestBody ContactRequest request) {
        ContactEnquiry enquiry = contactService.createEnquiry(request);
        return ResponseEntity.ok(ApiResponse.success("Enquiry submitted successfully", enquiry));
    }
}
