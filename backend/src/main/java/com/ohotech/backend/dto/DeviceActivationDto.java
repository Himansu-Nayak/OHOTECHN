package com.ohotech.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeviceActivationDto {
    private Long id;
    private Long licenseId;
    private String deviceId;
    private String deviceName;
    private String osName;
    private String ipAddress;
    private String status;
    private LocalDateTime activatedAt;
    private LocalDateTime lastSeenAt;
}
