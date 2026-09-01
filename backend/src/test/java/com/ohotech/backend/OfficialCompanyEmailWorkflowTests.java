package com.ohotech.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.ohotech.backend.dto.AssignOfficialEmailRequest;
import com.ohotech.backend.entity.Role;
import com.ohotech.backend.entity.User;
import com.ohotech.backend.repository.AuditLogRepository;
import com.ohotech.backend.repository.NotificationRepository;
import com.ohotech.backend.repository.UserRepository;
import com.ohotech.backend.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class OfficialCompanyEmailWorkflowTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());

    private User adminUser;
    private User customerUser1;
    private User customerUser2;
    private String adminToken;
    private String customerToken;

    @BeforeEach
    void setUp() {
        String suffix = UUID.randomUUID().toString().substring(0, 8);

        adminUser = userRepository.save(User.builder()
                .name("Super Admin")
                .email("admin_" + suffix + "@ohotech.com")
                .passwordHash(passwordEncoder.encode("AdminPass123!"))
                .role(Role.ROLE_ADMIN)
                .enabled(true)
                .emailVerified(true)
                .build());
        adminToken = tokenProvider.generateTokenFromUserId(adminUser.getId());

        customerUser1 = userRepository.save(User.builder()
                .name("Personal User One")
                .email("john_" + suffix + "@gmail.com") // Personal Registration Email
                .passwordHash(passwordEncoder.encode("CustPass123!"))
                .role(Role.ROLE_CUSTOMER)
                .enabled(true)
                .emailVerified(true)
                .build());
        customerToken = tokenProvider.generateTokenFromUserId(customerUser1.getId());

        customerUser2 = userRepository.save(User.builder()
                .name("Personal User Two")
                .email("jane_" + suffix + "@yahoo.com") // Personal Registration Email
                .passwordHash(passwordEncoder.encode("CustPass123!"))
                .role(Role.ROLE_CUSTOMER)
                .enabled(true)
                .emailVerified(true)
                .build());
    }

    @Test
    void testAdminCanAssignOfficialEmailToUser() throws Exception {
        String officialEmail = "john.doe@ohotech.com";
        AssignOfficialEmailRequest req = new AssignOfficialEmailRequest(officialEmail);

        mockMvc.perform(put("/api/admin/users/" + customerUser1.getId() + "/official-email")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.email").value(customerUser1.getEmail())) // Personal email remains unchanged
                .andExpect(jsonPath("$.data.officialEmail").value(officialEmail));

        User updated = userRepository.findById(customerUser1.getId()).orElseThrow();
        assertEquals(officialEmail, updated.getOfficialEmail());
        assertEquals("john_" + customerUser1.getEmail().split("@")[0].replace("john_", "") + "@gmail.com", updated.getEmail());

        // Verify audit log creation
        boolean auditLogged = auditLogRepository.findAll().stream()
                .anyMatch(log -> "ADMIN_ASSIGNED_OFFICIAL_EMAIL".equals(log.getAction()));
        assertTrue(auditLogged);

        // Verify user notification creation
        boolean notificationCreated = notificationRepository.findByUserIdOrderByCreatedAtDesc(customerUser1.getId(), org.springframework.data.domain.PageRequest.of(0, 10)).getContent().stream()
                .anyMatch(n -> n.getTitle().contains("Official Company Email Assigned"));
        assertTrue(notificationCreated);
    }

    @Test
    void testNonAdminCannotAssignOfficialEmail() throws Exception {
        AssignOfficialEmailRequest req = new AssignOfficialEmailRequest("hacker@ohotech.com");

        mockMvc.perform(put("/api/admin/users/" + customerUser1.getId() + "/official-email")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isForbidden());
    }

    @Test
    void testDuplicateOfficialEmailIsRejected() throws Exception {
        String officialEmail = "shared.official@ohotech.com";
        
        // Assign to User 1
        customerUser1.setOfficialEmail(officialEmail);
        userRepository.save(customerUser1);

        // Attempt to assign same official email to User 2
        AssignOfficialEmailRequest req = new AssignOfficialEmailRequest(officialEmail);

        mockMvc.perform(put("/api/admin/users/" + customerUser2.getId() + "/official-email")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }
}
