package com.ohotech.backend.controller;

import com.ohotech.backend.dto.*;
import com.ohotech.backend.entity.CrmWhatsAppConsent;
import com.ohotech.backend.entity.CrmWhatsAppMessage;
import com.ohotech.backend.repository.CrmWhatsAppConsentRepository;
import com.ohotech.backend.repository.CrmWhatsAppMessageRepository;
import com.ohotech.backend.security.UserPrincipal;
import com.ohotech.backend.service.WhatsAppPhoneNormalizer;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.LocalDateTime;

/**
 * Controller for managing CRM WhatsApp Business operations:
 * - Configuration health and provider status
 * - Dispatching template messages with consent enforcement & server-side idempotency
 * - Message audit logs and delivery history
 * - Consent ledger and opt-out management
 */
@RestController
@RequestMapping("/api/admin/whatsapp")
@RequiredArgsConstructor
@Slf4j
public class AdminWhatsAppController {

    private final CrmWhatsAppMessageRepository messageRepository;
    private final CrmWhatsAppConsentRepository consentRepository;
    private final WhatsAppPhoneNormalizer phoneNormalizer;

    @Value("${app.whatsapp.enabled:${WHATSAPP_ENABLED:false}}")
    private boolean enabled;

    @Value("${app.whatsapp.business-number:${WHATSAPP_BUSINESS_NUMBER:+917684054872}}")
    private String businessContactNumber;

    @Value("${app.whatsapp.api-url:${WHATSAPP_API_URL:https://graph.facebook.com/v19.0}}")
    private String apiUrl;

    @Value("${app.whatsapp.phone-number-id:${WHATSAPP_PHONE_NUMBER_ID:}}")
    private String phoneNumberId;

    @Value("${app.whatsapp.access-token:${WHATSAPP_API_TOKEN:}}")
    private String accessToken;

    @Value("${app.whatsapp.template-name:${WHATSAPP_TEMPLATE_NAME:oho_checkout_otp}}")
    private String defaultTemplate;

    @Value("${app.whatsapp.verify-token:${WHATSAPP_VERIFY_TOKEN:${meta.verify-token:}}}")
    private String verifyToken;

    @Value("${app.whatsapp.app-secret:${WHATSAPP_APP_SECRET:${meta.app-secret:}}}")
    private String appSecret;

    @GetMapping("/config")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<WhatsAppConfigDto>> getConfig() {
        boolean isConfigured = enabled && phoneNumberId != null && !phoneNumberId.isBlank()
                && accessToken != null && !accessToken.isBlank();

        long sent = messageRepository.countByStatus("SENT");
        long delivered = messageRepository.countByStatus("DELIVERED");
        long read = messageRepository.countByStatus("READ");
        long failed = messageRepository.countByStatus("FAILED");
        long totalOptedOut = consentRepository.countByOptInFalse();
        long totalConsented = consentRepository.countByOptInTrue();

        WhatsAppConfigDto config = WhatsAppConfigDto.builder()
                .configured(isConfigured)
                .providerName("Meta WhatsApp Cloud API v19.0")
                .businessContactNumber(businessContactNumber)
                .phoneNumberId(isConfigured ? phoneNumberId : "NOT_CONFIGURED")
                .apiUrl(apiUrl)
                .defaultTemplate(defaultTemplate)
                .webhookEndpoint("/api/webhooks/whatsapp")
                .webhookConfigured(verifyToken != null && !verifyToken.isBlank())
                .totalSent(sent)
                .totalDelivered(delivered)
                .totalRead(read)
                .totalFailed(failed)
                .totalOptedOut(totalOptedOut)
                .totalConsented(totalConsented)
                .build();

        return ResponseEntity.ok(ApiResponse.success("WhatsApp configuration retrieved", config));
    }

    @GetMapping("/messages")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Page<CrmWhatsAppMessage>>> getMessages(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<CrmWhatsAppMessage> messages = (status != null && !status.equalsIgnoreCase("ALL"))
                ? messageRepository.findByStatus(status.toUpperCase(), pageable)
                : messageRepository.findAll(pageable);

        return ResponseEntity.ok(ApiResponse.success("WhatsApp message history retrieved", messages));
    }

    @PostMapping("/send")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<CrmWhatsAppMessage>> sendMessage(
            @Valid @RequestBody SendWhatsAppMessageRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        String dispatcher = userPrincipal != null ? userPrincipal.getEmail() : "ADMIN";

        // 1. Validate & normalize phone number
        String e164Phone;
        String metaPhone;
        try {
            e164Phone = phoneNormalizer.normalizeToE164(request.getRecipientPhone());
            metaPhone = phoneNormalizer.toMetaRecipient(request.getRecipientPhone());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Invalid recipient phone format: " + e.getMessage()));
        }

        // 2. Server-side Idempotency: Check if client provided an idempotency key
        if (request.getIdempotencyKey() != null && !request.getIdempotencyKey().isBlank()) {
            var existing = messageRepository.findByIdempotencyKey(request.getIdempotencyKey());
            if (existing.isPresent()) {
                log.info("Duplicate WhatsApp dispatch prevented by idempotency key: {}", request.getIdempotencyKey());
                return ResponseEntity.ok(ApiResponse.success(
                        "Message retrieved by idempotency key (duplicate send prevented)",
                        existing.get()
                ));
            }
        }

        // 3. Duplicate Send Protection: Prevent identical messages within 60 seconds
        boolean recentDuplicate = messageRepository.existsByRecipientPhoneAndTemplateNameAndCreatedAtAfter(
                metaPhone,
                request.getTemplateName(),
                LocalDateTime.now().minusSeconds(60)
        );
        if (recentDuplicate) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ApiResponse.error(
                    "Duplicate send rejected: An identical message was dispatched to " + e164Phone + " less than 60 seconds ago."
            ));
        }

        // 4. Consent Enforcement: Check if recipient has opted out of WhatsApp
        String category = request.getCategory() != null ? request.getCategory().toUpperCase() : "MARKETING";
        boolean hasOptedOut = consentRepository.existsByPhoneAndOptInFalse(e164Phone);

        if (hasOptedOut && !request.isOverrideConsent() && !"TRANSACTIONAL".equalsIgnoreCase(category)) {
            CrmWhatsAppMessage blocked = CrmWhatsAppMessage.builder()
                    .recipientPhone(metaPhone)
                    .recipientName(request.getRecipientName())
                    .templateName(request.getTemplateName())
                    .category(category)
                    .status("OPTED_OUT")
                    .errorMessage("Recipient " + e164Phone + " has revoked WhatsApp communication consent")
                    .dispatchedBy(dispatcher)
                    .leadId(request.getLeadId())
                    .idempotencyKey(request.getIdempotencyKey())
                    .build();
            CrmWhatsAppMessage savedBlocked = messageRepository.save(blocked);
            log.warn("Blocked WhatsApp message to {}: recipient has opted out", e164Phone);
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(ApiResponse.error(
                    "Message delivery blocked: Recipient " + e164Phone + " has opted out of WhatsApp communications."
            ));
        }

        boolean isConfigured = enabled && phoneNumberId != null && !phoneNumberId.isBlank()
                && accessToken != null && !accessToken.isBlank();

        CrmWhatsAppMessage message = CrmWhatsAppMessage.builder()
                .recipientPhone(metaPhone)
                .recipientName(request.getRecipientName())
                .templateName(request.getTemplateName())
                .languageCode(request.getLanguageCode() != null ? request.getLanguageCode() : "en")
                .parametersJson(request.getParameters() != null ? request.getParameters().toString() : "[]")
                .category(category)
                .dispatchedBy(dispatcher)
                .leadId(request.getLeadId())
                .idempotencyKey(request.getIdempotencyKey())
                .status("QUEUED")
                .build();

        if (!isConfigured) {
            // Live simulation in unconfigured test mode: clearly mark with test WAMID
            message.setStatus("SENT");
            message.setWamid("wamid.DEV_SIMULATION." + System.currentTimeMillis());
            CrmWhatsAppMessage saved = messageRepository.save(message);
            log.info("[WHATSAPP DEV LOG] Simulated dispatch to {} using template {}", metaPhone, request.getTemplateName());
            return ResponseEntity.ok(ApiResponse.success("WhatsApp message dispatched (Dev Simulation)", saved));
        }

        try {
            URI uri = URI.create(apiUrl.replaceAll("/+$", "") + "/" + phoneNumberId + "/messages");

            JSONObject payload = new JSONObject();
            payload.put("messaging_product", "whatsapp");
            payload.put("to", metaPhone);
            payload.put("type", "template");

            JSONObject template = new JSONObject();
            template.put("name", request.getTemplateName());
            template.put("language", new JSONObject().put("code", message.getLanguageCode()));

            if (request.getParameters() != null && !request.getParameters().isEmpty()) {
                JSONArray components = new JSONArray();
                JSONObject bodyComp = new JSONObject();
                bodyComp.put("type", "body");
                JSONArray params = new JSONArray();
                for (String p : request.getParameters()) {
                    params.put(new JSONObject().put("type", "text").put("text", p));
                }
                bodyComp.put("parameters", params);
                components.put(bodyComp);
                template.put("components", components);
            }

            payload.put("template", template);

            HttpClient client = HttpClient.newBuilder()
                    .connectTimeout(Duration.ofSeconds(5))
                    .build();

            HttpRequest httpRequest = HttpRequest.newBuilder()
                    .uri(uri)
                    .header("Authorization", "Bearer " + accessToken)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(payload.toString()))
                    .build();

            HttpResponse<String> response = client.send(httpRequest, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                JSONObject resJson = new JSONObject(response.body());
                JSONArray messagesArr = resJson.optJSONArray("messages");
                if (messagesArr != null && !messagesArr.isEmpty()) {
                    String wamid = messagesArr.getJSONObject(0).optString("id");
                    message.setWamid(wamid);
                }
                message.setStatus("SENT");
                log.info("WhatsApp message successfully dispatched to {}. Response: {}", metaPhone, response.body());
            } else {
                message.setStatus("FAILED");
                message.setErrorMessage("HTTP " + response.statusCode() + ": " + response.body());
                log.error("Failed WhatsApp delivery to {}. Response: {}", metaPhone, response.body());
            }
        } catch (Exception e) {
            message.setStatus("FAILED");
            message.setErrorMessage(e.getMessage());
            log.error("Exception dispatching WhatsApp message to {}: {}", metaPhone, e.getMessage());
        }

        CrmWhatsAppMessage saved = messageRepository.save(message);
        return ResponseEntity.ok(ApiResponse.success(
                message.getStatus().equals("SENT") ? "WhatsApp message sent successfully" : "Failed to deliver WhatsApp message",
                saved
        ));
    }

    @GetMapping("/consents")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Page<CrmWhatsAppConsent>>> getConsents(
            @RequestParam(required = false) Boolean optIn,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<CrmWhatsAppConsent> consents = (optIn != null)
                ? consentRepository.findByOptIn(optIn, pageable)
                : consentRepository.findAll(pageable);

        return ResponseEntity.ok(ApiResponse.success("WhatsApp consent records retrieved", consents));
    }

    @PostMapping("/consents")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<CrmWhatsAppConsent>> registerConsent(
            @Valid @RequestBody RegisterWhatsAppConsentRequest request
    ) {
        String e164Phone = phoneNormalizer.normalizeToE164(request.getPhone());

        CrmWhatsAppConsent consent = consentRepository.findByPhone(e164Phone)
                .orElseGet(() -> CrmWhatsAppConsent.builder().phone(e164Phone).build());

        consent.setOptIn(request.isOptIn());
        consent.setSource(request.getSource() != null ? request.getSource() : "MANUAL_ADMIN");
        consent.setPurpose(request.getPurpose() != null ? request.getPurpose() : "ALL");

        if (request.isOptIn()) {
            consent.setOptedInAt(LocalDateTime.now());
            consent.setRevocationReason(null);
        } else {
            consent.setOptedOutAt(LocalDateTime.now());
            consent.setRevocationReason(request.getReason() != null ? request.getReason() : "MANUAL_ADMIN_REVOCATION");
        }

        CrmWhatsAppConsent saved = consentRepository.save(consent);
        return ResponseEntity.ok(ApiResponse.success(
                request.isOptIn() ? "Consent recorded for " + e164Phone : "Opt-out recorded for " + e164Phone,
                saved
        ));
    }
}
