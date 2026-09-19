package com.ohotech.backend.dto.ai;

import lombok.*;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImageAnalysisResponse {
    private String description;
    private String detectedCategory;
    private Map<String, String> attributes;
    private String altText;
    private String visualQualityRating;
}
