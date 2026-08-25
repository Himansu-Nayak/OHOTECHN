package com.ohotech.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerMatchResultDto {
    private Long leadId;
    private boolean hasExactMatch;
    private String matchReason; // MATCH_BY_EMAIL, MATCH_BY_PHONE, NO_MATCH
    private UserDto matchedUser;
    private LeadDto lead;
}
