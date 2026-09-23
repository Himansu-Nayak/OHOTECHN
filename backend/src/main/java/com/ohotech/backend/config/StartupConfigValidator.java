package com.ohotech.backend.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class StartupConfigValidator implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(StartupConfigValidator.class);

    @Value("${spring.profiles.active:default}")
    private String activeProfile;

    @Value("${app.jwt.secret:}")
    private String jwtSecret;

    @Value("${app.razorpay.key-id:}")
    private String razorpayKeyId;

    @Value("${spring.mail.host:}")
    private String mailHost;

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    @Value("${gemini.api.model:gemini-1.5-flash}")
    private String geminiModel;

    @Override
    public void run(String... args) {
        logger.info("=== OHO TECHN Production Configuration Validation ===");
        logger.info("Active Profile: {}", activeProfile);

        boolean isProduction = "prod".equalsIgnoreCase(activeProfile) || "production".equalsIgnoreCase(activeProfile);
        boolean isDefaultOrInsecureJwt = jwtSecret == null 
                || jwtSecret.trim().isEmpty() 
                || jwtSecret.length() < 32 
                || jwtSecret.contains("defaultSecretKeyForDevelopmentPhase");

        if (isProduction && isDefaultOrInsecureJwt) {
            String errorMsg = "FATAL SECURITY CONFIGURATION ERROR: Running in production profile requires an explicit, secure app.jwt.secret of at least 32 characters! Set JWT_SECRET environment variable.";
            logger.error(errorMsg);
            throw new IllegalStateException(errorMsg);
        }

        if (isDefaultOrInsecureJwt) {
            logger.warn("SECURITY WARNING: app.jwt.secret is empty or less than 32 characters! Defaulting to development fallback key.");
        } else {
            logger.info("JWT Secret: OK (Sufficient secret strength)");
        }

        if (razorpayKeyId == null || razorpayKeyId.contains("PLACEHOLDER") || razorpayKeyId.isEmpty()) {
            logger.info("Razorpay Gateway: Running in DEV/SIMULATION mode.");
        } else {
            logger.info("Razorpay Gateway: Configured.");
        }

        if (mailHost == null || mailHost.trim().isEmpty()) {
            logger.info("SMTP Email Gateway: Unconfigured (Running in dev log mode).");
        } else {
            logger.info("SMTP Email Gateway: Configured at host {}", mailHost);
        }

        if (geminiApiKey == null || geminiApiKey.trim().isEmpty()) {
            logger.info("Google Gemini AI Platform: Unconfigured (Set GEMINI_API_KEY environment variable to enable live AI capabilities). Active Model: {}", geminiModel);
        } else {
            logger.info("Google Gemini AI Platform: Configured & Ready. Active Model: {}", geminiModel);
        }

        logger.info("=== OHO TECHN Platform Readiness Check Complete ===");
    }
}
