package com.ohotech.backend.dto.developer;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StorageConfigDto {
    private String provider; // LOCAL, S3, R2, MINIO
    private String localBaseDir;
    private String bucket;
    private String region;
    private String endpoint;
    private String accessKey;
    private String maskedSecretKey;
    private String secretKey; // Input only for update
    private boolean pathStyle;
    private boolean enabled;
    private String source; // ENVIRONMENT or DEVELOPER_CONFIG
    private boolean configured;
    private String lastTestedAt;
    private String lastTestStatus;
}
