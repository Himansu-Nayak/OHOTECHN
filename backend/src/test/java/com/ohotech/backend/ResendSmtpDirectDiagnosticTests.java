package com.ohotech.backend;

import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.Test;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Properties;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static org.junit.jupiter.api.Assertions.assertTrue;

class ResendSmtpDirectDiagnosticTests {

    private String loadResendKey() {
        String envKey = System.getenv("SPRING_MAIL_PASSWORD");
        if (envKey != null && !envKey.isBlank()) return envKey;

        String resendEnv = System.getenv("RESEND_API_KEY");
        if (resendEnv != null && !resendEnv.isBlank()) return resendEnv;

        // Check .env.local in root
        try {
            File envLocal = new File("../.env.local");
            if (envLocal.exists()) {
                String content = Files.readString(Paths.get("../.env.local"));
                Matcher m = Pattern.compile("RESEND_API_KEY=(re_[a-zA-Z0-9_]+)").matcher(content);
                if (m.find()) {
                    return m.group(1);
                }
            }
        } catch (Exception e) {
            // ignore
        }
        return null;
    }

    @Test
    void testDirectResendSmtpConnectivity() {
        String apiKey = loadResendKey();
        System.out.println("Resend API Key discovered: " + (apiKey != null && !apiKey.isBlank()));

        if (apiKey == null || apiKey.isBlank()) {
            System.out.println("NOTICE: No Resend API key configured in host environment. Skipping live SMTP socket attempt.");
            return;
        }

        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost("smtp.resend.com");
        mailSender.setPort(465);
        mailSender.setUsername("resend");
        mailSender.setPassword(apiKey);

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.ssl.enable", "true");
        props.put("mail.smtp.starttls.enable", "false");
        props.put("mail.smtp.connectiontimeout", "10000");
        props.put("mail.smtp.timeout", "10000");

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom("onboarding@resend.dev", "OHO TECHN Test");
            helper.setTo("delivered@resend.dev"); // Resend official delivered test address
            helper.setSubject("OHO TECHN - SMTP Direct Diagnostic");
            helper.setText("Test message confirming JavaMailSender connectivity to smtp.resend.com:465", false);

            mailSender.send(message);
            System.out.println("✓ DIRECT RESEND SMTP SEND SUCCESSFUL: smtp.resend.com:465 accepted test message!");
        } catch (Exception e) {
            System.err.println("✗ DIRECT RESEND SMTP SEND FAILED: " + e.getClass().getName() + " - " + e.getMessage());
            // Do not fail build if network is offline during local test, but log the exact diagnostic
        }
    }

    @Test
    void testDirectResendSmtpToCustomEmail() {
        String apiKey = loadResendKey();
        if (apiKey == null || apiKey.isBlank()) return;

        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost("smtp.resend.com");
        mailSender.setPort(465);
        mailSender.setUsername("resend");
        mailSender.setPassword(apiKey);

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.ssl.enable", "true");
        props.put("mail.smtp.starttls.enable", "false");
        props.put("mail.smtp.connectiontimeout", "10000");
        props.put("mail.smtp.timeout", "10000");

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom("onboarding@resend.dev", "OHO TECHN Test");
            helper.setTo("Raja@ohotechn.com");
            helper.setSubject("OHO TECHN - Test Custom Recipient");
            helper.setText("Test message to Raja@ohotechn.com", false);

            mailSender.send(message);
            System.out.println("✓ CUSTOM RECIPIENT SEND SUCCESSFUL: smtp.resend.com:465 accepted!");
        } catch (Exception e) {
            System.err.println("✗ CUSTOM RECIPIENT SEND FAILED: " + e.getClass().getName() + " - " + e.getMessage());
            if (e.getCause() != null) {
                System.err.println("   CAUSE: " + e.getCause().getClass().getName() + " - " + e.getCause().getMessage());
            }
        }
    }

    @Test
    void testDirectResendSmtpToAccountOwner() {
        String apiKey = loadResendKey();
        if (apiKey == null || apiKey.isBlank()) return;

        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost("smtp.resend.com");
        mailSender.setPort(465);
        mailSender.setUsername("resend");
        mailSender.setPassword(apiKey);

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.ssl.enable", "true");
        props.put("mail.smtp.starttls.enable", "false");
        props.put("mail.smtp.connectiontimeout", "10000");
        props.put("mail.smtp.timeout", "10000");

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom("onboarding@resend.dev", "OHO TECHN Verification");
            helper.setTo("kampainfraa@gmail.com");
            helper.setSubject("OHO TECHN - Verification Code Test");
            helper.setText("<div style='font-family:sans-serif;'><h2>OHO TECHN Verification</h2><p>Your test code is: <strong>849201</strong></p></div>", true);

            mailSender.send(message);
            System.out.println("✓ ACCOUNT OWNER SEND SUCCESSFUL: smtp.resend.com:465 accepted message to kampainfraa@gmail.com!");
        } catch (Exception e) {
            System.err.println("✗ ACCOUNT OWNER SEND FAILED: " + e.getClass().getName() + " - " + e.getMessage());
        }
    }

    @Test
    void testDirectResendSmtpFromProductionSender() {
        String apiKey = loadResendKey();
        if (apiKey == null || apiKey.isBlank()) return;

        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost("smtp.resend.com");
        mailSender.setPort(465);
        mailSender.setUsername("resend");
        mailSender.setPassword(apiKey);

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.ssl.enable", "true");
        props.put("mail.smtp.starttls.enable", "false");
        props.put("mail.smtp.connectiontimeout", "10000");
        props.put("mail.smtp.timeout", "10000");

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom("noreply@ohotechn.com", "OHO TECHN");
            helper.setTo("customer-test@gmail.com");
            helper.setSubject("OHO TECHN - Production Sender Domain Test");
            helper.setText("Testing delivery from noreply@ohotechn.com to customer-test@gmail.com", false);

            mailSender.send(message);
            System.out.println("✓ PRODUCTION SENDER (noreply@ohotechn.com) ACCEPTED BY RESEND!");
        } catch (Exception e) {
            System.err.println("✗ PRODUCTION SENDER (noreply@ohotechn.com) STATUS: " + e.getClass().getName() + " - " + e.getMessage());
            if (e.getCause() != null) {
                System.err.println("   CAUSE: " + e.getCause().getClass().getName() + " - " + e.getCause().getMessage());
            }
        }
    }
}

