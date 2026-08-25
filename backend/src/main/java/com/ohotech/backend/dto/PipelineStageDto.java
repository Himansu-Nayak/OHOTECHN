package com.ohotech.backend.dto;

import com.ohotech.backend.entity.LeadStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PipelineStageDto {
    private LeadStatus status;
    private String stageName;
    private long count;
    private BigDecimal totalValue;
    private List<LeadDto> leads;
}
