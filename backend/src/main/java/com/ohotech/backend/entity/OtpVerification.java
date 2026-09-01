package com.ohotech.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "otp_verifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OtpVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String target; // Email or Phone number

    @Column(name = "otp_hash")
    private String otpHash; // Cryptographic hash of OTP code (SHA-256)

    @Enumerated(EnumType.STRING)
    @Column(name = "purpose")
    @Builder.Default
    private OtpPurpose purpose = OtpPurpose.EMAIL_VERIFICATION;

    @Column(nullable = false)
    private LocalDateTime expiryTime;

    @Builder.Default
    @Column(name = "attempts")
    private int attempts = 0;

    @Builder.Default
    private boolean verified = false;

    @Column(name = "reset_token")
    private String resetToken; // For single-use PASSWORD_RESET authorization after OTP verification

    @Column(name = "reset_token_expiry")
    private LocalDateTime resetTokenExpiry;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
