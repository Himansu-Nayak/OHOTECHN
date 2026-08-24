package com.ohotech.backend.dto;

import com.ohotech.backend.entity.Platform;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SoftwareReleaseDto {
    private Long id;
    private Long productId;
    private String productName;

    @NotBlank(message = "Version is required")
    private String version;

    private String releaseNotes;
    private String fileName;
    private String filePath;
    private Long fileSize;

    @NotNull(message = "Platform is required")
    private Platform platform;

    private Boolean active;
    private LocalDateTime releaseDate;
    private LocalDateTime createdAt;
}
