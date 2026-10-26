package com.ohotech.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SupportAiSummaryDto {
    private Long ticketId;
    private String ticketCode;
    private String executiveSummary;
    private String detectedIssueCategory;
    private String customerSentiment;
    private String suggestedPriority;
    private List<String> recommendedNextActions;
    private String draftedAgentReply;
    private boolean fallbackGenerated;
}
