package com.ohotech.backend.controller;

import com.ohotech.backend.dto.ApiResponse;
import com.ohotech.backend.dto.PaymentOrderRequest;
import com.ohotech.backend.dto.PaymentVerificationRequest;
import com.ohotech.backend.entity.Payment;
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

    @PostMapping("/create-order")
    public ResponseEntity<ApiResponse<Map<String, Object>>> createPaymentOrder(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody PaymentOrderRequest request) {
        Map<String, Object> paymentOrder = paymentService.createPaymentOrder(currentUser.getId(), request.getOrderId());
        return ResponseEntity.ok(ApiResponse.success("Payment order created successfully", paymentOrder));
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<Payment>> verifyPayment(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody PaymentVerificationRequest request) {
        Payment payment = paymentService.verifyPayment(currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Payment verified successfully", payment));
    }
}
