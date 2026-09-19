package com.ohotech.backend.dto.ai;

import com.ohotech.backend.dto.ProductDto;
import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiRecommendationResponse {
    private String summary;
    private List<ProductDto> recommendations;
    private String implementationAdvice;
    private String estimatedTimeline;
}
