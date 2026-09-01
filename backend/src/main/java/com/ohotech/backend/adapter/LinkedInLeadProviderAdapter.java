package com.ohotech.backend.adapter;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ohotech.backend.dto.NormalizedLeadInput;
import com.ohotech.backend.entity.LeadSource;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.Map;

@Component
@Slf4j
@RequiredArgsConstructor
public class LinkedInLeadProviderAdapter implements LeadProviderAdapter {

    private final ObjectMapper objectMapper;

    @Override
    public boolean supports(String providerName) {
        if (providerName == null) return false;
        return providerName.equalsIgnoreCase("linkedin");
    }

    @Override
    public boolean verifySignature(String payload, String signatureHeader, String secret) {
        if (secret == null || secret.isBlank()) {
            log.warn("LinkedIn webhook secret is empty; rejecting signature verification");
            return false;
        }

        if (signatureHeader == null || signatureHeader.isBlank()) {
            return false;
        }

        try {
            String signature = signatureHeader;
            if (signature.startsWith("sha256=")) {
                signature = signature.substring(7);
            }

            Mac hmac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            hmac.init(secretKey);
            byte[] hash = hmac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            String expectedHex = HexFormat.of().formatHex(hash);

            return expectedHex.equalsIgnoreCase(signature);
        } catch (Exception e) {
            log.error("Error verifying LinkedIn HMAC signature: {}", e.getMessage());
            return false;
        }
    }

    @Override
    public NormalizedLeadInput parseAndNormalize(String payload, Map<String, String> headers) {
        try {
            JsonNode root = objectMapper.readTree(payload);

            String externalLeadId = root.has("leadId") ? root.get("leadId").asText()
                    : (root.has("id") ? root.get("id").asText() : "LINKEDIN_" + System.currentTimeMillis());
            String externalEventId = root.has("eventId") ? root.get("eventId").asText()
                    : "EVT_LI_" + System.currentTimeMillis();

            String firstName = root.has("firstName") ? root.get("firstName").asText() : null;
            String lastName = root.has("lastName") ? root.get("lastName").asText() : null;
            String email = root.has("email") ? root.get("email").asText() : null;
            String phone = root.has("phone") ? root.get("phone").asText() : null;
            String company = root.has("company") ? root.get("company").asText() : null;
            String designation = root.has("title") ? root.get("title").asText()
                    : (root.has("designation") ? root.get("designation").asText() : null);
            String campaign = root.has("campaignName") ? root.get("campaignName").asText() : null;
            String campaignId = root.has("campaignId") ? root.get("campaignId").asText() : null;
            String adSetId = root.has("creativeId") ? root.get("creativeId").asText() : null;
            String message = root.has("message") ? root.get("message").asText() : null;

            return NormalizedLeadInput.builder()
                    .source(LeadSource.LINKEDIN)
                    .sourceName("LINKEDIN")
                    .externalLeadId(externalLeadId)
                    .externalEventId(externalEventId)
                    .firstName(firstName)
                    .lastName(lastName)
                    .email(email)
                    .phone(phone)
                    .company(company)
                    .designation(designation)
                    .campaign(campaign)
                    .campaignId(campaignId)
                    .adSetId(adSetId)
                    .message(message)
                    .utmSource("linkedin")
                    .utmMedium("cpc")
                    .utmCampaign(campaign != null ? campaign : campaignId)
                    .capturedAt(LocalDateTime.now())
                    .rawProviderReference("LINKEDIN_LEAD_GEN")
                    .build();
        } catch (Exception e) {
            log.error("Failed to parse LinkedIn lead payload: {}", e.getMessage());
            throw new IllegalArgumentException("Malformed LinkedIn webhook payload: " + e.getMessage());
        }
    }
}
