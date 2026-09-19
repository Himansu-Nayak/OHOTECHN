package com.ohotech.backend.dto.ai;

import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiRecommendationRequest {
    private String query;
    private String industry;
    private BigDecimal budget;
    private String organizationScale; // STARTUP, SME, ENTERPRISE
}
