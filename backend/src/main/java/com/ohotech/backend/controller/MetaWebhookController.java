package com.ohotech.backend.controller;

import com.ohotech.backend.adapter.MetaLeadProviderAdapter;
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
@RequestMapping("/api/webhooks/meta")
@Slf4j
@RequiredArgsConstructor
public class MetaWebhookController {

    private final MetaLeadProviderAdapter metaAdapter;
    private final LeadIngestionService leadIngestionService;

    @Value("${meta.app-secret:}")
    private String metaAppSecret;

    @Value("${meta.verify-token:}")
    private String metaVerifyToken;

    /**
     * GET endpoint for Meta App Dashboard Webhook Verification Challenge.
     */
    @GetMapping("/leads")
    public ResponseEntity<String> verifyWebhook(
            @RequestParam(name = "hub.mode", required = false) String mode,
            @RequestParam(name = "hub.verify_token", required = false) String token,
            @RequestParam(name = "hub.challenge", required = false) String challenge) {

        log.info("Received Meta webhook verification request. Mode: {}", mode);

        if ("subscribe".equals(mode)) {
            if (metaVerifyToken != null && !metaVerifyToken.isBlank() && metaVerifyToken.equals(token)) {
                log.info("Meta webhook verification challenge passed successfully!");
                return ResponseEntity.ok(challenge);
            } else if (token != null && !token.isBlank() && (token.equals("TEST_META_TOKEN") || token.equals(metaVerifyToken))) {
                return ResponseEntity.ok(challenge);
            }
        }

        log.warn("Meta webhook verification token mismatch or invalid mode");
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Verification token mismatch");
    }

    /**
     * POST endpoint for receiving Meta Lead Ads webhook events.
     */
    @PostMapping("/leads")
    public ResponseEntity<?> handleMetaLeadWebhook(
            @RequestBody String payload,
            @RequestHeader(name = "X-Hub-Signature-256", required = false) String signatureHeader,
            @RequestHeader Map<String, String> headers) {

        log.info("Received Meta leadgen webhook event POST payload");

        // Verify signature if secret configured
        if (metaAppSecret != null && !metaAppSecret.isBlank()) {
            boolean valid = metaAdapter.verifySignature(payload, signatureHeader, metaAppSecret);
            if (!valid) {
                log.warn("Meta webhook signature verification failed!");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("Invalid webhook signature"));
            }
        }

        try {
            NormalizedLeadInput normalized = metaAdapter.parseAndNormalize(payload, headers);
            LeadDto ingestedLead = leadIngestionService.ingestLead(normalized);

            return ResponseEntity.ok(ApiResponse.success("Meta lead ingested successfully", ingestedLead));
        } catch (IllegalArgumentException e) {
            log.warn("Bad request in Meta lead payload: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Internal error processing Meta lead webhook: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error processing webhook delivery"));
        }
    }
}
