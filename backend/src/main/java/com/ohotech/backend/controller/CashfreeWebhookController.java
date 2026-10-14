package com.ohotech.backend.controller;

import com.ohotech.backend.dto.ApiResponse;
import com.ohotech.backend.exception.BadRequestException;
import com.ohotech.backend.service.payment.CashfreeGateway;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/webhooks/cashfree")
@RequiredArgsConstructor
@Slf4j
public class CashfreeWebhookController {

    private final CashfreeGateway cashfreeGateway;

    /**
     * Cashfree PG Webhook Endpoint:
     * POST /api/webhooks/cashfree
     *
     * Validates headers:
     * - x-webhook-signature (or X-Webhook-Signature)
     * - x-webhook-timestamp (or X-Webhook-Timestamp)
     *
     * Uses the unmodified raw HTTP body string for HMAC-SHA256 Base64 verification.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> handleCashfreeWebhook(
            @RequestBody String rawPayload,
            @RequestHeader(value = "x-webhook-signature", required = false) String signatureHeader,
            @RequestHeader(value = "X-Webhook-Signature", required = false) String signatureHeaderUpper,
            @RequestHeader(value = "x-webhook-timestamp", required = false) String timestampHeader,
            @RequestHeader(value = "X-Webhook-Timestamp", required = false) String timestampHeaderUpper) {

        String signature = signatureHeader != null && !signatureHeader.isBlank() ? signatureHeader : signatureHeaderUpper;
        String timestamp = timestampHeader != null && !timestampHeader.isBlank() ? timestampHeader : timestampHeaderUpper;

        if (signature == null || signature.isBlank() || timestamp == null || timestamp.isBlank()) {
            log.warn("Cashfree webhook rejected: Missing signature or timestamp headers");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Missing required Cashfree signature headers"));
        }

        log.info("Received Cashfree webhook request with timestamp: {}", timestamp);

        try {
            Map<String, Object> result = cashfreeGateway.processWebhookEvent(rawPayload, timestamp, signature);
            return ResponseEntity.ok(ApiResponse.success("Cashfree webhook processed successfully", result));
        } catch (BadRequestException bre) {
            log.error("Cashfree webhook validation failed: {}", bre.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(bre.getMessage()));
        } catch (Exception e) {
            log.error("Server error processing Cashfree webhook: {}", e.getMessage(), e);
            // Cashfree expects 200 OK or 5xx for retryable failures
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Internal processing error"));
        }
    }
}
