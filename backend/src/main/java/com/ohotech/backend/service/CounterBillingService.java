package com.ohotech.backend.service;

import com.ohotech.backend.dto.CounterBillingReceiptDto;
import com.ohotech.backend.entity.*;
import com.ohotech.backend.exception.BadRequestException;
import com.ohotech.backend.exception.ResourceNotFoundException;
import com.ohotech.backend.repository.OrderRepository;
import com.ohotech.backend.repository.PaymentRepository;
import com.ohotech.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class CounterBillingService {

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final PaymentService paymentService;
    private final AuditService auditService;

    @Transactional
    public CounterBillingReceiptDto processCashSale(Long cashierId, Long orderId, BigDecimal cashTendered) {
        User cashier = userRepository.findById(cashierId)
                .orElseThrow(() -> new ResourceNotFoundException("Cashier", "id", cashierId));

        Order order = orderRepository.findByIdWithLock(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        if (order.getStatus() == OrderStatus.PAID || order.getStatus() == OrderStatus.CONFIRMED) {
            throw new BadRequestException("Order #" + orderId + " is already paid.");
        }

        if (cashTendered == null || cashTendered.compareTo(order.getTotalAmount()) < 0) {
            throw new BadRequestException("Tendered cash (₹" + cashTendered + ") is less than order total (₹" + order.getTotalAmount() + ").");
        }

        BigDecimal changeDue = cashTendered.subtract(order.getTotalAmount());
        LocalDateTime now = LocalDateTime.now();

        Payment payment = paymentRepository.findByOrderId(orderId).orElseGet(() ->
                Payment.builder().order(order).amount(order.getTotalAmount()).build()
        );

        payment.setAmount(order.getTotalAmount());
        payment.setStatus(PaymentStatus.SUCCESSFUL);
        payment.setProvider("COUNTER_CASH");
        payment.setMethod("CASH");
        payment.setCurrency("INR");
        payment.setCashierUserId(cashierId);
        payment.setCashTendered(cashTendered);
        payment.setChangeReturned(changeDue);
        payment.setVerifiedBy(cashier.getName() + " (#" + cashierId + ")");
        payment.setVerifiedAt(now);
        payment = paymentRepository.saveAndFlush(payment);

        order.setStatus(OrderStatus.PAID);
        orderRepository.save(order);

        // Auto-provision entitlements
        paymentService.createEntitlementsForOrder(order);

        auditService.logUserEvent(cashier, "COUNTER_SALE_CASH", "Order", String.valueOf(orderId),
                "Cashier #" + cashierId + " completed cash sale for Order #" + orderId + ". Tendered: ₹" + cashTendered + ", Change: ₹" + changeDue);

        log.info("Counter cash sale completed for Order #{} by Cashier #{}", orderId, cashierId);

        return buildReceipt(payment, order, cashier);
    }

    @Transactional
    public CounterBillingReceiptDto processCardTerminalSale(Long cashierId, Long orderId, String terminalRef, String terminalId) {
        if (terminalRef == null || terminalRef.trim().isEmpty()) {
            throw new BadRequestException("Card terminal reference / approval code is required.");
        }

        User cashier = userRepository.findById(cashierId)
                .orElseThrow(() -> new ResourceNotFoundException("Cashier", "id", cashierId));

        Order order = orderRepository.findByIdWithLock(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        if (order.getStatus() == OrderStatus.PAID || order.getStatus() == OrderStatus.CONFIRMED) {
            throw new BadRequestException("Order #" + orderId + " is already paid.");
        }

        LocalDateTime now = LocalDateTime.now();

        Payment payment = paymentRepository.findByOrderId(orderId).orElseGet(() ->
                Payment.builder().order(order).amount(order.getTotalAmount()).build()
        );

        payment.setAmount(order.getTotalAmount());
        payment.setStatus(PaymentStatus.SUCCESSFUL);
        payment.setProvider("CARD_TERMINAL");
        payment.setMethod("CARD");
        payment.setCurrency("INR");
        payment.setCashierUserId(cashierId);
        payment.setCardTerminalRef(terminalRef.trim());
        payment.setCardTerminalId(terminalId != null ? terminalId.trim() : "POS-TERM-01");
        payment.setTransactionReference(terminalRef.trim());
        payment.setVerifiedBy(cashier.getName() + " (#" + cashierId + ")");
        payment.setVerifiedAt(now);
        payment = paymentRepository.saveAndFlush(payment);

        order.setStatus(OrderStatus.PAID);
        orderRepository.save(order);

        // Auto-provision entitlements
        paymentService.createEntitlementsForOrder(order);

        auditService.logUserEvent(cashier, "COUNTER_SALE_CARD", "Order", String.valueOf(orderId),
                "Cashier #" + cashierId + " completed card sale for Order #" + orderId + ". Terminal Ref: " + terminalRef);

        log.info("Counter card sale completed for Order #{} by Cashier #{} (Ref: {})", orderId, cashierId, terminalRef);

        return buildReceipt(payment, order, cashier);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getTerminalSummary() {
        List<Payment> payments = paymentRepository.findAll();
        BigDecimal cashTotal = BigDecimal.ZERO;
        BigDecimal cardTotal = BigDecimal.ZERO;
        int cashCount = 0;
        int cardCount = 0;

        for (Payment p : payments) {
            if (p.getStatus() == PaymentStatus.SUCCESSFUL) {
                if ("COUNTER_CASH".equalsIgnoreCase(p.getProvider())) {
                    cashTotal = cashTotal.add(p.getAmount());
                    cashCount++;
                } else if ("CARD_TERMINAL".equalsIgnoreCase(p.getProvider())) {
                    cardTotal = cardTotal.add(p.getAmount());
                    cardCount++;
                }
            }
        }

        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("cashTotal", cashTotal);
        summary.put("cashCount", cashCount);
        summary.put("cardTotal", cardTotal);
        summary.put("cardCount", cardCount);
        summary.put("grandTotal", cashTotal.add(cardTotal));
        summary.put("totalTransactions", cashCount + cardCount);
        return summary;
    }

    private CounterBillingReceiptDto buildReceipt(Payment payment, Order order, User cashier) {
        String customerName = order.getUser() != null ? order.getUser().getName() : "Counter Walk-in Customer";
        String customerEmail = order.getUser() != null ? order.getUser().getEmail() : "walkin@ohotechn.com";

        return CounterBillingReceiptDto.builder()
                .paymentId(payment.getId())
                .orderId(order.getId())
                .receiptNumber("RCP-" + order.getId() + "-" + payment.getId())
                .customerName(customerName)
                .customerEmail(customerEmail)
                .orderTotal(order.getTotalAmount())
                .paymentMethod(payment.getMethod())
                .cashTendered(payment.getCashTendered())
                .changeReturned(payment.getChangeReturned())
                .cardTerminalRef(payment.getCardTerminalRef())
                .cardTerminalId(payment.getCardTerminalId())
                .cashierId(cashier.getId())
                .cashierName(cashier.getName())
                .transactedAt(payment.getVerifiedAt())
                .status("SUCCESSFUL")
                .build();
    }
}
