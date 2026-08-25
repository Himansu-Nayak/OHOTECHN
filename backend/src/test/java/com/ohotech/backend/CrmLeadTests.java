package com.ohotech.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.ohotech.backend.dto.AssignLeadRequest;
import com.ohotech.backend.dto.CreateLeadRequest;
import com.ohotech.backend.dto.UpdateLeadRequest;
import com.ohotech.backend.dto.UpdateLeadStatusRequest;
import com.ohotech.backend.entity.*;
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

import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class CrmLeadTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LeadRepository leadRepository;

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
        objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());

        // Create Admin User
        adminUser = User.builder()
                .name("CRM Admin")
                .email("crm_admin_" + UUID.randomUUID().toString().substring(0, 6) + "@ohotech.com")
                .passwordHash(passwordEncoder.encode("Password123!"))
                .role(Role.ROLE_ADMIN)
                .enabled(true)
                .build();
        adminUser = userRepository.save(adminUser);
        adminToken = jwtTokenProvider.generateTokenFromUserId(adminUser.getId());

        // Create Customer User
        customerUser = User.builder()
                .name("CRM Customer")
                .email("crm_customer_" + UUID.randomUUID().toString().substring(0, 6) + "@customer.com")
                .passwordHash(passwordEncoder.encode("Password123!"))
                .role(Role.ROLE_CUSTOMER)
                .enabled(true)
                .build();
        customerUser = userRepository.save(customerUser);
        customerToken = jwtTokenProvider.generateTokenFromUserId(customerUser.getId());
    }

    @Test
    @DisplayName("CRM 1: Admin can create lead successfully")
    void testAdminCreateLead() throws Exception {
        CreateLeadRequest request = CreateLeadRequest.builder()
                .firstName("Aarav")
                .lastName("Sharma")
                .email("aarav.sharma@techcorp.in")
                .phone("+91 98765 12345")
                .companyName("TechCorp Solutions")
                .designation("CTO")
                .industry("Healthcare")
                .city("Bhubaneswar")
                .state("Odisha")
                .country("India")
                .interestedProduct("Hospital EMR Platform")
                .source(LeadSource.WEBSITE)
                .status(LeadStatus.NEW)
                .priority(LeadPriority.HIGH)
                .estimatedValue(BigDecimal.valueOf(150000))
                .notes("Interested in enterprise hospital deployment across 3 branches.")
                .build();

        mockMvc.perform(post("/api/admin/crm/leads")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.email").value("aarav.sharma@techcorp.in"))
                .andExpect(jsonPath("$.data.status").value("NEW"))
                .andExpect(jsonPath("$.data.priority").value("HIGH"));

        Lead leadInDb = leadRepository.findByEmail("aarav.sharma@techcorp.in").orElse(null);
        assertNotNull(leadInDb);
        assertEquals("TechCorp Solutions", leadInDb.getCompanyName());
    }

    @Test
    @DisplayName("CRM 2: Admin can retrieve leads with pagination & search")
    void testAdminGetLeads() throws Exception {
        Lead lead = Lead.builder()
                .firstName("Priya")
                .lastName("Verma")
                .email("priya.verma@edulearn.org")
                .companyName("EduLearn Systems")
                .interestedProduct("University ERP")
                .source(LeadSource.DEMO_REQUEST)
                .status(LeadStatus.QUALIFIED)
                .priority(LeadPriority.URGENT)
                .build();
        leadRepository.save(lead);

        mockMvc.perform(get("/api/admin/crm/leads?search=EduLearn")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content[0].companyName").value("EduLearn Systems"));
    }

    @Test
    @DisplayName("CRM 3: Admin can update lead details")
    void testAdminUpdateLead() throws Exception {
        Lead lead = Lead.builder()
                .firstName("Rohan")
                .lastName("Patel")
                .email("rohan@patelretail.com")
                .companyName("Patel Retail")
                .source(LeadSource.QUOTE_REQUEST)
                .status(LeadStatus.NEW)
                .priority(LeadPriority.LOW)
                .build();
        Lead saved = leadRepository.save(lead);

        UpdateLeadRequest updateRequest = UpdateLeadRequest.builder()
                .companyName("Patel Supermarket Group")
                .priority(LeadPriority.HIGH)
                .estimatedValue(BigDecimal.valueOf(85000))
                .build();

        mockMvc.perform(put("/api/admin/crm/leads/" + saved.getId())
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.companyName").value("Patel Supermarket Group"))
                .andExpect(jsonPath("$.data.priority").value("HIGH"));
    }

    @Test
    @DisplayName("CRM 4: Admin can change lead status via PATCH /status")
    void testAdminChangeStatus() throws Exception {
        Lead lead = Lead.builder()
                .firstName("Sneha")
                .lastName("Das")
                .email("sneha.das@fintech.io")
                .status(LeadStatus.NEW)
                .build();
        Lead saved = leadRepository.save(lead);

        UpdateLeadStatusRequest statusReq = UpdateLeadStatusRequest.builder()
                .status(LeadStatus.DEMO_SCHEDULED)
                .build();

        mockMvc.perform(patch("/api/admin/crm/leads/" + saved.getId() + "/status")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(statusReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("DEMO_SCHEDULED"));

        Lead inDb = leadRepository.findById(saved.getId()).orElse(null);
        assertNotNull(inDb);
        assertEquals(LeadStatus.DEMO_SCHEDULED, inDb.getStatus());
    }

    @Test
    @DisplayName("CRM 5: Admin can assign lead via PATCH /assign")
    void testAdminAssignLead() throws Exception {
        Lead lead = Lead.builder()
                .firstName("Vikram")
                .lastName("Singh")
                .email("vikram.singh@logistics.com")
                .status(LeadStatus.NEW)
                .build();
        Lead saved = leadRepository.save(lead);

        AssignLeadRequest assignReq = AssignLeadRequest.builder()
                .assignedToId(adminUser.getId())
                .build();

        mockMvc.perform(patch("/api/admin/crm/leads/" + saved.getId() + "/assign")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(assignReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.assignedToId").value(adminUser.getId()))
                .andExpect(jsonPath("$.data.assignedToName").value(adminUser.getName()));
    }

    @Test
    @DisplayName("CRM 6: Customer cannot access CRM (403 Forbidden)")
    void testCustomerCannotAccessCrm() throws Exception {
        mockMvc.perform(get("/api/admin/crm/leads")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("CRM 7: Unauthenticated user cannot access CRM (401/403)")
    void testUnauthenticatedCannotAccessCrm() throws Exception {
        mockMvc.perform(get("/api/admin/crm/leads"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("CRM 8: Invalid lead data is rejected (400 Bad Request)")
    void testInvalidLeadDataRejected() throws Exception {
        CreateLeadRequest invalidReq = CreateLeadRequest.builder()
                .email("not-an-email")
                .build();

        mockMvc.perform(post("/api/admin/crm/leads")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidReq)))
                .andExpect(status().isBadRequest());
    }
}
