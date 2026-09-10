package com.ohotech.backend.dto.developer;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmailConfigDto {
    private String host;
    private int port;
    private String username;
    private String maskedPassword;
    private String password; // Input only for update
    private String fromEmail;
    private String fromName;
    private boolean auth;
    private boolean sslEnable;
    private boolean starttlsEnable;
    private boolean enabled;
    private String source; // ENVIRONMENT or DEVELOPER_CONFIG
    private boolean configured;
    private String lastTestedAt;
    private String lastTestStatus;
}
