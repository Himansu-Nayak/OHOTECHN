package com.ohotech.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeviceActivationRequest {

    @NotBlank(message = "deviceIdentifier is required")
    private String deviceIdentifier;

    private String deviceName;
    private String operatingSystem;
    private String applicationVersion;
}
