package com.ohotech.backend.config;

import com.ohotech.backend.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class StartupConfigValidator implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(StartupConfigValidator.class);

    private final EmailService emailService;

    @Value("${app.jwt.secret:}")
    private String jwtSecret;

    @Value("${app.razorpay.key-id:}")
    private String razorpayKeyId;

    @Value("${spring.mail.host:}")
    private String mailHost;

    @Value("${spring.mail.port:465}")
    private int mailPort;

    @Value("${spring.mail.username:${MAIL_USERNAME:}}")
    private String mailUsername;

    @Value("${spring.mail.password:${RESEND_API_KEY:}}")
    private String mailPassword;

    public StartupConfigValidator(EmailService emailService) {
        this.emailService = emailService;
    }

    @Override
    public void run(String... args) {
        logger.info("=== OHO TECHN Production Configuration Validation ===");

        // JWT Validation
        if (jwtSecret == null || jwtSecret.trim().isEmpty() || jwtSecret.length() < 32) {
            logger.warn("SECURITY WARNING: app.jwt.secret is empty or less than 32 characters! Defaulting to development fallback key.");
        } else {
            logger.info("JWT Secret: OK (Sufficient secret strength)");
        }

        // Razorpay Validation
        if (razorpayKeyId == null || razorpayKeyId.contains("PLACEHOLDER") || razorpayKeyId.isEmpty()) {
            logger.info("Razorpay Gateway: Running in DEV/SIMULATION mode.");
        } else {
            logger.info("Razorpay Gateway: Configured.");
        }

        // SMTP Validation (Safe masked diagnostics - STEP 7)
        boolean hasHost = mailHost != null && !mailHost.trim().isEmpty();
        boolean hasPort = mailPort > 0;
        boolean hasUsername = mailUsername != null && !mailUsername.trim().isEmpty();
        boolean hasPassword = mailPassword != null && !mailPassword.trim().isEmpty();
        boolean hasFrom = emailService.getFromEmail() != null && !emailService.getFromEmail().isBlank();

        logger.info("MAIL_HOST configured: {}", hasHost);
        logger.info("MAIL_PORT configured: {}", hasPort);
        logger.info("MAIL_USERNAME configured: {}", hasUsername);
        logger.info("MAIL_PASSWORD configured: {}", hasPassword);
        logger.info("MAIL_FROM configured: {}", hasFrom);
        logger.info("MAIL_FROM={}", EmailService.maskEmail(emailService.getFromEmail()));

        if (hasHost && hasPassword) {
            logger.info("SMTP Email Gateway: Configured for live dispatch via {}", mailHost);
        } else {
            logger.info("SMTP Email Gateway: Running in DEV safe log mode (no live outbound connection until password is provided).");
        }

        logger.info("=== OHO TECHN Platform Readiness Check Complete ===");
    }
}
