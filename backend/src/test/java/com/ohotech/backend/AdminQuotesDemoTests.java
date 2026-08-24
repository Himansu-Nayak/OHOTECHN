package com.ohotech.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.ohotech.backend.entity.ContactEnquiry;
import com.ohotech.backend.entity.Role;
import com.ohotech.backend.entity.User;
import com.ohotech.backend.repository.ContactRepository;
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

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class AdminQuotesDemoTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ContactRepository contactRepository;

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
    @DisplayName("Admin Quotes 1: Admin Fetch Enquiries Success & Customer 403 Forbidden")
    void testAdminGetEnquiriesRbac() throws Exception {
        // Seed a sample contact enquiry
        ContactEnquiry enquiry = ContactEnquiry.builder()
                .name("Enterprise Lead")
                .email("lead_" + UUID.randomUUID().toString().substring(0, 6) + "@enterprise.com")
                .phone("+91 99999 88888")
                .subject("HMS Hospital Quote Request")
                .message("Requesting enterprise quote for 5 hospital branches.")
                .status("PENDING")
                .build();
        contactRepository.save(enquiry);

        // Create Customer User
        User customer = User.builder()
                .name("Customer User")
                .email("cust_quote_" + UUID.randomUUID().toString().substring(0, 6) + "@ohotech.com")
                .passwordHash(passwordEncoder.encode("Pass123!"))
                .role(Role.ROLE_CUSTOMER)
                .enabled(true)
                .build();
        User savedCustomer = userRepository.save(customer);
        String customerToken = jwtTokenProvider.generateTokenFromUserId(savedCustomer.getId());

        // Create Admin User
        User admin = User.builder()
                .name("Admin User")
                .email("admin_quote_" + UUID.randomUUID().toString().substring(0, 6) + "@ohotech.com")
                .passwordHash(passwordEncoder.encode("Pass123!"))
                .role(Role.ROLE_ADMIN)
                .enabled(true)
                .build();
        User savedAdmin = userRepository.save(admin);
        String adminToken = jwtTokenProvider.generateTokenFromUserId(savedAdmin.getId());

        // 1. Customer User attempting /api/admin/enquiries -> 403 Forbidden
        mockMvc.perform(get("/api/admin/enquiries")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isForbidden());

        // 2. Admin User attempting /api/admin/enquiries -> 200 OK
        mockMvc.perform(get("/api/admin/enquiries")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    @DisplayName("Admin Quotes 2: Admin Update Enquiry Status (PENDING -> CONTACTED -> RESOLVED)")
    void testAdminUpdateEnquiryStatus() throws Exception {
        ContactEnquiry enquiry = ContactEnquiry.builder()
                .name("Demo Lead")
                .email("demo_" + UUID.randomUUID().toString().substring(0, 6) + "@school.org")
                .subject("School ERP Demo Request")
                .message("Please schedule a live demo for our academic board.")
                .status("PENDING")
                .build();
        ContactEnquiry savedEnquiry = contactRepository.save(enquiry);

        User admin = User.builder()
                .name("Admin User")
                .email("admin_update_" + UUID.randomUUID().toString().substring(0, 6) + "@ohotech.com")
                .passwordHash(passwordEncoder.encode("Pass123!"))
                .role(Role.ROLE_ADMIN)
                .enabled(true)
                .build();
        User savedAdmin = userRepository.save(admin);
        String adminToken = jwtTokenProvider.generateTokenFromUserId(savedAdmin.getId());

        Map<String, String> statusPayload = new HashMap<>();
        statusPayload.put("status", "CONTACTED");

        // Update status to CONTACTED
        mockMvc.perform(put("/api/admin/enquiries/" + savedEnquiry.getId() + "/status")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(statusPayload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("CONTACTED"));

        // Verify update in repository
        ContactEnquiry updatedInDb = contactRepository.findById(savedEnquiry.getId()).orElse(null);
        assertNotNull(updatedInDb);
        assertEquals("CONTACTED", updatedInDb.getStatus());
    }
}
