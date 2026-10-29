package com.ohotech.backend.service.otp;

import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

@Service
@Slf4j
public class WhatsAppBusinessOtpService implements OtpDeliveryService {

    @Value("${app.whatsapp.enabled:false}")
    private boolean enabled;

    @Value("${app.whatsapp.api-url:https://graph.facebook.com/v19.0}")
    private String apiUrl;

    @Value("${app.whatsapp.phone-number-id:}")
    private String phoneNumberId;

    @Value("${app.whatsapp.access-token:}")
    private String accessToken;

    @Value("${app.whatsapp.template-name:oho_checkout_otp}")
    private String templateName;

    private volatile HttpClient httpClient;

    private HttpClient getHttpClient() {
        if (httpClient == null) {
            synchronized (this) {
                if (httpClient == null) {
                    httpClient = HttpClient.newBuilder()
                            .connectTimeout(Duration.ofSeconds(5))
                            .build();
                }
            }
        }
        return httpClient;
    }

    @Override
    public String getProviderName() {
        return "WHATSAPP_BUSINESS_CLOUD";
    }

    @Override
    public boolean isEnabled() {
        return enabled && phoneNumberId != null && !phoneNumberId.isBlank()
                && accessToken != null && !accessToken.isBlank();
    }

    @Override
    public boolean deliverOtp(String phoneNumber, String otpCode, String purpose) {
        if (!isEnabled()) {
            log.info("WhatsApp Cloud API is unconfigured/disabled. Skipping delivery for target phone.");
            return false;
        }

        try {
            String cleanPhone = phoneNumber.replaceAll("[^0-9]", "");
            URI uri = URI.create(apiUrl.replaceAll("/+$", "") + "/" + phoneNumberId + "/messages");

            JSONObject payload = new JSONObject();
            payload.put("messaging_product", "whatsapp");
            payload.put("to", cleanPhone);
            payload.put("type", "template");

            JSONObject template = new JSONObject();
            template.put("name", templateName);
            template.put("language", new JSONObject().put("code", "en"));

            JSONArray components = new JSONArray();
            JSONObject bodyComp = new JSONObject();
            bodyComp.put("type", "body");
            JSONArray params = new JSONArray();
            params.put(new JSONObject().put("type", "text").put("text", otpCode));
            bodyComp.put("parameters", params);
            components.put(bodyComp);

            template.put("components", components);
            payload.put("template", template);

            HttpRequest request = HttpRequest.newBuilder(uri)
                    .timeout(Duration.ofSeconds(10))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + accessToken)
                    .POST(HttpRequest.BodyPublishers.ofString(payload.toString()))
                    .build();

            HttpResponse<String> response = getHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                log.info("WhatsApp OTP template successfully dispatched to recipient [phone ends in {}]",
                        cleanPhone.length() >= 4 ? cleanPhone.substring(cleanPhone.length() - 4) : "xxxx");
                return true;
            } else {
                log.error("WhatsApp Cloud API returned non-2xx status: {} with body: {}",
                        response.statusCode(), response.body());
                return false;
            }
        } catch (Exception e) {
            log.error("Failed to send WhatsApp OTP: {}", e.getMessage(), e);
            return false;
        }
    }
}
