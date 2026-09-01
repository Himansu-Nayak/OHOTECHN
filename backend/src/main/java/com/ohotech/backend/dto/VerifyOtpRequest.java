package com.ohotech.backend.dto;

import com.ohotech.backend.entity.OtpPurpose;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class VerifyOtpRequest {
    @NotBlank(message = "Target (email or phone) is required")
    private String target;

    @NotBlank(message = "OTP code is required")
    private String otpCode;

    private OtpPurpose purpose; // EMAIL_VERIFICATION, LOGIN, PASSWORD_RESET
}
