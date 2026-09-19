package com.ohotech.backend;

import com.ohotech.backend.dto.ai.*;
import com.ohotech.backend.service.ai.GeminiService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class GeminiServiceTests {

    @Autowired
    private GeminiService geminiService;

    @Test
    void testFallbackTextGenerationWhenKeyUnconfigured() {
        String response = geminiService.generateText("Hello OHO TECH", "System prompt");
        assertNotNull(response);
        assertTrue(response.contains("OHO TECH"));
    }

    @Test
    void testStructuredOutputGeneration() {
        AiClassificationResponse response = geminiService.generateStructured(
                "I want to buy hospital ERP",
                "Classify intent",
                AiClassificationResponse.class
        );
        assertNotNull(response);
        assertNotNull(response.getCategory());
    }

    @Test
    void testEmbeddingGeneration() {
        float[] vector = geminiService.generateEmbedding("Turnkey Hospital Software");
        assertNotNull(vector);
        assertTrue(vector.length > 0);
    }
}
