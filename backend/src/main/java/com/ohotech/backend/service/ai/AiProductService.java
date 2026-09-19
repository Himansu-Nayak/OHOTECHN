package com.ohotech.backend.service.ai;

import com.ohotech.backend.dto.ProductDto;
import com.ohotech.backend.dto.ai.AiRecommendationRequest;
import com.ohotech.backend.dto.ai.AiRecommendationResponse;
import com.ohotech.backend.dto.ai.ProductAiGenerationRequest;
import com.ohotech.backend.dto.ai.ProductAiGenerationResponse;
import com.ohotech.backend.entity.Product;
import com.ohotech.backend.exception.ResourceNotFoundException;
import com.ohotech.backend.repository.ProductRepository;
import com.ohotech.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiProductService {

    private final GeminiService geminiService;
    private final ProductService productService;
    private final ProductRepository productRepository;

    public AiRecommendationResponse recommendProducts(AiRecommendationRequest request) {
        // 1. Query actual products from catalog matching industry or keywords
        String query = request.getQuery() != null ? request.getQuery() : (request.getIndustry() != null ? request.getIndustry() : "");
        Page<ProductDto> matchedPage = productService.getActiveProducts(0, 8, query, null);
        List<ProductDto> candidateProducts = matchedPage.getContent();

        // 2. Build prompt with actual catalog items
        StringBuilder catalogContext = new StringBuilder();
        for (ProductDto p : candidateProducts) {
            catalogContext.append(String.format("ID: %d | Name: %s | Price: ₹%s | Service: %s | Description: %s\n",
                    p.getId(), p.getName(), p.getPrice(), p.getServiceType(), p.getDescription()));
        }

        String prompt = String.format("""
            User Requirement:
            Query: %s
            Industry: %s
            Budget: ₹%s
            Organization Scale: %s

            Available OHO TECH Software Catalog:
            %s

            Instructions:
            1. Recommend the best matching software solution(s) from the above catalog.
            2. Explain why they fit the user's budget and operational requirements.
            3. Provide implementation advice and an estimated deployment timeline.
            Do NOT invent any software products outside of the provided catalog.
            """,
                request.getQuery() != null ? request.getQuery() : "General Software Solutions",
                request.getIndustry() != null ? request.getIndustry() : "Technology / Enterprise",
                request.getBudget() != null ? request.getBudget().toString() : "Flexible",
                request.getOrganizationScale() != null ? request.getOrganizationScale() : "SME",
                catalogContext.length() > 0 ? catalogContext.toString() : "Standard OHO TECH Enterprise Suite"
        );

        String systemInstruction = "You are an Enterprise Solutions Architect for OHO TECH. Recommend software exclusively from the provided catalog.";
        String aiExplanation = geminiService.generateText(prompt, systemInstruction);

        return AiRecommendationResponse.builder()
                .summary(aiExplanation)
                .recommendations(candidateProducts)
                .implementationAdvice("OHO TECH provides turnkey setup, cloud provisioning, data migration, and on-site staff training.")
                .estimatedTimeline("Standard turnkey deployment: 3 to 7 business days.")
                .build();
    }

    public ProductAiGenerationResponse generateProductCopy(ProductAiGenerationRequest request) {
        String prompt = String.format("""
            Generate high-converting enterprise copy for the following software product:
            Product Name: %s
            Category: %s
            Target Audience: %s
            Key Features: %s
            Technical Specifications: %s

            Return a valid JSON object matching this schema:
            {
              "shortDescription": "One or two punchy sentences describing core value proposition",
              "longDescription": "Comprehensive 3-paragraph product description detailing architecture, workflow automation, and security",
              "features": ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5"],
              "seoTitle": "High-ranking SEO Title within 60 characters",
              "seoDescription": "Meta description within 160 characters",
              "faq": [
                {"question": "FAQ Question 1?", "answer": "Clear, concise answer."},
                {"question": "FAQ Question 2?", "answer": "Clear, concise answer."}
              ]
            }
            """,
                request.getProductName(),
                request.getCategory() != null ? request.getCategory() : "Enterprise Software",
                request.getTargetAudience() != null ? request.getTargetAudience() : "Businesses and Institutions",
                request.getKeyFeatures() != null ? request.getKeyFeatures() : "Automated billing, role-based security, analytics",
                request.getSpecifications() != null ? request.getSpecifications() : "PostgreSQL, Cloud Native, REST API"
        );

        String systemInstruction = "You are a senior enterprise B2B copywriter and technical product manager. Always respond with pure, valid JSON.";
        return geminiService.generateStructured(prompt, systemInstruction, ProductAiGenerationResponse.class);
    }

    @Transactional
    public ProductDto applyGeneratedCopy(Long productId, ProductAiGenerationResponse copy) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

        if (copy.getLongDescription() != null && !copy.getLongDescription().isBlank()) {
            product.setDescription(copy.getLongDescription());
        } else if (copy.getShortDescription() != null && !copy.getShortDescription().isBlank()) {
            product.setDescription(copy.getShortDescription());
        }

        Product saved = productRepository.save(product);
        return productService.getProductById(saved.getId());
    }
}
