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
public class MetaLeadProviderAdapter implements LeadProviderAdapter {

    private final ObjectMapper objectMapper;

    @Override
    public boolean supports(String providerName) {
        if (providerName == null) return false;
        String lower = providerName.toLowerCase();
        return lower.equals("meta") || lower.equals("facebook") || lower.equals("instagram");
    }

    @Override
    public boolean verifySignature(String payload, String signatureHeader, String secret) {
        if (secret == null || secret.isBlank()) {
            // If secret is not set, reject in production / accept only if test mode explicitly set
            log.warn("Meta app secret is empty; rejecting signature verification");
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
            log.error("Error verifying Meta HMAC signature: {}", e.getMessage());
            return false;
        }
    }

    @Override
    public NormalizedLeadInput parseAndNormalize(String payload, Map<String, String> headers) {
        try {
            JsonNode root = objectMapper.readTree(payload);

            String externalLeadId = null;
            String externalEventId = null;
            String formId = null;
            String adId = null;
            String adSetId = null;
            String campaignId = null;
            String sourcePlatform = "FACEBOOK";

            String email = null;
            String phone = null;
            String firstName = null;
            String lastName = null;
            String fullName = null;
            String company = null;
            String message = null;

            // Direct payload structure (sanitized test format or flattened input)
            if (root.has("leadgen_id")) {
                externalLeadId = root.get("leadgen_id").asText();
            }
            if (root.has("id")) {
                if (externalLeadId == null) externalLeadId = root.get("id").asText();
                externalEventId = root.get("id").asText();
            }
            if (root.has("platform")) {
                sourcePlatform = root.get("platform").asText().toUpperCase();
            }
            if (root.has("ad_id")) adId = root.get("ad_id").asText();
            if (root.has("adset_id")) adSetId = root.get("adset_id").asText();
            if (root.has("campaign_id")) campaignId = root.get("campaign_id").asText();
            if (root.has("form_id")) formId = root.get("form_id").asText();

            if (root.has("email")) email = root.get("email").asText();
            if (root.has("phone")) phone = root.get("phone").asText();
            if (root.has("full_name")) fullName = root.get("full_name").asText();
            if (root.has("first_name")) firstName = root.get("first_name").asText();
            if (root.has("last_name")) lastName = root.get("last_name").asText();
            if (root.has("company_name")) company = root.get("company_name").asText();
            if (root.has("message")) message = root.get("message").asText();

            // Nested Meta Webhook event format: entry[].changes[].value
            if (root.has("entry") && root.get("entry").isArray() && !root.get("entry").isEmpty()) {
                JsonNode entry = root.get("entry").get(0);
                if (entry.has("id") && externalEventId == null) {
                    externalEventId = entry.get("id").asText();
                }
                if (entry.has("changes") && entry.get("changes").isArray() && !entry.get("changes").isEmpty()) {
                    JsonNode change = entry.get("changes").get(0);
                    if (change.has("value")) {
                        JsonNode val = change.get("value");
                        if (val.has("leadgen_id")) externalLeadId = val.get("leadgen_id").asText();
                        if (val.has("ad_id")) adId = val.get("ad_id").asText();
                        if (val.has("adset_id")) adSetId = val.get("adset_id").asText();
                        if (val.has("campaign_id")) campaignId = val.get("campaign_id").asText();
                        if (val.has("form_id")) formId = val.get("form_id").asText();

                        // Meta field data array mapping
                        if (val.has("field_data") && val.get("field_data").isArray()) {
                            for (JsonNode field : val.get("field_data")) {
                                String name = field.has("name") ? field.get("name").asText() : "";
                                String valueStr = field.has("values") && field.get("values").isArray() && !field.get("values").isEmpty()
                                        ? field.get("values").get(0).asText() : "";

                                switch (name.toLowerCase()) {
                                    case "email":
                                        email = valueStr;
                                        break;
                                    case "phone_number":
                                    case "phone":
                                        phone = valueStr;
                                        break;
                                    case "full_name":
                                        fullName = valueStr;
                                        break;
                                    case "first_name":
                                        firstName = valueStr;
                                        break;
                                    case "last_name":
                                        lastName = valueStr;
                                        break;
                                    case "company_name":
                                    case "company":
                                        company = valueStr;
                                        break;
                                    case "notes":
                                    case "message":
                                        message = valueStr;
                                        break;
                                }
                            }
                        }
                    }
                }
            }

            LeadSource leadSource = sourcePlatform.contains("INSTAGRAM") ? LeadSource.INSTAGRAM : LeadSource.FACEBOOK;

            if (fullName != null && !fullName.isBlank()) {
                String[] parts = fullName.trim().split("\\s+", 2);
                if (firstName == null) firstName = parts[0];
                if (lastName == null && parts.length > 1) lastName = parts[1];
            }

            return NormalizedLeadInput.builder()
                    .source(leadSource)
                    .sourceName(sourcePlatform)
                    .externalLeadId(externalLeadId != null ? externalLeadId : "META_" + System.currentTimeMillis())
                    .externalEventId(externalEventId != null ? externalEventId : "EVT_META_" + System.currentTimeMillis())
                    .firstName(firstName)
                    .lastName(lastName)
                    .name(fullName)
                    .email(email)
                    .phone(phone)
                    .company(company)
                    .message(message)
                    .adId(adId)
                    .adSetId(adSetId)
                    .campaignId(campaignId)
                    .utmSource(sourcePlatform.toLowerCase())
                    .utmMedium("cpc")
                    .utmCampaign(campaignId)
                    .capturedAt(LocalDateTime.now())
                    .rawProviderReference("META_FORM_" + (formId != null ? formId : "N/A"))
                    .build();
        } catch (Exception e) {
            log.error("Failed to parse Meta lead payload: {}", e.getMessage());
            throw new IllegalArgumentException("Malformed Meta webhook payload: " + e.getMessage());
        }
    }
}
