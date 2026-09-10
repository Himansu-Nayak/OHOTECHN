package com.ohotech.backend.dto.developer;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RazorpayConfigDto {
    private String keyId;
    private String maskedKeySecret;
    private String keySecret; // Input only for update
    private String environment; // TEST or LIVE
    private boolean enabled;
    private String source; // ENVIRONMENT or DEVELOPER_CONFIG
    private boolean configured;
    private String lastTestedAt;
    private String lastTestStatus;
}
