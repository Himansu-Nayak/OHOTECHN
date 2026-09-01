package com.ohotech.backend.controller;

import com.ohotech.backend.adapter.GoogleLeadProviderAdapter;
import com.ohotech.backend.dto.ApiResponse;
import com.ohotech.backend.dto.LeadDto;
import com.ohotech.backend.dto.NormalizedLeadInput;
import com.ohotech.backend.service.LeadIngestionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/webhooks/google")
@Slf4j
@RequiredArgsConstructor
public class GoogleWebhookController {

    private final GoogleLeadProviderAdapter googleAdapter;
    private final LeadIngestionService leadIngestionService;

    @Value("${google.webhook-secret:}")
    private String googleWebhookSecret;

    @PostMapping("/leads")
    public ResponseEntity<?> handleGoogleLeadWebhook(
            @RequestBody String payload,
            @RequestHeader(name = "google_key", required = false) String googleKeyHeader,
            @RequestHeader(name = "Authorization", required = false) String authHeader,
            @RequestHeader Map<String, String> headers) {

        log.info("Received Google lead webhook event POST payload");

        String tokenHeader = googleKeyHeader != null ? googleKeyHeader : authHeader;

        if (googleWebhookSecret != null && !googleWebhookSecret.isBlank()) {
            boolean valid = googleAdapter.verifySignature(payload, tokenHeader, googleWebhookSecret);
            if (!valid) {
                log.warn("Google webhook key verification failed!");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("Invalid webhook key"));
            }
        }

        try {
            NormalizedLeadInput normalized = googleAdapter.parseAndNormalize(payload, headers);
            LeadDto ingestedLead = leadIngestionService.ingestLead(normalized);

            return ResponseEntity.ok(ApiResponse.success("Google Lead Form ingested successfully", ingestedLead));
        } catch (IllegalArgumentException e) {
            log.warn("Bad request in Google lead payload: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Internal error processing Google lead webhook: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error processing webhook delivery"));
        }
    }
}
