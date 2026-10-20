package com.ohotech.backend.service;

import com.ohotech.backend.entity.OtpPurpose;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class EmailTemplateService {

    private static final String BRAND_COLOR = "#11112b";
    private static final String ACCENT_COLOR = "#8b5cf6";

    @Value("${app.frontend.url:https://ohotechn.com}")
    private String frontendUrl;

    private String safeName(String value) {
        if (value == null || value.isBlank()) return "there";
        return value.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
                .replace("\"", "&quot;").replace("'", "&#39;");
    }

    private String siteUrl(String path) {
        String base = frontendUrl == null || frontendUrl.isBlank() ? "https://ohotechn.com" : frontendUrl.trim();
        while (base.endsWith("/")) base = base.substring(0, base.length() - 1);
        return base + path;
    }

    private String wrapTemplate(String title, String contentHtml) {
        return """
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset="utf-8">
                  <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0b0b18; margin: 0; padding: 20px 10px; color: #f3f4f6; }
                    .container { max-width: 600px; margin: 0 auto; background: #11112b; border-radius: 18px; border: 1px solid #292947; overflow: hidden; }
                    .header { background: #171733; color: #ffffff; padding: 30px 20px; text-align: center; border-bottom: 1px solid #2b2b4a; }
                    .header h1 { margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -0.5px; }
                    .header p { margin: 5px 0 0 0; font-size: 11px; opacity: 0.8; font-family: monospace; text-transform: uppercase; }
                    .content { padding: 28px 24px; font-size: 14px; line-height: 1.7; color: #e5e7eb; }
                    .button { display: inline-block; padding: 14px 28px; background-color: %s; color: #ffffff !important; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 20px 0; }
                    .box { background: #191a36; border: 1px solid #343452; border-radius: 16px; padding: 20px; margin: 15px 0; }
                    .footer { background: #0d0d20; padding: 20px; text-align: center; font-size: 11px; color: #9a9ab6; border-top: 1px solid #292947; font-family: monospace; }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="header">
                      <h1>OHO TECH</h1>
                      <p>BUILD. INNOVATE. SCALE.</p>
                    </div>
                    <div class="content">
                      <h2 style="margin-top: 0; font-size: 20px; font-weight: 800;">%s</h2>
                      %s
                    </div>
                    <div class="footer">
                      &copy; %d OHO TECH. All Rights Reserved.<br>
                      Need assistance? Visit ohotechn.com
                    </div>
                  </div>
                </body>
                </html>
                """.formatted(ACCENT_COLOR, title, contentHtml, LocalDateTime.now().getYear());
    }

    public String buildOtpEmail(String userName, String otpCode, OtpPurpose purpose) {
        String title = switch (purpose) {
            case EMAIL_VERIFICATION -> "Email Verification Code";
            case LOGIN -> "Login Verification Code";
            case PASSWORD_RESET -> "Password Reset Verification Code";
        };
        String actionText = switch (purpose) {
            case EMAIL_VERIFICATION -> "verify your email address";
            case LOGIN -> "log in to your account";
            case PASSWORD_RESET -> "reset your account password";
        };
        String content = """
                <p>Hello <strong>%s</strong>,</p>
                <p>Use the verification code below to %s. This code is single-use and will expire in 10 minutes.</p>
                <div class="box" style="text-align: center;">
                  <div style="font-size: 11px; font-family: monospace; color: #64748b; text-transform: uppercase;">VERIFICATION OTP</div>
                  <div style="font-family: monospace; font-size: 32px; font-weight: 900; color: #0284c7; margin: 10px 0; letter-spacing: 6px;">%s</div>
                  <div style="font-size: 12px; color: #64748b;">Expires in 10 minutes</div>
                </div>
                <p style="font-size: 12px; color: #64748b;">If you did not request this verification code, please ignore this email or secure your account.</p>
                """.formatted(userName != null && !userName.isBlank() ? userName : "User", actionText, otpCode);
        return wrapTemplate(title, content);
    }

    public String buildWelcomeEmail(String userName) {
        String title = "Welcome to OHO TECH!";
        String name = safeName(userName);
        String productsUrl = siteUrl("/products");
        String content = """
                <p style="margin:0 0 18px;color:#e5e7eb;font-size:16px;line-height:1.65;">Hi <strong style="color:#ffffff;">%s</strong>,</p>
                <p style="margin:0 0 22px;color:#c7c8df;font-size:15px;line-height:1.75;">Welcome to OHO TECH. Your account is ready to explore software, digital products, and practical technology solutions built to help you work smarter.</p>
                <table role="presentation" width="100%%" cellpadding="0" cellspacing="0" style="border-collapse:separate;border-spacing:0;background:#191a36;border:1px solid #343452;border-radius:14px;margin:22px 0;">
                  <tr><td style="padding:20px 22px;">
                    <p style="margin:0 0 14px;color:#a78bfa;font-size:12px;font-weight:800;letter-spacing:1.6px;">YOUR NEXT STEPS</p>
                    <p style="margin:0 0 13px;color:#f3f4f6;font-size:14px;line-height:1.6;"><strong style="color:#c4b5fd;">01&nbsp; Explore the catalog</strong><br><span style="color:#b8bad3;">Discover products, plans, and available trials.</span></p>
                    <p style="margin:0 0 13px;color:#f3f4f6;font-size:14px;line-height:1.6;"><strong style="color:#c4b5fd;">02&nbsp; Manage your account</strong><br><span style="color:#b8bad3;">Keep your purchases and services in one place.</span></p>
                    <p style="margin:0;color:#f3f4f6;font-size:14px;line-height:1.6;"><strong style="color:#c4b5fd;">03&nbsp; Get support</strong><br><span style="color:#b8bad3;">Our team can help if you need a hand.</span></p>
                  </td></tr>
                </table>
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:26px auto 12px;">
                  <tr><td align="center" bgcolor="#8b5cf6" style="border-radius:10px;background-color:#8b5cf6;">
                    <a href="%s" style="display:inline-block;padding:15px 28px;border-radius:10px;color:#ffffff;text-decoration:none;font-size:14px;font-weight:800;letter-spacing:.2px;">Explore OHO TECH &#8594;</a>
                  </td></tr>
                </table>
                <p style="margin:18px 0 0;text-align:center;color:#a5a6c3;font-size:12px;line-height:1.6;">Need help? Visit <a href="%s" style="color:#c4b5fd;text-decoration:underline;">ohotechn.com</a> and contact our support team.</p>
                """.formatted(name, productsUrl, siteUrl("/"));
        return wrapTemplate(title, content);
    }

    public String buildPasswordResetEmail(String userName, String resetToken) {
        String title = "Password Reset Request";
        String content = """
                <p>Hello <strong>%s</strong>,</p>
                <p>We received a request to reset your password. Click the button below to set a new password. This single-use link expires in 30 minutes.</p>
                <div class="box" style="font-family: monospace; word-break: break-all;">
                  Reset Token: <strong>%s</strong>
                </div>
                <p style="text-align: center;">
                  <a href="http://localhost:3000/reset-password?token=%s" class="button">Reset Password Now</a>
                </p>
                <p style="font-size: 12px; color: #64748b;">If you did not request this reset, please ignore this email.</p>
                """.formatted(userName, resetToken, resetToken);
        return wrapTemplate(title, content);
    }

    public String buildOrderSuccessEmail(String userName, Long orderId, String productName, String planName, BigDecimal totalAmount) {
        String title = "Order Confirmed #" + orderId;
        String content = """
                <p>Hello <strong>%s</strong>,</p>
                <p>Your order <strong>#%d</strong> has been successfully confirmed and recorded.</p>
                <div class="box">
                  <table style="width: 100%%; font-size: 13px;">
                    <tr><td><strong>Order ID:</strong></td><td>#%d</td></tr>
                    <tr><td><strong>Product:</strong></td><td>%s</td></tr>
                    <tr><td><strong>Plan:</strong></td><td>%s</td></tr>
                    <tr><td><strong>Total Amount:</strong></td><td>₹%s</td></tr>
                    <tr><td><strong>Date:</strong></td><td>%s</td></tr>
                  </table>
                </div>
                <p style="text-align: center;">
                  <a href="http://localhost:3000/orders" class="button">View Order Details</a>
                </p>
                """.formatted(userName, orderId, orderId, productName, planName, totalAmount, LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy, HH:mm")));
        return wrapTemplate(title, content);
    }

    public String buildPaymentSuccessEmail(String userName, String razorpayPaymentId, Long orderId, BigDecimal amount) {
        String title = "Payment Receipt - Successful";
        String content = """
                <p>Hello <strong>%s</strong>,</p>
                <p>We have successfully verified your payment for Order <strong>#%d</strong>.</p>
                <div class="box">
                  <table style="width: 100%%; font-size: 13px;">
                    <tr><td><strong>Payment ID:</strong></td><td style="font-family: monospace;">%s</td></tr>
                    <tr><td><strong>Order ID:</strong></td><td>#%d</td></tr>
                    <tr><td><strong>Amount Paid:</strong></td><td>₹%s</td></tr>
                    <tr><td><strong>Status:</strong></td><td style="color: #059669; font-weight: bold;">VERIFIED / SUCCESSFUL</td></tr>
                  </table>
                </div>
                <p style="text-align: center;">
                  <a href="http://localhost:3000/orders" class="button">Download Tax Invoice PDF</a>
                </p>
                """.formatted(userName, orderId, razorpayPaymentId, orderId, amount);
        return wrapTemplate(title, content);
    }

    public String buildLicenseGeneratedEmail(String userName, String productName, String planName, String licenseKey, LocalDateTime expiryDate) {
        String title = "License Key Provisioned";
        String expStr = expiryDate != null ? expiryDate.format(DateTimeFormatter.ofPattern("dd MMM yyyy")) : "Perpetual / Lifetime Access";
        String content = """
                <p>Hello <strong>%s</strong>,</p>
                <p>Your license key for <strong>%s</strong> (%s) has been generated and activated.</p>
                <div class="box" style="text-align: center;">
                  <div style="font-size: 11px; font-family: monospace; color: #64748b;">CRYPTOGRAPHIC LICENSE KEY</div>
                  <div style="font-family: monospace; font-size: 18px; font-weight: 900; color: #0284c7; margin: 10px 0; letter-spacing: 2px;">%s</div>
                  <div style="font-size: 12px; color: #64748b;">Expires: %s</div>
                </div>
                <p style="text-align: center;">
                  <a href="http://localhost:3000/licenses" class="button">Manage Licenses & Devices</a>
                </p>
                """.formatted(userName, productName, planName, licenseKey, expStr);
        return wrapTemplate(title, content);
    }

    public String buildFreeTrialStartedEmail(String userName, String productName, LocalDateTime trialEnd) {
        String title = "14-Day Free Trial Activated";
        String content = """
                <p>Hello <strong>%s</strong>,</p>
                <p>Your 14-day free trial for <strong>%s</strong> is now active!</p>
                <div class="box">
                  <table style="width: 100%%; font-size: 13px;">
                    <tr><td><strong>Software:</strong></td><td>%s</td></tr>
                    <tr><td><strong>Trial Period:</strong></td><td>14 Days</td></tr>
                    <tr><td><strong>Trial Expiry Date:</strong></td><td>%s</td></tr>
                  </table>
                </div>
                <p style="text-align: center;">
                  <a href="http://localhost:3000/my-products" class="button">Access Software Downloads</a>
                </p>
                """.formatted(userName, productName, productName, trialEnd.format(DateTimeFormatter.ofPattern("dd MMM yyyy, HH:mm")));
        return wrapTemplate(title, content);
    }

    public String buildSubscriptionReminderEmail(String userName, String productName, int daysRemaining, LocalDateTime expiryDate) {
        String title = "Subscription Renewal Reminder (" + daysRemaining + " Days Left)";
        String content = """
                <p>Hello <strong>%s</strong>,</p>
                <p>Your subscription for <strong>%s</strong> will expire in <strong>%d days</strong> on %s.</p>
                <p>Please renew your subscription to maintain uninterrupted cloud software access and device activations.</p>
                <p style="text-align: center;">
                  <a href="http://localhost:3000/subscriptions" class="button">Renew Subscription Now</a>
                </p>
                """.formatted(userName, productName, daysRemaining, expiryDate.format(DateTimeFormatter.ofPattern("dd MMM yyyy")));
        return wrapTemplate(title, content);
    }

    public String buildSubscriptionExpiredEmail(String userName, String productName) {
        String title = "Subscription Expired";
        String content = """
                <p>Hello <strong>%s</strong>,</p>
                <p>Your subscription for <strong>%s</strong> has expired. Device activations and binary download access have been temporarily paused.</p>
                <p style="text-align: center;">
                  <a href="http://localhost:3000/subscriptions" class="button">Reactivate Subscription</a>
                </p>
                """.formatted(userName, productName);
        return wrapTemplate(title, content);
    }

    public String buildSubscriptionRenewedEmail(String userName, String productName, LocalDateTime newExpiry) {
        String title = "Subscription Renewed Successfully";
        String content = """
                <p>Hello <strong>%s</strong>,</p>
                <p>Thank you for renewing your subscription for <strong>%s</strong>.</p>
                <div class="box">
                  Your new subscription expiry date is: <strong>%s</strong>
                </div>
                <p style="text-align: center;">
                  <a href="http://localhost:3000/subscriptions" class="button">View Subscription Status</a>
                </p>
                """.formatted(userName, productName, newExpiry.format(DateTimeFormatter.ofPattern("dd MMM yyyy")));
        return wrapTemplate(title, content);
    }

    public String buildLicenseStatusChangedEmail(String userName, String licenseKey, String newStatus) {
        String title = "License Status Changed (" + newStatus + ")";
        String content = """
                <p>Hello <strong>%s</strong>,</p>
                <p>An administrator has updated the status of your license key <code style="font-family: monospace;">%s</code> to <strong>%s</strong>.</p>
                <p style="text-align: center;">
                  <a href="http://localhost:3000/licenses" class="button">Check License Portal</a>
                </p>
                """.formatted(userName, licenseKey, newStatus);
        return wrapTemplate(title, content);
    }
}
