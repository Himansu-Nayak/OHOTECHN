package com.ohotech.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.ohotech.backend.dto.PaymentVerificationRequest;
import com.ohotech.backend.dto.RegisterRequest;
import com.ohotech.backend.entity.Role;
import com.ohotech.backend.entity.User;
import com.ohotech.backend.repository.UserRepository;
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

import java.util.UUID;

import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.containsString;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class SecurityAuthorizationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());
    }

    @Test
    @DisplayName("Security 1: Public Registration Rejects Role Injection & Hardcodes ROLE_CUSTOMER")
    void testPublicRegistrationRejectsRoleInjection() throws Exception {
        String email = "role_inject_" + UUID.randomUUID().toString().substring(0, 8) + "@ohotech.com";

        RegisterRequest request = new RegisterRequest();
        request.setName("Role Injection Attacker");
        request.setEmail(email);
        request.setPassword("AttackerPass123!");
        request.setRole("ADMIN"); // Attempting role injection

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        User savedUser = userRepository.findByEmail(email).orElse(null);
        assertNotNull(savedUser);
        assertEquals(Role.ROLE_CUSTOMER, savedUser.getRole(), "Public registration MUST enforce ROLE_CUSTOMER even if ADMIN role is supplied in payload!");
    }

    @Test
    @DisplayName("Security 2: Developer Endpoints Require ROLE_DEVELOPER (Customer 403, Developer 200)")
    void testDeveloperEndpointAuthorization() throws Exception {
        // Create Customer User
        User customer = User.builder()
                .name("Customer User")
                .email("cust_dev_" + UUID.randomUUID().toString().substring(0, 6) + "@ohotech.com")
                .passwordHash(passwordEncoder.encode("Pass123!"))
                .role(Role.ROLE_CUSTOMER)
                .enabled(true)
                .build();
        User savedCustomer = userRepository.save(customer);
        String customerToken = jwtTokenProvider.generateTokenFromUserId(savedCustomer.getId());

        // Create Developer User
        User dev = User.builder()
                .name("Developer User")
                .email("dev_user_" + UUID.randomUUID().toString().substring(0, 6) + "@ohotech.com")
                .passwordHash(passwordEncoder.encode("Pass123!"))
                .role(Role.ROLE_DEVELOPER)
                .enabled(true)
                .build();
        User savedDev = userRepository.save(dev);
        String devToken = jwtTokenProvider.generateTokenFromUserId(savedDev.getId());

        // 1. Customer User attempting /api/developer/config -> 403 Forbidden
        mockMvc.perform(get("/api/developer/config")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isForbidden());

        // 2. Developer User attempting /api/developer/config -> 200 OK
        mockMvc.perform(get("/api/developer/config")
                        .header("Authorization", "Bearer " + devToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("Security 3: Password Hash Absent in API Responses")
    void testPasswordHashAbsentInUserResponses() throws Exception {
        User admin = User.builder()
                .name("Admin User")
                .email("admin_pwd_check_" + UUID.randomUUID().toString().substring(0, 6) + "@ohotech.com")
                .passwordHash(passwordEncoder.encode("SecretPass123!"))
                .role(Role.ROLE_ADMIN)
                .enabled(true)
                .build();
        User savedAdmin = userRepository.save(admin);
        String adminToken = jwtTokenProvider.generateTokenFromUserId(savedAdmin.getId());

        // Get Users List -> Confirm passwordHash field is completely absent
        mockMvc.perform(get("/api/admin/users")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(content().string(not(containsString("passwordHash"))))
                .andExpect(content().string(not(containsString("password_hash"))));
    }

    @Test
    @DisplayName("Security 4: Payment Verification Rejects Empty/Null Signatures")
    void testPaymentVerificationRejectsInvalidSignature() throws Exception {
        User customer = User.builder()
                .name("Payment Customer")
                .email("pay_cust_" + UUID.randomUUID().toString().substring(0, 6) + "@ohotech.com")
                .passwordHash(passwordEncoder.encode("Pass123!"))
                .role(Role.ROLE_CUSTOMER)
                .enabled(true)
                .build();
        User savedCustomer = userRepository.save(customer);
        String customerToken = jwtTokenProvider.generateTokenFromUserId(savedCustomer.getId());

        PaymentVerificationRequest req = new PaymentVerificationRequest();
        req.setOrderId(99999L);
        req.setRazorpayOrderId("rzp_order_fake");
        req.setRazorpayPaymentId("rzp_pay_fake");
        req.setRazorpaySignature(""); // Empty signature

        mockMvc.perform(post("/api/payments/verify")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().is4xxClientError());
    }
}
