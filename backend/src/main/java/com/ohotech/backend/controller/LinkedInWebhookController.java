package com.ohotech.backend.controller;

import com.ohotech.backend.adapter.LinkedInLeadProviderAdapter;
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
@RequestMapping("/api/webhooks/linkedin")
@Slf4j
@RequiredArgsConstructor
public class LinkedInWebhookController {

    private final LinkedInLeadProviderAdapter linkedinAdapter;
    private final LeadIngestionService leadIngestionService;

    @Value("${linkedin.webhook-secret:}")
    private String linkedinWebhookSecret;

    @PostMapping("/leads")
    public ResponseEntity<?> handleLinkedInLeadWebhook(
            @RequestBody String payload,
            @RequestHeader(name = "X-LinkedIn-Signature", required = false) String signatureHeader,
            @RequestHeader Map<String, String> headers) {

        log.info("Received LinkedIn lead webhook event POST payload");

        if (linkedinWebhookSecret != null && !linkedinWebhookSecret.isBlank()) {
            boolean valid = linkedinAdapter.verifySignature(payload, signatureHeader, linkedinWebhookSecret);
            if (!valid) {
                log.warn("LinkedIn webhook signature verification failed!");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("Invalid webhook signature"));
            }
        }

        try {
            NormalizedLeadInput normalized = linkedinAdapter.parseAndNormalize(payload, headers);
            LeadDto ingestedLead = leadIngestionService.ingestLead(normalized);

            return ResponseEntity.ok(ApiResponse.success("LinkedIn lead ingested successfully", ingestedLead));
        } catch (IllegalArgumentException e) {
            log.warn("Bad request in LinkedIn lead payload: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Internal error processing LinkedIn lead webhook: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error processing webhook delivery"));
        }
    }
}
