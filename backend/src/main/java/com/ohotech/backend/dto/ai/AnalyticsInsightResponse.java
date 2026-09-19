package com.ohotech.backend.dto.ai;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalyticsInsightResponse {
    private String executiveSummary;
    private List<String> keyObservations;
    private List<String> strategicOpportunities;
    private List<String> recommendedNextSteps;
    private LocalDateTime generatedAt;
}
