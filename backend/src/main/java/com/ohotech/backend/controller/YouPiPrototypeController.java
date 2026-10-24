package com.ohotech.backend.controller;

import com.ohotech.backend.dto.ApiResponse;
import com.ohotech.backend.entity.OrderStatus;
import com.ohotech.backend.entity.Payment;
import com.ohotech.backend.entity.PaymentStatus;
import com.ohotech.backend.entity.WebhookEvent;
import com.ohotech.backend.entity.WebhookEventStatus;
import com.ohotech.backend.repository.OrderRepository;
import com.ohotech.backend.repository.PaymentRepository;
import com.ohotech.backend.repository.WebhookEventRepository;
import com.ohotech.backend.security.UserPrincipal;
import com.ohotech.backend.service.CartService;
import com.ohotech.backend.service.payment.YouPiPrototypeService;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments/youpi")
@RequiredArgsConstructor
public class YouPiPrototypeController {
    private final YouPiPrototypeService youPiService;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final WebhookEventRepository webhookEventRepository;
    private final CartService cartService;

    @PostMapping("/create-order")
    public ResponseEntity<ApiResponse<Map<String, Object>>> createOrder(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody Map<String, Long> request) {
        if (currentUser == null || request.get("orderId") == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Authentication and orderId are required."));
        }
        return ResponseEntity.ok(ApiResponse.success(
                "YouPI prototype payment session created",
                youPiService.createPayment(currentUser.getId(), request.get("orderId"))));
    }

    @PostMapping(value = "/webhook", consumes = "application/json")
    @Transactional
    public ResponseEntity<ApiResponse<String>> webhook(
            @RequestBody byte[] rawBody,
            @RequestHeader(value = "X-Gateway-Signature", required = false) String signature,
            @RequestHeader(value = "X-Gateway-Delivery-Id", required = false) String deliveryId,
            @RequestHeader(value = "X-Gateway-Event", required = false) String eventHeader) {
        try {
            if (signature == null || !signature.startsWith("sha256=")
                    || deliveryId == null || deliveryId.isBlank()) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Missing signature or delivery ID."));
            }
            byte[] expected = hmac(rawBody, youPiService.getWebhookSecretForVerification());
            byte[] supplied;
            try {
                supplied = HexFormat.of().parseHex(signature.substring("sha256=".length()));
            } catch (IllegalArgumentException ex) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Malformed webhook signature."));
            }
            if (!MessageDigest.isEqual(expected, supplied)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Invalid webhook signature."));
            }

            JSONObject event = new JSONObject(new String(rawBody, StandardCharsets.UTF_8));
            String eventType = event.optString("event", eventHeader == null ? "" : eventHeader);
            if (eventHeader != null && !eventHeader.isBlank() && !eventHeader.equalsIgnoreCase(eventType)) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Webhook event header does not match payload."));
            }
            String externalOrderId = event.optString("orderId", "");
            String paymentId = event.optString("paymentId", "");
            if (!externalOrderId.matches("OHO-[1-9][0-9]*") || paymentId.isBlank()) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Invalid OHO order mapping in webhook."));
            }
            long orderId = Long.parseLong(externalOrderId.substring(4));
            Order order = orderRepository.findById(orderId).orElse(null);
            if (order == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Order not found."));
            }
            Payment payment = paymentRepository.findByOrderId(orderId).orElse(null);
            if (payment == null || !"YOUPI_PG".equalsIgnoreCase(payment.getProvider())
                    || !paymentId.equals(payment.getYoupiPaymentId())) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(ApiResponse.error("Payment session does not match this order."));
            }

            BigDecimal webhookAmount = event.has("amountPaise")
                    ? BigDecimal.valueOf(event.optLong("amountPaise")).movePointLeft(2)
                    : new BigDecimal(event.optString("amount", "0"));
            if (webhookAmount.compareTo(order.getTotalAmount()) != 0
                    || !"INR".equalsIgnoreCase(event.optString("currency", "INR"))) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(ApiResponse.error("Webhook amount or currency mismatch."));
            }

            String rawText = new String(rawBody, StandardCharsets.UTF_8);
            WebhookEvent savedEvent = webhookEventRepository.save(WebhookEvent.builder()
                    .provider("YOUPI_PG")
                    .externalEventId(deliveryId)
                    .externalLeadId(externalOrderId)
                    .eventType(eventType)
                    .status(WebhookEventStatus.RECEIVED)
                    .payloadSummary(rawText.substring(0, Math.min(rawText.length(), 500)))
                    .build());

            if ("SUCCESS".equalsIgnoreCase(eventType)) {
                payment.setStatus(PaymentStatus.SUCCESSFUL);
                payment.setTransactionReference(event.optString("utr", null));
                payment.setVerifiedBy("YOUPI_PG_SIGNED_WEBHOOK");
                payment.setVerifiedAt(LocalDateTime.now());
                paymentRepository.save(payment);
                if (order.getStatus() != OrderStatus.PAID && order.getStatus() != OrderStatus.CONFIRMED) {
                    order.setStatus(OrderStatus.CONFIRMED);
                    orderRepository.save(order);
                    try { cartService.clearCart(order.getUser().getId()); } catch (Exception ignored) { }
                }
            } else if ("FAILED".equalsIgnoreCase(eventType) || "EXPIRED".equalsIgnoreCase(eventType)
                    || "CANCELLED".equalsIgnoreCase(eventType)) {
                if (payment.getStatus() != PaymentStatus.SUCCESSFUL) {
                    payment.setStatus(PaymentStatus.FAILED);
                    paymentRepository.save(payment);
                }
            } else {
                savedEvent.setStatus(WebhookEventStatus.FAILED);
                savedEvent.setErrorReason("Unsupported YouPI event type: " + eventType);
                webhookEventRepository.save(savedEvent);
                return ResponseEntity.badRequest().body(ApiResponse.error("Unsupported YouPI event type."));
            }

            savedEvent.setStatus(WebhookEventStatus.PROCESSED);
            savedEvent.setProcessedAt(LocalDateTime.now());
            webhookEventRepository.save(savedEvent);
            return ResponseEntity.ok(ApiResponse.success("YouPI webhook processed", "OK"));
        } catch (org.springframework.dao.DataIntegrityViolationException duplicate) {
            return ResponseEntity.ok(ApiResponse.success("Duplicate webhook acknowledged", "ALREADY_PROCESSED"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.error("Webhook rejected or could not be processed."));
        }
    }

    private static byte[] hmac(byte[] rawBody, String secret) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
        return mac.doFinal(rawBody);
    }
}
