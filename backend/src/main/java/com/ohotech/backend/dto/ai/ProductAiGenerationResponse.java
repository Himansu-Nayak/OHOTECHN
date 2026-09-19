package com.ohotech.backend.dto.ai;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProductAiGenerationResponse {
    private String shortDescription;
    private String longDescription;
    private List<String> features;
    private String seoTitle;
    private String seoDescription;
    private List<FaqItem> faq;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class FaqItem {
        private String question;
        private String answer;
    }
}
