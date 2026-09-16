package com.ohotech.backend.service;

import com.ohotech.backend.entity.OtpPurpose;
import com.ohotech.backend.entity.OtpVerification;
import com.ohotech.backend.entity.User;
import com.ohotech.backend.exception.BadRequestException;
import com.ohotech.backend.repository.OtpRepository;
import com.ohotech.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OtpService {

    private static final Logger logger = LoggerFactory.getLogger(OtpService.class);
    private static final int MAX_ATTEMPTS = 5;
    private static final int OTP_EXPIRY_MINUTES = 10;
    private static final int COOLDOWN_SECONDS = 60;

    private final OtpRepository otpRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final EmailTemplateService emailTemplateService;
    private final SecureRandom secureRandom = new SecureRandom();

    @Transactional
    public String sendOtp(String target, String channel, OtpPurpose purpose) {
        if (target == null || target.trim().isEmpty()) {
            throw new BadRequestException("Target email or phone is required.");
        }
        String normalizedTarget = target.trim().toLowerCase();
        OtpPurpose actualPurpose = purpose != null ? purpose : OtpPurpose.EMAIL_VERIFICATION;

        // User Enumeration Protection for LOGIN and PASSWORD_RESET
        boolean isEmail = normalizedTarget.contains("@");
        User user = null;
        if (isEmail) {
            user = userRepository.findByEmail(normalizedTarget).orElse(null);
        } else {
            user = userRepository.findByPhone(normalizedTarget).orElse(null);
        }

        if (actualPurpose == OtpPurpose.LOGIN || actualPurpose == OtpPurpose.PASSWORD_RESET) {
            if (user == null || !user.isEnabled()) {
                logger.info("Enumeration safe response: target {} not found or disabled for purpose {}", normalizedTarget, actualPurpose);
                return "If an eligible account exists with this detail, a verification code has been sent.";
            }
        }

        // Resend Cooldown Protection
        Optional<OtpVerification> latestOpt = otpRepository.findFirstByTargetAndPurposeOrderByCreatedAtDesc(normalizedTarget, actualPurpose);
        if (latestOpt.isPresent()) {
            OtpVerification latest = latestOpt.get();
            if (latest.getCreatedAt() != null && latest.getCreatedAt().isAfter(LocalDateTime.now().minusSeconds(COOLDOWN_SECONDS))) {
                throw new BadRequestException("Please wait 60 seconds before requesting another verification code.");
            }
        }

        // Cryptographically Secure OTP Generation
        int numericCode = 100000 + secureRandom.nextInt(900000);
        String rawOtpCode = String.valueOf(numericCode);
        String otpHash = hashOtp(rawOtpCode);
        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES);

        OtpVerification verification = OtpVerification.builder()
                .target(normalizedTarget)
                .otpHash(otpHash)
                .purpose(actualPurpose)
                .expiryTime(expiryTime)
                .attempts(0)
                .verified(false)
                .build();

        // Flush immediately to assign primary key ID and avoid null identifier errors in Hibernate session
        verification = otpRepository.saveAndFlush(verification);

        String recipientName = user != null ? user.getName() : "User";

        logger.info("=================================================");
        logger.info("[DEV AUTH OTP] Target: {} | Purpose: {} | Code: {}", normalizedTarget, actualPurpose, rawOtpCode);
        logger.info("=================================================");

        if (isEmail) {
            String htmlBody = emailTemplateService.buildOtpEmail(recipientName, rawOtpCode, actualPurpose);
            emailService.sendHtmlEmail(normalizedTarget, "OHO TECHN - Verification Code", htmlBody);
        } else {
            // DEV Mode SMS logging without raw OTP in prod logs
            logger.info("[DEV SMS OTP MODE] Target: {} | Purpose: {} | OTP Generated", normalizedTarget, actualPurpose);
        }

        if (actualPurpose == OtpPurpose.LOGIN || actualPurpose == OtpPurpose.PASSWORD_RESET) {
            return "If an eligible account exists with this detail, a verification code has been sent.";
        }

        return "Verification code sent successfully to " + normalizedTarget;
    }

    @Transactional
    public OtpVerification verifyOtpAndGetRecord(String target, String rawOtpCode, OtpPurpose purpose) {
        if (target == null || target.trim().isEmpty()) {
            throw new BadRequestException("Target email or phone is required.");
        }
        if (rawOtpCode == null || rawOtpCode.trim().isEmpty()) {
            throw new BadRequestException("OTP code is required.");
        }

        String normalizedTarget = target.trim().toLowerCase();
        OtpPurpose actualPurpose = purpose != null ? purpose : OtpPurpose.EMAIL_VERIFICATION;

        OtpVerification verification = otpRepository.findFirstByTargetAndPurposeOrderByCreatedAtDesc(normalizedTarget, actualPurpose)
                .orElseThrow(() -> new BadRequestException("No verification code requested for " + normalizedTarget));

        if (verification.isVerified()) {
            throw new BadRequestException("This verification code has already been used.");
        }

        if (verification.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Verification code has expired. Please request a new one.");
        }

        if (verification.getAttempts() >= MAX_ATTEMPTS) {
            throw new BadRequestException("Maximum verification attempts exceeded. Please request a new code.");
        }

        String submittedHash = hashOtp(rawOtpCode.trim());
        if (!verification.getOtpHash().equals(submittedHash)) {
            int newAttempts = verification.getAttempts() + 1;
            verification.setAttempts(newAttempts);
            otpRepository.saveAndFlush(verification);

            int remaining = MAX_ATTEMPTS - newAttempts;
            if (remaining <= 0) {
                throw new BadRequestException("Maximum verification attempts exceeded. Please request a new code.");
            }
            throw new BadRequestException("Invalid verification code. " + remaining + " attempts remaining.");
        }

        verification.setVerified(true);

        if (actualPurpose == OtpPurpose.PASSWORD_RESET) {
            String resetToken = UUID.randomUUID().toString();
            verification.setResetToken(resetToken);
            verification.setResetTokenExpiry(LocalDateTime.now().plusMinutes(15));
        }

        return otpRepository.saveAndFlush(verification);
    }

    @Transactional
    public boolean verifyOtp(String target, String rawOtpCode, OtpPurpose purpose) {
        verifyOtpAndGetRecord(target, rawOtpCode, purpose);
        return true;
    }

    @Transactional
    public String verifyResetOtp(String email, String rawOtpCode) {
        OtpVerification verification = verifyOtpAndGetRecord(email, rawOtpCode, OtpPurpose.PASSWORD_RESET);
        return verification.getResetToken();
    }

    public String hashOtp(String otpCode) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(otpCode.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }
}
