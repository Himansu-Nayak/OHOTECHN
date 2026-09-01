package com.ohotech.backend.adapter;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ohotech.backend.dto.NormalizedLeadInput;
import com.ohotech.backend.entity.LeadSource;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Map;

@Component
@Slf4j
@RequiredArgsConstructor
public class GoogleLeadProviderAdapter implements LeadProviderAdapter {

    private final ObjectMapper objectMapper;

    @Override
    public boolean supports(String providerName) {
        if (providerName == null) return false;
        String lower = providerName.toLowerCase();
        return lower.equals("google") || lower.equals("google_ads") || lower.equals("googleads");
    }

    @Override
    public boolean verifySignature(String payload, String signatureHeader, String secret) {
        if (secret == null || secret.isBlank()) {
            log.warn("Google webhook secret is empty; rejecting verification");
            return false;
        }

        if (signatureHeader == null || signatureHeader.isBlank()) {
            return false;
        }

        // Google Lead Form extensions pass google_key or Bearer secret token
        String token = signatureHeader;
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        return secret.equals(token);
    }

    @Override
    public NormalizedLeadInput parseAndNormalize(String payload, Map<String, String> headers) {
        try {
            JsonNode root = objectMapper.readTree(payload);

            String externalLeadId = root.has("lead_id") ? root.get("lead_id").asText()
                    : (root.has("id") ? root.get("id").asText() : "GOOGLE_" + System.currentTimeMillis());
            String externalEventId = root.has("gclid") ? root.get("gclid").asText()
                    : "EVT_GOOG_" + System.currentTimeMillis();

            String campaignId = root.has("campaign_id") ? root.get("campaign_id").asText() : null;
            String adGroupId = root.has("ad_group_id") ? root.get("ad_group_id").asText() : null;

            String email = null;
            String phone = null;
            String firstName = null;
            String lastName = null;
            String company = null;
            String message = null;

            if (root.has("user_column_data") && root.get("user_column_data").isArray()) {
                for (JsonNode col : root.get("user_column_data")) {
                    String columnId = col.has("column_id") ? col.get("column_id").asText() : "";
                    String val = col.has("string_value") ? col.get("string_value").asText() : "";

                    switch (columnId.toUpperCase()) {
                        case "EMAIL":
                        case "USER_EMAIL":
                            email = val;
                            break;
                        case "PHONE_NUMBER":
                        case "USER_PHONE_NUMBER":
                            phone = val;
                            break;
                        case "FIRST_NAME":
                            firstName = val;
                            break;
                        case "LAST_NAME":
                            lastName = val;
                            break;
                        case "FULL_NAME":
                            if (firstName == null) {
                                String[] parts = val.trim().split("\\s+", 2);
                                firstName = parts[0];
                                if (parts.length > 1) lastName = parts[1];
                            }
                            break;
                        case "COMPANY_NAME":
                            company = val;
                            break;
                        case "NOTE":
                        case "MESSAGE":
                            message = val;
                            break;
                    }
                }
            } else {
                if (root.has("email")) email = root.get("email").asText();
                if (root.has("phone")) phone = root.get("phone").asText();
                if (root.has("first_name")) firstName = root.get("first_name").asText();
                if (root.has("last_name")) lastName = root.get("last_name").asText();
                if (root.has("company")) company = root.get("company").asText();
                if (root.has("message")) message = root.get("message").asText();
            }

            return NormalizedLeadInput.builder()
                    .source(LeadSource.GOOGLE_ADS)
                    .sourceName("GOOGLE_ADS")
                    .externalLeadId(externalLeadId)
                    .externalEventId(externalEventId)
                    .firstName(firstName)
                    .lastName(lastName)
                    .email(email)
                    .phone(phone)
                    .company(company)
                    .campaignId(campaignId)
                    .adSetId(adGroupId)
                    .message(message)
                    .utmSource("google")
                    .utmMedium("cpc")
                    .utmCampaign(campaignId)
                    .capturedAt(LocalDateTime.now())
                    .rawProviderReference("GOOGLE_LEAD_FORM")
                    .build();
        } catch (Exception e) {
            log.error("Failed to parse Google lead payload: {}", e.getMessage());
            throw new IllegalArgumentException("Malformed Google webhook payload: " + e.getMessage());
        }
    }
}
