package com.ohotech.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.ohotech.backend.dto.CreateActivityRequest;
import com.ohotech.backend.dto.CreateFollowUpRequest;
import com.ohotech.backend.dto.UpdateFollowUpRequest;
import com.ohotech.backend.entity.*;
import com.ohotech.backend.repository.LeadActivityRepository;
import com.ohotech.backend.repository.LeadFollowUpRepository;
import com.ohotech.backend.repository.LeadRepository;
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

import java.time.LocalDateTime;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class CrmSalesPipelineTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LeadRepository leadRepository;

    @Autowired
    private LeadActivityRepository activityRepository;

    @Autowired
    private LeadFollowUpRepository followUpRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private ObjectMapper objectMapper;
    private User adminUser;
    private User customerUser;
    private String adminToken;
    private String customerToken;
    private Lead sampleLead;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());

        // Admin
        adminUser = User.builder()
                .name("Pipeline Admin")
                .email("pipe_admin_" + UUID.randomUUID().toString().substring(0, 6) + "@ohotech.com")
                .passwordHash(passwordEncoder.encode("Pass123!"))
                .role(Role.ROLE_ADMIN)
                .enabled(true)
                .build();
        adminUser = userRepository.save(adminUser);
        adminToken = jwtTokenProvider.generateTokenFromUserId(adminUser.getId());

        // Customer
        customerUser = User.builder()
                .name("Pipeline Customer")
                .email("pipe_cust_" + UUID.randomUUID().toString().substring(0, 6) + "@customer.com")
                .passwordHash(passwordEncoder.encode("Pass123!"))
                .role(Role.ROLE_CUSTOMER)
                .enabled(true)
                .build();
        customerUser = userRepository.save(customerUser);
        customerToken = jwtTokenProvider.generateTokenFromUserId(customerUser.getId());

        // Lead
        sampleLead = Lead.builder()
                .firstName("Rajesh")
                .lastName("Kumar")
                .email("rajesh.kumar_" + UUID.randomUUID().toString().substring(0, 6) + "@enterprise.in")
                .companyName("Kumar Tech")
                .status(LeadStatus.QUALIFIED)
                .priority(LeadPriority.HIGH)
                .assignedTo(adminUser)
                .build();
        sampleLead = leadRepository.save(sampleLead);
    }

    @Test
    @DisplayName("Pipeline 1: Retrieve Sales Pipeline Board")
    void testGetPipelineBoard() throws Exception {
        mockMvc.perform(get("/api/admin/crm/pipeline")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    @DisplayName("Pipeline 2: Log Activity for Lead")
    void testCreateActivity() throws Exception {
        CreateActivityRequest request = CreateActivityRequest.builder()
                .type(ActivityType.CALL)
                .description("Completed initial phone qualification call with CTO.")
                .build();

        mockMvc.perform(post("/api/admin/crm/leads/" + sampleLead.getId() + "/activities")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.type").value("CALL"));

        assertFalse(activityRepository.findByLeadIdOrderByCreatedAtDesc(sampleLead.getId()).isEmpty());
    }

    @Test
    @DisplayName("Pipeline 3: Schedule & Complete Follow-Up")
    void testScheduleAndCompleteFollowUp() throws Exception {
        CreateFollowUpRequest scheduleReq = CreateFollowUpRequest.builder()
                .title("HMS Demo Presentation")
                .scheduledAt(LocalDateTime.now().plusDays(1))
                .notes("Demonstrate multi-branch EMR workflow.")
                .assignedUserId(adminUser.getId())
                .build();

        String resContent = mockMvc.perform(post("/api/admin/crm/leads/" + sampleLead.getId() + "/follow-ups")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(scheduleReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("PENDING"))
                .andReturn().getResponse().getContentAsString();

        Long followUpId = objectMapper.readTree(resContent).get("data").get("id").asLong();

        UpdateFollowUpRequest updateReq = UpdateFollowUpRequest.builder()
                .status(FollowUpStatus.COMPLETED)
                .notes("Demo completed successfully. Quote requested.")
                .build();

        mockMvc.perform(patch("/api/admin/crm/follow-ups/" + followUpId)
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("COMPLETED"));

        LeadFollowUp updatedInDb = followUpRepository.findById(followUpId).orElse(null);
        assertNotNull(updatedInDb);
        assertEquals(FollowUpStatus.COMPLETED, updatedInDb.getStatus());
        assertNotNull(updatedInDb.getCompletedAt());
    }

    @Test
    @DisplayName("Pipeline 4: Retrieve Follow-Up Dashboard & Detect Overdue")
    void testFollowUpDashboardAndOverdue() throws Exception {
        // Create an overdue follow-up
        LeadFollowUp overdueFollowUp = LeadFollowUp.builder()
                .lead(sampleLead)
                .assignedUser(adminUser)
                .title("Past Due Call")
                .scheduledAt(LocalDateTime.now().minusDays(2))
                .status(FollowUpStatus.PENDING)
                .build();
        followUpRepository.save(overdueFollowUp);

        mockMvc.perform(get("/api/admin/crm/follow-ups/dashboard")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.overdueCount").value(1));

        LeadFollowUp inDb = followUpRepository.findById(overdueFollowUp.getId()).orElse(null);
        assertNotNull(inDb);
        assertEquals(FollowUpStatus.OVERDUE, inDb.getStatus());
    }

    @Test
    @DisplayName("Pipeline 5: Customer access is forbidden (403)")
    void testCustomerForbidden() throws Exception {
        mockMvc.perform(get("/api/admin/crm/pipeline")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isForbidden());
    }
}
