package com.ohotech.backend.service;

import com.ohotech.backend.entity.OtpPurpose;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class EmailTemplateService {

    private static final String BRAND_COLOR = "#0d0d0e";
    private static final String ACCENT_COLOR = "#0284c7";

    private String wrapTemplate(String title, String contentHtml) {
        return """
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset="utf-8">
                  <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f7f7f5; margin: 0; padding: 20px; color: #0d0d0e; }
                    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 24px; border: 2px solid #e2e8f0; overflow: hidden; }
                    .header { background: %s; color: #ffffff; padding: 30px 20px; text-align: center; }
                    .header h1 { margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -0.5px; }
                    .header p { margin: 5px 0 0 0; font-size: 11px; opacity: 0.8; font-family: monospace; text-transform: uppercase; }
                    .content { padding: 30px; font-size: 14px; line-height: 1.6; }
                    .button { display: inline-block; padding: 14px 28px; background-color: %s; color: #ffffff !important; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 20px 0; }
                    .box { background: #fafafa; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; margin: 15px 0; }
                    .footer { background: #f1f5f9; padding: 20px; text-align: center; font-size: 11px; color: #64748b; font-family: monospace; }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="header">
                      <h1>OHO TECHN</h1>
                      <p>Turnkey Enterprise Cloud & Licensing Systems</p>
                    </div>
                    <div class="content">
                      <h2 style="margin-top: 0; font-size: 20px; font-weight: 800;">%s</h2>
                      %s
                    </div>
                    <div class="footer">
                      &copy; %d OHO TECHN. All Rights Reserved.<br>
                      Need assistance? Contact support@ohotech.com
                    </div>
                  </div>
                </body>
                </html>
                """.formatted(BRAND_COLOR, ACCENT_COLOR, title, contentHtml, LocalDateTime.now().getYear());
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
        String title = "Welcome to OHO TECHN!";
        String content = """
                <p>Hello <strong>%s</strong>,</p>
                <p>Thank you for creating your account on OHO TECHN. We are thrilled to welcome you to our enterprise platform.</p>
                <div class="box">
                  <strong>What's Next?</strong>
                  <ul>
                    <li>Browse our Turnkey Software Catalog</li>
                    <li>Evaluate software with 14-Day Free Trials</li>
                    <li>Provision perpetual licenses & subscriptions</li>
                  </ul>
                </div>
                <p style="text-align: center;">
                  <a href="http://localhost:3000/products" class="button">Explore Products Catalog</a>
                </p>
                """.formatted(userName);
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
