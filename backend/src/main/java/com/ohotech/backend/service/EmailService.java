package com.ohotech.backend.service;

import com.ohotech.backend.entity.EmailOutbox;
import com.ohotech.backend.repository.EmailOutboxRepository;
import com.ohotech.backend.repository.EmailSuppressionRepository;
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

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Autowired(required = false)
    private EmailOutboxRepository emailOutboxRepository;

    @Autowired(required = false)
    private EmailSuppressionRepository emailSuppressionRepository;

    @Value("${spring.mail.host:}")
    private String mailHost;

    @Value("${spring.mail.username:${MAIL_USERNAME:}}")
    private String mailUsername;

    @Value("${app.mail.from-email:${SPRING_MAIL_FROM_ADDRESS:}}")
    private String configuredFromEmail;

    @Value("${app.mail.from-name:${MAIL_FROM_NAME:OHO TECH Notification}}")
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

        String recipientEmail = to.trim().toLowerCase();

        // Check suppression list
        if (emailSuppressionRepository != null && emailSuppressionRepository.existsByEmailIgnoreCase(recipientEmail)) {
            logger.warn("Email delivery to {} skipped: address is in suppression list", recipientEmail);
            if (emailOutboxRepository != null) {
                EmailOutbox suppressedRecord = EmailOutbox.builder()
                        .recipient(recipientEmail)
                        .subject(subject != null ? subject : "No Subject")
                        .category("TRANSACTIONAL")
                        .status("SUPPRESSED")
                        .attempts(0)
                        .errorMessage("Recipient address is on the suppression list")
                        .contentPreview(htmlContent != null && htmlContent.length() > 500 ? htmlContent.substring(0, 500) : htmlContent)
                        .build();
                emailOutboxRepository.save(suppressedRecord);
            }
            return;
        }

        // Duplicate Send Protection: Prevent exact duplicate subject + recipient within 10 seconds
        if (emailOutboxRepository != null && emailOutboxRepository.existsByRecipientAndSubjectAndCreatedAtAfter(
                recipientEmail, subject != null ? subject : "No Subject", LocalDateTime.now().minusSeconds(10))) {
            logger.warn("Skipping duplicate email dispatch to {} with subject '{}' within debounce window", recipientEmail, subject);
            return;
        }

        EmailOutbox outboxRecord = null;
        if (emailOutboxRepository != null) {
            outboxRecord = EmailOutbox.builder()
                    .recipient(recipientEmail)
                    .subject(subject != null ? subject : "No Subject")
                    .category("TRANSACTIONAL")
                    .status("QUEUED")
                    .attempts(1)
                    .contentPreview(htmlContent != null && htmlContent.length() > 500 ? htmlContent.substring(0, 500) : htmlContent)
                    .build();
            outboxRecord = emailOutboxRepository.save(outboxRecord);
        }

        boolean isRealSmtpConfigured = mailSender != null && mailHost != null && !mailHost.trim().isEmpty() && !mailHost.equalsIgnoreCase("localhost");

        if (!isRealSmtpConfigured) {
            logger.info("[DEV EMAIL NOTIFICATION LOG] To: {} | Subject: {} | Content Length: {} chars", to, subject, htmlContent != null ? htmlContent.length() : 0);
            if (outboxRecord != null && emailOutboxRepository != null) {
                outboxRecord.setStatus("SENT");
                outboxRecord.setSentAt(LocalDateTime.now());
                outboxRecord.setProviderMessageId("DEV-LOCAL-" + System.currentTimeMillis());
                emailOutboxRepository.save(outboxRecord);
            }
            return;
        }

        String senderAddress = getFromEmail();

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(senderAddress, fromName);
            helper.setTo(to);
            helper.setSubject(subject);
            String plainText = htmlContent == null ? "" : htmlContent
                    .replaceAll("(?is)<(style|script)\\b[^>]*>.*?</\\1>", " ")
                    .replaceAll("(?i)<br\\s*/?>", "\n")
                    .replaceAll("(?i)</(p|div|li|tr|h[1-6])>", "\n")
                    .replaceAll("<[^>]*>", " ")
                    .replace("&nbsp;", " ")
                    .replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">")
                    .replaceAll("[ \\t]+", " ").replaceAll("\\n{3,}", "\n\n").trim();
            helper.setText(plainText, htmlContent);

            mailSender.send(message);
            logger.info("Async HTML email successfully delivered to {}", to);

            if (outboxRecord != null && emailOutboxRepository != null) {
                outboxRecord.setStatus("SENT");
                outboxRecord.setSentAt(LocalDateTime.now());
                outboxRecord.setProviderMessageId("SMTP-" + System.currentTimeMillis());
                emailOutboxRepository.save(outboxRecord);
            }
        } catch (Exception e) {
            logger.error("Async email delivery to {} failed (non-blocking): {}", to, e.getMessage());
            if (outboxRecord != null && emailOutboxRepository != null) {
                outboxRecord.setStatus("FAILED");
                outboxRecord.setErrorMessage(e.getMessage());
                outboxRecord.setNextRetryAt(LocalDateTime.now().plusMinutes(15));
                emailOutboxRepository.save(outboxRecord);
            }
        }
    }
}
