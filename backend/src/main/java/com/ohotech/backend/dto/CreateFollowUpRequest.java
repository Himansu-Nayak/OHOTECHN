package com.ohotech.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateFollowUpRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotNull(message = "Scheduled date & time is required")
    private LocalDateTime scheduledAt;

    private String notes;
    private Long assignedUserId;
}
