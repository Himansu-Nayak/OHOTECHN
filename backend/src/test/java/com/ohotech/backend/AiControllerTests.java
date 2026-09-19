package com.ohotech.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ohotech.backend.dto.ai.AiChatRequest;
import com.ohotech.backend.dto.ai.AiRecommendationRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AiControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void publicChatEndpointShouldRespond() throws Exception {
        AiChatRequest req = AiChatRequest.builder()
                .message("What software solutions do you offer?")
                .build();

        mockMvc.perform(post("/api/ai/chat")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.message").isNotEmpty());
    }

    @Test
    void productRecommendationShouldReturnMatches() throws Exception {
        AiRecommendationRequest req = AiRecommendationRequest.builder()
                .industry("Healthcare")
                .budget(new BigDecimal("75000"))
                .build();

        mockMvc.perform(post("/api/ai/product/recommend")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.summary").isNotEmpty());
    }

    @Test
    void queryClassificationShouldReturnCategory() throws Exception {
        Map<String, String> payload = Map.of("query", "Where is my order #1234?");

        mockMvc.perform(post("/api/ai/classify")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.category").isNotEmpty());
    }
}
