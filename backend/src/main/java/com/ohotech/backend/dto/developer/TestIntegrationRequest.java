package com.ohotech.backend.dto.developer;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TestIntegrationRequest {
    private String provider;
    private String testRecipientEmail; // Required for Email test
    private String notes;
}
