package com.ohotech.backend.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GatewayHealthDto {
    private String providerId;
    private String status;
    private boolean healthy;
    private long latencyMs;
    private String message;
    private LocalDateTime checkedAt;
}
