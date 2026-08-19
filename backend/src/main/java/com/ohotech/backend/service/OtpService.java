package com.ohotech.backend.service;

import com.ohotech.backend.entity.OtpVerification;
import com.ohotech.backend.exception.BadRequestException;
import com.ohotech.backend.repository.OtpRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class OtpService {

    private static final Logger logger = LoggerFactory.getLogger(OtpService.class);
    private final OtpRepository otpRepository;
    private final EmailService emailService;

    @Transactional
    public String sendOtp(String target, String channel) {
        String otpCode = String.format("%06d", new Random().nextInt(900000) + 100000);
        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(10);

        OtpVerification verification = OtpVerification.builder()
                .target(target)
                .otpCode(otpCode)
                .expiryTime(expiryTime)
                .verified(false)
                .build();

        otpRepository.save(verification);

        if (target.contains("@")) {
            emailService.sendEmail(target, "OHO TECHN - OTP Verification Code",
                    "Your OTP code is: " + otpCode + ". It will expire in 10 minutes.");
        } else {
            logger.info("[DEV SMS OTP MODE] Target: {} | OTP Code: {}", target, otpCode);
        }

        return "OTP sent successfully to " + target;
    }

    @Transactional
    public boolean verifyOtp(String target, String otpCode) {
        OtpVerification verification = otpRepository.findFirstByTargetOrderByCreatedAtDesc(target)
                .orElseThrow(() -> new BadRequestException("No OTP requested for " + target));

        if (verification.isVerified()) {
            throw new BadRequestException("OTP has already been used");
        }

        if (verification.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("OTP code has expired");
        }

        if (!verification.getOtpCode().equals(otpCode)) {
            throw new BadRequestException("Invalid OTP code");
        }

        verification.setVerified(true);
        otpRepository.save(verification);
        return true;
    }
}
