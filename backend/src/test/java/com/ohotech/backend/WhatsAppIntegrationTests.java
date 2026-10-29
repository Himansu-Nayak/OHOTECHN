package com.ohotech.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.ohotech.backend.dto.RegisterWhatsAppConsentRequest;
import com.ohotech.backend.dto.SendWhatsAppMessageRequest;
import com.ohotech.backend.entity.CrmWhatsAppConsent;
import com.ohotech.backend.entity.CrmWhatsAppMessage;
import com.ohotech.backend.entity.Role;
import com.ohotech.backend.entity.User;
import com.ohotech.backend.repository.CrmWhatsAppConsentRepository;
import com.ohotech.backend.repository.CrmWhatsAppMessageRepository;
import com.ohotech.backend.repository.UserRepository;
import com.ohotech.backend.security.JwtTokenProvider;
import com.ohotech.backend.service.WhatsAppPhoneNormalizer;
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
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class WhatsAppIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CrmWhatsAppMessageRepository messageRepository;

    @Autowired
    private CrmWhatsAppConsentRepository consentRepository;

    @Autowired
    private WhatsAppPhoneNormalizer phoneNormalizer;

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

        String suffix = UUID.randomUUID().toString().substring(0, 8);

        adminUser = User.builder()
                .name("WhatsApp Test Admin")
                .email("wa_admin_" + suffix + "@ohotechn.com")
                .passwordHash(passwordEncoder.encode("Password123!"))
                .role(Role.ROLE_ADMIN)
                .enabled(true)
                .build();
        adminUser = userRepository.save(adminUser);
        adminToken = jwtTokenProvider.generateTokenFromUserId(adminUser.getId());

        customerUser = User.builder()
                .name("WhatsApp Normal User")
                .email("wa_cust_" + suffix + "@gmail.com")
                .passwordHash(passwordEncoder.encode("Password123!"))
                .role(Role.ROLE_CUSTOMER)
                .enabled(true)
                .build();
        customerUser = userRepository.save(customerUser);
        customerToken = jwtTokenProvider.generateTokenFromUserId(customerUser.getId());
    }

    @AfterEach
    void tearDown() {
        messageRepository.deleteAll();
        consentRepository.deleteAll();
        if (adminUser != null) {
            userRepository.deleteById(adminUser.getId());
        }
        if (customerUser != null) {
            userRepository.deleteById(customerUser.getId());
        }
    }

    @Test
    @DisplayName("Phone Normalizer standardizes Indian and international numbers correctly")
    void testPhoneNormalization() {
        // Standard 10-digit Indian mobile
        assertEquals("+917684054872", phoneNormalizer.normalizeToE164("7684054872"));
        assertEquals("917684054872", phoneNormalizer.toMetaRecipient("7684054872"));

        // With leading 0
        assertEquals("+917684054872", phoneNormalizer.normalizeToE164("07684054872"));
        assertEquals("917684054872", phoneNormalizer.toMetaRecipient("07684054872"));

        // With spaces and hyphens
        assertEquals("+917684054872", phoneNormalizer.normalizeToE164("+91 76840-54872"));
        assertEquals("917684054872", phoneNormalizer.toMetaRecipient("+91 76840-54872"));

        // International format
        assertEquals("+14155552671", phoneNormalizer.normalizeToE164("+14155552671"));
        assertEquals("14155552671", phoneNormalizer.toMetaRecipient("+14155552671"));
    }

    @Test
    @DisplayName("GET /api/webhooks/whatsapp responds to Meta hub verification challenge")
    void testWebhookVerificationChallenge() throws Exception {
        // Valid verify token
        mockMvc.perform(get("/api/webhooks/whatsapp")
                        .param("hub.mode", "subscribe")
                        .param("hub.verify_token", "test_verify_token_12345")
                        .param("hub.challenge", "challenge_code_98765"))
                .andExpect(status().isOk())
                .andExpect(content().string("challenge_code_98765"));

        // Invalid verify token -> 403 Forbidden
        mockMvc.perform(get("/api/webhooks/whatsapp")
                        .param("hub.mode", "subscribe")
                        .param("hub.verify_token", "wrong_token")
                        .param("hub.challenge", "challenge_code_98765"))
                .andExpect(status().isForbidden());

        // Invalid mode -> 403 Forbidden
        mockMvc.perform(get("/api/webhooks/whatsapp")
                        .param("hub.mode", "unsubscribe")
                        .param("hub.verify_token", "test_verify_token_12345")
                        .param("hub.challenge", "challenge_code_98765"))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("POST /api/webhooks/whatsapp updates message status on DELIVERED and READ receipts")
    void testWebhookStatusReceiptUpdates() throws Exception {
        String testWamid = "wamid.HBgLOTE3Njg0MDU0ODcyFQIAERgSRTBBQ0E5REQ3N0IzRjgyNjk1AA==";

        // Seed an existing message in SENT state
        CrmWhatsAppMessage initialMsg = CrmWhatsAppMessage.builder()
                .recipientPhone("917684054872")
                .recipientName("Test Customer")
                .templateName("oho_checkout_otp")
                .status("SENT")
                .wamid(testWamid)
                .category("TRANSACTIONAL")
                .build();
        messageRepository.save(initialMsg);

        // 1. Simulate Meta webhook POST with "delivered" status
        String deliveredPayload = """
        {
          "object": "whatsapp_business_account",
          "entry": [{
            "id": "100200300400",
            "changes": [{
              "value": {
                "messaging_product": "whatsapp",
                "metadata": {
                  "display_phone_number": "7684054872",
                  "phone_number_id": "999888777"
                },
                "statuses": [{
                  "id": "%s",
                  "status": "delivered",
                  "timestamp": "%d",
                  "recipient_id": "917684054872"
                }]
              },
              "field": "messages"
            }]
          }]
        }
        """.formatted(testWamid, System.currentTimeMillis() / 1000);

        mockMvc.perform(post("/api/webhooks/whatsapp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(deliveredPayload))
                .andExpect(status().isOk());

        // Verify message updated to DELIVERED
        CrmWhatsAppMessage deliveredMsg = messageRepository.findByWamid(testWamid).orElseThrow();
        assertEquals("DELIVERED", deliveredMsg.getStatus());
        assertNotNull(deliveredMsg.getDeliveredAt());

        // 2. Simulate Meta webhook POST with "read" status
        String readPayload = """
        {
          "object": "whatsapp_business_account",
          "entry": [{
            "id": "100200300400",
            "changes": [{
              "value": {
                "messaging_product": "whatsapp",
                "metadata": {
                  "display_phone_number": "7684054872",
                  "phone_number_id": "999888777"
                },
                "statuses": [{
                  "id": "%s",
                  "status": "read",
                  "timestamp": "%d",
                  "recipient_id": "917684054872"
                }]
              },
              "field": "messages"
            }]
          }]
        }
        """.formatted(testWamid, System.currentTimeMillis() / 1000);

        mockMvc.perform(post("/api/webhooks/whatsapp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(readPayload))
                .andExpect(status().isOk());

        // Verify message updated to READ
        CrmWhatsAppMessage readMsg = messageRepository.findByWamid(testWamid).orElseThrow();
        assertEquals("READ", readMsg.getStatus());
        assertNotNull(readMsg.getReadAt());
    }

    @Test
    @DisplayName("POST /api/webhooks/whatsapp detects inbound opt-out keyword 'STOP' and revokes consent")
    void testWebhookInboundOptOutDetection() throws Exception {
        String customerPhone = "919937591330";
        String normalizedE164 = "+919937591330";

        // Seed positive consent initially
        CrmWhatsAppConsent initialConsent = CrmWhatsAppConsent.builder()
                .phone(normalizedE164)
                .optIn(true)
                .source("PREVIOUS_CHECKOUT")
                .purpose("CRM_UPDATES")
                .build();
        consentRepository.save(initialConsent);

        // Simulate incoming message with text body "STOP"
        String inboundStopPayload = """
        {
          "object": "whatsapp_business_account",
          "entry": [{
            "id": "100200300400",
            "changes": [{
              "value": {
                "messaging_product": "whatsapp",
                "metadata": {
                  "display_phone_number": "7684054872",
                  "phone_number_id": "999888777"
                },
                "contacts": [{
                  "profile": { "name": "Bikash Jena" },
                  "wa_id": "%s"
                }],
                "messages": [{
                  "from": "%s",
                  "id": "wamid.ABGG1234567890",
                  "timestamp": "%d",
                  "text": { "body": "STOP" },
                  "type": "text"
                }]
              },
              "field": "messages"
            }]
          }]
        }
        """.formatted(customerPhone, customerPhone, System.currentTimeMillis() / 1000);

        mockMvc.perform(post("/api/webhooks/whatsapp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(inboundStopPayload))
                .andExpect(status().isOk());

        // Assert consent ledger reflects opt-out
        CrmWhatsAppConsent updatedConsent = consentRepository.findByPhone(normalizedE164).orElseThrow();
        assertFalse(updatedConsent.isOptIn());
        assertNotNull(updatedConsent.getOptedOutAt());
        assertEquals("Inbound opt-out keyword: STOP", updatedConsent.getRevocationReason());
    }

    @Test
    @DisplayName("POST /api/admin/whatsapp/send enforces opt-out consent blocking")
    void testConsentEnforcementOnSend() throws Exception {
        String testPhone = "+917684054872";

        // Register opt-out in ledger
        CrmWhatsAppConsent optOut = CrmWhatsAppConsent.builder()
                .phone(testPhone)
                .optIn(false)
                .source("CUSTOMER_REQUEST")
                .revocationReason("UNSUBSCRIBED")
                .optedOutAt(LocalDateTime.now())
                .build();
        consentRepository.save(optOut);

        // Attempt sending marketing template to opted-out number -> HTTP 422 Unprocessable Entity
        SendWhatsAppMessageRequest marketingReq = SendWhatsAppMessageRequest.builder()
                .recipientPhone(testPhone)
                .recipientName("Opted-out Recipient")
                .templateName("festival_discount_offer")
                .category("MARKETING")
                .build();

        mockMvc.perform(post("/api/admin/whatsapp/send")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(marketingReq)))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message", org.hamcrest.Matchers.containsString("opted out")));

        // Attempt sending transactional template to opted-out recipient -> Should succeed (transactional allowed)
        SendWhatsAppMessageRequest transactionalReq = SendWhatsAppMessageRequest.builder()
                .recipientPhone(testPhone)
                .recipientName("Opted-out Recipient")
                .templateName("order_status_update")
                .category("TRANSACTIONAL")
                .build();

        mockMvc.perform(post("/api/admin/whatsapp/send")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(transactionalReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("POST /api/admin/whatsapp/send rejects duplicate send with HTTP 409 Conflict")
    void testIdempotencyAndDuplicateDebounce() throws Exception {
        String idempotencyKey = "WA-IDEM-" + UUID.randomUUID();
        String testPhone = "+919876543210";

        SendWhatsAppMessageRequest req = SendWhatsAppMessageRequest.builder()
                .recipientPhone(testPhone)
                .recipientName("Debounce Test Customer")
                .templateName("demo_followup_reminder")
                .idempotencyKey(idempotencyKey)
                .category("TRANSACTIONAL")
                .build();

        // 1st request -> 200 OK
        mockMvc.perform(post("/api/admin/whatsapp/send")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        // 2nd request with exact same idempotencyKey -> 200 OK (idempotent response)
        mockMvc.perform(post("/api/admin/whatsapp/send")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", org.hamcrest.Matchers.containsString("duplicate send prevented")));

        // 3rd request with different idempotency key but same phone & template within 60s debounce window -> 409 Conflict
        SendWhatsAppMessageRequest quickDuplicateReq = SendWhatsAppMessageRequest.builder()
                .recipientPhone(testPhone)
                .recipientName("Debounce Test Customer")
                .templateName("demo_followup_reminder")
                .idempotencyKey("WA-IDEM-" + UUID.randomUUID())
                .category("TRANSACTIONAL")
                .build();

        mockMvc.perform(post("/api/admin/whatsapp/send")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(quickDuplicateReq)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message", org.hamcrest.Matchers.containsString("Duplicate send rejected")));
    }

    @Test
    @DisplayName("Admin WhatsApp Consent endpoints allow managing opt-in and opt-out ledger")
    void testConsentManagementEndpoints() throws Exception {
        // Customer forbidden
        mockMvc.perform(get("/api/admin/whatsapp/consents")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isForbidden());

        // Admin registers opt-out
        RegisterWhatsAppConsentRequest registerReq = RegisterWhatsAppConsentRequest.builder()
                .phone("+917684054872")
                .optIn(false)
                .purpose("PROMOTIONAL_SMS")
                .reason("Customer called support asking to opt out")
                .build();

        mockMvc.perform(post("/api/admin/whatsapp/consents")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.phone").value("+917684054872"))
                .andExpect(jsonPath("$.data.optIn").value(false));

        // Verify listed in consents endpoint
        mockMvc.perform(get("/api/admin/whatsapp/consents")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content").isArray())
                .andExpect(jsonPath("$.data.totalElements").value(org.hamcrest.Matchers.greaterThanOrEqualTo(1)));

        // Admin re-activates consent (opt-in)
        RegisterWhatsAppConsentRequest optInReq = RegisterWhatsAppConsentRequest.builder()
                .phone("+917684054872")
                .optIn(true)
                .purpose("SERVICE_NOTIFICATIONS")
                .reason("Customer accepted terms at checkout")
                .build();

        mockMvc.perform(post("/api/admin/whatsapp/consents")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(optInReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.optIn").value(true));
    }
}
