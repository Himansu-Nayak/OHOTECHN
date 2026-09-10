package com.ohotech.backend.dto.developer;

import lombok.*;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SystemHealthDto {
    private String status; // UP, DEGRADED, DOWN
    private long uptimeMs;
    private String timestamp;
    private Map<String, Object> components;
    private Map<String, Object> systemMetrics;
}
