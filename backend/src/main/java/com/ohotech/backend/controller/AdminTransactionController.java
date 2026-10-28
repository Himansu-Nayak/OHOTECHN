package com.ohotech.backend.controller;

import com.ohotech.backend.dto.ApiResponse;
import com.ohotech.backend.dto.PaymentResponseDto;
import com.ohotech.backend.dto.TransactionOverviewDto;
import com.ohotech.backend.dto.WebhookEventDto;
import com.ohotech.backend.security.UserPrincipal;
import com.ohotech.backend.service.TransactionOperationsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/admin/transactions")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
@Slf4j
public class AdminTransactionController {

    private final TransactionOperationsService transactionOperationsService;

    @GetMapping("/overview")
    public ResponseEntity<ApiResponse<TransactionOverviewDto>> getOverview(
            @RequestParam(defaultValue = "ALL") String period,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        TransactionOverviewDto overview = transactionOperationsService.getTransactionOverview(period, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success("Transaction overview metrics retrieved successfully", overview));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<Page<PaymentResponseDto>>> getHistory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "ALL") String status,
            @RequestParam(defaultValue = "ALL") String provider,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(defaultValue = "createdAt") String sort,
            @RequestParam(defaultValue = "desc") String direction) {
        Page<PaymentResponseDto> transactions = transactionOperationsService.getTransactions(
                page, size, search, status, provider, startDate, endDate, sort, direction);
        return ResponseEntity.ok(ApiResponse.success("Transaction ledger retrieved successfully", transactions));
    }

    @GetMapping("/webhooks")
    public ResponseEntity<ApiResponse<Page<WebhookEventDto>>> getWebhooks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "ALL") String provider,
            @RequestParam(defaultValue = "ALL") String status,
            @RequestParam(defaultValue = "ALL") String eventType,
            @RequestParam(required = false) String search) {
        Page<WebhookEventDto> webhooks = transactionOperationsService.getWebhooks(
                page, size, provider, status, eventType, search);
        return ResponseEntity.ok(ApiResponse.success("Webhook event log retrieved successfully", webhooks));
    }

    @PostMapping("/webhooks/{id}/retry")
    public ResponseEntity<ApiResponse<WebhookEventDto>> retryWebhook(
            @AuthenticationPrincipal UserPrincipal adminUser,
            @PathVariable Long id) {
        log.info("Admin user #{} initiated retry for webhook event #{}", adminUser.getId(), id);
        WebhookEventDto retried = transactionOperationsService.retryWebhook(id, adminUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Webhook event processed successfully on retry", retried));
    }

    @PostMapping("/reconciliation/recover/{orderId}")
    public ResponseEntity<ApiResponse<PaymentResponseDto>> recoverReconciliation(
            @AuthenticationPrincipal UserPrincipal adminUser,
            @PathVariable Long orderId) {
        log.info("Admin user #{} initiated reconciliation recovery for Order #{}", adminUser.getId(), orderId);
        PaymentResponseDto payment = transactionOperationsService.recoverReconciliation(orderId, adminUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Reconciliation recovery succeeded. Entitlements provisioned.", payment));
    }
}
