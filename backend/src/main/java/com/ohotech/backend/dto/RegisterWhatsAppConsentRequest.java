package com.ohotech.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterWhatsAppConsentRequest {

    @NotBlank(message = "Phone number is required")
    private String phone;

    @Builder.Default
    private boolean optIn = true;

    private String source;

    private String purpose;

    private String reason;
}
