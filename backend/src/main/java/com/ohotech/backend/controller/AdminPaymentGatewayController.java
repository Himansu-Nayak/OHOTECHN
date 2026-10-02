package com.ohotech.backend.controller;

import com.ohotech.backend.dto.*;
import com.ohotech.backend.security.UserPrincipal;
import com.ohotech.backend.service.PaymentService;
import com.ohotech.backend.service.payment.PaymentGatewayRegistry;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
@Slf4j
public class AdminPaymentGatewayController {

    private final PaymentGatewayRegistry gatewayRegistry;
    private final PaymentService paymentService;

    // 1. Get All Payment Gateway Cards (with genuine verified state)
    @GetMapping("/gateways")
    public ResponseEntity<ApiResponse<List<PaymentGatewayDto>>> getPaymentGateways() {
        List<PaymentGatewayDto> gateways = gatewayRegistry.getAllGateways();
        return ResponseEntity.ok(ApiResponse.success("Payment gateway configurations retrieved", gateways));
    }

    // 2. Perform Real Health Check on Specified Gateway
    @PostMapping("/gateways/{providerId}/health-check")
    public ResponseEntity<ApiResponse<GatewayHealthDto>> runGatewayHealthCheck(@PathVariable String providerId) {
        GatewayHealthDto health = gatewayRegistry.checkGatewayHealth(providerId);
        return ResponseEntity.ok(ApiResponse.success("Gateway health check completed", health));
    }

    // 3. Enable or Disable Payment Gateway
    @PostMapping("/gateways/{providerId}/toggle")
    public ResponseEntity<ApiResponse<PaymentGatewayDto>> toggleGateway(
            @AuthenticationPrincipal UserPrincipal adminUser,
            @PathVariable String providerId,
            @RequestBody Map<String, Boolean> payload) {
        Boolean enable = payload.get("enabled");
        if (enable == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Field 'enabled' is required"));
        }
        PaymentGatewayDto updated = gatewayRegistry.toggleGateway(providerId, enable, adminUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Gateway state updated successfully", updated));
    }

    // 4. Payment Gateway Top-Level Summary KPIs
    @GetMapping("/gateways/summary")
    public ResponseEntity<ApiResponse<PaymentGatewaySummaryDto>> getGatewaySummary() {
        PaymentGatewaySummaryDto summary = gatewayRegistry.getSummaryMetrics();
        return ResponseEntity.ok(ApiResponse.success("Gateway summary KPIs calculated", summary));
    }

    // 5. Admin Refund Execution
    @PostMapping("/payments/{id}/refund")
    public ResponseEntity<ApiResponse<PaymentResponseDto>> processRefund(
            @AuthenticationPrincipal UserPrincipal adminUser,
            @PathVariable Long id,
            @Valid @RequestBody(required = false) PaymentRefundRequest request) {
        PaymentResponseDto response = paymentService.adminRefundPayment(adminUser.getId(), id, request);
        return ResponseEntity.ok(ApiResponse.success("Payment refund processed successfully", response));
    }

    // 6. Payment Reconciliation Audit Report
    @GetMapping("/payments/reconciliation")
    public ResponseEntity<ApiResponse<PaymentReconciliationReportDto>> getPaymentReconciliation() {
        PaymentReconciliationReportDto report = paymentService.generateReconciliationReport();
        return ResponseEntity.ok(ApiResponse.success("Payment reconciliation report generated", report));
    }
}
