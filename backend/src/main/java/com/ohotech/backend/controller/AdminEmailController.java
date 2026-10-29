package com.ohotech.backend.controller;

import com.ohotech.backend.dto.ApiResponse;
import com.ohotech.backend.dto.EmailStatsDto;
import com.ohotech.backend.entity.EmailOutbox;
import com.ohotech.backend.entity.EmailSuppression;
import com.ohotech.backend.repository.EmailOutboxRepository;
import com.ohotech.backend.repository.EmailSuppressionRepository;
import com.ohotech.backend.service.EmailService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin/emails")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminEmailController {

    private final EmailOutboxRepository emailOutboxRepository;
    private final EmailSuppressionRepository emailSuppressionRepository;
    private final EmailService emailService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<EmailOutbox>>> getEmails(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<EmailOutbox> result;

        if (status != null && !status.equalsIgnoreCase("ALL") && category != null && !category.equalsIgnoreCase("ALL")) {
            result = emailOutboxRepository.findByStatusAndCategory(status.toUpperCase(), category.toUpperCase(), pageable);
        } else if (status != null && !status.equalsIgnoreCase("ALL")) {
            result = emailOutboxRepository.findByStatus(status.toUpperCase(), pageable);
        } else if (category != null && !category.equalsIgnoreCase("ALL")) {
            result = emailOutboxRepository.findByCategory(category.toUpperCase(), pageable);
        } else {
            result = emailOutboxRepository.findAll(pageable);
        }

        return ResponseEntity.ok(ApiResponse.success("Emails retrieved successfully", result));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<EmailStatsDto>> getEmailStats() {
        long total = emailOutboxRepository.count();
        long queued = emailOutboxRepository.countByStatus("QUEUED");
        long processing = emailOutboxRepository.countByStatus("PROCESSING");
        long sent = emailOutboxRepository.countByStatus("SENT");
        long failed = emailOutboxRepository.countByStatus("FAILED");
        long suppressed = emailOutboxRepository.countByStatus("SUPPRESSED");

        EmailStatsDto stats = EmailStatsDto.builder()
                .total(total)
                .queued(queued)
                .processing(processing)
                .sent(sent)
                .failed(failed)
                .suppressed(suppressed)
                .build();

        return ResponseEntity.ok(ApiResponse.success("Email stats retrieved", stats));
    }

    @PostMapping("/{id}/retry")
    public ResponseEntity<ApiResponse<EmailOutbox>> retryEmail(@PathVariable Long id) {
        EmailOutbox outbox = emailOutboxRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Email record #" + id + " not found"));

        if ("SUPPRESSED".equalsIgnoreCase(outbox.getStatus())) {
            throw new IllegalStateException("Cannot retry email to suppressed address: " + outbox.getRecipient());
        }

        outbox.setStatus("QUEUED");
        outbox.setAttempts(outbox.getAttempts() + 1);
        outbox.setErrorMessage(null);
        outbox.setNextRetryAt(LocalDateTime.now());
        EmailOutbox saved = emailOutboxRepository.save(outbox);

        // Async retry
        emailService.sendHtmlEmail(saved.getRecipient(), saved.getSubject(), saved.getContentPreview() != null ? saved.getContentPreview() : "");

        return ResponseEntity.ok(ApiResponse.success("Email retry queued", saved));
    }

    @GetMapping("/suppressions")
    public ResponseEntity<ApiResponse<List<EmailSuppression>>> getSuppressions() {
        List<EmailSuppression> suppressions = emailSuppressionRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(ApiResponse.success("Suppressions retrieved", suppressions));
    }

    @PostMapping("/suppressions")
    public ResponseEntity<ApiResponse<EmailSuppression>> addSuppression(@RequestBody SuppressionRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email is required for suppression");
        }

        String cleanEmail = request.getEmail().trim().toLowerCase();
        EmailSuppression suppression = emailSuppressionRepository.findByEmailIgnoreCase(cleanEmail)
                .orElseGet(() -> EmailSuppression.builder()
                        .email(cleanEmail)
                        .reason(request.getReason() != null ? request.getReason() : "MANUAL_ADMIN")
                        .source("ADMIN_CONSOLE")
                        .build());

        suppression.setReason(request.getReason() != null ? request.getReason() : "MANUAL_ADMIN");
        EmailSuppression saved = emailSuppressionRepository.save(suppression);

        return ResponseEntity.ok(ApiResponse.success("Email address added to suppression list", saved));
    }

    @DeleteMapping("/suppressions/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSuppression(@PathVariable Long id) {
        emailSuppressionRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Suppression removed successfully", null));
    }

    @Data
    public static class SuppressionRequest {
        private String email;
        private String reason;
    }
}
