package com.ohotech.backend.controller;

import com.ohotech.backend.dto.ApiResponse;
import com.ohotech.backend.entity.BankCreditAlert;
import com.ohotech.backend.entity.ObserverDevice;
import com.ohotech.backend.service.PaymentObservationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments/observers")
@RequiredArgsConstructor
@Slf4j
public class PaymentObserverController {

    private final PaymentObservationService observationService;

    @PostMapping("/alerts")
    public ResponseEntity<ApiResponse<Map<String, Object>>> ingestAlert(
            @RequestHeader(value = "X-Observer-Token", required = false) String token,
            @RequestBody Map<String, Object> payload) {

        ObserverDevice device = observationService.authenticateObserverDevice(token);

        BigDecimal amount = new BigDecimal(String.valueOf(payload.get("amount")));
        String rrn = payload.get("rrn") != null ? String.valueOf(payload.get("rrn")) : null;
        String payerUpi = payload.get("payerUpi") != null ? String.valueOf(payload.get("payerUpi")) : null;
        String rawMessage = payload.get("rawMessage") != null ? String.valueOf(payload.get("rawMessage")) : null;

        BankCreditAlert alert = observationService.ingestBankAlert(device, amount, rrn, payerUpi, rawMessage);

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("alertId", alert.getId());
        responseData.put("status", alert.getStatus());
        responseData.put("confidenceScore", alert.getConfidenceScore());
        if (alert.getMatchedPaymentId() != null) {
            responseData.put("matchedPaymentId", alert.getMatchedPaymentId());
        }

        return ResponseEntity.ok(ApiResponse.success("Bank credit alert processed", responseData));
    }

    @RequestMapping(value = "/heartbeat", method = {RequestMethod.GET, RequestMethod.POST})
    public ResponseEntity<ApiResponse<Map<String, Object>>> heartbeat(
            @RequestHeader(value = "X-Observer-Token", required = false) String token) {

        ObserverDevice device = observationService.authenticateObserverDevice(token);
        return ResponseEntity.ok(ApiResponse.success("Device heartbeat acknowledged", Map.of(
                "deviceId", device.getId(),
                "deviceName", device.getDeviceName(),
                "status", device.getStatus()
        )));
    }
}
