package com.ohotech.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.ohotech.backend.dto.ChangePasswordRequest;
import com.ohotech.backend.dto.UpdateProfileRequest;
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
import org.springframework.test.web.servlet.MockMvc;
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
class UserProfileSecurityTests {

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
    @DisplayName("1. Customer accessing their own profile (GET /api/users/profile)")
    void testCustomerGetOwnProfile() throws Exception {
        String email = "customer_" + UUID.randomUUID().toString().substring(0, 8) + "@ohotech.com";
        String phone = "99" + UUID.randomUUID().toString().replaceAll("[^0-9]", "").substring(0, 8);
        User customer = User.builder()
                .name("John Customer")
                .email(email)
                .phone(phone)
                .passwordHash(passwordEncoder.encode("SecretPass123!"))
                .role(Role.ROLE_CUSTOMER)
                .enabled(true)
                .build();
        User savedCustomer = userRepository.save(customer);
        String token = jwtTokenProvider.generateTokenFromUserId(savedCustomer.getId());

        mockMvc.perform(get("/api/users/profile")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.email").value(email))
                .andExpect(jsonPath("$.data.name").value("John Customer"));
    }

    @Test
    @DisplayName("2. Customer updating their own profile details (PUT /api/users/profile)")
    void testCustomerUpdateOwnProfile() throws Exception {
        String email = "update_" + UUID.randomUUID().toString().substring(0, 8) + "@ohotech.com";
        User customer = User.builder()
                .name("Initial Name")
                .email(email)
                .phone("9111111111")
                .passwordHash(passwordEncoder.encode("SecretPass123!"))
                .role(Role.ROLE_CUSTOMER)
                .enabled(true)
                .build();
        User savedCustomer = userRepository.save(customer);
        String token = jwtTokenProvider.generateTokenFromUserId(savedCustomer.getId());

        UpdateProfileRequest updateReq = new UpdateProfileRequest();
        updateReq.setName("Updated Full Name");
        updateReq.setPhone("9222222222");

        mockMvc.perform(put("/api/users/profile")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.name").value("Updated Full Name"))
                .andExpect(jsonPath("$.data.phone").value("9222222222"));

        User reloaded = userRepository.findById(savedCustomer.getId()).orElseThrow();
        assertEquals("Updated Full Name", reloaded.getName());
    }

    @Test
    @DisplayName("3. Customer Password Change Validation (Correct vs Incorrect Current Password)")
    void testCustomerPasswordChangeValidation() throws Exception {
        String email = "passchange_" + UUID.randomUUID().toString().substring(0, 8) + "@ohotech.com";
        String oldPassword = "OldPassword123!";
        User customer = User.builder()
                .name("Password Change User")
                .email(email)
                .passwordHash(passwordEncoder.encode(oldPassword))
                .role(Role.ROLE_CUSTOMER)
                .enabled(true)
                .build();
        User savedCustomer = userRepository.save(customer);
        String token = jwtTokenProvider.generateTokenFromUserId(savedCustomer.getId());

        // 1. Invalid Current Password Rejection
        ChangePasswordRequest invalidReq = new ChangePasswordRequest();
        invalidReq.setCurrentPassword("WrongCurrentPassword!");
        invalidReq.setNewPassword("BrandNewPassword123!");

        mockMvc.perform(put("/api/users/change-password")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidReq)))
                .andExpect(status().isBadRequest());

        // 2. Valid Password Change Success
        ChangePasswordRequest validReq = new ChangePasswordRequest();
        validReq.setCurrentPassword(oldPassword);
        validReq.setNewPassword("BrandNewPassword123!");

        mockMvc.perform(put("/api/users/change-password")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        // Verify password hash in DB matches new password
        User reloaded = userRepository.findById(savedCustomer.getId()).orElseThrow();
        assertTrue(passwordEncoder.matches("BrandNewPassword123!", reloaded.getPasswordHash()));
    }

    @Test
    @DisplayName("4. Customer Attempting to Access Admin Users API (403 Forbidden)")
    void testCustomerAccessAdminUsersForbidden() throws Exception {
        User customer = User.builder()
                .name("Unauthorized Customer")
                .email("unauth_" + UUID.randomUUID().toString().substring(0, 8) + "@ohotech.com")
                .passwordHash(passwordEncoder.encode("Pass123!"))
                .role(Role.ROLE_CUSTOMER)
                .enabled(true)
                .build();
        User savedCustomer = userRepository.save(customer);
        String token = jwtTokenProvider.generateTokenFromUserId(savedCustomer.getId());

        mockMvc.perform(get("/api/admin/users")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("5. Admin Viewing Users List with Pagination & Search (200 OK)")
    void testAdminViewUsersList() throws Exception {
        User admin = User.builder()
                .name("Admin Tester")
                .email("admin_user_" + UUID.randomUUID().toString().substring(0, 8) + "@ohotech.com")
                .passwordHash(passwordEncoder.encode("Pass123!"))
                .role(Role.ROLE_ADMIN)
                .enabled(true)
                .build();
        User savedAdmin = userRepository.save(admin);
        String adminToken = jwtTokenProvider.generateTokenFromUserId(savedAdmin.getId());

        mockMvc.perform(get("/api/admin/users?page=0&size=10")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content").isArray())
                .andExpect(jsonPath("$.data.totalElements").exists());
    }

    @Test
    @DisplayName("6. Admin Updating User Active Status (PATCH /api/admin/users/{id}/status)")
    void testAdminUpdateUserStatus() throws Exception {
        User admin = User.builder()
                .name("Status Admin")
                .email("status_admin_" + UUID.randomUUID().toString().substring(0, 8) + "@ohotech.com")
                .passwordHash(passwordEncoder.encode("Pass123!"))
                .role(Role.ROLE_ADMIN)
                .enabled(true)
                .build();
        User savedAdmin = userRepository.save(admin);
        String adminToken = jwtTokenProvider.generateTokenFromUserId(savedAdmin.getId());

        User targetCustomer = User.builder()
                .name("Target Customer")
                .email("target_" + UUID.randomUUID().toString().substring(0, 8) + "@ohotech.com")
                .passwordHash(passwordEncoder.encode("Pass123!"))
                .role(Role.ROLE_CUSTOMER)
                .enabled(true)
                .build();
        User savedTarget = userRepository.save(targetCustomer);

        // Disable user
        mockMvc.perform(patch("/api/admin/users/" + savedTarget.getId() + "/status")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("enabled", false))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.enabled").value(false));

        User reloaded = userRepository.findById(savedTarget.getId()).orElseThrow();
        assertFalse(reloaded.isEnabled());
    }

    @Test
    @DisplayName("7. Admin Updating User Assigned Role (PATCH /api/admin/users/{id}/role)")
    void testAdminUpdateUserRole() throws Exception {
        User admin = User.builder()
                .name("Role Admin")
                .email("role_admin_" + UUID.randomUUID().toString().substring(0, 8) + "@ohotech.com")
                .passwordHash(passwordEncoder.encode("Pass123!"))
                .role(Role.ROLE_ADMIN)
                .enabled(true)
                .build();
        User savedAdmin = userRepository.save(admin);
        String adminToken = jwtTokenProvider.generateTokenFromUserId(savedAdmin.getId());

        User targetUser = User.builder()
                .name("Promote Target")
                .email("promote_" + UUID.randomUUID().toString().substring(0, 8) + "@ohotech.com")
                .passwordHash(passwordEncoder.encode("Pass123!"))
                .role(Role.ROLE_CUSTOMER)
                .enabled(true)
                .build();
        User savedTarget = userRepository.save(targetUser);

        // Promote to ADMIN
        mockMvc.perform(patch("/api/admin/users/" + savedTarget.getId() + "/role")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("role", "ROLE_ADMIN"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.role").value("ROLE_ADMIN"));

        User reloaded = userRepository.findById(savedTarget.getId()).orElseThrow();
        assertEquals(Role.ROLE_ADMIN, reloaded.getRole());
    }
}
