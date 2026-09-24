package com.ohotech.backend.controller;

import com.ohotech.backend.dto.*;
import com.ohotech.backend.security.UserPrincipal;
import com.ohotech.backend.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping("/config")
    public ResponseEntity<ApiResponse<PaymentConfigDto>> getPaymentConfig() {
        PaymentConfigDto config = paymentService.getPaymentConfig();
        return ResponseEntity.ok(ApiResponse.success("Payment configuration retrieved", config));
    }

    @PostMapping("/create-order")
    public ResponseEntity<ApiResponse<Map<String, Object>>> createPaymentOrder(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody PaymentOrderRequest request) {
        Map<String, Object> paymentOrder = paymentService.createPaymentOrder(currentUser.getId(), request.getOrderId());
        return ResponseEntity.ok(ApiResponse.success("Payment order created successfully", paymentOrder));
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<PaymentResponseDto>> verifyPayment(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody PaymentVerificationRequest request) {
        PaymentResponseDto payment = paymentService.verifyPayment(currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Payment verified successfully", payment));
    }

    @PostMapping("/initiate-upi")
    public ResponseEntity<ApiResponse<UpiInitiateResponse>> initiateUpiPayment(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody PaymentOrderRequest request) {
        UpiInitiateResponse response = paymentService.initiateUpiPayment(currentUser.getId(), request.getOrderId());
        return ResponseEntity.ok(ApiResponse.success("Dynamic UPI payment initiated", response));
    }

    @PostMapping("/submit-utr")
    public ResponseEntity<ApiResponse<PaymentResponseDto>> submitUtr(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody UtrSubmissionRequest request) {
        PaymentResponseDto payment = paymentService.submitUtr(currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("UTR submitted successfully. Payment under verification.", payment));
    }

    @PostMapping("/initiate-cod")
    public ResponseEntity<ApiResponse<PaymentResponseDto>> initiateCod(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody PaymentOrderRequest request) {
        PaymentResponseDto payment = paymentService.initiateCod(currentUser.getId(), request.getOrderId());
        return ResponseEntity.ok(ApiResponse.success("Cash on Delivery order confirmed.", payment));
    }
}
