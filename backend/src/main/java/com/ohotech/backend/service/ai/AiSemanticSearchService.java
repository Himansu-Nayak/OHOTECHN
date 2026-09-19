package com.ohotech.backend.service.ai;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ohotech.backend.dto.ProductDto;
import com.ohotech.backend.dto.ai.SemanticSearchResponse;
import com.ohotech.backend.entity.Product;
import com.ohotech.backend.entity.ProductEmbedding;
import com.ohotech.backend.repository.ProductEmbeddingRepository;
import com.ohotech.backend.repository.ProductRepository;
import com.ohotech.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiSemanticSearchService {

    private final GeminiService geminiService;
    private final ProductRepository productRepository;
    private final ProductEmbeddingRepository embeddingRepository;
    private final ProductService productService;
    private final ObjectMapper objectMapper;

    @Transactional
    public void syncAllProductEmbeddings() {
        List<Product> products = productRepository.findAll();
        log.info("Starting embedding generation for {} products...", products.size());

        for (Product product : products) {
            try {
                String text = String.format("%s: %s Category: %s. Service Type: %s.",
                        product.getName(),
                        product.getDescription() != null ? product.getDescription() : "",
                        product.getCategory() != null ? product.getCategory().getName() : "General",
                        product.getServiceType() != null ? product.getServiceType() : "Software");

                float[] vector = geminiService.generateEmbedding(text);
                String json = objectMapper.writeValueAsString(vector);

                ProductEmbedding pe = embeddingRepository.findByProductId(product.getId())
                        .orElseGet(() -> ProductEmbedding.builder().productId(product.getId()).build());

                pe.setProductName(product.getName());
                pe.setContentText(text);
                pe.setEmbeddingJson(json);
                embeddingRepository.save(pe);
            } catch (Exception e) {
                log.warn("Failed to generate embedding for product {}: {}", product.getId(), e.getMessage());
            }
        }
        log.info("Completed embedding sync for products.");
    }

    public SemanticSearchResponse search(String query, int limit) {
        float[] queryVector = geminiService.generateEmbedding(query);
        List<ProductEmbedding> allEmbeddings = embeddingRepository.findAll();

        // If no embeddings in DB yet, auto-sync or search fallback
        if (allEmbeddings.isEmpty()) {
            syncAllProductEmbeddings();
            allEmbeddings = embeddingRepository.findAll();
        }

        List<ScoredItem> scored = new ArrayList<>();
        for (ProductEmbedding pe : allEmbeddings) {
            try {
                float[] itemVector = objectMapper.readValue(pe.getEmbeddingJson(), new TypeReference<float[]>() {});
                double similarity = calculateCosineSimilarity(queryVector, itemVector);
                scored.add(new ScoredItem(pe.getProductId(), pe.getContentText(), similarity));
            } catch (Exception e) {
                // skip corrupt vector
            }
        }

        scored.sort((a, b) -> Double.compare(b.similarity, a.similarity));

        List<SemanticSearchResponse.SearchResultItem> results = new ArrayList<>();
        int max = Math.min(limit > 0 ? limit : 5, scored.size());

        for (int i = 0; i < max; i++) {
            ScoredItem item = scored.get(i);
            try {
                ProductDto dto = productService.getProductById(item.productId);
                results.add(SemanticSearchResponse.SearchResultItem.builder()
                        .product(dto)
                        .similarityScore(Math.round(item.similarity * 100.0) / 100.0)
                        .matchingContext(item.context)
                        .build());
            } catch (Exception e) {
                // Product might have been deleted
            }
        }

        return SemanticSearchResponse.builder()
                .query(query)
                .results(results)
                .build();
    }

    private double calculateCosineSimilarity(float[] vecA, float[] vecB) {
        if (vecA == null || vecB == null || vecA.length == 0 || vecB.length == 0) return 0.0;
        int len = Math.min(vecA.length, vecB.length);
        double dotProduct = 0.0;
        double normA = 0.0;
        double normB = 0.0;

        for (int i = 0; i < len; i++) {
            dotProduct += vecA[i] * vecB[i];
            normA += vecA[i] * vecA[i];
            normB += vecB[i] * vecB[i];
        }

        if (normA == 0.0 || normB == 0.0) return 0.0;
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    private static class ScoredItem {
        Long productId;
        String context;
        double similarity;

        ScoredItem(Long productId, String context, double similarity) {
            this.productId = productId;
            this.context = context;
            this.similarity = similarity;
        }
    }
}
