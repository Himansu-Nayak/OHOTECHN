package com.ohotech.backend.dto.ai;

import lombok.*;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentAnalysisResponse {
    private String documentType;
    private String summary;
    private List<String> keyPoints;
    private Map<String, Object> extractedFields;
    private Double confidence;
}
