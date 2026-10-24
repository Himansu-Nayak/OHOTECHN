package com.ohotech.backend;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ohotech.backend.config.DataInitializer;
import com.ohotech.backend.dto.ApiResponse;
import com.ohotech.backend.dto.PublicLicenseVerificationDto;
import com.ohotech.backend.entity.*;
import com.ohotech.backend.exception.ResourceNotFoundException;
import com.ohotech.backend.repository.CategoryRepository;
import com.ohotech.backend.repository.LicenseRepository;
import com.ohotech.backend.repository.OrderRepository;
import com.ohotech.backend.repository.ProductPlanRepository;
import com.ohotech.backend.repository.ProductRepository;
import com.ohotech.backend.repository.UserRepository;
import com.ohotech.backend.service.OrderService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class CriticalSecurityPatchTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductPlanRepository productPlanRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private LicenseRepository licenseRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderService orderService;

    @Autowired
    private DataInitializer dataInitializer;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    @DisplayName("SEC-01: Serialized User entity must NEVER contain passwordHash")
    void testUserSerializationNeverContainsPasswordHash() throws Exception {
        User user = User.builder()
                .name("Secure Customer")
                .email("secure.customer@example.com")
                .phone("+919999988888")
                .passwordHash(passwordEncoder.encode("SecretSecurePass#2026"))
                .role(Role.ROLE_CUSTOMER)
                .enabled(true)
                .failedLoginAttempts(0)
                .build();

        String json = objectMapper.writeValueAsString(user);
        JsonNode node = objectMapper.readTree(json);

        assertFalse(node.has("passwordHash"), "CRITICAL: 'passwordHash' must not be serialized in User JSON!");
        assertFalse(json.contains("SecretSecurePass"), "CRITICAL: Plaintext password must not appear in JSON!");
        assertFalse(json.contains("$2a$"), "CRITICAL: BCrypt hash prefix must not appear in User JSON!");
    }

    @Test
    @DisplayName("SEC-02: Serialized Order, Cart, and License entities must NEVER contain passwordHash")
    void testEntitiesSerializationNeverContainsPasswordHash() throws Exception {
        User user = User.builder()
                .name("Entity Owner")
                .email("owner@example.com")
                .phone("+918888877777")
                .passwordHash(passwordEncoder.encode("SensitiveHash$12345"))
                .role(Role.ROLE_CUSTOMER)
                .enabled(true)
                .build();

        Order order = Order.builder()
                .id(999L)
                .user(user)
                .totalAmount(new BigDecimal("15000.00"))
                .status(OrderStatus.CONFIRMED)
                .shippingAddress("123 Tech Park")
                .contactPhone("+918888877777")
                .items(new ArrayList<>())
                .build();

        Cart cart = Cart.builder()
                .id(888L)
                .user(user)
                .items(new ArrayList<>())
                .build();

        License license = License.builder()
                .id(777L)
                .user(user)
                .licenseKey("OHO-TEST-KEY-0001")
                .status(LicenseStatus.ACTIVE)
                .activationLimit(1)
                .activationCount(0)
                .build();

        String orderJson = objectMapper.writeValueAsString(order);
        String cartJson = objectMapper.writeValueAsString(cart);
        String licenseJson = objectMapper.writeValueAsString(license);

        assertFalse(orderJson.contains("passwordHash"), "Order JSON must not leak passwordHash!");
        assertFalse(cartJson.contains("passwordHash"), "Cart JSON must not leak passwordHash!");
        assertFalse(licenseJson.contains("passwordHash"), "License JSON must not leak passwordHash!");
    }

    @Test
    @DisplayName("SEC-03: Public license lookup endpoint returns PublicLicenseVerificationDto without User entity or PII")
    void testPublicLicenseVerificationEndpointOnlyExposesSafeFields() throws Exception {
        Category cat = categoryRepository.save(Category.builder().name("Security Testing Cat").description("Desc").build());
        Product product = productRepository.save(Product.builder()
                .name("Secure Antivirus Suite")
                .description("Product description")
                .price(new BigDecimal("2999.00"))
                .category(cat)
                .stock(50)
                .active(true)
                .build());

        User customer = userRepository.save(User.builder()
                .name("Target Customer")
                .email("victim.customer@target.com")
                .phone("+919123456789")
                .officialEmail("official@target.com")
                .passwordHash(passwordEncoder.encode("VictimPassword!123"))
                .role(Role.ROLE_CUSTOMER)
                .enabled(true)
                .failedLoginAttempts(2)
                .build());

        String key = "OHO-SECU-RITY-TEST";
        License license = licenseRepository.save(License.builder()
                .user(customer)
                .product(product)
                .licenseKey(key)
                .status(LicenseStatus.ACTIVE)
                .activationLimit(3)
                .activationCount(1)
                .issuedAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusMonths(6))
                .build());

        mockMvc.perform(get("/api/licenses/key/" + key)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.licenseKey").value(key))
                .andExpect(jsonPath("$.data.status").value("ACTIVE"))
                .andExpect(jsonPath("$.data.productName").value("Secure Antivirus Suite"))
                .andExpect(jsonPath("$.data.activationLimit").value(3))
                .andExpect(jsonPath("$.data.activationCount").value(1))
                .andExpect(jsonPath("$.data.valid").value(true))
                // CRITICAL ASSERTIONS: Must NEVER leak the associated user or PII
                .andExpect(jsonPath("$.data.user").doesNotExist())
                .andExpect(jsonPath("$.data.email").doesNotExist())
                .andExpect(jsonPath("$.data.phone").doesNotExist())
                .andExpect(jsonPath("$.data.officialEmail").doesNotExist())
                .andExpect(jsonPath("$.data.passwordHash").doesNotExist())
                .andExpect(jsonPath("$.data.failedLoginAttempts").doesNotExist());
    }

    @Test
    @DisplayName("SEC-04: Demo customer seeding is blocked under production profile")
    void testDemoCustomerSeedingGuardInProduction() throws Exception {
        // Delete demo customer if present from previous runs in the transactional context
        userRepository.findByEmail("customer@demo.ohotech.com").ifPresent(userRepository::delete);
        assertFalse(userRepository.findByEmail("customer@demo.ohotech.com").isPresent());

        // Configure DataInitializer with production profile
        ReflectionTestUtils.setField(dataInitializer, "activeProfile", "prod");
        ReflectionTestUtils.setField(dataInitializer, "seedDemoData", false);

        // Execute initializer
        dataInitializer.run();

        // Assert demo customer was NOT created
        assertFalse(userRepository.findByEmail("customer@demo.ohotech.com").isPresent(),
                "SECURITY GUARD: Demo customer must NEVER be created under production profile!");
    }

    @Test
    @DisplayName("SEC-05: Demo customer seeding executes as intended in development when explicitly enabled")
    void testDemoCustomerSeedingAllowedInDev() throws Exception {
        userRepository.findByEmail("customer@demo.ohotech.com").ifPresent(userRepository::delete);
        assertFalse(userRepository.findByEmail("customer@demo.ohotech.com").isPresent());

        // Configure DataInitializer with dev profile and explicit opt-in
        ReflectionTestUtils.setField(dataInitializer, "activeProfile", "dev");
        ReflectionTestUtils.setField(dataInitializer, "seedDemoData", true);

        // Execute initializer
        dataInitializer.run();

        // Assert demo customer was created for dev/testing
        assertTrue(userRepository.findByEmail("customer@demo.ohotech.com").isPresent(),
                "Demo customer should be created in dev profile when seedDemoData=true");
    }

    @Test
    @DisplayName("SEC-06: Existing IDOR and ownership checks remain strictly enforced on Orders")
    void testOrderOwnershipProtectionRemainsEnforced() {
        User user1 = userRepository.save(User.builder()
                .name("User One")
                .email("user1@example.com")
                .passwordHash(passwordEncoder.encode("Password#1"))
                .role(Role.ROLE_CUSTOMER)
                .build());

        User user2 = userRepository.save(User.builder()
                .name("User Two")
                .email("user2@example.com")
                .passwordHash(passwordEncoder.encode("Password#2"))
                .role(Role.ROLE_CUSTOMER)
                .build());

        Order order = orderRepository.save(Order.builder()
                .user(user1)
                .totalAmount(new BigDecimal("999.00"))
                .status(OrderStatus.PENDING)
                .build());

        // User 1 owns order -> success
        assertDoesNotThrow(() -> orderService.getOrderById(user1.getId(), order.getId()));

        // User 2 does NOT own order -> ResourceNotFoundException (prevent IDOR)
        assertThrows(ResourceNotFoundException.class, () -> orderService.getOrderById(user2.getId(), order.getId()),
                "Accessing an order belonging to another user must be denied!");
    }
}
