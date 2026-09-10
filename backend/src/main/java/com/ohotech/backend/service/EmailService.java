package com.ohotech.backend.service;

import com.ohotech.backend.entity.OtpPurpose;
import com.ohotech.backend.exception.BadRequestException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.host:smtp.resend.com}")
    private String mailHost;

    @Value("${spring.mail.port:465}")
    private int mailPort;

    @Value("${spring.mail.username:${MAIL_USERNAME:resend}}")
    private String mailUsername;

    @Value("${spring.mail.password:${RESEND_API_KEY:}}")
    private String mailPassword;

    @Value("${app.mail.from-email:${MAIL_FROM:${SPRING_MAIL_FROM_ADDRESS:noreply@ohotechn.com}}}")
    private String configuredFromEmail;

    @Value("${app.mail.from-name:${MAIL_FROM_NAME:OHO TECHN}}")
    private String fromName;

    @Value("${spring.profiles.active:dev}")
    private String activeProfile;

    @Value("${app.mail.strict-fail:false}")
    private boolean strictFail;

    public String getFromEmail() {
        if (configuredFromEmail != null && !configuredFromEmail.isBlank()) {
            return configuredFromEmail.trim();
        }
        if (mailUsername != null && mailUsername.contains("@")) {
            return mailUsername.trim();
        }
        return "noreply@ohotechn.com";
    }

    public static String maskEmail(String email) {
        if (email == null || !email.contains("@")) {
            return "******";
        }
        String[] parts = email.split("@", 2);
        String name = parts[0];
        String domain = parts[1];
        if (name.length() <= 2) {
            return name.charAt(0) + "***@" + domain;
        }
        return name.charAt(0) + "***" + name.charAt(name.length() - 1) + "@" + domain;
    }

    public boolean isRealSmtpConfigured() {
        return mailSender != null
                && mailHost != null
                && !mailHost.trim().isEmpty()
                && !mailHost.equalsIgnoreCase("localhost")
                && mailPassword != null
                && !mailPassword.trim().isEmpty();
    }

    /**
     * Synchronous OTP email delivery with structured safe diagnostic logging.
     * In production with strictFail=true, throws an exception if delivery fails.
     * In dev mode, logs the failure and allows registration/OTP verification to continue.
     */
    public void sendOtpEmail(String to, String subject, String htmlContent, OtpPurpose purpose) {
        if (to == null || to.trim().isEmpty()) {
            logger.warn("Skipping OTP email: recipient address is empty.");
            throw new BadRequestException("Recipient email address is required.");
        }

        String masked = maskEmail(to);
        boolean userPresent = mailUsername != null && !mailUsername.isBlank();
        boolean passPresent = mailPassword != null && !mailPassword.isBlank();
        String fromEmail = getFromEmail();

        logger.info("[OTP EMAIL ATTEMPT] MAIL_HOST={} MAIL_PORT={} MAIL_USERNAME_PRESENT={} MAIL_PASSWORD_PRESENT={} MAIL_FROM={} RECIPIENT={} PURPOSE={}",
                mailHost, mailPort, userPresent, passPresent, fromEmail, masked, purpose);

        if (!isRealSmtpConfigured()) {
            logger.info("[DEV EMAIL NOTIFICATION] SMTP credentials unconfigured or running in dev mode. MAIL_HOST={} RECIPIENT={} PURPOSE={}",
                    mailHost, masked, purpose);
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail, fromName);
            helper.setTo(to.trim());
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            logger.info("[OTP EMAIL DISPATCH ACCEPTED] Resend SMTP accepted message for processing. RECIPIENT={} PURPOSE={}", masked, purpose);
        } catch (Exception e) {
            logger.error("[OTP EMAIL DISPATCH FAILED] MAIL_HOST={} MAIL_PORT={} RECIPIENT={} PURPOSE={} EXCEPTION={} MESSAGE={}",
                    mailHost, mailPort, masked, purpose, e.getClass().getName(), e.getMessage());
            if (strictFail || "prod".equalsIgnoreCase(activeProfile)) {
                throw new BadRequestException("Failed to deliver verification email. Please check your email address or try again later.");
            }
            logger.warn("[DEV MODE OTP NOTICE] Email dispatch to {} failed (e.g. unverified domain in dev mode). OTP was safely persisted to database.", masked);
        }
    }

    @Async
    public void sendEmail(String to, String subject, String body) {
        sendHtmlEmail(to, subject, body);
    }

    @Async
    public void sendHtmlEmail(String to, String subject, String htmlContent) {
        if (to == null || to.trim().isEmpty()) {
            logger.warn("Skipping email send: recipient email address is empty.");
            return;
        }

        String masked = maskEmail(to);

        if (!isRealSmtpConfigured()) {
            logger.info("[DEV EMAIL NOTIFICATION LOG] To: {} | Subject: {} | Content Length: {} chars",
                    masked, subject, htmlContent != null ? htmlContent.length() : 0);
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(getFromEmail(), fromName);
            helper.setTo(to.trim());
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            logger.info("Async HTML email successfully delivered to {}", masked);
        } catch (Exception e) {
            logger.error("Async email delivery to {} failed (non-blocking): {}", masked, e.getMessage());
        }
    }
}
