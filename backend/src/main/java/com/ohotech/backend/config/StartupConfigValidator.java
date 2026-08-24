package com.ohotech.backend.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class StartupConfigValidator implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(StartupConfigValidator.class);

    @Value("${app.jwt.secret:}")
    private String jwtSecret;

    @Value("${app.razorpay.key-id:}")
    private String razorpayKeyId;

    @Value("${spring.mail.host:}")
    private String mailHost;

    @Override
    public void run(String... args) {
        logger.info("=== OHO TECHN Production Configuration Validation ===");

        if (jwtSecret == null || jwtSecret.trim().isEmpty() || jwtSecret.length() < 32) {
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

        logger.info("=== OHO TECHN Platform Readiness Check Complete ===");
    }
}
