package com.ohotech.backend.dto;

import com.ohotech.backend.entity.LeadStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateLeadStatusRequest {
    @NotNull(message = "Status is required")
    private LeadStatus status;
}
