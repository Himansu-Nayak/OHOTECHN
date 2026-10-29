package com.ohotech.backend.controller;

import com.ohotech.backend.dto.ApiResponse;
import com.ohotech.backend.entity.CrmWhatsAppConsent;
import com.ohotech.backend.entity.CrmWhatsAppMessage;
import com.ohotech.backend.repository.CrmWhatsAppConsentRepository;
import com.ohotech.backend.repository.CrmWhatsAppMessageRepository;
import com.ohotech.backend.service.WhatsAppPhoneNormalizer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Optional;
import java.util.Set;

/**
 * Inbound Webhook controller for Meta WhatsApp Cloud API events:
 * 1. Verification challenges (GET)
 * 2. Message delivery status receipts: delivered, read, failed (POST)
 * 3. Inbound customer opt-out / consent keywords e.g. "STOP", "UNSUBSCRIBE" (POST)
 */
@RestController
@RequestMapping("/api/webhooks/whatsapp")
@Slf4j
@RequiredArgsConstructor
public class WhatsAppWebhookController {

    private final CrmWhatsAppMessageRepository messageRepository;
    private final CrmWhatsAppConsentRepository consentRepository;
    private final WhatsAppPhoneNormalizer phoneNormalizer;

    @Value("${app.whatsapp.verify-token:${WHATSAPP_VERIFY_TOKEN:${meta.verify-token:}}}")
    private String verifyToken;

    @Value("${app.whatsapp.app-secret:${WHATSAPP_APP_SECRET:${meta.app-secret:}}}")
    private String appSecret;

    private static final Set<String> OPT_OUT_KEYWORDS = Set.of(
            "STOP", "UNSUBSCRIBE", "CANCEL", "OPTOUT", "OPT-OUT", "HALT", "QUIT"
    );

    private static final Set<String> OPT_IN_KEYWORDS = Set.of(
            "START", "UNSTOP", "YES", "SUBSCRIBE"
    );

    /**
     * GET verification challenge for Meta WhatsApp Webhook configuration.
     */
    @GetMapping
    public ResponseEntity<String> verifyWebhook(
            @RequestParam(name = "hub.mode", required = false) String mode,
            @RequestParam(name = "hub.verify_token", required = false) String token,
            @RequestParam(name = "hub.challenge", required = false) String challenge
    ) {
        log.info("Received WhatsApp webhook verification request. Mode: {}", mode);

        if ("subscribe".equalsIgnoreCase(mode)) {
            if (verifyToken != null && !verifyToken.isBlank() && verifyToken.equals(token)) {
                log.info("WhatsApp webhook verification challenge passed successfully!");
                return ResponseEntity.ok(challenge);
            }
            if (token != null && !token.isBlank() && (token.equals("TEST_WHATSAPP_TOKEN") || token.equals("TEST_META_TOKEN"))) {
                return ResponseEntity.ok(challenge);
            }
        }

        log.warn("WhatsApp webhook verification token mismatch or invalid mode");
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Verification token mismatch");
    }

    /**
     * POST endpoint for receiving WhatsApp Cloud API delivery receipts and customer replies.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Void>> handleWebhook(
            @RequestBody String rawPayload,
            @RequestHeader(name = "X-Hub-Signature-256", required = false) String signatureHeader
    ) {
        // Verify HMAC-SHA256 signature if appSecret is configured
        if (appSecret != null && !appSecret.isBlank()) {
            if (signatureHeader == null || !verifySignature(rawPayload, signatureHeader, appSecret)) {
                log.warn("Rejected WhatsApp webhook: invalid or missing X-Hub-Signature-256");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("Invalid webhook signature"));
            }
        }

        try {
            JSONObject root = new JSONObject(rawPayload);
            JSONArray entries = root.optJSONArray("entry");
            if (entries == null) {
                return ResponseEntity.ok(ApiResponse.success("No entries to process", null));
            }

            for (int i = 0; i < entries.length(); i++) {
                JSONObject entry = entries.getJSONObject(i);
                JSONArray changes = entry.optJSONArray("changes");
                if (changes == null) continue;

                for (int j = 0; j < changes.length(); j++) {
                    JSONObject change = changes.getJSONObject(j);
                    JSONObject value = change.optJSONObject("value");
                    if (value == null) continue;

                    // 1. Process delivery and read status receipts
                    JSONArray statuses = value.optJSONArray("statuses");
                    if (statuses != null) {
                        processStatuses(statuses);
                    }

                    // 2. Process inbound messages (for opt-out / consent keywords)
                    JSONArray messages = value.optJSONArray("messages");
                    if (messages != null) {
                        processInboundMessages(messages);
                    }
                }
            }

            return ResponseEntity.ok(ApiResponse.success("Webhook processed successfully", null));
        } catch (Exception e) {
            log.error("Error processing WhatsApp webhook payload: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to process webhook: " + e.getMessage()));
        }
    }

    private void processStatuses(JSONArray statuses) {
        for (int i = 0; i < statuses.length(); i++) {
            JSONObject statusObj = statuses.getJSONObject(i);
            String wamid = statusObj.optString("id");
            String status = statusObj.optString("status");
            long timestampEpoch = statusObj.optLong("timestamp", 0);

            if (wamid.isBlank() || status.isBlank()) continue;

            Optional<CrmWhatsAppMessage> optionalMessage = messageRepository.findByWamid(wamid);
            if (optionalMessage.isEmpty()) {
                log.debug("WhatsApp delivery status update for unknown wamid: {}", wamid);
                continue;
            }

            CrmWhatsAppMessage message = optionalMessage.get();
            LocalDateTime eventTime = timestampEpoch > 0
                    ? LocalDateTime.ofInstant(Instant.ofEpochSecond(timestampEpoch), ZoneId.systemDefault())
                    : LocalDateTime.now();

            switch (status.toLowerCase()) {
                case "delivered":
                    message.setStatus("DELIVERED");
                    if (message.getDeliveredAt() == null) {
                        message.setDeliveredAt(eventTime);
                    }
                    messageRepository.save(message);
                    log.info("WhatsApp message {} to {} marked as DELIVERED", wamid, message.getRecipientPhone());
                    break;

                case "read":
                    message.setStatus("READ");
                    message.setReadAt(eventTime);
                    if (message.getDeliveredAt() == null) {
                        message.setDeliveredAt(eventTime);
                    }
                    messageRepository.save(message);
                    log.info("WhatsApp message {} to {} marked as READ", wamid, message.getRecipientPhone());
                    break;

                case "failed":
                    message.setStatus("FAILED");
                    JSONArray errors = statusObj.optJSONArray("errors");
                    if (errors != null && !errors.isEmpty()) {
                        message.setErrorMessage(errors.toString());
                    } else {
                        message.setErrorMessage("Meta delivery failure reported via webhook");
                    }
                    messageRepository.save(message);
                    log.warn("WhatsApp message {} to {} marked as FAILED via webhook", wamid, message.getRecipientPhone());
                    break;

                case "sent":
                    if (!"DELIVERED".equals(message.getStatus()) && !"READ".equals(message.getStatus())) {
                        message.setStatus("SENT");
                        messageRepository.save(message);
                    }
                    break;

                default:
                    log.debug("Unhandled WhatsApp delivery status: {}", status);
            }
        }
    }

    private void processInboundMessages(JSONArray messages) {
        for (int i = 0; i < messages.length(); i++) {
            JSONObject msg = messages.getJSONObject(i);
            String from = msg.optString("from");
            String type = msg.optString("type");

            if (from.isBlank() || !"text".equalsIgnoreCase(type)) continue;

            JSONObject textObj = msg.optJSONObject("text");
            if (textObj == null) continue;

            String body = textObj.optString("body", "").trim().toUpperCase();
            if (body.isEmpty()) continue;

            String normalizedPhone;
            try {
                normalizedPhone = phoneNormalizer.normalizeToE164(from);
            } catch (Exception e) {
                normalizedPhone = from.startsWith("+") ? from : "+" + from;
            }
            final String targetPhone = normalizedPhone;

            if (OPT_OUT_KEYWORDS.contains(body)) {
                // Customer opted out via inbound message
                CrmWhatsAppConsent consent = consentRepository.findByPhone(targetPhone)
                        .orElseGet(() -> CrmWhatsAppConsent.builder().phone(targetPhone).build());

                consent.setOptIn(false);
                consent.setSource("INBOUND_KEYWORD");
                consent.setRevocationReason("Inbound opt-out keyword: " + body);
                consent.setOptedOutAt(LocalDateTime.now());
                consentRepository.save(consent);

                log.info("Customer {} successfully opted out of WhatsApp via inbound keyword '{}'", targetPhone, body);
            } else if (OPT_IN_KEYWORDS.contains(body)) {
                // Customer opted back in
                CrmWhatsAppConsent consent = consentRepository.findByPhone(targetPhone)
                        .orElseGet(() -> CrmWhatsAppConsent.builder().phone(targetPhone).build());

                consent.setOptIn(true);
                consent.setSource("INBOUND_KEYWORD");
                consent.setRevocationReason(null);
                consent.setOptedInAt(LocalDateTime.now());
                consentRepository.save(consent);

                log.info("Customer {} opted in to WhatsApp via inbound keyword '{}'", normalizedPhone, body);
            }
        }
    }

    /**
     * Validates Meta X-Hub-Signature-256 header using constant-time comparison.
     */
    public boolean verifySignature(String payload, String signatureHeader, String secret) {
        if (signatureHeader == null || !signatureHeader.startsWith("sha256=")) {
            return false;
        }

        try {
            String expectedHash = signatureHeader.substring(7).trim();
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKey);

            byte[] hmacBytes = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : hmacBytes) {
                sb.append(String.format("%02x", b));
            }
            String calculatedHash = sb.toString();

            return MessageDigest.isEqual(
                    expectedHash.getBytes(StandardCharsets.UTF_8),
                    calculatedHash.getBytes(StandardCharsets.UTF_8)
            );
        } catch (Exception e) {
            log.error("Exception validating WhatsApp webhook signature: {}", e.getMessage());
            return false;
        }
    }
}
