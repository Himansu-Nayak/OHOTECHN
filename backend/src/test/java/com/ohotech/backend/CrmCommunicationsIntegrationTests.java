package com.ohotech.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.ohotech.backend.dto.SendWhatsAppMessageRequest;
import com.ohotech.backend.entity.EmailOutbox;
import com.ohotech.backend.entity.EmailSuppression;
import com.ohotech.backend.entity.Role;
import com.ohotech.backend.entity.User;
import com.ohotech.backend.repository.CrmWhatsAppMessageRepository;
import com.ohotech.backend.repository.EmailOutboxRepository;
import com.ohotech.backend.repository.EmailSuppressionRepository;
import com.ohotech.backend.repository.UserRepository;
import com.ohotech.backend.security.JwtTokenProvider;
import com.ohotech.backend.service.EmailService;
import org.junit.jupiter.api.AfterEach;
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

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class CrmCommunicationsIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailOutboxRepository emailOutboxRepository;

    @Autowired
    private EmailSuppressionRepository emailSuppressionRepository;

    @Autowired
    private CrmWhatsAppMessageRepository whatsAppMessageRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private ObjectMapper objectMapper;
    private User adminUser;
    private User customerUser;
    private String adminToken;
    private String customerToken;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        String uniqueSuffix = UUID.randomUUID().toString().substring(0, 8);

        adminUser = User.builder()
                .name("CRM Admin")
                .email("crm_comm_admin_" + uniqueSuffix + "@ohotechn.com")
                .passwordHash(passwordEncoder.encode("Password123!"))
                .role(Role.ROLE_ADMIN)
                .enabled(true)
                .build();
        adminUser = userRepository.save(adminUser);
        adminToken = jwtTokenProvider.generateTokenFromUserId(adminUser.getId());

        customerUser = User.builder()
                .name("Normal Customer")
                .email("crm_comm_cust_" + uniqueSuffix + "@gmail.com")
                .passwordHash(passwordEncoder.encode("Password123!"))
                .role(Role.ROLE_CUSTOMER)
                .enabled(true)
                .build();
        customerUser = userRepository.save(customerUser);
        customerToken = jwtTokenProvider.generateTokenFromUserId(customerUser.getId());
    }

    @AfterEach
    void tearDown() {
        whatsAppMessageRepository.deleteAll();
        emailOutboxRepository.deleteAll();
        emailSuppressionRepository.deleteAll();
        if (adminUser != null) {
            userRepository.deleteById(adminUser.getId());
        }
        if (customerUser != null) {
            userRepository.deleteById(customerUser.getId());
        }
    }

    @Test
    @DisplayName("Email Outbox endpoints reject unauthenticated or non-admin requests")
    void testEmailEndpointsAuthorization() throws Exception {
        // Unauthenticated -> 401
        mockMvc.perform(get("/api/admin/emails"))
                .andExpect(status().isUnauthorized());

        // Role Customer -> 403
        mockMvc.perform(get("/api/admin/emails")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isForbidden());

        // Role Admin -> 200
        mockMvc.perform(get("/api/admin/emails")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("Email Service records lifecycle into EmailOutbox and respects suppression list")
    void testEmailOutboxAndSuppression() throws Exception {
        String testEmail = "test_suppressed_" + UUID.randomUUID().toString().substring(0, 6) + "@test.com";

        // Add to suppression list via Admin Controller
        Map<String, String> suppressionReq = Map.of(
                "email", testEmail,
                "reason", "SPAM_COMPLAINT"
        );

        mockMvc.perform(post("/api/admin/emails/suppressions")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(suppressionReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.email").value(testEmail));

        assertTrue(emailSuppressionRepository.existsByEmailIgnoreCase(testEmail));

        // Attempt sending email to suppressed address
        emailService.sendHtmlEmail(testEmail, "Test Subject", "<p>Hello</p>");

        // Await async outbox record creation with SUPPRESSED status (up to 3 seconds)
        boolean foundSuppressed = false;
        for (int i = 0; i < 30; i++) {
            List<EmailOutbox> outboxList = emailOutboxRepository.findAll();
            foundSuppressed = outboxList.stream()
                    .anyMatch(e -> e.getRecipient().equalsIgnoreCase(testEmail) && "SUPPRESSED".equals(e.getStatus()));
            if (foundSuppressed) {
                break;
            }
            Thread.sleep(100);
        }
        assertTrue(foundSuppressed, "Suppressed email should be recorded with SUPPRESSED status in outbox");

        // Verify stats endpoint returns non-zero counts
        mockMvc.perform(get("/api/admin/emails/stats")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.suppressed").value(org.hamcrest.Matchers.greaterThanOrEqualTo(1)));
    }

    @Test
    @DisplayName("WhatsApp CRM Controller endpoints enforce Admin role, validate payload, and record messages")
    void testWhatsAppCrmController() throws Exception {
        // Customer forbidden
        mockMvc.perform(get("/api/admin/whatsapp/config")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isForbidden());

        // Admin config check
        mockMvc.perform(get("/api/admin/whatsapp/config")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.providerName").value("Meta WhatsApp Cloud API v19.0"));

        // Dispatch CRM message
        SendWhatsAppMessageRequest request = SendWhatsAppMessageRequest.builder()
                .recipientPhone("+919876543210")
                .recipientName("Dr. Mohapatra")
                .templateName("hms_enterprise_demo")
                .parameters(List.of("Hospital Management Software"))
                .build();

        mockMvc.perform(post("/api/admin/whatsapp/send")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.recipientPhone").value("919876543210"))
                .andExpect(jsonPath("$.data.templateName").value("hms_enterprise_demo"));

        // Verify history endpoint retrieves the logged message
        mockMvc.perform(get("/api/admin/whatsapp/messages")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content").isArray());
    }

    @Test
    @DisplayName("Email Service prevents rapid duplicate sends within 10-second debounce window")
    void testEmailDebounce() throws Exception {
        String testEmail = "debounce_" + UUID.randomUUID().toString().substring(0, 6) + "@test.com";
        String subject = "Debounce Verification Notification";

        // Dispatch first email
        emailService.sendHtmlEmail(testEmail, subject, "<p>First attempt</p>");

        // Wait for first outbox entry to be written
        for (int i = 0; i < 30; i++) {
            if (emailOutboxRepository.existsByRecipientAndSubjectAndCreatedAtAfter(testEmail, subject, LocalDateTime.now().minusSeconds(10))) {
                break;
            }
            Thread.sleep(100);
        }

        // Dispatch immediate second email with identical recipient and subject
        emailService.sendHtmlEmail(testEmail, subject, "<p>Rapid duplicate attempt</p>");
        Thread.sleep(300);

        // Count should remain exactly 1
        long count = emailOutboxRepository.findAll().stream()
                .filter(e -> e.getRecipient().equalsIgnoreCase(testEmail) && e.getSubject().equals(subject))
                .count();
        assertEquals(1, count, "Rapid duplicate email within 10s should be debounced and discarded");
    }
}
