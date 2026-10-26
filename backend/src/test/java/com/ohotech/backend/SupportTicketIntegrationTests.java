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
}
