package com.ohotech.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConvertLeadRequest {
    private String name;
    private String email;
    private String phone;
    private String companyName;
    private String initialPassword; // Optional, defaults to secure random password token
}
