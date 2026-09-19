package com.ohotech.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ohotech.backend.dto.FirebaseLoginRequest;
import com.ohotech.backend.dto.LoginRequest;
import com.ohotech.backend.entity.Role;
import com.ohotech.backend.entity.User;
import com.ohotech.backend.repository.UserRepository;
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

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class FirebaseAuthIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new com.fasterxml.jackson.datatype.jsr310.JavaTimeModule());

    @Test
    void testGoogleLoginCreatesNewCustomerUser() throws Exception {
        String randomEmail = "google_" + UUID.randomUUID().toString().substring(0, 8) + "@ohotechn.com";
        String mockToken = "mock-test-token-google:" + randomEmail + ":Google Test User:true";

        FirebaseLoginRequest request = new FirebaseLoginRequest(mockToken);

        mockMvc.perform(post("/api/auth/firebase-login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.accessToken").exists())
                .andExpect(jsonPath("$.data.refreshToken").exists())
                .andExpect(jsonPath("$.data.user.email").value(randomEmail))
                .andExpect(jsonPath("$.data.user.role").value("ROLE_CUSTOMER"))
                .andExpect(jsonPath("$.data.user.emailVerified").value(true));

        User user = userRepository.findByEmail(randomEmail).orElseThrow();
        assertNotNull(user.getFirebaseUid());
        assertNotNull(user.getPasswordHash(), "Password hash must remain non-null for DB integrity");
        assertEquals(Role.ROLE_CUSTOMER, user.getRole());
    }

    @Test
    void testGoogleLoginLinksExistingUserWithVerifiedEmail() throws Exception {
        String existingEmail = "existing_" + UUID.randomUUID().toString().substring(0, 8) + "@ohotechn.com";

        // Pre-create user with password
        User existing = User.builder()
                .name("Existing Person")
                .email(existingEmail)
                .passwordHash(passwordEncoder.encode("SecretPass123!"))
                .role(Role.ROLE_ADMIN) // Verify that elevated role is preserved!
                .enabled(true)
                .emailVerified(true)
                .build();
        userRepository.save(existing);

        String mockToken = "mock-test-token-google:" + existingEmail + ":Existing Person:true";
        FirebaseLoginRequest request = new FirebaseLoginRequest(mockToken);

        mockMvc.perform(post("/api/auth/firebase-login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.accessToken").exists())
                .andExpect(jsonPath("$.data.user.role").value("ROLE_ADMIN")); // Role retained

        User updated = userRepository.findByEmail(existingEmail).orElseThrow();
        assertNotNull(updated.getFirebaseUid());
        assertEquals(Role.ROLE_ADMIN, updated.getRole());

        // Also verify existing password login continues to work for this linked account
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername(existingEmail);
        loginRequest.setPassword("SecretPass123!");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testPhoneLoginCreatesNewUser() throws Exception {
        String randomDigits = String.valueOf((long)(Math.random() * 9000000000L) + 1000000000L);
        String phone = "+91" + randomDigits;
        String mockToken = "mock-test-token-phone:" + phone;

        FirebaseLoginRequest request = new FirebaseLoginRequest(mockToken);

        mockMvc.perform(post("/api/auth/firebase-login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.accessToken").exists())
                .andExpect(jsonPath("$.data.user.phone").value(phone))
                .andExpect(jsonPath("$.data.user.role").value("ROLE_CUSTOMER"))
                .andExpect(jsonPath("$.data.user.phoneVerified").value(true));

        User user = userRepository.findByPhone(phone).orElseThrow();
        assertNotNull(user.getFirebaseUid());
        assertNotNull(user.getPasswordHash());
    }

    @Test
    void testPhoneLoginLinksExistingPhoneUser() throws Exception {
        String randomDigits = String.valueOf((long)(Math.random() * 9000000000L) + 1000000000L);
        String phone = "+91" + randomDigits;

        User existing = User.builder()
                .name("Phone Lead")
                .phone(phone)
                .passwordHash(passwordEncoder.encode("RandomPass123!"))
                .role(Role.ROLE_CUSTOMER)
                .enabled(true)
                .phoneVerified(true)
                .build();
        userRepository.save(existing);

        String mockToken = "mock-test-token-phone:" + phone;
        FirebaseLoginRequest request = new FirebaseLoginRequest(mockToken);

        mockMvc.perform(post("/api/auth/firebase-login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.user.id").value(existing.getId()));

        User updated = userRepository.findById(existing.getId()).orElseThrow();
        assertNotNull(updated.getFirebaseUid());
    }

    @Test
    void testBlankTokenReturnsBadRequest() throws Exception {
        FirebaseLoginRequest request = new FirebaseLoginRequest("");

        mockMvc.perform(post("/api/auth/firebase-login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testUnverifiedGoogleEmailDoesNotLinkExistingUser() throws Exception {
        String existingEmail = "secure_owner_" + UUID.randomUUID().toString().substring(0, 8) + "@ohotechn.com";

        User existing = User.builder()
                .name("Secure Owner")
                .email(existingEmail)
                .passwordHash(passwordEncoder.encode("MasterPass123!"))
                .role(Role.ROLE_ADMIN)
                .enabled(true)
                .emailVerified(true)
                .build();
        userRepository.save(existing);

        // Token where email_verified is false
        String unverifiedToken = "mock-test-token-google:" + existingEmail + ":Attacker:false";
        FirebaseLoginRequest request = new FirebaseLoginRequest(unverifiedToken);

        // Should reject linking to the existing account because email is unverified
        mockMvc.perform(post("/api/auth/firebase-login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());

        // Existing owner should NOT have this attacker's firebase_uid linked
        User refreshedOwner = userRepository.findById(existing.getId()).orElseThrow();
        assertNull(refreshedOwner.getFirebaseUid(), "Unverified Google email must NOT link to existing account");
    }

    @Test
    void testRefreshTokenFlowForFirebaseAuthenticatedUser() throws Exception {
        String email = "refresh_user_" + UUID.randomUUID().toString().substring(0, 8) + "@ohotechn.com";
        String mockToken = "mock-test-token-google:" + email + ":Refresh Tester:true";

        FirebaseLoginRequest request = new FirebaseLoginRequest(mockToken);

        String responseContent = mockMvc.perform(post("/api/auth/firebase-login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        com.fasterxml.jackson.databind.JsonNode rootNode = objectMapper.readTree(responseContent);
        String refreshToken = rootNode.path("data").path("refreshToken").asText();
        assertNotNull(refreshToken);

        com.ohotech.backend.dto.RefreshTokenRequest refreshRequest = new com.ohotech.backend.dto.RefreshTokenRequest();
        refreshRequest.setRefreshToken(refreshToken);

        mockMvc.perform(post("/api/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(refreshRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.accessToken").exists())
                .andExpect(jsonPath("$.data.user.email").value(email));
    }
}
