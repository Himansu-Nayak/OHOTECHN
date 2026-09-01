package com.ohotech.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignOfficialEmailRequest {

    @NotBlank(message = "Official email is required.")
    @Email(message = "Invalid email format.")
    private String officialEmail;
}
