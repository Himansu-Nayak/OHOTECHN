package com.ohotech.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank(message = "Email or Phone is required")
    private String username; // Email or Phone number

    @NotBlank(message = "Password is required")
    private String password;
}
