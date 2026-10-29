package com.ohotech.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmailStatsDto {
    private long total;
    private long queued;
    private long processing;
    private long sent;
    private long failed;
    private long suppressed;
}
