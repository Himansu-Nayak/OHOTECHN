package com.ohotech.backend.service;

import com.ohotech.backend.dto.developer.FeatureFlagDto;
import com.ohotech.backend.entity.FeatureFlag;
import com.ohotech.backend.repository.FeatureFlagRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class FeatureFlagService {

    private final FeatureFlagRepository featureFlagRepository;
    private final AuditService auditService;

    @Transactional
    public void initBaselineFlagsIfEmpty() {
        if (featureFlagRepository.count() == 0) {
            featureFlagRepository.saveAll(List.of(
                    FeatureFlag.builder().flagKey("CRM_ENABLED").name("CRM & Lead Management").description("Enables public contact enquiries and admin CRM pipelines").enabled(true).category("OPERATIONAL").updatedBy("SYSTEM").build(),
                    FeatureFlag.builder().flagKey("DEMO_REQUESTS_ENABLED").name("Demo Request Bookings").description("Allows prospective enterprise clients to book live product demos").enabled(true).category("COMMERCE").updatedBy("SYSTEM").build(),
                    FeatureFlag.builder().flagKey("QUOTE_REQUESTS_ENABLED").name("Enterprise Quote Inquiries").description("Allows custom turnkey software quote submissions").enabled(true).category("COMMERCE").updatedBy("SYSTEM").build(),
                    FeatureFlag.builder().flagKey("CUSTOMER_REGISTRATION_ENABLED").name("Customer Self-Registration").description("Allows new visitors to create customer accounts").enabled(true).category("AUTHENTICATION").updatedBy("SYSTEM").build(),
                    FeatureFlag.builder().flagKey("EMAIL_NOTIFICATIONS_ENABLED").name("Email Notifications").description("Controls whether transactional emails & notifications are dispatched").enabled(true).category("COMMUNICATIONS").updatedBy("SYSTEM").build(),
                    FeatureFlag.builder().flagKey("MAINTENANCE_MODE").name("System Maintenance Mode").description("Puts public routes in maintenance while allowing Admin/Developer access").enabled(false).category("OPERATIONAL").updatedBy("SYSTEM").build(),
                    FeatureFlag.builder().flagKey("PUBLIC_SIGNUP_ENABLED").name("Public Signups").description("Toggles public onboarding availability").enabled(true).category("AUTHENTICATION").updatedBy("SYSTEM").build()
            ));
        }
    }

    @Transactional
    public List<FeatureFlagDto> getAllFlags() {
        if (featureFlagRepository.count() == 0) {
            initBaselineFlagsIfEmpty();
        }
        return featureFlagRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public boolean isFeatureEnabled(String flagKey, boolean defaultValue) {
        return featureFlagRepository.findByFlagKey(flagKey)
                .map(FeatureFlag::isEnabled)
                .orElse(defaultValue);
    }

    @Transactional
    public FeatureFlagDto toggleFlag(String flagKey, boolean enabled, String updatedBy) {
        if (featureFlagRepository.count() == 0) {
            initBaselineFlagsIfEmpty();
        }

        FeatureFlag flag = featureFlagRepository.findByFlagKey(flagKey)
                .orElseGet(() -> FeatureFlag.builder()
                        .flagKey(flagKey)
                        .name(flagKey)
                        .description("Dynamic operational feature flag")
                        .category("OPERATIONAL")
                        .enabled(enabled)
                        .build());

        boolean prevVal = flag.isEnabled();
        flag.setEnabled(enabled);
        flag.setUpdatedBy(updatedBy != null ? updatedBy : "DEVELOPER");
        flag.setUpdatedAt(LocalDateTime.now());

        FeatureFlag saved = featureFlagRepository.save(flag);

        auditService.logEvent(
                "FEATURE_FLAG_CHANGED",
                "FeatureFlag",
                flagKey,
                String.format("Feature flag '%s' updated from enabled=%s to enabled=%s by %s", flagKey, prevVal, enabled, updatedBy)
        );

        log.info("Feature flag '{}' updated to enabled={} by {}", flagKey, enabled, updatedBy);
        return mapToDto(saved);
    }

    @Transactional
    public FeatureFlagDto createOrUpdateFlag(FeatureFlagDto dto, String updatedBy) {
        FeatureFlag flag = featureFlagRepository.findByFlagKey(dto.getFlagKey())
                .orElseGet(() -> FeatureFlag.builder()
                        .flagKey(dto.getFlagKey())
                        .name(dto.getName())
                        .category(dto.getCategory() != null ? dto.getCategory() : "OPERATIONAL")
                        .build());

        boolean prevVal = flag.isEnabled();
        flag.setName(dto.getName() != null ? dto.getName() : flag.getName());
        flag.setDescription(dto.getDescription() != null ? dto.getDescription() : flag.getDescription());
        flag.setEnabled(dto.isEnabled());
        flag.setCategory(dto.getCategory() != null ? dto.getCategory() : flag.getCategory());
        flag.setUpdatedBy(updatedBy != null ? updatedBy : "DEVELOPER");

        FeatureFlag saved = featureFlagRepository.save(flag);

        auditService.logEvent(
                "FEATURE_FLAG_CONFIGURED",
                "FeatureFlag",
                flag.getFlagKey(),
                String.format("Feature flag '%s' configured (enabled=%s, prev=%s) by %s", flag.getFlagKey(), flag.isEnabled(), prevVal, updatedBy)
        );

        return mapToDto(saved);
    }

    private FeatureFlagDto mapToDto(FeatureFlag flag) {
        return FeatureFlagDto.builder()
                .id(flag.getId())
                .flagKey(flag.getFlagKey())
                .name(flag.getName())
                .description(flag.getDescription())
                .enabled(flag.isEnabled())
                .category(flag.getCategory())
                .updatedBy(flag.getUpdatedBy())
                .updatedAt(flag.getUpdatedAt() != null ? flag.getUpdatedAt().toString() : null)
                .build();
    }
}
