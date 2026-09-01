package com.ohotech.backend.dto;

import com.ohotech.backend.entity.OtpPurpose;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SendOtpRequest {
    @NotBlank(message = "Target (email or phone) is required")
    private String target;

    private String channel; // EMAIL or SMS / PHONE

    private OtpPurpose purpose; // EMAIL_VERIFICATION, LOGIN, PASSWORD_RESET
}
