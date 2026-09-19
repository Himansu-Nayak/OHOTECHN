package com.ohotech.backend.controller;

import com.ohotech.backend.dto.*;
import com.ohotech.backend.entity.OtpPurpose;
import com.ohotech.backend.entity.OtpVerification;
import com.ohotech.backend.security.UserPrincipal;
import com.ohotech.backend.service.AuthService;
import com.ohotech.backend.service.OtpService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final OtpService otpService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(ApiResponse.success("User registered successfully", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @PostMapping("/login-otp")
    public ResponseEntity<ApiResponse<AuthResponse>> loginWithOtp(@Valid @RequestBody VerifyOtpRequest request) {
        AuthResponse response = authService.loginWithOtp(request.getTarget(), request.getOtpCode());
        return ResponseEntity.ok(ApiResponse.success("Login via OTP successful", response));
    }

    @PostMapping("/firebase-login")
    public ResponseEntity<ApiResponse<AuthResponse>> firebaseLogin(@Valid @RequestBody FirebaseLoginRequest request) {
        AuthResponse response = authService.loginWithFirebase(request.getIdToken());
        return ResponseEntity.ok(ApiResponse.success("Firebase authentication successful", response));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        AuthResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(ApiResponse.success("Token refreshed successfully", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser(@AuthenticationPrincipal UserPrincipal currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Unauthorized access"));
        }
        UserDto userDto = authService.getCurrentUser(currentUser);
        return ResponseEntity.ok(ApiResponse.success("Current user fetched successfully", userDto));
    }

    @PostMapping("/send-otp")
    public ResponseEntity<ApiResponse<String>> sendOtp(@Valid @RequestBody SendOtpRequest request) {
        String result = otpService.sendOtp(request.getTarget(), request.getChannel(), request.getPurpose());
        return ResponseEntity.ok(ApiResponse.success(result, null));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<VerifyOtpResponse>> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        OtpVerification verification = otpService.verifyOtpAndGetRecord(request.getTarget(), request.getOtpCode(), request.getPurpose());
        VerifyOtpResponse response = VerifyOtpResponse.builder()
                .verified(verification.isVerified())
                .resetToken(verification.getResetToken())
                .build();
        return ResponseEntity.ok(ApiResponse.success("OTP verified successfully", response));
    }

    @PostMapping("/verify-email-otp")
    public ResponseEntity<ApiResponse<Boolean>> verifyEmailOtp(@Valid @RequestBody VerifyOtpRequest request) {
        boolean verified = authService.verifyEmailOtp(request.getTarget(), request.getOtpCode());
        return ResponseEntity.ok(ApiResponse.success("Email verified successfully", verified));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<String>> forgotPassword(@Valid @RequestBody SendOtpRequest request) {
        String result = otpService.sendOtp(request.getTarget(), "EMAIL", OtpPurpose.PASSWORD_RESET);
        return ResponseEntity.ok(ApiResponse.success(result, null));
    }

    @PostMapping("/verify-reset-otp")
    public ResponseEntity<ApiResponse<VerifyOtpResponse>> verifyResetOtp(@Valid @RequestBody VerifyOtpRequest request) {
        String resetToken = otpService.verifyResetOtp(request.getTarget(), request.getOtpCode());
        VerifyOtpResponse response = VerifyOtpResponse.builder()
                .verified(true)
                .resetToken(resetToken)
                .build();
        return ResponseEntity.ok(ApiResponse.success("Password reset OTP verified successfully", response));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<String>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(ApiResponse.success("Password updated successfully. Please login with your new password.", null));
    }
}
