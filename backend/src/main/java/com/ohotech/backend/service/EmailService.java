package com.ohotech.backend.service;

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

    @Value("${spring.mail.host:}")
    private String mailHost;

    @Value("${spring.mail.username:${MAIL_USERNAME:}}")
    private String mailUsername;

    @Value("${app.mail.from-email:${SPRING_MAIL_FROM_ADDRESS:}}")
    private String configuredFromEmail;

    @Value("${app.mail.from-name:${MAIL_FROM_NAME:OHO TECHN Notification}}")
    private String fromName;

    private String getFromEmail() {
        if (configuredFromEmail != null && !configuredFromEmail.isBlank()) {
            return configuredFromEmail.trim();
        }
        if (mailUsername != null && mailUsername.contains("@")) {
            return mailUsername.trim();
        }
        return "onboarding@resend.dev";
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

        boolean isRealSmtpConfigured = mailSender != null && mailHost != null && !mailHost.trim().isEmpty() && !mailHost.equalsIgnoreCase("localhost");

        if (!isRealSmtpConfigured) {
            logger.info("[DEV EMAIL NOTIFICATION LOG] To: {} | Subject: {} | Content Length: {} chars", to, subject, htmlContent != null ? htmlContent.length() : 0);
            return;
        }

        String senderAddress = getFromEmail();

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(senderAddress, fromName);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            logger.info("Async HTML email successfully delivered to {}", to);
        } catch (Exception e) {
            logger.error("Async email delivery to {} failed (non-blocking): {}", to, e.getMessage());
        }
    }
}
