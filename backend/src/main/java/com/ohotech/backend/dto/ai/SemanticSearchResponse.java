package com.ohotech.backend.dto.ai;

import com.ohotech.backend.dto.ProductDto;
import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SemanticSearchResponse {
    private String query;
    private List<SearchResultItem> results;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SearchResultItem {
        private ProductDto product;
        private Double similarityScore;
        private String matchingContext;
    }
}
