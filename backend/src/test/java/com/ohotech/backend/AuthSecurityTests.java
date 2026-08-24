package com.ohotech.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.ohotech.backend.dto.LoginRequest;
import com.ohotech.backend.dto.RefreshTokenRequest;
import com.ohotech.backend.dto.RegisterRequest;
import com.ohotech.backend.entity.Role;
import com.ohotech.backend.entity.User;
import com.ohotech.backend.repository.UserRepository;
import com.ohotech.backend.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.UUID;

import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class AuthSecurityTests {

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
    @DisplayName("1. User Registration: Success & Duplicate Email/Phone Rejection")
    void testRegisterSuccessAndDuplicates() throws Exception {
        String uniqueEmail = "user_" + UUID.randomUUID().toString().substring(0, 8) + "@ohotech.com";
        String uniquePhone = "99" + UUID.randomUUID().toString().replaceAll("[^0-9]", "").substring(0, 8);

        RegisterRequest request = new RegisterRequest();
        request.setName("Security Test User");
        request.setEmail(uniqueEmail);
        request.setPhone(uniquePhone);
        request.setPassword("SecretPass123!");

        // 1. Successful Registration
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.accessToken").exists())
                .andExpect(jsonPath("$.data.refreshToken").exists())
                .andExpect(jsonPath("$.data.user.email").value(uniqueEmail));

        // Verify User is persisted in database with encoded password
        User savedUser = userRepository.findByEmail(uniqueEmail).orElse(null);
        assertNotNull(savedUser);
        assertTrue(passwordEncoder.matches("SecretPass123!", savedUser.getPasswordHash()));
        assertEquals(Role.ROLE_CUSTOMER, savedUser.getRole());

        // 2. Duplicate Email Registration Rejection
        RegisterRequest dupEmailReq = new RegisterRequest();
        dupEmailReq.setName("Duplicate Email User");
        dupEmailReq.setEmail(uniqueEmail);
        dupEmailReq.setPhone("8888888888");
        dupEmailReq.setPassword("Password123!");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dupEmailReq)))
                .andExpect(status().isBadRequest());

        // 3. Duplicate Phone Registration Rejection
        RegisterRequest dupPhoneReq = new RegisterRequest();
        dupPhoneReq.setName("Duplicate Phone User");
        dupPhoneReq.setEmail("different_" + uniqueEmail);
        dupPhoneReq.setPhone(uniquePhone);
        dupPhoneReq.setPassword("Password123!");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dupPhoneReq)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("2. User Login: Valid & Invalid Credentials")
    void testLoginSuccessAndFailure() throws Exception {
        String email = "login_test_" + UUID.randomUUID().toString().substring(0, 8) + "@ohotech.com";
        String rawPassword = "ValidPassword123!";

        // Create test user
        User user = User.builder()
                .name("Login Test User")
                .email(email)
                .passwordHash(passwordEncoder.encode(rawPassword))
                .role(Role.ROLE_CUSTOMER)
                .enabled(true)
                .build();
        userRepository.save(user);

        // 1. Successful Login
        LoginRequest validLogin = new LoginRequest();
        validLogin.setUsername(email);
        validLogin.setPassword(rawPassword);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validLogin)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.accessToken").exists())
                .andExpect(jsonPath("$.data.user.email").value(email));

        // 2. Invalid Password Login Failure
        LoginRequest invalidLogin = new LoginRequest();
        invalidLogin.setUsername(email);
        invalidLogin.setPassword("WrongPassword!");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidLogin)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("3. JWT Generation & Signature Validation / Tampering Detection")
    void testJwtGenerationAndValidation() throws Exception {
        User user = User.builder()
                .name("JWT Test User")
                .email("jwt_user@ohotech.com")
                .passwordHash(passwordEncoder.encode("Pass123!"))
                .role(Role.ROLE_CUSTOMER)
                .enabled(true)
                .build();
        User savedUser = userRepository.save(user);

        // Generate JWT directly via JwtTokenProvider
        String validToken = jwtTokenProvider.generateTokenFromUserId(savedUser.getId());
        assertNotNull(validToken);

        // Validate Token
        assertTrue(jwtTokenProvider.validateToken(validToken));
        assertEquals(savedUser.getId(), jwtTokenProvider.getUserIdFromJWT(validToken));

        // Test Tampered Token Rejection
        String tamperedToken = validToken.substring(0, validToken.length() - 4) + "XXXX";
        assertFalse(jwtTokenProvider.validateToken(tamperedToken));
    }

    @Test
    @DisplayName("4. Protected Routes & Authentication Entry Point")
    void testProtectedRoutesAccess() throws Exception {
        String email = "protected_user_" + UUID.randomUUID().toString().substring(0, 8) + "@ohotech.com";
        User user = User.builder()
                .name("Protected Route User")
                .email(email)
                .passwordHash(passwordEncoder.encode("Pass123!"))
                .role(Role.ROLE_CUSTOMER)
                .enabled(true)
                .build();
        User savedUser = userRepository.save(user);
        String token = jwtTokenProvider.generateTokenFromUserId(savedUser.getId());

        // 1. Unauthenticated Request to Protected Route (/api/auth/me) -> 401 Unauthorized
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized());

        // 2. Authenticated Request with Valid Bearer Token -> 200 OK
        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.email").value(email));
    }

    @Test
    @DisplayName("5. Role-Based Access Control (RBAC): Customer vs Admin Access")
    void testRoleBasedAccessControl() throws Exception {
        // Create Customer User
        User customer = User.builder()
                .name("Customer User")
                .email("customer_" + UUID.randomUUID().toString().substring(0, 6) + "@ohotech.com")
                .passwordHash(passwordEncoder.encode("Pass123!"))
                .role(Role.ROLE_CUSTOMER)
                .enabled(true)
                .build();
        User savedCustomer = userRepository.save(customer);
        String customerToken = jwtTokenProvider.generateTokenFromUserId(savedCustomer.getId());

        // Create Admin User
        User admin = User.builder()
                .name("Admin User")
                .email("admin_" + UUID.randomUUID().toString().substring(0, 6) + "@ohotech.com")
                .passwordHash(passwordEncoder.encode("Pass123!"))
                .role(Role.ROLE_ADMIN)
                .enabled(true)
                .build();
        User savedAdmin = userRepository.save(admin);
        String adminToken = jwtTokenProvider.generateTokenFromUserId(savedAdmin.getId());

        // 1. Customer User attempting Admin Route (/api/admin/stats) -> 403 Forbidden
        mockMvc.perform(get("/api/admin/stats")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isForbidden());

        // 2. Admin User attempting Admin Route (/api/admin/stats) -> 200 OK
        mockMvc.perform(get("/api/admin/stats")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.systemStatus").value("OPERATIONAL_100"));
    }

    @Test
    @DisplayName("6. Refresh Token Generation & Validation Flow")
    void testRefreshTokenFlow() throws Exception {
        String email = "refresh_" + UUID.randomUUID().toString().substring(0, 8) + "@ohotech.com";
        String password = "Password123!";

        RegisterRequest request = new RegisterRequest();
        request.setName("Refresh Test User");
        request.setEmail(email);
        request.setPassword(password);

        MvcResult registerResult = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andReturn();

        String responseJson = registerResult.getResponse().getContentAsString();
        @SuppressWarnings("unchecked")
        Map<String, Object> responseMap = objectMapper.readValue(responseJson, Map.class);
        @SuppressWarnings("unchecked")
        Map<String, Object> dataMap = (Map<String, Object>) responseMap.get("data");
        String refreshToken = (String) dataMap.get("refreshToken");

        assertNotNull(refreshToken);

        // Refresh Access Token
        RefreshTokenRequest refreshReq = new RefreshTokenRequest();
        refreshReq.setRefreshToken(refreshToken);

        mockMvc.perform(post("/api/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(refreshReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.accessToken").exists());
    }
}
