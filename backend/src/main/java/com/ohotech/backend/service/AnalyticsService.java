package com.ohotech.backend.service;

import com.ohotech.backend.dto.AnalyticsDto;
import com.ohotech.backend.entity.*;
import com.ohotech.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final LicenseRepository licenseRepository;
    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public AnalyticsDto getDashboardAnalytics(LocalDate startDate, LocalDate endDate) {
        LocalDateTime start = startDate != null ? startDate.atStartOfDay() : LocalDateTime.now().minusDays(30);
        LocalDateTime end = endDate != null ? endDate.atTime(LocalTime.MAX) : LocalDateTime.now();

        LocalDateTime todayStart = LocalDate.now().atStartOfDay();
        LocalDateTime monthStart = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        LocalDateTime yearStart = LocalDate.now().withDayOfYear(1).atStartOfDay();

        // 1. User Metrics
        long totalUsers = userRepository.count();
        long totalCustomers = userRepository.findAll().stream().filter(u -> u.getRole() == Role.ROLE_CUSTOMER).count();
        long totalAdmins = userRepository.findAll().stream().filter(u -> u.getRole() == Role.ROLE_ADMIN || u.getRole() == Role.ROLE_DEVELOPER).count();
        long newUsersToday = userRepository.findAll().stream().filter(u -> u.getCreatedAt() != null && u.getCreatedAt().isAfter(todayStart)).count();
        long newUsersThisMonth = userRepository.findAll().stream().filter(u -> u.getCreatedAt() != null && u.getCreatedAt().isAfter(monthStart)).count();

        AnalyticsDto.UserMetrics userMetrics = AnalyticsDto.UserMetrics.builder()
                .totalUsers(totalUsers)
                .totalCustomers(totalCustomers)
                .totalAdmins(totalAdmins)
                .newUsersToday(newUsersToday)
                .newUsersThisMonth(newUsersThisMonth)
                .build();

        // 2. Revenue Metrics (Verified successful payments only)
        List<Payment> successfulPaymentsList = paymentRepository.findAll().stream()
                .filter(p -> p.getStatus() == PaymentStatus.SUCCESSFUL)
                .toList();

        BigDecimal totalRevenue = successfulPaymentsList.stream()
                .map(p -> p.getAmount() != null ? p.getAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, (a, b) -> a.add(b));

        BigDecimal revenueToday = successfulPaymentsList.stream()
                .filter(p -> p.getCreatedAt() != null && p.getCreatedAt().isAfter(todayStart))
                .map(p -> p.getAmount() != null ? p.getAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, (a, b) -> a.add(b));

        BigDecimal revenueThisMonth = successfulPaymentsList.stream()
                .filter(p -> p.getCreatedAt() != null && p.getCreatedAt().isAfter(monthStart))
                .map(p -> p.getAmount() != null ? p.getAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, (a, b) -> a.add(b));

        BigDecimal revenueThisYear = successfulPaymentsList.stream()
                .filter(p -> p.getCreatedAt() != null && p.getCreatedAt().isAfter(yearStart))
                .map(p -> p.getAmount() != null ? p.getAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, (a, b) -> a.add(b));

        BigDecimal filteredRevenue = successfulPaymentsList.stream()
                .filter(p -> p.getCreatedAt() != null && !p.getCreatedAt().isBefore(start) && !p.getCreatedAt().isAfter(end))
                .map(p -> p.getAmount() != null ? p.getAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, (a, b) -> a.add(b));

        List<Payment> allPayments = paymentRepository.findAll();

        BigDecimal pendingPaymentsTotal = allPayments.stream()
                .filter(p -> p.getStatus() == PaymentStatus.PENDING)
                .map(p -> p.getAmount() != null ? p.getAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal refundsTotal = allPayments.stream()
                .filter(p -> p.getStatus() == PaymentStatus.REFUNDED)
                .map(p -> p.getAmount() != null ? p.getAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Real Provider Wholesale Cost Liability from completed paid orders
        BigDecimal totalProviderCost = BigDecimal.ZERO;
        for (Payment p : successfulPaymentsList) {
            Order ord = p.getOrder();
            if (ord != null && ord.getItems() != null) {
                for (OrderItem item : ord.getItems()) {
                    if (item.getProduct() != null && item.getProduct().getProviderCost() != null) {
                        int qty = item.getQuantity() != null && item.getQuantity() > 0 ? item.getQuantity() : 1;
                        totalProviderCost = totalProviderCost.add(item.getProduct().getProviderCost().multiply(BigDecimal.valueOf(qty)));
                    }
                }
            }
        }

        BigDecimal grossMargin = totalRevenue.subtract(totalProviderCost);
        BigDecimal netRevenue = totalRevenue.subtract(refundsTotal);

        AnalyticsDto.RevenueMetrics revenueMetrics = AnalyticsDto.RevenueMetrics.builder()
                .totalRevenue(totalRevenue)
                .revenueToday(revenueToday)
                .revenueThisMonth(revenueThisMonth)
                .revenueThisYear(revenueThisYear)
                .filteredRevenue(filteredRevenue)
                .customerRevenue(totalRevenue)
                .providerCost(totalProviderCost)
                .grossMargin(grossMargin)
                .refunds(refundsTotal)
                .netRevenue(netRevenue)
                .pendingPayments(pendingPaymentsTotal)
                .completedPayments(totalRevenue)
                .build();

        // 3. Order Metrics
        List<Order> orders = orderRepository.findAll();
        long totalOrders = orders.size();
        long confirmedOrders = orders.stream().filter(o -> o.getStatus() == OrderStatus.CONFIRMED || o.getStatus() == OrderStatus.PAID || o.getStatus() == OrderStatus.DELIVERED).count();
        long pendingOrders = orders.stream().filter(o -> o.getStatus() == OrderStatus.PENDING).count();
        long cancelledOrders = orders.stream().filter(o -> o.getStatus() == OrderStatus.CANCELLED).count();

        AnalyticsDto.OrderMetrics orderMetrics = AnalyticsDto.OrderMetrics.builder()
                .totalOrders(totalOrders)
                .confirmedOrders(confirmedOrders)
                .pendingOrders(pendingOrders)
                .cancelledOrders(cancelledOrders)
                .build();

        // 4. Subscription Metrics
        List<Subscription> subs = subscriptionRepository.findAll();
        long activeSubs = subs.stream().filter(s -> s.getStatus() == SubscriptionStatus.ACTIVE).count();
        long trialSubs = subs.stream().filter(s -> s.getStatus() == SubscriptionStatus.TRIAL).count();
        long expiredSubs = subs.stream().filter(s -> s.getStatus() == SubscriptionStatus.EXPIRED).count();
        long suspendedSubs = subs.stream().filter(s -> s.getStatus() == SubscriptionStatus.SUSPENDED).count();
        long expiringSoon = subs.stream().filter(s -> s.getExpiryDate() != null && s.getExpiryDate().isAfter(LocalDateTime.now()) && s.getExpiryDate().isBefore(LocalDateTime.now().plusDays(7))).count();

        AnalyticsDto.SubscriptionMetrics subscriptionMetrics = AnalyticsDto.SubscriptionMetrics.builder()
                .activeSubscriptions(activeSubs)
                .trialSubscriptions(trialSubs)
                .expiredSubscriptions(expiredSubs)
                .suspendedSubscriptions(suspendedSubs)
                .expiringSoon(expiringSoon)
                .build();

        // 5. License Metrics
        List<License> licenses = licenseRepository.findAll();
        long activeLic = licenses.stream().filter(l -> l.getStatus() == LicenseStatus.ACTIVE).count();
        long expiredLic = licenses.stream().filter(l -> l.getStatus() == LicenseStatus.EXPIRED).count();
        long revokedLic = licenses.stream().filter(l -> l.getStatus() == LicenseStatus.REVOKED).count();
        long suspendedLic = licenses.stream().filter(l -> l.getStatus() == LicenseStatus.SUSPENDED).count();

        AnalyticsDto.LicenseMetrics licenseMetrics = AnalyticsDto.LicenseMetrics.builder()
                .activeLicenses(activeLic)
                .expiredLicenses(expiredLic)
                .revokedLicenses(revokedLic)
                .suspendedLicenses(suspendedLic)
                .build();

        // 6. Product Metrics
        List<Product> products = productRepository.findAll();
        List<AnalyticsDto.TopProductItem> topProducts = new ArrayList<>();

        for (Product p : products) {
            long sales = subs.stream().filter(s -> s.getProduct() != null && s.getProduct().getId().equals(p.getId())).count();
            BigDecimal prodRev = successfulPaymentsList.stream()
                    .filter(pay -> pay.getOrder() != null && pay.getOrder().getItems() != null && pay.getOrder().getItems().stream().anyMatch(item -> item.getProduct().getId().equals(p.getId())))
                    .map(pay -> pay.getAmount() != null ? pay.getAmount() : BigDecimal.ZERO)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            if (sales > 0 || prodRev.compareTo(BigDecimal.ZERO) > 0) {
                topProducts.add(AnalyticsDto.TopProductItem.builder()
                        .id(p.getId())
                        .name(p.getName())
                        .salesCount(sales)
                        .revenue(prodRev)
                        .build());
            }
        }

        AnalyticsDto.ProductMetrics productMetrics = AnalyticsDto.ProductMetrics.builder()
                .mostPurchasedProducts(topProducts)
                .trialStarts(trialSubs)
                .build();

        // 7. Payment Metrics
        long successfulPayments = successfulPaymentsList.size();
        long failedPayments = allPayments.stream().filter(p -> p.getStatus() == PaymentStatus.FAILED).count();

        AnalyticsDto.PaymentMetrics paymentMetrics = AnalyticsDto.PaymentMetrics.builder()
                .successfulPayments(successfulPayments)
                .failedPayments(failedPayments)
                .build();

        return AnalyticsDto.builder()
                .userMetrics(userMetrics)
                .revenueMetrics(revenueMetrics)
                .orderMetrics(orderMetrics)
                .subscriptionMetrics(subscriptionMetrics)
                .licenseMetrics(licenseMetrics)
                .productMetrics(productMetrics)
                .paymentMetrics(paymentMetrics)
                .build();
    }
}
