package com.ohotech.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ohotech.backend.adapter.GoogleLeadProviderAdapter;
import com.ohotech.backend.adapter.LinkedInLeadProviderAdapter;
import com.ohotech.backend.adapter.MetaLeadProviderAdapter;
import com.ohotech.backend.dto.LeadDto;
import com.ohotech.backend.dto.NormalizedLeadInput;
import com.ohotech.backend.entity.*;
import com.ohotech.backend.repository.AuditLogRepository;
import com.ohotech.backend.repository.LeadRepository;
import com.ohotech.backend.repository.UserRepository;
import com.ohotech.backend.repository.WebhookEventRepository;
import com.ohotech.backend.security.JwtTokenProvider;
import com.ohotech.backend.service.LeadIngestionService;
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

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.HexFormat;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class ExternalLeadIngestionTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private LeadRepository leadRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WebhookEventRepository webhookEventRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private LeadIngestionService leadIngestionService;

    @Autowired
    private MetaLeadProviderAdapter metaAdapter;

    @Autowired
    private LinkedInLeadProviderAdapter linkedInAdapter;

    @Autowired
    private GoogleLeadProviderAdapter googleAdapter;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private User adminUser;
    private User customerUser;
    private String adminToken;
    private String customerToken;

    private static final String TEST_META_SECRET = "test_meta_app_secret_12345";
    private static final String TEST_LINKEDIN_SECRET = "test_linkedin_secret_12345";
    private static final String TEST_GOOGLE_SECRET = "test_google_secret_12345";

    @BeforeEach
    void setUp() {
        webhookEventRepository.deleteAll();
        leadRepository.deleteAll();

        if (adminUser == null) {
            adminUser = userRepository.save(User.builder()
                    .name("CRM Marketing Admin")
                    .email("mkt_admin_" + System.currentTimeMillis() + "@ohotech.com")
                    .phone("+9199" + (System.currentTimeMillis() % 100000000))
                    .passwordHash(passwordEncoder.encode("AdminPass123!"))
                    .role(Role.ROLE_ADMIN)
                    .enabled(true)
                    .build());
            adminToken = tokenProvider.generateTokenFromUserId(adminUser.getId());
        }

        if (customerUser == null) {
            customerUser = userRepository.save(User.builder()
                    .name("Existing Customer")
                    .email("existing_cust_" + System.currentTimeMillis() + "@client.com")
                    .phone("+9198" + (System.currentTimeMillis() % 100000000))
                    .passwordHash(passwordEncoder.encode("CustPass123!"))
                    .role(Role.ROLE_CUSTOMER)
                    .enabled(true)
                    .build());
            customerToken = tokenProvider.generateTokenFromUserId(customerUser.getId());
        }
    }

    private String calculateHmac(String data, String key) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        mac.init(secretKey);
        return HexFormat.of().formatHex(mac.doFinal(data.getBytes(StandardCharsets.UTF_8)));
    }

    @Test
    @DisplayName("1. Valid Meta Webhook GET challenge verification")
    void testMetaWebhookVerificationChallenge() throws Exception {
        mockMvc.perform(get("/api/webhooks/meta/leads")
                        .param("hub.mode", "subscribe")
                        .param("hub.verify_token", "TEST_META_TOKEN")
                        .param("hub.challenge", "challenge_code_98765"))
                .andExpect(status().isOk())
                .andExpect(content().string("challenge_code_98765"));
    }

    @Test
    @DisplayName("2. Invalid Meta verification token rejected")
    void testMetaWebhookInvalidVerificationToken() throws Exception {
        mockMvc.perform(get("/api/webhooks/meta/leads")
                        .param("hub.mode", "subscribe")
                        .param("hub.verify_token", "WRONG_TOKEN")
                        .param("hub.challenge", "challenge_code_98765"))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("3. Valid Meta Lead Ads POST ingestion")
    void testValidMetaLeadIngestion() throws Exception {
        String payload = """
                {
                  "leadgen_id": "meta_lead_1001",
                  "id": "evt_meta_1001",
                  "platform": "facebook",
                  "ad_id": "ad_555",
                  "adset_id": "adset_444",
                  "campaign_id": "cmp_333",
                  "form_id": "form_222",
                  "email": "fb_lead_1001@example.com",
                  "phone": "+919988776655",
                  "full_name": "Rohan Verma",
                  "company_name": "Verma Enterprises",
                  "message": "Interested in ERP software"
                }
                """;

        mockMvc.perform(post("/api/webhooks/meta/leads")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.email").value("fb_lead_1001@example.com"))
                .andExpect(jsonPath("$.data.source").value("FACEBOOK"))
                .andExpect(jsonPath("$.data.externalLeadId").value("meta_lead_1001"));

        Optional<Lead> leadOpt = leadRepository.findByExternalLeadId("meta_lead_1001");
        assertTrue(leadOpt.isPresent());
        assertEquals("Rohan", leadOpt.get().getFirstName());
        assertEquals("Verma", leadOpt.get().getLastName());
        assertEquals(LeadStatus.NEW, leadOpt.get().getStatus());
    }

    @Test
    @DisplayName("4. Malformed Meta payload returns HTTP 400")
    void testMalformedMetaPayload() throws Exception {
        String malformedJson = "{ invalid_json: true ";

        mockMvc.perform(post("/api/webhooks/meta/leads")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(malformedJson))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("5. Idempotent duplicate external lead ID does not create duplicate lead")
    void testIdempotentDuplicateLeadId() throws Exception {
        NormalizedLeadInput input = NormalizedLeadInput.builder()
                .source(LeadSource.FACEBOOK)
                .sourceName("FACEBOOK")
                .externalLeadId("meta_lead_dup_999")
                .externalEventId("evt_dup_1")
                .name("Aakash Kumar")
                .email("aakash_dup@example.com")
                .phone("+919111122223")
                .campaign("Summer Campaign")
                .build();

        LeadDto firstCall = leadIngestionService.ingestLead(input);
        assertNotNull(firstCall);

        // Second call with same event ID
        LeadDto secondCall = leadIngestionService.ingestLead(input);
        assertEquals(firstCall.getId(), secondCall.getId());

        assertEquals(1, leadRepository.findAll().stream().filter(l -> "meta_lead_dup_999".equals(l.getExternalLeadId())).count());
    }

    @Test
    @DisplayName("6. Duplicate email updates existing lead instead of creating second lead")
    void testDeduplicationByEmail() throws Exception {
        Lead existing = leadRepository.save(Lead.builder()
                .firstName("Same")
                .lastName("Email")
                .email("same_email@domain.com")
                .source(LeadSource.WEBSITE)
                .status(LeadStatus.CONTACTED)
                .notes("Original website lead")
                .build());

        NormalizedLeadInput input = NormalizedLeadInput.builder()
                .source(LeadSource.INSTAGRAM)
                .sourceName("INSTAGRAM")
                .externalLeadId("ig_lead_888")
                .email("same_email@domain.com")
                .phone("+919888877777")
                .company("Insta Brand")
                .message("Subscribed via Instagram Ad")
                .build();

        LeadDto updated = leadIngestionService.ingestLead(input);
        assertEquals(existing.getId(), updated.getId());

        Lead refreshed = leadRepository.findById(existing.getId()).orElseThrow();
        assertEquals("ig_lead_888", refreshed.getExternalLeadId());
        assertEquals("+919888877777", refreshed.getPhone());
        assertTrue(refreshed.getNotes().contains("Subscribed via Instagram Ad"));
    }

    @Test
    @DisplayName("7. Duplicate phone updates existing lead")
    void testDeduplicationByPhone() throws Exception {
        Lead existing = leadRepository.save(Lead.builder()
                .firstName("Phone")
                .lastName("Match")
                .email("old_email@domain.com")
                .phone("+919000011111")
                .source(LeadSource.MANUAL)
                .build());

        NormalizedLeadInput input = NormalizedLeadInput.builder()
                .source(LeadSource.FACEBOOK)
                .sourceName("FACEBOOK")
                .externalLeadId("fb_phone_123")
                .email("new_email_same_phone@domain.com")
                .phone("+919000011111")
                .build();

        LeadDto updated = leadIngestionService.ingestLead(input);
        assertEquals(existing.getId(), updated.getId());
    }

    @Test
    @DisplayName("8. Existing customer account matching during lead ingestion")
    void testExistingCustomerMatchIngestion() throws Exception {
        NormalizedLeadInput input = NormalizedLeadInput.builder()
                .source(LeadSource.LINKEDIN)
                .sourceName("LINKEDIN")
                .externalLeadId("li_cust_55")
                .email(customerUser.getEmail())
                .phone(customerUser.getPhone())
                .name(customerUser.getName())
                .company("Client Corp")
                .build();

        LeadDto lead = leadIngestionService.ingestLead(input);
        assertNotNull(lead);
        assertEquals(customerUser.getEmail(), lead.getEmail());
    }

    @Test
    @DisplayName("9. Instagram Lead Ad source assignment")
    void testInstagramLeadSourceAssignment() throws Exception {
        NormalizedLeadInput input = NormalizedLeadInput.builder()
                .source(LeadSource.INSTAGRAM)
                .sourceName("INSTAGRAM")
                .externalLeadId("ig_777")
                .email("ig_user@social.com")
                .build();

        LeadDto lead = leadIngestionService.ingestLead(input);
        assertEquals(LeadSource.INSTAGRAM, lead.getSource());
    }

    @Test
    @DisplayName("10. LinkedIn Lead Gen Adapter normalization and endpoint")
    void testLinkedInLeadIngestion() throws Exception {
        String payload = """
                {
                  "leadId": "li_form_900",
                  "eventId": "evt_li_900",
                  "firstName": "Priya",
                  "lastName": "Sharma",
                  "email": "priya.sharma@techcorp.com",
                  "phone": "+919876512345",
                  "company": "Tech Corp Ltd",
                  "title": "Vice President - Engineering",
                  "campaignName": "B2B SaaS Lead Campaign",
                  "campaignId": "cmp_li_111",
                  "message": "Need enterprise demo for 50 users"
                }
                """;

        mockMvc.perform(post("/api/webhooks/linkedin/leads")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.source").value("LINKEDIN"))
                .andExpect(jsonPath("$.data.email").value("priya.sharma@techcorp.com"));

        Optional<Lead> lead = leadRepository.findByExternalLeadId("li_form_900");
        assertTrue(lead.isPresent());
        assertEquals("B2B SaaS Lead Campaign", lead.get().getCampaign());
        assertEquals("Vice President - Engineering", lead.get().getDesignation());
    }

    @Test
    @DisplayName("11. Google Ads Lead Form Adapter normalization and endpoint")
    void testGoogleLeadIngestion() throws Exception {
        String payload = """
                {
                  "lead_id": "google_lead_3003",
                  "gclid": "gclid_test_abcd_1234",
                  "campaign_id": "cmp_goog_77",
                  "ad_group_id": "adgroup_goog_88",
                  "user_column_data": [
                    { "column_id": "EMAIL", "string_value": "google_lead@search.com" },
                    { "column_id": "PHONE_NUMBER", "string_value": "+919123456789" },
                    { "column_id": "FIRST_NAME", "string_value": "Amit" },
                    { "column_id": "LAST_NAME", "string_value": "Joshi" },
                    { "column_id": "COMPANY_NAME", "string_value": "Joshi Solutions" }
                  ]
                }
                """;

        mockMvc.perform(post("/api/webhooks/google/leads")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.source").value("GOOGLE_ADS"))
                .andExpect(jsonPath("$.data.email").value("google_lead@search.com"));

        Optional<Lead> lead = leadRepository.findByExternalLeadId("google_lead_3003");
        assertTrue(lead.isPresent());
        assertEquals("Amit", lead.get().getFirstName());
        assertEquals("cmp_goog_77", lead.get().getExternalCampaignId());
    }

    @Test
    @DisplayName("12. UTM marketing parameters preservation")
    void testUtmMarketingAttributionPreservation() throws Exception {
        NormalizedLeadInput input = NormalizedLeadInput.builder()
                .source(LeadSource.FACEBOOK)
                .sourceName("FACEBOOK")
                .externalLeadId("meta_utm_404")
                .email("utm_test@campaign.com")
                .utmSource("facebook_ads")
                .utmMedium("cpc")
                .utmCampaign("q3_growth_2026")
                .utmTerm("crm_software")
                .utmContent("banner_v2")
                .campaign("Q3 Growth Campaign")
                .adSet("India SMEs")
                .adSetId("adset_101")
                .ad("Banner Ad V2")
                .adId("ad_202")
                .build();

        LeadDto lead = leadIngestionService.ingestLead(input);
        assertEquals("facebook_ads", lead.getUtmSource());
        assertEquals("cpc", lead.getUtmMedium());
        assertEquals("q3_growth_2026", lead.getUtmCampaign());
        assertEquals("crm_software", lead.getUtmTerm());
        assertEquals("banner_v2", lead.getUtmContent());
        assertEquals("adset_101", lead.getExternalAdSetId());
        assertEquals("ad_202", lead.getExternalAdId());
    }

    @Test
    @DisplayName("13. Audit log entry created for webhook lead ingestion")
    void testAuditLogEventCreated() throws Exception {
        NormalizedLeadInput input = NormalizedLeadInput.builder()
                .source(LeadSource.GOOGLE_ADS)
                .sourceName("GOOGLE_ADS")
                .externalLeadId("audit_lead_12")
                .email("audit_check@lead.com")
                .build();

        leadIngestionService.ingestLead(input);

        long auditCount = auditLogRepository.findAll().stream()
                .filter(a -> "LEAD_INGESTED_WEBHOOK".equals(a.getAction()))
                .count();
        assertTrue(auditCount >= 1);
    }

    @Test
    @DisplayName("14. Admin role can access Marketing Analytics API")
    void testAdminAccessMarketingAnalytics() throws Exception {
        mockMvc.perform(get("/api/admin/crm/analytics/marketing")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalLeads").exists())
                .andExpect(jsonPath("$.data.leadsBySource").exists())
                .andExpect(jsonPath("$.data.conversionRateBySource").exists());
    }

    @Test
    @DisplayName("15. Customer role cannot access Marketing Analytics API (HTTP 403)")
    void testCustomerForbiddenFromMarketingAnalytics() throws Exception {
        mockMvc.perform(get("/api/admin/crm/analytics/marketing")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("16. Unauthenticated request to Marketing Analytics API rejected (HTTP 401)")
    void testUnauthenticatedAccessRejected() throws Exception {
        mockMvc.perform(get("/api/admin/crm/analytics/marketing"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("17. Meta adapter signature verification algorithm test")
    void testMetaAdapterSignatureVerification() throws Exception {
        String testPayload = "{\"test\":\"meta_payload\"}";
        String validSig = calculateHmac(testPayload, TEST_META_SECRET);

        assertTrue(metaAdapter.verifySignature(testPayload, "sha256=" + validSig, TEST_META_SECRET));
        assertFalse(metaAdapter.verifySignature(testPayload, "sha256=invalid_hash_12345", TEST_META_SECRET));
    }

    @Test
    @DisplayName("18. LinkedIn adapter supports check")
    void testLinkedInAdapterSupports() {
        assertTrue(linkedInAdapter.supports("linkedin"));
        assertTrue(linkedInAdapter.supports("LINKEDIN"));
        assertFalse(linkedInAdapter.supports("facebook"));
    }

    @Test
    @DisplayName("19. Google adapter supports check")
    void testGoogleAdapterSupports() {
        assertTrue(googleAdapter.supports("google"));
        assertTrue(googleAdapter.supports("google_ads"));
        assertFalse(googleAdapter.supports("linkedin"));
    }

    @Test
    @DisplayName("20. Webhook log entry created in crm_webhook_events")
    void testWebhookLogEventPersistence() throws Exception {
        NormalizedLeadInput input = NormalizedLeadInput.builder()
                .source(LeadSource.FACEBOOK)
                .sourceName("FACEBOOK")
                .externalLeadId("log_lead_55")
                .externalEventId("evt_log_55")
                .email("log_persisted@domain.com")
                .build();

        leadIngestionService.ingestLead(input);

        assertTrue(webhookEventRepository.existsByProviderAndExternalEventId("FACEBOOK", "evt_log_55"));
    }
}
