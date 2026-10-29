package com.ohotech.backend.controller;

import com.ohotech.backend.dto.ApiResponse;
import com.ohotech.backend.dto.SendWhatsAppMessageRequest;
import com.ohotech.backend.dto.WhatsAppConfigDto;
import com.ohotech.backend.entity.CrmWhatsAppMessage;
import com.ohotech.backend.repository.CrmWhatsAppMessageRepository;
import com.ohotech.backend.security.UserPrincipal;
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
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

@RestController
@RequestMapping("/api/admin/whatsapp")
@RequiredArgsConstructor
@Slf4j
public class AdminWhatsAppController {

    private final CrmWhatsAppMessageRepository messageRepository;

    @Value("${app.whatsapp.enabled:false}")
    private boolean enabled;

    @Value("${app.whatsapp.api-url:https://graph.facebook.com/v19.0}")
    private String apiUrl;

    @Value("${app.whatsapp.phone-number-id:}")
    private String phoneNumberId;

    @Value("${app.whatsapp.access-token:}")
    private String accessToken;

    @Value("${app.whatsapp.template-name:oho_checkout_otp}")
    private String defaultTemplate;

    @GetMapping("/config")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<WhatsAppConfigDto>> getConfig() {
        boolean isConfigured = enabled && phoneNumberId != null && !phoneNumberId.isBlank()
                && accessToken != null && !accessToken.isBlank();

        long sent = messageRepository.countByStatus("SENT");
        long delivered = messageRepository.countByStatus("DELIVERED");
        long read = messageRepository.countByStatus("READ");
        long failed = messageRepository.countByStatus("FAILED");

        WhatsAppConfigDto config = WhatsAppConfigDto.builder()
                .configured(isConfigured)
                .providerName("Meta WhatsApp Cloud API v19.0")
                .phoneNumberId(isConfigured ? phoneNumberId : "NOT_CONFIGURED")
                .apiUrl(apiUrl)
                .defaultTemplate(defaultTemplate)
                .totalSent(sent)
                .totalDelivered(delivered)
                .totalRead(read)
                .totalFailed(failed)
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
        String cleanPhone = request.getRecipientPhone().replaceAll("[^0-9]", "");

        boolean isConfigured = enabled && phoneNumberId != null && !phoneNumberId.isBlank()
                && accessToken != null && !accessToken.isBlank();

        CrmWhatsAppMessage message = CrmWhatsAppMessage.builder()
                .recipientPhone(cleanPhone)
                .recipientName(request.getRecipientName())
                .templateName(request.getTemplateName())
                .languageCode(request.getLanguageCode() != null ? request.getLanguageCode() : "en")
                .parametersJson(request.getParameters() != null ? request.getParameters().toString() : "[]")
                .dispatchedBy(dispatcher)
                .leadId(request.getLeadId())
                .status("QUEUED")
                .build();

        if (!isConfigured) {
            // Live simulation in unconfigured test mode: clearly mark with test WAMID
            message.setStatus("SENT");
            message.setWamid("wamid.DEV_SIMULATION." + System.currentTimeMillis());
            CrmWhatsAppMessage saved = messageRepository.save(message);
            log.info("[WHATSAPP DEV LOG] Simulated dispatch to {} using template {}", cleanPhone, request.getTemplateName());
            return ResponseEntity.ok(ApiResponse.success("WhatsApp message dispatched (Dev Simulation)", saved));
        }

        try {
            URI uri = URI.create(apiUrl.replaceAll("/+$", "") + "/" + phoneNumberId + "/messages");

            JSONObject payload = new JSONObject();
            payload.put("messaging_product", "whatsapp");
            payload.put("to", cleanPhone);
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
                log.info("WhatsApp message successfully dispatched to {}. Response: {}", cleanPhone, response.body());
            } else {
                message.setStatus("FAILED");
                message.setErrorMessage("HTTP " + response.statusCode() + ": " + response.body());
                log.error("Failed WhatsApp delivery to {}. Response: {}", cleanPhone, response.body());
            }
        } catch (Exception e) {
            message.setStatus("FAILED");
            message.setErrorMessage(e.getMessage());
            log.error("Exception dispatching WhatsApp message to {}: {}", cleanPhone, e.getMessage());
        }

        CrmWhatsAppMessage saved = messageRepository.save(message);
        return ResponseEntity.ok(ApiResponse.success(
                message.getStatus().equals("SENT") ? "WhatsApp message sent successfully" : "Failed to deliver WhatsApp message",
                saved
        ));
    }
}
