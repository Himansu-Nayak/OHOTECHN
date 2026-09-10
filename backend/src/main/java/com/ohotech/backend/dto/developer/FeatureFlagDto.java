package com.ohotech.backend.dto.developer;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeatureFlagDto {
    private Long id;
    private String flagKey;
    private String name;
    private String description;
    private boolean enabled;
    private String category;
    private String updatedBy;
    private String updatedAt;
}
