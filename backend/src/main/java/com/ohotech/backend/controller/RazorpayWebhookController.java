package com.ohotech.backend.controller;

import com.ohotech.backend.dto.ApiResponse;
import com.ohotech.backend.entity.Order;
import com.ohotech.backend.entity.OrderStatus;
import com.ohotech.backend.entity.Payment;
import com.ohotech.backend.entity.PaymentStatus;
import com.ohotech.backend.entity.WebhookEvent;
import com.ohotech.backend.entity.WebhookEventStatus;
import com.ohotech.backend.repository.OrderRepository;
import com.ohotech.backend.repository.PaymentRepository;
import com.ohotech.backend.repository.WebhookEventRepository;
import com.ohotech.backend.service.AuditService;
import com.ohotech.backend.service.CartService;
import com.ohotech.backend.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class RazorpayWebhookController {

    private static final Logger logger = LoggerFactory.getLogger(RazorpayWebhookController.class);

    private final PaymentService paymentService;
    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final CartService cartService;
    private final WebhookEventRepository webhookEventRepository;
    private final AuditService auditService;

    @PostMapping("/webhook")
    public ResponseEntity<ApiResponse<String>> handleRazorpayWebhook(
            @RequestBody String rawPayload,
            @RequestHeader(value = "X-Razorpay-Signature", required = false) String signature) {

        if (signature == null || signature.isBlank()) {
            logger.warn("Received Razorpay webhook without X-Razorpay-Signature header");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Missing webhook signature"));
        }

        boolean isValid = paymentService.verifyWebhookSignature(rawPayload, signature);
        if (!isValid) {
            logger.error("Invalid Razorpay webhook signature");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Invalid webhook signature"));
        }

        WebhookEvent webhookEvent = null;
        try {
            JSONObject event = new JSONObject(rawPayload);
            String eventType = event.optString("event");
            String eventId = event.optString("id", "rzp_evt_" + System.currentTimeMillis());
            logger.info("Processing verified Razorpay webhook event: {} (id: {})", eventType, eventId);

            // 1. Deduplication check against persistent durable database record
            Optional<WebhookEvent> existingOpt = webhookEventRepository.findByProviderAndExternalEventId("RAZORPAY", eventId);
            if (existingOpt.isPresent()) {
                WebhookEvent existing = existingOpt.get();
                if (existing.getStatus() == WebhookEventStatus.PROCESSED) {
                    logger.warn("Duplicate Razorpay webhook event already processed: {}", eventId);
                    return ResponseEntity.ok(ApiResponse.success("Duplicate webhook event acknowledged", "ALREADY_PROCESSED"));
                }
                webhookEvent = existing;
                webhookEvent.setAttemptCount((webhookEvent.getAttemptCount() != null ? webhookEvent.getAttemptCount() : 1) + 1);
                webhookEvent.setStatus(WebhookEventStatus.PROCESSING);
                webhookEvent = webhookEventRepository.save(webhookEvent);
            } else {
                try {
                    webhookEvent = WebhookEvent.builder()
                            .provider("RAZORPAY")
                            .externalEventId(eventId)
                            .eventType(eventType)
                            .status(WebhookEventStatus.PROCESSING)
                            .attemptCount(1)
                            .payloadSummary(rawPayload.length() > 500 ? rawPayload.substring(0, 500) + "..." : rawPayload)
                            .build();
                    webhookEvent = webhookEventRepository.save(webhookEvent);
                } catch (DataIntegrityViolationException dive) {
                    // Concurrent identical event delivery caught by unique constraint
                    logger.warn("Concurrent duplicate webhook delivery caught by DB constraint for event: {}", eventId);
                    return ResponseEntity.ok(ApiResponse.success("Duplicate webhook event acknowledged", "ALREADY_PROCESSED"));
                }
            }

            // 2. Execute authoritative event state transition
            executeEventProcessing(webhookEvent, event);

            // 3. Mark processed upon safe completion
            webhookEvent.setStatus(WebhookEventStatus.PROCESSED);
            webhookEvent.setProcessedAt(LocalDateTime.now());
            webhookEvent.setErrorReason(null);
            webhookEventRepository.save(webhookEvent);

            auditService.logEvent("WEBHOOK_PROCESSED", "WebhookEvent", String.valueOf(webhookEvent.getId()),
                    "Processed Razorpay webhook event: " + eventType + " [" + eventId + "]");

            return ResponseEntity.ok(ApiResponse.success("Webhook processed successfully", "OK"));
        } catch (Exception e) {
            logger.error("Error processing webhook payload: {}", e.getMessage(), e);
            if (webhookEvent != null && webhookEvent.getId() != null) {
                try {
                    webhookEvent.setStatus(WebhookEventStatus.FAILED);
                    String msg = e.getMessage() != null ? e.getMessage() : "Unknown processing error";
                    webhookEvent.setErrorReason(msg.length() > 255 ? msg.substring(0, 255) : msg);
                    webhookEventRepository.save(webhookEvent);
                } catch (Exception ignored) {}
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Webhook processing error: " + e.getMessage()));
        }
    }

    @Transactional
    public void executeEventProcessing(WebhookEvent webhookEvent, JSONObject event) {
        String eventType = event.optString("event");

        if ("payment.captured".equals(eventType) || "order.paid".equals(eventType)) {
            JSONObject payloadObj = event.optJSONObject("payload");
            if (payloadObj != null) {
                JSONObject paymentObj = payloadObj.optJSONObject("payment");
                JSONObject entity = paymentObj != null ? paymentObj.optJSONObject("entity") : null;

                if (entity != null) {
                    String razorpayOrderId = entity.optString("order_id");
                    String razorpayPaymentId = entity.optString("id");

                    if (!razorpayOrderId.isBlank()) {
                        // Pessimistic DB lock on payment ensures cluster-wide concurrency protection
                        Optional<Payment> paymentOpt = paymentRepository.findByRazorpayOrderIdWithLock(razorpayOrderId);
                        if (paymentOpt.isPresent()) {
                            Payment payment = paymentOpt.get();
                            Order order = payment.getOrder();

                            // Idempotent state check
                            if (payment.getStatus() != PaymentStatus.SUCCESSFUL) {
                                payment.setRazorpayPaymentId(razorpayPaymentId);
                                payment.setStatus(PaymentStatus.SUCCESSFUL);
                                payment.setVerifiedAt(LocalDateTime.now());
                                paymentRepository.save(payment);

                                if (order != null) {
                                    order.setStatus(OrderStatus.PAID);
                                    orderRepository.save(order);

                                    // Automated instant entitlement provisioning
                                    paymentService.createEntitlementsForOrder(order);

                                    if (order.getUser() != null) {
                                        cartService.clearCart(order.getUser().getId());
                                    }
                                    logger.info("Webhook captured payment for Order #{}. Entitlements provisioned.", order.getId());
                                }
                            }
                        } else {
                            logger.warn("Received webhook for unknown Razorpay order: {}", razorpayOrderId);
                        }
                    }
                }
            }
        } else if ("payment.failed".equals(eventType)) {
            JSONObject payloadObj = event.optJSONObject("payload");
            if (payloadObj != null) {
                JSONObject paymentObj = payloadObj.optJSONObject("payment");
                JSONObject entity = paymentObj != null ? paymentObj.optJSONObject("entity") : null;
                if (entity != null) {
                    String razorpayOrderId = entity.optString("order_id");
                    String failureReason = entity.optString("error_description", "Payment failed at gateway");
                    if (!razorpayOrderId.isBlank()) {
                        Optional<Payment> paymentOpt = paymentRepository.findByRazorpayOrderIdWithLock(razorpayOrderId);
                        if (paymentOpt.isPresent()) {
                            Payment payment = paymentOpt.get();
                            Order order = payment.getOrder();
                            // Safe handling of delayed/out-of-order events: cannot regress terminal SUCCESSFUL state
                            if (payment.getStatus() != PaymentStatus.SUCCESSFUL && (order == null || order.getStatus() != OrderStatus.PAID)) {
                                payment.setStatus(PaymentStatus.FAILED);
                                payment.setFailureReason(failureReason);
                                paymentRepository.save(payment);
                                logger.info("Recorded payment failure for Order #{} from webhook: {}", order != null ? order.getId() : "N/A", failureReason);
                            } else {
                                logger.warn("Ignored delayed payment.failed event for already-paid order #{}", order != null ? order.getId() : "N/A");
                            }
                        }
                    }
                }
            }
        }
    }
}
