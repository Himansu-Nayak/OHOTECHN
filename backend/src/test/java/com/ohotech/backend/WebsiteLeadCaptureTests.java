package com.ohotech.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.ohotech.backend.dto.ContactRequest;
import com.ohotech.backend.entity.*;
import com.ohotech.backend.repository.ContactRepository;
import com.ohotech.backend.repository.LeadRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class WebsiteLeadCaptureTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ContactRepository contactRepository;

    @Autowired
    private LeadRepository leadRepository;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());
    }

    @Test
    @DisplayName("Website 1: Contact Form submission creates CONTACT_FORM Lead")
    void testContactFormCreatesLead() throws Exception {
        String testEmail = "contact_" + UUID.randomUUID().toString().substring(0, 6) + "@client.com";

        ContactRequest req = ContactRequest.builder()
                .name("Kavita Patel")
                .email(testEmail)
                .phone("+91 91234 56789")
                .company("Patel Software Solutions")
                .subject("Custom ERP Enquiry")
                .message("We need custom ERP module for our manufacturing unit.")
                .source(LeadSource.CONTACT_FORM)
                .build();

        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        // Verify enquiry saved
        List<ContactEnquiry> enquiries = contactRepository.findAllByOrderByCreatedAtDesc();
        assertFalse(enquiries.isEmpty());

        // Verify Lead created in CRM
        Lead lead = leadRepository.findByEmail(testEmail).orElse(null);
        assertNotNull(lead);
        assertEquals("Kavita", lead.getFirstName());
        assertEquals("Patel", lead.getLastName());
        assertEquals("Patel Software Solutions", lead.getCompanyName());
        assertEquals(LeadSource.CONTACT_FORM, lead.getSource());
        assertEquals(LeadStatus.NEW, lead.getStatus());
    }

    @Test
    @DisplayName("Website 2: Get Quote Form submission creates QUOTE_REQUEST Lead")
    void testQuoteFormCreatesLead() throws Exception {
        String testEmail = "quote_" + UUID.randomUUID().toString().substring(0, 6) + "@enterprise.com";

        ContactRequest req = ContactRequest.builder()
                .name("Vikramaditya Roy")
                .email(testEmail)
                .phone("+91 99887 76655")
                .company("Roy Logistics")
                .subject("Quote Request: Hospital EMR")
                .message("Requesting commercial quote for 3 hospital locations.")
                .interestedProduct("Hospital EMR Platform")
                .source(LeadSource.QUOTE_REQUEST)
                .build();

        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk());

        Lead lead = leadRepository.findByEmail(testEmail).orElse(null);
        assertNotNull(lead);
        assertEquals(LeadSource.QUOTE_REQUEST, lead.getSource());
        assertEquals("Hospital EMR Platform", lead.getInterestedProduct());
    }

    @Test
    @DisplayName("Website 3: Book Demo Form submission creates DEMO_REQUEST Lead")
    void testDemoFormCreatesLead() throws Exception {
        String testEmail = "demo_" + UUID.randomUUID().toString().substring(0, 6) + "@school.edu";

        ContactRequest req = ContactRequest.builder()
                .name("Dr. Ananya Sen")
                .email(testEmail)
                .phone("+91 97766 55443")
                .company("St. Xavier Campus")
                .subject("Demo Request: University ERP")
                .message("Preferred Date: 2026-09-01, Preferred Time: 11:00 AM")
                .source(LeadSource.DEMO_REQUEST)
                .build();

        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk());

        Lead lead = leadRepository.findByEmail(testEmail).orElse(null);
        assertNotNull(lead);
        assertEquals(LeadSource.DEMO_REQUEST, lead.getSource());
    }

    @Test
    @DisplayName("Website 4: Product Enquiry submission creates WEBSITE_PRODUCT Lead")
    void testProductEnquiryCreatesLead() throws Exception {
        String testEmail = "prod_" + UUID.randomUUID().toString().substring(0, 6) + "@retail.com";

        ContactRequest req = ContactRequest.builder()
                .name("Manish Gupta")
                .email(testEmail)
                .company("Gupta Supermarket")
                .subject("Retail POS & Billing Software")
                .message("Can we get source code deployment SLA?")
                .interestedProduct("Retail POS Software")
                .source(LeadSource.WEBSITE_PRODUCT)
                .build();

        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk());

        Lead lead = leadRepository.findByEmail(testEmail).orElse(null);
        assertNotNull(lead);
        assertEquals(LeadSource.WEBSITE_PRODUCT, lead.getSource());
    }

    @Test
    @DisplayName("Website 5: UTM Campaign Tracking is stored with Lead")
    void testUtmCampaignTracking() throws Exception {
        String testEmail = "utm_" + UUID.randomUUID().toString().substring(0, 6) + "@fbads.com";

        ContactRequest req = ContactRequest.builder()
                .name("Siddharth Mehra")
                .email(testEmail)
                .subject("Facebook Ad Enquiry")
                .message("Clicked on Facebook Ad")
                .source(LeadSource.FACEBOOK)
                .utmSource("facebook")
                .utmMedium("paid_social")
                .utmCampaign("school_erp_august")
                .utmTerm("school_software")
                .utmContent("banner_v2")
                .landingPage("/solutions/education")
                .build();

        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk());

        Lead lead = leadRepository.findByEmail(testEmail).orElse(null);
        assertNotNull(lead);
        assertEquals("facebook", lead.getUtmSource());
        assertEquals("paid_social", lead.getUtmMedium());
        assertEquals("school_erp_august", lead.getUtmCampaign());
        assertEquals("/solutions/education", lead.getLandingPage());
    }

    @Test
    @DisplayName("Website 6: Duplicate submissions update existing Lead without creating duplicate records")
    void testDuplicateSubmissionsDeduplication() throws Exception {
        String testEmail = "repeat_" + UUID.randomUUID().toString().substring(0, 6) + "@client.com";

        // Submission 1: Contact form
        ContactRequest req1 = ContactRequest.builder()
                .name("Alok Nanda")
                .email(testEmail)
                .phone("+91 90000 11111")
                .subject("Initial Contact")
                .message("First inquiry about pricing.")
                .source(LeadSource.CONTACT_FORM)
                .build();

        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req1)))
                .andExpect(status().isOk());

        // Submission 2: Quote Request from same email
        ContactRequest req2 = ContactRequest.builder()
                .name("Alok Nanda")
                .email(testEmail)
                .phone("+91 90000 11111")
                .company("Nanda Enterprises")
                .subject("Quote Request for HMS")
                .message("Follow up for 5 hospital branches.")
                .interestedProduct("HMS Hospital EMR")
                .source(LeadSource.QUOTE_REQUEST)
                .build();

        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req2)))
                .andExpect(status().isOk());

        // Verify only 1 Lead exists for this email
        List<Lead> leadsInDb = leadRepository.findAll().stream()
                .filter(l -> l.getEmail().equalsIgnoreCase(testEmail))
                .toList();

        assertEquals(1, leadsInDb.size(), "Should deduplicate and keep single Lead record");

        Lead updatedLead = leadsInDb.get(0);
        assertEquals("Nanda Enterprises", updatedLead.getCompanyName());
        assertEquals("HMS Hospital EMR", updatedLead.getInterestedProduct());
        assertTrue(updatedLead.getNotes().contains("First inquiry"));
        assertTrue(updatedLead.getNotes().contains("Follow up for 5 hospital branches"));
    }
}
