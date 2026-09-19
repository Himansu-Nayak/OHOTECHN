package com.ohotech.backend.controller;

import com.ohotech.backend.dto.ApiResponse;
import com.ohotech.backend.dto.ProductDto;
import com.ohotech.backend.dto.ai.AnalyticsInsightResponse;
import com.ohotech.backend.dto.ai.ProductAiGenerationRequest;
import com.ohotech.backend.dto.ai.ProductAiGenerationResponse;
import com.ohotech.backend.service.ai.AiAdminService;
import com.ohotech.backend.service.ai.AiProductService;
import com.ohotech.backend.service.ai.AiSemanticSearchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/ai")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_DEVELOPER')")
public class AdminAiController {

    private final AiProductService productService;
    private final AiAdminService adminService;
    private final AiSemanticSearchService semanticSearchService;

    @PostMapping("/product-description")
    public ResponseEntity<ApiResponse<ProductAiGenerationResponse>> generateProductDescription(
            @Valid @RequestBody ProductAiGenerationRequest request) {

        ProductAiGenerationResponse response = productService.generateProductCopy(request);
        return ResponseEntity.ok(ApiResponse.success("Product descriptions generated", response));
    }

    @PostMapping("/product-description/apply/{productId}")
    public ResponseEntity<ApiResponse<ProductDto>> applyProductDescription(
            @PathVariable Long productId,
            @RequestBody ProductAiGenerationResponse copy) {

        ProductDto updated = productService.applyGeneratedCopy(productId, copy);
        return ResponseEntity.ok(ApiResponse.success("AI descriptions applied to product", updated));
    }

    @PostMapping("/summarize-enquiries")
    public ResponseEntity<ApiResponse<Map<String, Object>>> summarizeEnquiries() {
        Map<String, Object> response = adminService.summarizeEnquiries();
        return ResponseEntity.ok(ApiResponse.success("Customer enquiries summarized", response));
    }

    @PostMapping("/analytics-insight")
    public ResponseEntity<ApiResponse<AnalyticsInsightResponse>> generateAnalyticsInsight() {
        AnalyticsInsightResponse response = adminService.generateAnalyticsInsight();
        return ResponseEntity.ok(ApiResponse.success("Strategic analytics insight generated", response));
    }

    @PostMapping("/embeddings/sync")
    public ResponseEntity<ApiResponse<String>> syncEmbeddings() {
        semanticSearchService.syncAllProductEmbeddings();
        return ResponseEntity.ok(ApiResponse.success("Product embeddings synced successfully", "Sync completed"));
    }
}
