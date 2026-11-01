package com.ohotech.backend;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ohotech.backend.dto.CreateTicketRequest;
import com.ohotech.backend.entity.SupportTicket;
import com.ohotech.backend.repository.SupportTicketRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class SupportTicketIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private SupportTicketRepository supportTicketRepository;

    @Test
    @DisplayName("Verify ticket creation, issue_ownership persistence, and querying by ticketCode without SQL errors")
    void testCreateTicketAndFindByTicketCode() throws Exception {
        // Step 1: POST create ticket with required fields matching user bug scenario:
        // subject: "Test ticket", department: "Technical & Bugs", priority: "Medium", description: "Testing the fix"
        CreateTicketRequest request = CreateTicketRequest.builder()
                .subject("Test ticket")
                .department("Technical & Bugs")
                .priority("Medium")
                .description("Testing the fix")
                .clientName("QA Test Client")
                .clientEmail("qa.client@ohotech.com")
                .clientPhone("+919876543210")
                .build();

        MvcResult createResult = mockMvc.perform(post("/api/support/public/ticket")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.subject").value("Test ticket"))
                .andExpect(jsonPath("$.data.department").value("TECHNICAL"))
                .andExpect(jsonPath("$.data.priority").value("MEDIUM"))
                .andExpect(jsonPath("$.data.issueOwnership").value("OHO_TECH"))
                .andReturn();

        JsonNode root = objectMapper.readTree(createResult.getResponse().getContentAsString());
        String ticketCode = root.path("data").path("ticketCode").asText();
        assertThat(ticketCode).isNotBlank();

        // Step 2: Confirm issue_ownership value is stored correctly in database
        SupportTicket persistedEntity = supportTicketRepository.findByTicketCode(ticketCode)
                .orElseThrow(() -> new AssertionError("Ticket entity not found in database for code: " + ticketCode));
        assertThat(persistedEntity.getIssueOwnership()).isEqualTo("OHO_TECH");
        assertThat(persistedEntity.getSubject()).isEqualTo("Test ticket");
        assertThat(persistedEntity.getDepartment()).isEqualTo("TECHNICAL");
        assertThat(persistedEntity.getPriority()).isEqualTo("MEDIUM");

        // Step 3: GET ticket by ticket_code and confirm it returns without SQL error
        mockMvc.perform(get("/api/support/public/ticket/" + ticketCode))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.ticketCode").value(ticketCode))
                .andExpect(jsonPath("$.data.subject").value("Test ticket"))
                .andExpect(jsonPath("$.data.issueOwnership").value("OHO_TECH"));
    }

    @Test
    @WithMockUser(authorities = {"ROLE_ADMIN"})
    @DisplayName("Verify staff tickets listing includes newly created ticket without column mismatch")
    void testStaffCanListTickets() throws Exception {
        CreateTicketRequest request = CreateTicketRequest.builder()
                .subject("Staff Desk Test Ticket")
                .department("Technical & Bugs")
                .priority("Medium")
                .description("Testing the staff list endpoint")
                .clientName("Desk User")
                .clientEmail("desk.user@ohotech.com")
                .build();

        MvcResult createResult = mockMvc.perform(post("/api/support/public/ticket")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode root = objectMapper.readTree(createResult.getResponse().getContentAsString());
        String ticketCode = root.path("data").path("ticketCode").asText();

        // GET /api/support/tickets (Staff list endpoint)
        mockMvc.perform(get("/api/support/tickets"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data[?(@.ticketCode == '" + ticketCode + "')].subject").value("Staff Desk Test Ticket"))
                .andExpect(jsonPath("$.data[?(@.ticketCode == '" + ticketCode + "')].issueOwnership").value("OHO_TECH"));
    }

    @Test
    @DisplayName("Verify SLA status calculation cleanly distinguishes BREACHED, WITHIN_SLA, APPROACHING and RESOLVED")
    void testSlaStatusCalculationDistinguishesBreachedWithinAndResolved() throws Exception {
        // 1. Create a ticket whose SLA was 24 hours ago (Breached)
        SupportTicket overdueTicket = SupportTicket.builder()
                .ticketCode("TCK-OVERDUE")
                .subject("Overdue Server Outage")
                .description("Investigate delay")
                .department("TECHNICAL")
                .priority("URGENT")
                .status("OPEN")
                .clientName("Overdue Client")
                .clientEmail("overdue@client.com")
                .slaDueAt(LocalDateTime.now().minusHours(12))
                .build();
        supportTicketRepository.save(overdueTicket);

        // 2. Create a ticket whose SLA is 1 hour in the future (Approaching)
        SupportTicket approachingTicket = SupportTicket.builder()
                .ticketCode("TCK-APPROACH")
                .subject("Approaching Deadline Query")
                .description("Due in one hour")
                .department("BILLING")
                .priority("HIGH")
                .status("OPEN")
                .clientName("Approaching Client")
                .clientEmail("approaching@client.com")
                .slaDueAt(LocalDateTime.now().plusHours(1))
                .build();
        supportTicketRepository.save(approachingTicket);

        // 3. Create a ticket whose SLA is 24 hours in the future (Within SLA)
        SupportTicket withinTicket = SupportTicket.builder()
                .ticketCode("TCK-WITHIN")
                .subject("Within SLA Normal Query")
                .description("Standard response time")
                .department("GENERAL")
                .priority("LOW")
                .status("OPEN")
                .clientName("Within Client")
                .clientEmail("within@client.com")
                .slaDueAt(LocalDateTime.now().plusHours(24))
                .build();
        supportTicketRepository.save(withinTicket);

        // 4. Create a resolved ticket
        SupportTicket resolvedTicket = SupportTicket.builder()
                .ticketCode("TCK-RESOLVED")
                .subject("Completed Ticket")
                .description("All fixed")
                .department("TECHNICAL")
                .priority("MEDIUM")
                .status("RESOLVED")
                .clientName("Resolved Client")
                .clientEmail("resolved@client.com")
                .resolvedAt(LocalDateTime.now().minusHours(2))
                .slaDueAt(LocalDateTime.now().minusHours(5))
                .build();
        supportTicketRepository.save(resolvedTicket);

        // Verify overdue ticket returns BREACHED with negative remaining hours (never clamped to 0h remaining)
        mockMvc.perform(get("/api/support/public/ticket/TCK-OVERDUE"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.slaStatus").value("BREACHED"))
                .andExpect(jsonPath("$.data.slaHoursRemaining").isNumber());

        // Verify approaching ticket returns APPROACHING
        mockMvc.perform(get("/api/support/public/ticket/TCK-APPROACH"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.slaStatus").value("APPROACHING"));

        // Verify normal ticket returns WITHIN_SLA
        mockMvc.perform(get("/api/support/public/ticket/TCK-WITHIN"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.slaStatus").value("WITHIN_SLA"));

        // Verify resolved ticket returns RESOLVED
        mockMvc.perform(get("/api/support/public/ticket/TCK-RESOLVED"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.slaStatus").value("RESOLVED"));
    }
}
