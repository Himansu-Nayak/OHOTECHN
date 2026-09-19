package com.ohotech.backend.dto.ai;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class AiClassificationResponse {
    private String category;
    private Double confidence;
    private String intent;
    private String suggestedAction;
}
