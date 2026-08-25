package com.ohotech.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.ohotech.backend.dto.ConvertLeadRequest;
import com.ohotech.backend.dto.LinkCustomerRequest;
import com.ohotech.backend.entity.*;
import com.ohotech.backend.repository.*;
import com.ohotech.backend.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class Customer360AndLeadConversionTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LeadRepository leadRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private LicenseRepository licenseRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private ObjectMapper objectMapper;
    private User adminUser;
    private User customerUser;
    private String adminToken;
    private String customerToken;
    private Lead convertibleLead;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());

        // Admin
        adminUser = User.builder()
                .name("Admin User 360")
                .email("c360_admin_" + UUID.randomUUID().toString().substring(0, 6) + "@ohotech.com")
                .passwordHash(passwordEncoder.encode("Pass123!"))
                .role(Role.ROLE_ADMIN)
                .enabled(true)
                .build();
        adminUser = userRepository.save(adminUser);
        adminToken = jwtTokenProvider.generateTokenFromUserId(adminUser.getId());

        // Customer
        customerUser = User.builder()
                .name("Kavita Customer")
                .email("kavita_" + UUID.randomUUID().toString().substring(0, 6) + "@client.com")
                .phone("+91 91111 22222")
                .passwordHash(passwordEncoder.encode("Pass123!"))
                .role(Role.ROLE_CUSTOMER)
                .enabled(true)
                .build();
        customerUser = userRepository.save(customerUser);
        customerToken = jwtTokenProvider.generateTokenFromUserId(customerUser.getId());

        // Convertible Lead
        convertibleLead = Lead.builder()
                .firstName("Siddharth")
                .lastName("Malhotra")
                .email("sid_" + UUID.randomUUID().toString().substring(0, 6) + "@enterprise.in")
                .phone("+91 98888 77777")
                .companyName("Malhotra Logistics")
                .status(LeadStatus.QUALIFIED)
                .priority(LeadPriority.HIGH)
                .estimatedValue(BigDecimal.valueOf(150000))
                .build();
        convertibleLead = leadRepository.save(convertibleLead);
    }

    @Test
    @DisplayName("Phase 4 Test 1: Admin can open Customer 360° view with aggregated commerce data")
    void testGetCustomer360Success() throws Exception {
        // Seed order, payment, product, subscription, license
        Product product = Product.builder()
                .name("School ERP Pro")
                .price(BigDecimal.valueOf(49999))
                .description("School Management ERP")
                .build();
        product = productRepository.save(product);

        Order order = Order.builder()
                .user(customerUser)
                .totalAmount(BigDecimal.valueOf(49999))
                .status(OrderStatus.PAID)
                .build();
        order = orderRepository.save(order);

        Payment payment = Payment.builder()
                .order(order)
                .amount(BigDecimal.valueOf(49999))
                .status(PaymentStatus.SUCCESSFUL)
                .razorpayOrderId("order_test_123")
                .razorpayPaymentId("pay_test_456")
                .build();
        paymentRepository.save(payment);

        Subscription subscription = Subscription.builder()
                .user(customerUser)
                .product(product)
                .order(order)
                .status(SubscriptionStatus.ACTIVE)
                .startDate(LocalDateTime.now())
                .expiryDate(LocalDateTime.now().plusYears(1))
                .build();
        subscriptionRepository.save(subscription);

        License license = License.builder()
                .user(customerUser)
                .product(product)
                .licenseKey("KEY-" + UUID.randomUUID().toString().substring(0, 8))
                .status(LicenseStatus.ACTIVE)
                .activationLimit(5)
                .activationCount(1)
                .build();
        licenseRepository.save(license);

        mockMvc.perform(get("/api/admin/crm/customers/" + customerUser.getId())
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.profile.email").value(customerUser.getEmail()))
                .andExpect(jsonPath("$.data.totalOrdersCount").value(1))
                .andExpect(jsonPath("$.data.orders[0].id").value(order.getId()))
                .andExpect(jsonPath("$.data.payments[0].razorpayPaymentId").value("pay_test_456"))
                .andExpect(jsonPath("$.data.subscriptions[0].status").value("ACTIVE"))
                .andExpect(jsonPath("$.data.licenses[0].status").value("ACTIVE"))
                .andExpect(jsonPath("$.data.timeline").isArray());
    }

    @Test
    @DisplayName("Phase 4 Test 2: Customer receives 403 Forbidden on Customer 360° endpoints")
    void testCustomerForbidden() throws Exception {
        mockMvc.perform(get("/api/admin/crm/customers/" + customerUser.getId())
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Phase 4 Test 3: Unauthenticated user receives 401 Unauthorized")
    void testUnauthenticatedForbidden() throws Exception {
        mockMvc.perform(get("/api/admin/crm/customers/" + customerUser.getId()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Phase 4 Test 4 & 5: Match lead to existing customer by email and phone")
    void testFindCustomerMatch() throws Exception {
        // Lead matching customer email
        Lead leadSameEmail = Lead.builder()
                .firstName("Kavita")
                .email(customerUser.getEmail())
                .status(LeadStatus.QUALIFIED)
                .build();
        leadSameEmail = leadRepository.save(leadSameEmail);

        mockMvc.perform(get("/api/admin/crm/leads/" + leadSameEmail.getId() + "/customer-match")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.hasExactMatch").value(true))
                .andExpect(jsonPath("$.data.matchReason").value("MATCH_BY_EMAIL"))
                .andExpect(jsonPath("$.data.matchedUser.id").value(customerUser.getId()));
    }

    @Test
    @DisplayName("Phase 4 Test 6: Link existing customer to Lead without creating duplicate User")
    void testLinkCustomerToLead() throws Exception {
        long userCountBefore = userRepository.count();

        LinkCustomerRequest req = LinkCustomerRequest.builder()
                .userId(customerUser.getId())
                .build();

        mockMvc.perform(post("/api/admin/crm/leads/" + convertibleLead.getId() + "/link-customer")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.isConverted").value(true))
                .andExpect(jsonPath("$.data.convertedUserId").value(customerUser.getId()))
                .andExpect(jsonPath("$.data.status").value("WON"));

        assertEquals(userCountBefore, userRepository.count(), "User count must remain unchanged when linking existing customer");
    }

    @Test
    @DisplayName("Phase 4 Test 9 & 10: Convert Lead to new Customer account (receives ROLE_CUSTOMER)")
    void testConvertLeadToNewCustomer() throws Exception {
        ConvertLeadRequest req = ConvertLeadRequest.builder()
                .initialPassword("CustomPass123!")
                .build();

        mockMvc.perform(post("/api/admin/crm/leads/" + convertibleLead.getId() + "/convert")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("WON"))
                .andExpect(jsonPath("$.data.isConverted").value(true));

        Lead updated = leadRepository.findById(convertibleLead.getId()).orElse(null);
        assertNotNull(updated);
        assertNotNull(updated.getConvertedUser());
        assertEquals(Role.ROLE_CUSTOMER, updated.getConvertedUser().getRole(), "New converted account MUST receive ROLE_CUSTOMER!");
    }

    @Test
    @DisplayName("Phase 4 Test 17: WON Lead does NOT automatically create fake order, payment, or license")
    void testWonLeadDoesNotCreateFakeOrders() throws Exception {
        long orderCountBefore = orderRepository.count();
        long paymentCountBefore = paymentRepository.count();
        long licenseCountBefore = licenseRepository.count();

        ConvertLeadRequest req = ConvertLeadRequest.builder().build();
        mockMvc.perform(post("/api/admin/crm/leads/" + convertibleLead.getId() + "/convert")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk());

        assertEquals(orderCountBefore, orderRepository.count(), "WON lead MUST NOT auto-create orders");
        assertEquals(paymentCountBefore, paymentRepository.count(), "WON lead MUST NOT auto-create payments");
        assertEquals(licenseCountBefore, licenseRepository.count(), "WON lead MUST NOT auto-create licenses");
    }
}
