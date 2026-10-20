package com.ohotech.backend.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class EmailTemplateServiceTest {

    private final EmailTemplateService emailTemplateService = new EmailTemplateService();

    @Test
    void welcomeEmailUsesPremiumBrandingAndProductionLinks() {
        String html = emailTemplateService.buildWelcomeEmail("Himansu");

        assertTrue(html.contains("Welcome to OHO TECH!"));
        assertTrue(html.contains("Hi <strong style=\"color:#ffffff;\">Himansu</strong>"));
        assertTrue(html.contains("#11112b"));
        assertTrue(html.contains("#8b5cf6"));
        assertTrue(html.contains("name=\"viewport\""));
        assertTrue(html.contains("@media only screen and (max-width: 600px)"));
        assertTrue(html.contains("https://ohotechn.com/products"));
        assertFalse(html.contains("localhost:3000"));
    }

    @Test
    void welcomeEmailEscapesUntrustedNameHtml() {
        String html = emailTemplateService.buildWelcomeEmail("<script>alert('x')</script>");

        assertFalse(html.contains("<script>alert('x')</script>"));
        assertTrue(html.contains("&lt;script&gt;"));
        assertTrue(html.contains("&#39;x&#39;"));
    }

    @Test
    void welcomeEmailHandlesMissingName() {
        String html = emailTemplateService.buildWelcomeEmail(null);

        assertTrue(html.contains("Hi <strong style=\"color:#ffffff;\">there</strong>"));
    }
}
