package com.ohotech.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LinkCustomerRequest {

    @NotNull(message = "User ID is required to link lead to existing customer")
    private Long userId;
}
