package com.ohotech.backend.service.ai;

import com.ohotech.backend.dto.ai.AiClassificationResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiClassifierService {

    private final GeminiService geminiService;

    public AiClassificationResponse classifyQuery(String query) {
        String prompt = String.format("""
            Classify the following customer query for OHO TECH enterprise platform:
            Query: "%s"

            Categories available:
            - PRODUCT_SEARCH: Looking for new software or asking for prices/features
            - PRODUCT_INFORMATION: Asking how a specific software works
            - ORDER_STATUS: Inquiring about previous orders, tracking, or delivery
            - PAYMENT: Inquiries regarding invoices, payment methods, or refunds
            - SUBSCRIPTION: Inquiries regarding recurring plans, license keys, or renewals
            - ACCOUNT: Login, password reset, or profile settings
            - TECHNICAL_SUPPORT: Bug reports, API integration, or deployment errors
            - GENERAL_SUPPORT: Company contact, office location, partnership
            - OTHER: Unrelated or unclassified

            Return valid JSON matching:
            {
              "category": "PRODUCT_SEARCH | ORDER_STATUS | ...",
              "confidence": 0.95,
              "intent": "Short intent code",
              "suggestedAction": "Action code"
            }
            """, query);

        String systemInstruction = "You are an automated query intent classification engine. Always respond with pure, valid JSON.";
        return geminiService.generateStructured(prompt, systemInstruction, AiClassificationResponse.class);
    }
}
