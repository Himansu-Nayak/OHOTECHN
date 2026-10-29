package com.ohotech.backend.controller;

import com.ohotech.backend.dto.ApiResponse;
import com.ohotech.backend.service.PhoneVerificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth/phone-otp")
@RequiredArgsConstructor
@Slf4j
public class PhoneVerificationController {

    private final PhoneVerificationService phoneVerificationService;

    @PostMapping("/request")
    public ResponseEntity<ApiResponse<Map<String, Object>>> requestPhoneOtp(@RequestBody Map<String, String> payload) {
        String phone = payload.get("phoneNumber");
        String message = phoneVerificationService.requestPhoneOtp(phone);
        return ResponseEntity.ok(ApiResponse.success(message, Map.of(
                "status", "OTP_DISPATCHED",
                "cooldownSeconds", 60
        )));
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<Map<String, Object>>> verifyPhoneOtp(@RequestBody Map<String, String> payload) {
        String phone = payload.get("phoneNumber");
        String code = payload.get("otpCode");
        String proofToken = phoneVerificationService.verifyPhoneOtp(phone, code);
        return ResponseEntity.ok(ApiResponse.success("Phone number verified successfully.", Map.of(
                "verified", true,
                "proofToken", proofToken
        )));
    }
}
