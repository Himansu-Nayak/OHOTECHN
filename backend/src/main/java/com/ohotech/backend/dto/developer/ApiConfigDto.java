package com.ohotech.backend.dto.developer;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiConfigDto {
    private String backendUrl;
    private String frontendUrl;
    private List<String> allowedCorsOrigins;
    private String newCorsOrigin; // Input helper for adding
    private String environment;
    private String activeProfile;
    private String healthStatus;
}
