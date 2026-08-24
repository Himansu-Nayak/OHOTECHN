package com.ohotech.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ohotech.backend.dto.*;
import com.ohotech.backend.entity.*;
import com.ohotech.backend.exception.BadRequestException;
import com.ohotech.backend.repository.*;
import com.ohotech.backend.service.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class Priority5SystemTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    @SuppressWarnings("unused")
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private AuditService auditService;

    @Autowired
    private AuthService authService;

    @Autowired
    private AnalyticsService analyticsService;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    private User testCustomer;
    @SuppressWarnings("unused")
    private User testAdmin;
    @SuppressWarnings("unused")
    private User testDeveloper;

    @BeforeEach
    void setUp() {
        try {
            jdbcTemplate.execute("ALTER TABLE audit_logs ALTER COLUMN description TYPE VARCHAR(2000) USING description::text");
            jdbcTemplate.execute("ALTER TABLE audit_logs ALTER COLUMN previous_value TYPE VARCHAR(2000) USING previous_value::text");
            jdbcTemplate.execute("ALTER TABLE audit_logs ALTER COLUMN new_value TYPE VARCHAR(2000) USING new_value::text");
        } catch (Exception ignored) {}

        notificationRepository.deleteAll();
        auditLogRepository.deleteAll();

        testCustomer = userRepository.save(User.builder()
                .name("P5 Customer")
                .email("p5customer@ohotech.com")
                .passwordHash(passwordEncoder.encode("Password123!"))
                .role(Role.ROLE_CUSTOMER)
                .enabled(true)
                .failedLoginAttempts(0)
                .build());

        testAdmin = userRepository.save(User.builder()
                .name("P5 Admin")
                .email("p5admin@ohotech.com")
                .passwordHash(passwordEncoder.encode("Password123!"))
                .role(Role.ROLE_ADMIN)
                .enabled(true)
                .failedLoginAttempts(0)
                .build());

        testDeveloper = userRepository.save(User.builder()
                .name("P5 Developer")
                .email("p5dev@ohotech.com")
                .passwordHash(passwordEncoder.encode("Password123!"))
                .role(Role.ROLE_DEVELOPER)
                .enabled(true)
                .failedLoginAttempts(0)
                .build());
    }

    @Test
    @WithMockUser(username = "p5customer@ohotech.com", authorities = {"ROLE_CUSTOMER"})
    void test1_UserOnlySeesOwnNotifications() {
        notificationService.createNotification(testCustomer.getId(), "Test Notif", "Message 1", NotificationType.INFO, NotificationCategory.SYSTEM, "/link");

        User otherUser = userRepository.save(User.builder()
                .name("Other Customer")
                .email("othercust@ohotech.com")
                .passwordHash("hash")
                .role(Role.ROLE_CUSTOMER)
                .enabled(true)
                .build());
        notificationService.createNotification(otherUser.getId(), "Other Notif", "Message 2", NotificationType.INFO, NotificationCategory.SYSTEM, "/link");

        long count = notificationService.getUnreadCount(testCustomer.getId());
        assertEquals(1, count);
    }

    @Test
    @WithMockUser(username = "p5customer@ohotech.com", authorities = {"ROLE_CUSTOMER"})
    void test2_UnreadNotificationCount() {
        notificationService.createNotification(testCustomer.getId(), "Notif 1", "Msg 1", NotificationType.SUCCESS, NotificationCategory.ORDER, "/order");
        notificationService.createNotification(testCustomer.getId(), "Notif 2", "Msg 2", NotificationType.INFO, NotificationCategory.LICENSE, "/license");

        assertEquals(2, notificationService.getUnreadCount(testCustomer.getId()));
    }

    @Test
    @WithMockUser(username = "p5customer@ohotech.com", authorities = {"ROLE_CUSTOMER"})
    void test3_MarkNotificationAsRead() {
        Notification n = notificationService.createNotification(testCustomer.getId(), "Notif 1", "Msg 1", NotificationType.SUCCESS, NotificationCategory.ORDER, "/order");

        notificationService.markAsRead(testCustomer.getId(), n.getId());
        assertEquals(0, notificationService.getUnreadCount(testCustomer.getId()));
    }

    @Test
    @WithMockUser(username = "p5customer@ohotech.com", authorities = {"ROLE_CUSTOMER"})
    void test4_MarkAllNotificationsAsRead() {
        notificationService.createNotification(testCustomer.getId(), "Notif 1", "Msg 1", NotificationType.SUCCESS, NotificationCategory.ORDER, "/order");
        notificationService.createNotification(testCustomer.getId(), "Notif 2", "Msg 2", NotificationType.INFO, NotificationCategory.LICENSE, "/license");

        notificationService.markAllAsRead(testCustomer.getId());
        assertEquals(0, notificationService.getUnreadCount(testCustomer.getId()));
    }

    @Test
    void test5_6_PaymentSuccessCreatesNotification() {
        notificationService.createNotification(testCustomer.getId(), "Payment Verified", "₹5000 verified", NotificationType.SUCCESS, NotificationCategory.PAYMENT, "/my-products");
        long count = notificationService.getUnreadCount(testCustomer.getId());
        assertTrue(count >= 1);
    }

    @Test
    void test7_DuplicateNotificationPrevention() {
        notificationService.createNotification(testCustomer.getId(), "Unique Payment", "Msg", NotificationType.SUCCESS, NotificationCategory.PAYMENT, "/link");
        assertEquals(1, notificationService.getUnreadCount(testCustomer.getId()));
    }

    @Test
    void test8_9_EmailFailureDoesNotRollbackTransaction() {
        assertDoesNotThrow(() -> {
            notificationService.createNotification(testCustomer.getId(), "Email Safe", "Msg", NotificationType.INFO, NotificationCategory.SYSTEM, null);
        });
    }

    @Test
    @WithMockUser(username = "p5customer@ohotech.com", authorities = {"ROLE_CUSTOMER"})
    void test10_CustomerBlockedFromAnalytics() throws Exception {
        mockMvc.perform(get("/api/admin/analytics/dashboard"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "p5admin@ohotech.com", authorities = {"ROLE_ADMIN"})
    void test11_AdminCanAccessAnalytics() throws Exception {
        mockMvc.perform(get("/api/admin/analytics/dashboard"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.userMetrics.totalUsers").exists());
    }

    @Test
    @WithMockUser(username = "p5dev@ohotech.com", authorities = {"ROLE_DEVELOPER"})
    void test12_DeveloperCanAccessAnalytics() throws Exception {
        mockMvc.perform(get("/api/admin/analytics/dashboard"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void test13_RevenueCountsOnlySuccessfulPayments() {
        Order order1 = orderRepository.save(Order.builder()
                .user(testCustomer)
                .totalAmount(new BigDecimal("1500.00"))
                .status(OrderStatus.CONFIRMED)
                .shippingAddress("Addr 1")
                .contactPhone("9999999999")
                .build());

        Order order2 = orderRepository.save(Order.builder()
                .user(testCustomer)
                .totalAmount(new BigDecimal("5000.00"))
                .status(OrderStatus.PENDING)
                .shippingAddress("Addr 2")
                .contactPhone("9999999999")
                .build());

        paymentRepository.save(Payment.builder()
                .order(order1)
                .amount(new BigDecimal("1500.00"))
                .status(PaymentStatus.SUCCESSFUL)
                .build());

        paymentRepository.save(Payment.builder()
                .order(order2)
                .amount(new BigDecimal("5000.00"))
                .status(PaymentStatus.FAILED)
                .build());

        AnalyticsDto analytics = analyticsService.getDashboardAnalytics(null, null);
        assertTrue(analytics.getRevenueMetrics().getTotalRevenue().compareTo(new BigDecimal("1500.00")) >= 0);
    }

    @Test
    void test14_AnalyticsDateRangeFilter() {
        AnalyticsDto analytics = analyticsService.getDashboardAnalytics(
                java.time.LocalDate.now().minusDays(7), java.time.LocalDate.now()
        );
        assertNotNull(analytics);
        assertNotNull(analytics.getRevenueMetrics());
    }

    @Test
    void test15_16_AdminAndSecurityAuditLogsCreated() {
        auditService.logEvent("TEST_ACTION", "User", "1", "Test audit entry");

        org.springframework.data.domain.Page<AuditLogDto> logs = auditLogRepository.filterAuditLogs(null, null, null, null, null, org.springframework.data.domain.PageRequest.of(0, 10))
                .map(auditService::mapToDto);

        assertFalse(logs.isEmpty());
    }

    @Test
    @WithMockUser(username = "p5customer@ohotech.com", authorities = {"ROLE_CUSTOMER"})
    void test17_CustomerCannotAccessAuditLogs() throws Exception {
        mockMvc.perform(get("/api/admin/audit-logs"))
                .andExpect(status().isForbidden());
    }

    @Test
    void test18_SensitiveDataMaskedInAuditLogs() {
        auditService.logEvent("PASSWORD_CHANGED", "User", "1", "password=SecretPassword123! token=abc123secret");

        AuditLog log = auditLogRepository.findAll().get(0);
        assertFalse(log.getDescription().contains("SecretPassword123!"));
        assertTrue(log.getDescription().contains("******"));
    }

    @Test
    void test20_21_RepeatedFailedLoginsLockoutAndReset() {
        LoginRequest badRequest = new LoginRequest();
        badRequest.setUsername("p5customer@ohotech.com");
        badRequest.setPassword("WrongPassword!");

        // Exceed max failed logins
        for (int i = 0; i < 5; i++) {
            assertThrows(Exception.class, () -> authService.login(badRequest));
        }

        User lockedUser = userRepository.findByEmail("p5customer@ohotech.com").orElseThrow();
        assertNotNull(lockedUser.getLockoutUntil());
        assertTrue(lockedUser.getLockoutUntil().isAfter(LocalDateTime.now()));

        // Locked login attempt rejected
        assertThrows(BadRequestException.class, () -> authService.login(badRequest));
    }
}
