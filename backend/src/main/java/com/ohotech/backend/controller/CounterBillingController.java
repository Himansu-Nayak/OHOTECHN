package com.ohotech.backend.controller;

import com.ohotech.backend.dto.ApiResponse;
import com.ohotech.backend.dto.CounterBillingReceiptDto;
import com.ohotech.backend.security.UserPrincipal;
import com.ohotech.backend.service.CounterBillingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/counter-billing")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
@Slf4j
public class CounterBillingController {

    private final CounterBillingService counterBillingService;

    @PostMapping("/cash")
    public ResponseEntity<ApiResponse<CounterBillingReceiptDto>> processCash(
            @AuthenticationPrincipal UserPrincipal adminUser,
            @RequestBody Map<String, Object> payload) {

        Long orderId = Long.valueOf(String.valueOf(payload.get("orderId")));
        BigDecimal cashTendered = new BigDecimal(String.valueOf(payload.get("cashTendered")));

        CounterBillingReceiptDto receipt = counterBillingService.processCashSale(adminUser.getId(), orderId, cashTendered);
        return ResponseEntity.ok(ApiResponse.success("Counter cash sale processed successfully.", receipt));
    }

    @PostMapping("/card")
    public ResponseEntity<ApiResponse<CounterBillingReceiptDto>> processCard(
            @AuthenticationPrincipal UserPrincipal adminUser,
            @RequestBody Map<String, Object> payload) {

        Long orderId = Long.valueOf(String.valueOf(payload.get("orderId")));
        String terminalRef = String.valueOf(payload.get("terminalRef"));
        String terminalId = payload.get("terminalId") != null ? String.valueOf(payload.get("terminalId")) : "TERM-POS-01";

        CounterBillingReceiptDto receipt = counterBillingService.processCardTerminalSale(
                adminUser.getId(), orderId, terminalRef, terminalId);
        return ResponseEntity.ok(ApiResponse.success("Counter card terminal sale processed successfully.", receipt));
    }

    @GetMapping("/terminal-summary")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSummary() {
        Map<String, Object> summary = counterBillingService.getTerminalSummary();
        return ResponseEntity.ok(ApiResponse.success("Counter terminal summary retrieved.", summary));
    }
}
