package com.ohotech.backend.service;

import com.ohotech.backend.dto.*;
import com.ohotech.backend.entity.OtpPurpose;
import com.ohotech.backend.entity.OtpVerification;
import com.ohotech.backend.entity.RefreshToken;
import com.ohotech.backend.entity.Role;
import com.ohotech.backend.entity.User;
import com.ohotech.backend.exception.BadRequestException;
import com.ohotech.backend.exception.ResourceNotFoundException;
import com.ohotech.backend.repository.OtpRepository;
import com.ohotech.backend.repository.RefreshTokenRepository;
import com.ohotech.backend.repository.UserRepository;
import com.ohotech.backend.security.JwtTokenProvider;
import com.ohotech.backend.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final EmailService emailService;
    private final NotificationService notificationService;
    private final EmailTemplateService emailTemplateService;
    private final AuditService auditService;
    private final OtpService otpService;
    private final OtpRepository otpRepository;

    @Value("${app.jwt.refresh-expiration-ms:604800000}")
    private long refreshTokenExpirationMs;

    @Value("${app.security.max-failed-logins:5}")
    private int maxFailedLogins;

    @Value("${app.security.lockout-duration-minutes:15}")
    private long lockoutDurationMinutes;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (request.getEmail() != null && userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered!");
        }
        if (request.getPhone() != null && userRepository.existsByPhone(request.getPhone())) {
            throw new BadRequestException("Phone number is already registered!");
        }
        if (request.getEmail() == null && request.getPhone() == null) {
            throw new BadRequestException("Either Email or Phone number must be provided!");
        }

        // CRITICAL SECURITY HARDENING: Public registration must ALWAYS create ROLE_CUSTOMER.
        // Role elevation to ADMIN or DEVELOPER is strictly prohibited via public endpoints.
        Role role = Role.ROLE_CUSTOMER;

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .enabled(true)
                .failedLoginAttempts(0)
                .build();

        User savedUser = userRepository.save(user);

        try {
            notificationService.createNotification(
                    savedUser.getId(),
                    "Welcome to OHO TECHN!",
                    "Your account has been created successfully. Explore our software catalog to activate free trials & licenses.",
                    com.ohotech.backend.entity.NotificationType.SUCCESS,
                    com.ohotech.backend.entity.NotificationCategory.SYSTEM,
                    "/products"
            );

            if (savedUser.getEmail() != null) {
                String htmlBody = emailTemplateService.buildWelcomeEmail(savedUser.getName());
                emailService.sendHtmlEmail(savedUser.getEmail(), "Welcome to OHO TECHN", htmlBody);
            }
        } catch (Exception e) {
            // Non-blocking notification failure
        }

        auditService.logUserEvent(savedUser, "USER_REGISTERED", "User", String.valueOf(savedUser.getId()),
                "User registered with email: " + savedUser.getEmail());

        if (savedUser.getEmail() != null) {
            try {
                otpService.sendOtp(savedUser.getEmail(), "EMAIL", OtpPurpose.EMAIL_VERIFICATION);
            } catch (Exception e) {
                // Non-blocking notification/OTP dispatch log
            }
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail() != null ? request.getEmail() : request.getPhone(),
                        request.getPassword()
                )
        );

        String jwt = tokenProvider.generateToken(authentication);
        RefreshToken refreshToken = createRefreshToken(savedUser);

        return AuthResponse.builder()
                .accessToken(jwt)
                .refreshToken(refreshToken.getToken())
                .user(mapUserToDto(savedUser))
                .build();
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        String username = request.getUsername();

        User user = (username != null && username.contains("@"))
                ? userRepository.findByEmail(username).orElse(null)
                : userRepository.findByPhone(username).orElse(null);

        if (user != null) {
            if (user.getLockoutUntil() != null && user.getLockoutUntil().isAfter(java.time.LocalDateTime.now())) {
                auditService.logUserEvent(user, "USER_LOGIN_BLOCKED_LOCKOUT", "User", String.valueOf(user.getId()),
                        "Login attempt blocked due to active account lockout");
                throw new BadRequestException("Account is temporarily locked due to repeated failed login attempts. Please try again after 15 minutes.");
            }
            if (!user.isEmailVerified()) {
                throw new BadRequestException("Your email address is not verified. Please check your inbox and verify your email first.");
            }
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            User authenticatedUser = userRepository.findById(userPrincipal.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getId()));

            // Reset failed login counter on successful authentication
            authenticatedUser.setFailedLoginAttempts(0);
            authenticatedUser.setLockoutUntil(null);
            userRepository.save(authenticatedUser);

            auditService.logUserEvent(authenticatedUser, "USER_LOGIN_SUCCESS", "User", String.valueOf(authenticatedUser.getId()),
                    "Successful authentication for user: " + authenticatedUser.getEmail());

            String jwt = tokenProvider.generateToken(authentication);
            RefreshToken refreshToken = createRefreshToken(authenticatedUser);

            return AuthResponse.builder()
                    .accessToken(jwt)
                    .refreshToken(refreshToken.getToken())
                    .user(mapUserToDto(authenticatedUser))
                    .build();

        } catch (Exception e) {
            if (user != null) {
                int newAttempts = user.getFailedLoginAttempts() + 1;
                user.setFailedLoginAttempts(newAttempts);
                if (newAttempts >= maxFailedLogins) {
                    user.setLockoutUntil(java.time.LocalDateTime.now().plusMinutes(lockoutDurationMinutes));
                    auditService.logUserEvent(user, "ACCOUNT_LOCKED", "User", String.valueOf(user.getId()),
                            "Account locked for " + lockoutDurationMinutes + " minutes after " + newAttempts + " failed login attempts");
                } else {
                    auditService.logUserEvent(user, "USER_LOGIN_FAILED", "User", String.valueOf(user.getId()),
                            "Failed login attempt (" + newAttempts + "/" + maxFailedLogins + ")");
                }
                userRepository.save(user);
            }
            throw e;
        }
    }

    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(request.getRefreshToken())
                .orElseThrow(() -> new BadRequestException("Invalid refresh token"));

        if (refreshToken.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(refreshToken);
            throw new BadRequestException("Refresh token was expired. Please login again.");
        }

        User user = refreshToken.getUser();
        String newAccessToken = tokenProvider.generateTokenFromUserId(user.getId());

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(refreshToken.getToken())
                .user(mapUserToDto(user))
                .build();
    }

    public UserDto getCurrentUser(UserPrincipal currentUser) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUser.getId()));
        return mapUserToDto(user);
    }

    private RefreshToken createRefreshToken(User user) {
        RefreshToken refreshToken = refreshTokenRepository.findByUser(user)
                .orElse(RefreshToken.builder().user(user).build());

        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setExpiryDate(Instant.now().plusMillis(refreshTokenExpirationMs));

        return refreshTokenRepository.save(refreshToken);
    }

    public UserDto mapUserToDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .officialEmail(user.getOfficialEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .enabled(user.isEnabled())
                .emailVerified(user.isEmailVerified())
                .phoneVerified(user.isPhoneVerified())
                .createdAt(user.getCreatedAt())
                .build();
    }

    @Transactional
    public AuthResponse loginWithOtp(String target, String rawOtpCode) {
        String normalizedTarget = target != null ? target.trim().toLowerCase() : "";
        otpService.verifyOtp(normalizedTarget, rawOtpCode, OtpPurpose.LOGIN);

        User user = (normalizedTarget.contains("@"))
                ? userRepository.findByEmail(normalizedTarget).orElseThrow(() -> new BadRequestException("Account not found"))
                : userRepository.findByPhone(normalizedTarget).orElseThrow(() -> new BadRequestException("Account not found"));

        if (!user.isEnabled()) {
            throw new BadRequestException("Account is disabled. Please contact support.");
        }

        if (!user.isEmailVerified()) {
            throw new BadRequestException("Your email address is not verified. Please check your inbox and verify your email first.");
        }

        if (user.getLockoutUntil() != null && user.getLockoutUntil().isAfter(LocalDateTime.now())) {
            throw new BadRequestException("Account is temporarily locked due to failed login attempts.");
        }

        user.setFailedLoginAttempts(0);
        user.setLockoutUntil(null);
        userRepository.save(user);

        auditService.logUserEvent(user, "USER_LOGIN_OTP_SUCCESS", "User", String.valueOf(user.getId()),
                "Successful OTP authentication for user: " + user.getEmail());

        String jwt = tokenProvider.generateTokenFromUserId(user.getId());
        RefreshToken refreshToken = createRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(jwt)
                .refreshToken(refreshToken.getToken())
                .user(mapUserToDto(user))
                .build();
    }

    @Transactional
    public boolean verifyEmailOtp(String target, String rawOtpCode) {
        String normalizedTarget = target != null ? target.trim().toLowerCase() : "";
        otpService.verifyOtp(normalizedTarget, rawOtpCode, OtpPurpose.EMAIL_VERIFICATION);

        User user = (normalizedTarget.contains("@"))
                ? userRepository.findByEmail(normalizedTarget).orElse(null)
                : userRepository.findByPhone(normalizedTarget).orElse(null);

        if (user != null) {
            user.setEmailVerified(true);
            userRepository.save(user);
            auditService.logUserEvent(user, "USER_EMAIL_VERIFIED", "User", String.valueOf(user.getId()),
                    "Email verified successfully via OTP: " + user.getEmail());
        }

        return true;
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new BadRequestException("Email is required.");
        }
        if (request.getResetToken() == null || request.getResetToken().isBlank()) {
            throw new BadRequestException("Reset token is required.");
        }
        if (request.getNewPassword() == null || request.getNewPassword().length() < 6) {
            throw new BadRequestException("New password must be at least 6 characters long.");
        }

        String normalizedEmail = request.getEmail().trim().toLowerCase();
        OtpVerification verification = otpRepository.findByTargetAndResetToken(normalizedEmail, request.getResetToken())
                .orElseThrow(() -> new BadRequestException("Invalid or expired password reset token. Please request a new OTP."));

        if (verification.getResetTokenExpiry() == null || verification.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Password reset token has expired. Please request a new OTP.");
        }

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new BadRequestException("User account not found."));

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        user.setFailedLoginAttempts(0);
        user.setLockoutUntil(null);
        userRepository.save(user);

        // Consume single-use reset token
        verification.setResetToken(null);
        verification.setResetTokenExpiry(null);
        otpRepository.save(verification);

        auditService.logUserEvent(user, "USER_PASSWORD_RESET_SUCCESS", "User", String.valueOf(user.getId()),
                "Password reset successfully via OTP reset authorization");
    }
}
