package com.ohotech.backend.controller;

import com.ohotech.backend.dto.ApiResponse;
import com.ohotech.backend.dto.UpiCheckoutResponseDto;
import com.ohotech.backend.dto.UpiCheckoutStatusDto;
import com.ohotech.backend.security.UserPrincipal;
import com.ohotech.backend.service.SelfHostedUpiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments/upi")
@RequiredArgsConstructor
@Slf4j
public class UpiCheckoutController {

    private final SelfHostedUpiService selfHostedUpiService;

    @PostMapping("/initiate")
    public ResponseEntity<ApiResponse<UpiCheckoutResponseDto>> initiateCheckout(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody Map<String, Object> payload) {

        Long orderId = Long.valueOf(String.valueOf(payload.get("orderId")));
        Long userId = currentUser != null ? currentUser.getId() : 1L; // Fallback for public checkout with session

        UpiCheckoutResponseDto response = selfHostedUpiService.initiateOrResumeCheckout(userId, orderId);
        return ResponseEntity.ok(ApiResponse.success("Self-hosted UPI checkout session ready", response));
    }

    @GetMapping("/status/{paymentId}")
    public ResponseEntity<ApiResponse<UpiCheckoutStatusDto>> getStatus(@PathVariable Long paymentId) {
        UpiCheckoutStatusDto status = selfHostedUpiService.getPaymentStatus(paymentId);
        return ResponseEntity.ok(ApiResponse.success("UPI payment status retrieved", status));
    }

    @PostMapping("/submit-utr")
    public ResponseEntity<ApiResponse<UpiCheckoutStatusDto>> submitUtr(@RequestBody Map<String, String> payload) {
        Long paymentId = Long.valueOf(payload.get("paymentId"));
        String utr = payload.get("utr");
        String payerUpi = payload.get("payerUpi");
        String payerName = payload.get("payerName");

        UpiCheckoutStatusDto status = selfHostedUpiService.submitCustomerUtr(paymentId, utr, payerUpi, payerName);
        return ResponseEntity.ok(ApiResponse.success(status.getMessage(), status));
    }

    @PostMapping("/cancel/{paymentId}")
    public ResponseEntity<ApiResponse<Void>> cancelCheckout(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long paymentId) {

        Long userId = currentUser != null ? currentUser.getId() : 1L;
        selfHostedUpiService.cancelCheckout(paymentId, userId);
        return ResponseEntity.ok(ApiResponse.success("Payment session cancelled and lease slot released."));
    }
}
