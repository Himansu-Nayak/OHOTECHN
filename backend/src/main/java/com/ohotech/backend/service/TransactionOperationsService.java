package com.ohotech.backend.service;

import com.ohotech.backend.dto.PaymentResponseDto;
import com.ohotech.backend.dto.TransactionOverviewDto;
import com.ohotech.backend.dto.WebhookEventDto;
import com.ohotech.backend.entity.*;
import com.ohotech.backend.exception.BadRequestException;
import com.ohotech.backend.exception.ResourceNotFoundException;
import com.ohotech.backend.repository.*;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionOperationsService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final WebhookEventRepository webhookEventRepository;
    private final UserRepository userRepository;
    private final PaymentService paymentService;
    private final AuditService auditService;
    private final com.ohotech.backend.controller.RazorpayWebhookController razorpayWebhookController;

    @Transactional(readOnly = true)
    public TransactionOverviewDto getTransactionOverview(String period, LocalDateTime customStart, LocalDateTime customEnd) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime periodStart = null;
        LocalDateTime periodEnd = now;
        String normalizedPeriod = (period != null ? period.trim().toUpperCase() : "ALL");

        switch (normalizedPeriod) {
            case "24H":
                periodStart = now.minusHours(24);
                break;
            case "7D":
                periodStart = now.minusDays(7);
                break;
            case "30D":
                periodStart = now.minusDays(30);
                break;
            case "CUSTOM":
                periodStart = customStart;
                periodEnd = (customEnd != null ? customEnd : now);
                break;
            case "ALL":
            default:
                normalizedPeriod = "ALL";
                periodStart = null;
                periodEnd = null;
                break;
        }

        long totalCount = paymentRepository.countTotalInPeriod(periodStart, periodEnd);
        BigDecimal totalVolume = paymentRepository.sumSuccessfulAmountInPeriod(periodStart, periodEnd);

        long successCount = paymentRepository.countByStatusInPeriod(PaymentStatus.SUCCESSFUL, periodStart, periodEnd);
        BigDecimal successAmount = paymentRepository.sumByStatusInPeriod(PaymentStatus.SUCCESSFUL, periodStart, periodEnd);

        long pendingCount = paymentRepository.countByStatusInPeriod(PaymentStatus.PENDING, periodStart, periodEnd);
        BigDecimal pendingAmount = paymentRepository.sumByStatusInPeriod(PaymentStatus.PENDING, periodStart, periodEnd);

        long failedCount = paymentRepository.countByStatusInPeriod(PaymentStatus.FAILED, periodStart, periodEnd);
        BigDecimal failedAmount = paymentRepository.sumByStatusInPeriod(PaymentStatus.FAILED, periodStart, periodEnd);

        long refundedCount = paymentRepository.countByStatusInPeriod(PaymentStatus.REFUNDED, periodStart, periodEnd);
        BigDecimal refundedAmount = paymentRepository.sumByStatusInPeriod(PaymentStatus.REFUNDED, periodStart, periodEnd);

        // Operational integrity metrics
        var reconciliationReport = paymentService.generateReconciliationReport();
        long reconciliationDiscrepancies = reconciliationReport.getAnomalyCount();
        long webhookFailures = webhookEventRepository.countByStatus(WebhookEventStatus.FAILED);
        long entitlementFailures = reconciliationReport.getAnomalies() != null ?
                reconciliationReport.getAnomalies().stream().filter(a -> "MISSING_ENTITLEMENT".equalsIgnoreCase(a.getAnomalyType())).count() : 0;

        return TransactionOverviewDto.builder()
                .generatedAt(now)
                .period(normalizedPeriod)
                .periodStart(periodStart)
                .periodEnd(periodEnd)
                .totalTransactions(totalCount)
                .totalVolume(totalVolume)
                .successfulCount(successCount)
                .successfulAmount(successAmount)
                .pendingCount(pendingCount)
                .pendingAmount(pendingAmount)
                .failedCount(failedCount)
                .failedAmount(failedAmount)
                .refundedCount(refundedCount)
                .refundedAmount(refundedAmount)
                .reconciliationDiscrepancies(reconciliationDiscrepancies)
                .webhookFailures(webhookFailures)
                .entitlementFailures(entitlementFailures)
                .build();
    }

    @Transactional(readOnly = true)
    public Page<PaymentResponseDto> getTransactions(
            int page,
            int size,
            String search,
            String status,
            String provider,
            LocalDateTime startDate,
            LocalDateTime endDate,
            String sortProperty,
            String sortDirection) {

        int validPage = Math.max(0, page);
        int validSize = Math.min(100, Math.max(1, size));

        Sort.Direction direction = "asc".equalsIgnoreCase(sortDirection) ? Sort.Direction.ASC : Sort.Direction.DESC;
        String property = (sortProperty != null && !sortProperty.isBlank()) ? sortProperty.trim() : "createdAt";
        Pageable pageable = PageRequest.of(validPage, validSize, Sort.by(direction, property));

        Specification<Payment> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Search filter
            if (search != null && !search.trim().isEmpty()) {
                String searchTrim = search.trim();
                String searchLike = "%" + searchTrim.toLowerCase() + "%";

                List<Predicate> searchPredicates = new ArrayList<>();

                // If numeric, search ID and order.id
                try {
                    Long num = Long.parseLong(searchTrim);
                    searchPredicates.add(cb.equal(root.get("id"), num));
                    Join<Payment, Order> orderJoin = root.join("order", JoinType.LEFT);
                    searchPredicates.add(cb.equal(orderJoin.get("id"), num));
                } catch (NumberFormatException ignored) {}

                // String fields on Payment
                searchPredicates.add(cb.like(cb.lower(root.get("transactionReference")), searchLike));
                searchPredicates.add(cb.like(cb.lower(root.get("payerUpiId")), searchLike));
                searchPredicates.add(cb.like(cb.lower(root.get("payerName")), searchLike));
                searchPredicates.add(cb.like(cb.lower(root.get("razorpayPaymentId")), searchLike));
                searchPredicates.add(cb.like(cb.lower(root.get("razorpayOrderId")), searchLike));

                // Customer user fields
                Join<Payment, Order> orderJoin = root.join("order", JoinType.LEFT);
                Join<Order, User> userJoin = orderJoin.join("user", JoinType.LEFT);
                searchPredicates.add(cb.like(cb.lower(userJoin.get("name")), searchLike));
                searchPredicates.add(cb.like(cb.lower(userJoin.get("email")), searchLike));

                predicates.add(cb.or(searchPredicates.toArray(new Predicate[0])));
            }

            // Status filter
            if (status != null && !status.trim().isEmpty() && !"ALL".equalsIgnoreCase(status.trim())) {
                try {
                    PaymentStatus ps = PaymentStatus.valueOf(status.trim().toUpperCase());
                    predicates.add(cb.equal(root.get("status"), ps));
                } catch (IllegalArgumentException ignored) {}
            }

            // Provider filter
            if (provider != null && !provider.trim().isEmpty() && !"ALL".equalsIgnoreCase(provider.trim())) {
                predicates.add(cb.equal(cb.upper(root.get("provider")), provider.trim().toUpperCase()));
            }

            // Date Range
            if (startDate != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("createdAt"), startDate));
            }
            if (endDate != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("createdAt"), endDate));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Payment> paymentPage = paymentRepository.findAll(spec, pageable);
        return paymentPage.map(paymentService::mapPaymentToDto);
    }

    @Transactional(readOnly = true)
    public Page<WebhookEventDto> getWebhooks(
            int page,
            int size,
            String provider,
            String status,
            String eventType,
            String search) {

        int validPage = Math.max(0, page);
        int validSize = Math.min(100, Math.max(1, size));
        Pageable pageable = PageRequest.of(validPage, validSize, Sort.by(Sort.Direction.DESC, "receivedAt"));

        Specification<WebhookEvent> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (provider != null && !provider.trim().isEmpty() && !"ALL".equalsIgnoreCase(provider.trim())) {
                predicates.add(cb.equal(cb.upper(root.get("provider")), provider.trim().toUpperCase()));
            }

            if (status != null && !status.trim().isEmpty() && !"ALL".equalsIgnoreCase(status.trim())) {
                try {
                    WebhookEventStatus st = WebhookEventStatus.valueOf(status.trim().toUpperCase());
                    predicates.add(cb.equal(root.get("status"), st));
                } catch (IllegalArgumentException ignored) {}
            }

            if (eventType != null && !eventType.trim().isEmpty() && !"ALL".equalsIgnoreCase(eventType.trim())) {
                predicates.add(cb.equal(root.get("eventType"), eventType.trim()));
            }

            if (search != null && !search.trim().isEmpty()) {
                String searchLike = "%" + search.trim().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("externalEventId")), searchLike),
                        cb.like(cb.lower(root.get("payloadSummary")), searchLike)
                ));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<WebhookEvent> eventPage = webhookEventRepository.findAll(spec, pageable);
        return eventPage.map(this::mapWebhookToDto);
    }

    @Transactional
    public WebhookEventDto retryWebhook(Long webhookEventId, Long adminUserId) {
        WebhookEvent webhookEvent = webhookEventRepository.findById(webhookEventId)
                .orElseThrow(() -> new ResourceNotFoundException("WebhookEvent", "id", webhookEventId));

        User adminUser = userRepository.findById(adminUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin User", "id", adminUserId));

        webhookEvent.setAttemptCount((webhookEvent.getAttemptCount() != null ? webhookEvent.getAttemptCount() : 1) + 1);
        webhookEvent.setStatus(WebhookEventStatus.PROCESSING);
        webhookEvent = webhookEventRepository.save(webhookEvent);

        try {
            if ("RAZORPAY".equalsIgnoreCase(webhookEvent.getProvider())) {
                if (webhookEvent.getPayloadSummary() != null && webhookEvent.getPayloadSummary().startsWith("{")) {
                    JSONObject payloadJson = new JSONObject(webhookEvent.getPayloadSummary());
                    razorpayWebhookController.executeEventProcessing(webhookEvent, payloadJson);
                }
            }

            webhookEvent.setStatus(WebhookEventStatus.PROCESSED);
            webhookEvent.setProcessedAt(LocalDateTime.now());
            webhookEvent.setErrorReason(null);
            webhookEvent = webhookEventRepository.save(webhookEvent);

            auditService.logUserEvent(adminUser, "WEBHOOK_RETRY_SUCCESS", "WebhookEvent", String.valueOf(webhookEventId),
                    "Admin #" + adminUserId + " successfully retried webhook event #" + webhookEventId + " [" + webhookEvent.getExternalEventId() + "]");

            return mapWebhookToDto(webhookEvent);
        } catch (Exception e) {
            log.error("Retry execution failed for webhook event #{}: {}", webhookEventId, e.getMessage());
            webhookEvent.setStatus(WebhookEventStatus.FAILED);
            webhookEvent.setErrorReason("Retry failure: " + e.getMessage());
            webhookEvent = webhookEventRepository.save(webhookEvent);

            auditService.logUserEvent(adminUser, "WEBHOOK_RETRY_FAILED", "WebhookEvent", String.valueOf(webhookEventId),
                    "Admin #" + adminUserId + " retried webhook event #" + webhookEventId + " but it failed: " + e.getMessage());

            throw new BadRequestException("Webhook retry failed: " + e.getMessage());
        }
    }

    @Transactional
    public PaymentResponseDto recoverReconciliation(Long orderId, Long adminUserId) {
        Order order = orderRepository.findByIdWithLock(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        User adminUser = userRepository.findById(adminUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin User", "id", adminUserId));

        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new BadRequestException("No payment found associated with order #" + orderId));

        if (order.getStatus() != OrderStatus.PAID || payment.getStatus() != PaymentStatus.SUCCESSFUL) {
            throw new BadRequestException("Cannot recover entitlements: Order #" + orderId +
                    " payment status is " + payment.getStatus() + " and order status is " + order.getStatus() +
                    ". Both must be verified as PAID/SUCCESSFUL.");
        }

        // Idempotently trigger automated entitlement provisioning
        paymentService.createEntitlementsForOrder(order);

        auditService.logUserEvent(adminUser, "RECONCILIATION_RECOVERY", "Order", String.valueOf(orderId),
                "Admin #" + adminUserId + " executed reconciliation recovery for Order #" + orderId +
                ". Subscriptions and licenses provisioned.");

        return paymentService.mapPaymentToDto(payment);
    }

    public WebhookEventDto mapWebhookToDto(WebhookEvent event) {
        return WebhookEventDto.builder()
                .id(event.getId())
                .provider(event.getProvider())
                .externalEventId(event.getExternalEventId())
                .externalLeadId(event.getExternalLeadId())
                .eventType(event.getEventType())
                .receivedAt(event.getReceivedAt())
                .status(event.getStatus())
                .attemptCount(event.getAttemptCount())
                .processedAt(event.getProcessedAt())
                .errorReason(event.getErrorReason())
                .payloadSummary(event.getPayloadSummary())
                .build();
    }
}
