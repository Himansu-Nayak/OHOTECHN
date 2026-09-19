package com.ohotech.backend.dto.ai;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductAiGenerationRequest {
    @NotBlank(message = "Product name is required")
    private String productName;
    private String category;
    private String targetAudience;
    private String keyFeatures;
    private String specifications;
}
