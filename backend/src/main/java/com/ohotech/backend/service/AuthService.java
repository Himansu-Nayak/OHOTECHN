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
import java.util.Optional;
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
    private final FirebaseService firebaseService;

    @Value("${app.jwt.refresh-expiration-ms:604800000}")
    private long refreshTokenExpirationMs;

    @Value("${app.security.max-failed-logins:5}")
    private int maxFailedLogins;

    @Value("${app.security.lockout-duration-minutes:15}")
    private long lockoutDurationMinutes;

    @Value("${app.auth.require-email-verification:false}")
    private boolean requireEmailVerification;

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
                .emailVerified(!requireEmailVerification)
                .phoneVerified(!requireEmailVerification)
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
            if (requireEmailVerification && !user.isEmailVerified()) {
                if (user.getRole() == Role.ROLE_ADMIN || user.getRole() == Role.ROLE_DEVELOPER) {
                    user.setEmailVerified(true);
                    userRepository.save(user);
                } else {
                    throw new BadRequestException("Your email address is not verified. Please check your inbox and verify your email first.");
                }
            } else if (!requireEmailVerification && !user.isEmailVerified()) {
                user.setEmailVerified(true);
                userRepository.save(user);
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

        // Proving ownership via OTP automatically validates email
        if (!user.isEmailVerified() && normalizedTarget.contains("@")) {
            user.setEmailVerified(true);
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

    @Transactional
    public AuthResponse loginWithFirebase(String idToken) {
        FirebaseVerifiedUser verified = firebaseService.verifyToken(idToken);
        String uid = verified.getUid();
        String email = verified.getEmail();
        boolean emailVerified = verified.isEmailVerified();
        String phone = verified.getPhone();
        String name = verified.getName();

        // 1. Check if user with this firebaseUid already exists
        User user = userRepository.findByFirebaseUid(uid).orElse(null);

        // 2. If not found by firebaseUid, attempt safe account linking using SERVER-VERIFIED identifiers
        if (user == null) {
            // Google verified email account linking
            // Google verified email account linking
            if (email != null) {
                Optional<User> existingEmailUser = userRepository.findByEmail(email);
                if (existingEmailUser.isPresent()) {
                    if (!emailVerified) {
                        throw new BadRequestException("The email associated with this Google account is not verified. Cannot link to existing account.");
                    }
                    User existing = existingEmailUser.get();
                    if (existing.getFirebaseUid() != null && !existing.getFirebaseUid().equals(uid)) {
                        throw new BadRequestException("This email is already associated with another authentication account.");
                    }
                    existing.setFirebaseUid(uid);
                    existing.setEmailVerified(true);
                    if (phone != null && existing.getPhone() == null && !userRepository.existsByPhone(phone)) {
                        existing.setPhone(phone);
                        existing.setPhoneVerified(true);
                    }
                    user = userRepository.save(existing);
                    auditService.logUserEvent(user, "USER_FIREBASE_LINKED_EMAIL", "User", String.valueOf(user.getId()),
                            "Linked Firebase UID to existing account via verified Google email: " + email);
                }
            }

            // Phone verified account linking
            if (user == null && phone != null) {
                Optional<User> existingPhoneUser = userRepository.findByPhone(phone);
                if (existingPhoneUser.isPresent()) {
                    User existing = existingPhoneUser.get();
                    if (existing.getFirebaseUid() != null && !existing.getFirebaseUid().equals(uid)) {
                        throw new BadRequestException("This phone number is already associated with another authentication account.");
                    }
                    existing.setFirebaseUid(uid);
                    existing.setPhoneVerified(true);
                    if (email != null && emailVerified && existing.getEmail() == null && !userRepository.existsByEmail(email)) {
                        existing.setEmail(email);
                        existing.setEmailVerified(true);
                    }
                    user = userRepository.save(existing);
                    auditService.logUserEvent(user, "USER_FIREBASE_LINKED_PHONE", "User", String.valueOf(user.getId()),
                            "Linked Firebase UID to existing account via verified phone: " + phone);
                }
            }
        }

        // 3. If still no user exists, create a brand-new customer account
        if (user == null) {
            String displayName = (name != null && !name.isBlank()) ? name.trim() : null;
            if (displayName == null) {
                if (email != null && email.contains("@")) {
                    displayName = email.substring(0, email.indexOf('@'));
                } else if (phone != null && phone.length() >= 4) {
                    displayName = "User " + phone.substring(phone.length() - 4);
                } else {
                    displayName = "OHO TECH User";
                }
            }

            // Cryptographically random unusable BCrypt password hash to satisfy NOT NULL constraint (must be <= 72 bytes)
            String unusablePasswordHash = passwordEncoder.encode("FB_" + UUID.randomUUID().toString().replace("-", ""));

            User newUser = User.builder()
                    .name(displayName)
                    .email(email)
                    .phone(phone)
                    .firebaseUid(uid)
                    .passwordHash(unusablePasswordHash)
                    .role(Role.ROLE_CUSTOMER) // Strictly enforce ROLE_CUSTOMER for new federated signups
                    .enabled(true)
                    .emailVerified(email != null && emailVerified)
                    .phoneVerified(phone != null)
                    .failedLoginAttempts(0)
                    .build();

            user = userRepository.save(newUser);

            try {
                notificationService.createNotification(
                        user.getId(),
                        "Welcome to OHO TECHN!",
                        "Your account has been created successfully via Firebase Authentication.",
                        com.ohotech.backend.entity.NotificationType.SUCCESS,
                        com.ohotech.backend.entity.NotificationCategory.SYSTEM,
                        "/products"
                );
                if (user.getEmail() != null) {
                    String htmlBody = emailTemplateService.buildWelcomeEmail(user.getName());
                    emailService.sendHtmlEmail(user.getEmail(), "Welcome to OHO TECHN", htmlBody);
                }
            } catch (Exception e) {
                // Non-blocking notification
            }

            auditService.logUserEvent(user, "USER_FIREBASE_REGISTERED", "User", String.valueOf(user.getId()),
                    "User registered via Firebase federated auth. UID: " + uid);
        }

        // 4. Update verification status if newly verified by provider
        boolean needsUpdate = false;
        if (email != null && emailVerified && !user.isEmailVerified() && email.equalsIgnoreCase(user.getEmail())) {
            user.setEmailVerified(true);
            needsUpdate = true;
        }
        if (phone != null && !user.isPhoneVerified() && phone.equals(user.getPhone())) {
            user.setPhoneVerified(true);
            needsUpdate = true;
        }

        // 5. Enforce account status and security locks
        if (!user.isEnabled()) {
            throw new BadRequestException("Your account is disabled. Please contact support.");
        }

        if (user.getLockoutUntil() != null && user.getLockoutUntil().isAfter(LocalDateTime.now())) {
            throw new BadRequestException("Account is temporarily locked due to failed login attempts. Please try again later.");
        }

        if (user.getFailedLoginAttempts() > 0 || user.getLockoutUntil() != null) {
            user.setFailedLoginAttempts(0);
            user.setLockoutUntil(null);
            needsUpdate = true;
        }

        if (needsUpdate) {
            user = userRepository.save(user);
        }

        auditService.logUserEvent(user, "USER_LOGIN_FIREBASE_SUCCESS", "User", String.valueOf(user.getId()),
                "Successful Firebase authentication for user: " + (user.getEmail() != null ? user.getEmail() : user.getPhone()));

        // 6. Generate standard OHO TECH Application JWT and Refresh Token
        String jwt = tokenProvider.generateTokenFromUserId(user.getId());
        RefreshToken refreshToken = createRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(jwt)
                .refreshToken(refreshToken.getToken())
                .user(mapUserToDto(user))
                .build();
    }
}
