package com.ohotech.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ohotech.backend.dto.ai.ProductAiGenerationRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AdminAiSecurityTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void anonymousUserCannotAccessAdminAi() throws Exception {
        ProductAiGenerationRequest req = ProductAiGenerationRequest.builder()
                .productName("NextGen ERP")
                .build();

        mockMvc.perform(post("/api/admin/ai/product-description")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(authorities = {"ROLE_CUSTOMER"})
    void customerRoleCannotAccessAdminAi() throws Exception {
        ProductAiGenerationRequest req = ProductAiGenerationRequest.builder()
                .productName("NextGen ERP")
                .build();

        mockMvc.perform(post("/api/admin/ai/product-description")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(authorities = {"ROLE_ADMIN"})
    void adminRoleCanAccessAdminAi() throws Exception {
        ProductAiGenerationRequest req = ProductAiGenerationRequest.builder()
                .productName("NextGen ERP")
                .build();

        mockMvc.perform(post("/api/admin/ai/product-description")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk());
    }
}
