package com.ohotech.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalyticsDto {

    private UserMetrics userMetrics;
    private RevenueMetrics revenueMetrics;
    private OrderMetrics orderMetrics;
    private SubscriptionMetrics subscriptionMetrics;
    private LicenseMetrics licenseMetrics;
    private ProductMetrics productMetrics;
    private PaymentMetrics paymentMetrics;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UserMetrics {
        private long totalUsers;
        private long totalCustomers;
        private long totalAdmins;
        private long newUsersToday;
        private long newUsersThisMonth;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RevenueMetrics {
        private BigDecimal totalRevenue;
        private BigDecimal revenueToday;
        private BigDecimal revenueThisMonth;
        private BigDecimal revenueThisYear;
        private BigDecimal filteredRevenue;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrderMetrics {
        private long totalOrders;
        private long confirmedOrders;
        private long pendingOrders;
        private long cancelledOrders;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SubscriptionMetrics {
        private long activeSubscriptions;
        private long trialSubscriptions;
        private long expiredSubscriptions;
        private long suspendedSubscriptions;
        private long expiringSoon;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LicenseMetrics {
        private long activeLicenses;
        private long expiredLicenses;
        private long revokedLicenses;
        private long suspendedLicenses;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ProductMetrics {
        private List<TopProductItem> mostPurchasedProducts;
        private long trialStarts;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TopProductItem {
        private Long id;
        private String name;
        private long salesCount;
        private BigDecimal revenue;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PaymentMetrics {
        private long successfulPayments;
        private long failedPayments;
    }
}
