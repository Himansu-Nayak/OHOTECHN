package com.ohotech.backend.service;

import com.ohotech.backend.entity.OtpPurpose;
import com.ohotech.backend.entity.OtpVerification;
import com.ohotech.backend.exception.BadRequestException;
import com.ohotech.backend.repository.OtpRepository;
import com.ohotech.backend.service.otp.OtpDeliveryRouter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
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
@Slf4j
public class PhoneVerificationService {

    private static final int MAX_ATTEMPTS = 3;
    private static final int OTP_EXPIRY_MINUTES = 5;
    private static final int COOLDOWN_SECONDS = 60;

    private final OtpRepository otpRepository;
    private final OtpDeliveryRouter otpDeliveryRouter;
    private final SecureRandom secureRandom = new SecureRandom();

    @Transactional
    public String requestPhoneOtp(String rawPhone) {
        String cleanPhone = normalizePhone(rawPhone);

        // Resend Cooldown Check
        Optional<OtpVerification> latestOpt = otpRepository.findFirstByTargetAndPurposeOrderByCreatedAtDesc(
                cleanPhone, OtpPurpose.PHONE_CHECKOUT_VERIFICATION);

        if (latestOpt.isPresent()) {
            OtpVerification latest = latestOpt.get();
            if (latest.getCreatedAt() != null && latest.getCreatedAt().isAfter(LocalDateTime.now().minusSeconds(COOLDOWN_SECONDS))) {
                throw new BadRequestException("Please wait " + COOLDOWN_SECONDS + " seconds before requesting another code.");
            }
        }

        // Generate 6-digit secure code
        int code = 100000 + secureRandom.nextInt(900000);
        String rawOtp = String.valueOf(code);
        String otpHash = hashOtp(rawOtp);
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES);

        OtpVerification verification = OtpVerification.builder()
                .target(cleanPhone)
                .otpHash(otpHash)
                .purpose(OtpPurpose.PHONE_CHECKOUT_VERIFICATION)
                .expiryTime(expiry)
                .attempts(0)
                .verified(false)
                .build();

        otpRepository.saveAndFlush(verification);

        // Dispatch via WhatsApp / Dev sink
        otpDeliveryRouter.dispatchPhoneOtp(cleanPhone, rawOtp, "CHECKOUT_VERIFICATION");

        return "Verification code dispatched to your phone number.";
    }

    @Transactional
    public String verifyPhoneOtp(String rawPhone, String rawOtpCode) {
        if (rawOtpCode == null || rawOtpCode.trim().length() != 6) {
            throw new BadRequestException("A valid 6-digit verification code is required.");
        }

        String cleanPhone = normalizePhone(rawPhone);

        OtpVerification verification = otpRepository.findFirstByTargetAndPurposeOrderByCreatedAtDesc(
                cleanPhone, OtpPurpose.PHONE_CHECKOUT_VERIFICATION)
                .orElseThrow(() -> new BadRequestException("No verification code found for this phone number. Please request a new code."));

        if (verification.isVerified()) {
            throw new BadRequestException("This verification code has already been consumed.");
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
            throw new BadRequestException("Invalid verification code. " + remaining + " attempt(s) remaining.");
        }

        // Mark consumed and issue verification proof token
        verification.setVerified(true);
        String proofToken = UUID.randomUUID().toString();
        verification.setResetToken(proofToken);
        verification.setResetTokenExpiry(LocalDateTime.now().plusMinutes(30));
        otpRepository.saveAndFlush(verification);

        log.info("Phone verification successful for target [masked: ***{}]",
                cleanPhone.length() >= 4 ? cleanPhone.substring(cleanPhone.length() - 4) : "xxxx");

        return proofToken;
    }

    public boolean isPhoneVerified(String rawPhone, String proofToken) {
        if (proofToken == null || proofToken.isBlank()) return false;
        String cleanPhone = normalizePhone(rawPhone);

        Optional<OtpVerification> opt = otpRepository.findFirstByTargetAndPurposeOrderByCreatedAtDesc(
                cleanPhone, OtpPurpose.PHONE_CHECKOUT_VERIFICATION);

        if (opt.isEmpty()) return false;
        OtpVerification v = opt.get();
        return v.isVerified() && proofToken.equals(v.getResetToken())
                && v.getResetTokenExpiry() != null
                && v.getResetTokenExpiry().isAfter(LocalDateTime.now());
    }

    private String normalizePhone(String raw) {
        if (raw == null || raw.trim().isEmpty()) {
            throw new BadRequestException("Phone number is required.");
        }
        String digits = raw.replaceAll("[^0-9]", "");
        if (digits.length() < 10 || digits.length() > 15) {
            throw new BadRequestException("Please enter a valid 10 to 12 digit mobile phone number.");
        }
        // Normalize 10-digit Indian numbers to +91
        if (digits.length() == 10) {
            digits = "91" + digits;
        }
        return "+" + digits;
    }

    private String hashOtp(String code) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(code.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }
}
