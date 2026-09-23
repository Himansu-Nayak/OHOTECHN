package com.ohotech.backend.controller;

import com.ohotech.backend.dto.ApiResponse;
import com.ohotech.backend.entity.Order;
import com.ohotech.backend.entity.OrderStatus;
import com.ohotech.backend.entity.Payment;
import com.ohotech.backend.entity.PaymentStatus;
import com.ohotech.backend.repository.OrderRepository;
import com.ohotech.backend.repository.PaymentRepository;
import com.ohotech.backend.service.CartService;
import com.ohotech.backend.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

        try {
            JSONObject event = new JSONObject(rawPayload);
            String eventType = event.optString("event");
            logger.info("Processing verified Razorpay webhook event: {}", eventType);

            if ("payment.captured".equals(eventType) || "order.paid".equals(eventType)) {
                JSONObject payloadObj = event.optJSONObject("payload");
                if (payloadObj != null) {
                    JSONObject paymentObj = payloadObj.optJSONObject("payment");
                    JSONObject entity = paymentObj != null ? paymentObj.optJSONObject("entity") : null;

                    if (entity != null) {
                        String razorpayOrderId = entity.optString("order_id");
                        String razorpayPaymentId = entity.optString("id");

                        if (!razorpayOrderId.isBlank()) {
                            Optional<Payment> paymentOpt = paymentRepository.findByRazorpayOrderId(razorpayOrderId);
                            if (paymentOpt.isPresent()) {
                                Payment payment = paymentOpt.get();
                                Order order = payment.getOrder();

                                // Idempotent check
                                if (payment.getStatus() != PaymentStatus.SUCCESSFUL) {
                                    payment.setRazorpayPaymentId(razorpayPaymentId);
                                    payment.setStatus(PaymentStatus.SUCCESSFUL);
                                    paymentRepository.save(payment);

                                    if (order != null) {
                                        order.setStatus(OrderStatus.PAID);
                                        orderRepository.save(order);
                                        paymentService.createEntitlementsForOrder(order);

                                        if (order.getUser() != null) {
                                            cartService.clearCart(order.getUser().getId());
                                        }
                                        logger.info("Webhook successfully verified and activated Order #{}", order.getId());
                                    }
                                }
                            }
                        }
                    }
                }
            }

            return ResponseEntity.ok(ApiResponse.success("Webhook processed successfully", "OK"));
        } catch (Exception e) {
            logger.error("Error processing webhook payload: {}", e.getMessage(), e);
            return ResponseEntity.ok(ApiResponse.success("Webhook received with processing notes", "ACK"));
        }
    }
}
