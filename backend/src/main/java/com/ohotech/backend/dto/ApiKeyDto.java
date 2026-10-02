package com.ohotech.backend.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiKeyDto {
    private Long id;
    private String name;
    private String keyPrefix;
    private String plaintextSecret; // Populated only at creation time
    private String scope;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime lastUsedAt;
    private LocalDateTime expiresAt;
    private String createdByEmail;
}
