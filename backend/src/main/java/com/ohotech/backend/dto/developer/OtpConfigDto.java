package com.ohotech.backend.dto.developer;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OtpConfigDto {
    private int expiryMinutes;
    private int cooldownSeconds;
    private int maxAttempts;
    private boolean enabled;
    private String source;
}
