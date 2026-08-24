package com.ohotech.backend.service;

import com.ohotech.backend.dto.DeviceActivationRequest;
import com.ohotech.backend.entity.*;
import com.ohotech.backend.exception.BadRequestException;
import com.ohotech.backend.exception.ResourceNotFoundException;
import com.ohotech.backend.repository.DeviceActivationRepository;
import com.ohotech.backend.repository.LicenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LicenseService {

    private final LicenseRepository licenseRepository;
    private final DeviceActivationRepository deviceActivationRepository;
    private static final SecureRandom random = new SecureRandom();
    private static final String ALPHA_NUMERIC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    public String generateUniqueLicenseKey() {
        String key;
        do {
            StringBuilder sb = new StringBuilder("OHO-");
            for (int i = 0; i < 4; i++) {
                if (i > 0) sb.append("-");
                for (int j = 0; j < 4; j++) {
                    sb.append(ALPHA_NUMERIC.charAt(random.nextInt(ALPHA_NUMERIC.length())));
                }
            }
            key = sb.toString();
        } while (licenseRepository.findByLicenseKey(key).isPresent());
        return key;
    }

    @Transactional
    public List<License> getUserLicenses(Long userId) {
        List<License> licenses = licenseRepository.findByUserIdOrderByCreatedAtDesc(userId);
        licenses.forEach(this::checkAndUpdateExpiry);
        return licenses;
    }

    @Transactional
    public License getLicenseById(Long userId, Long licenseId) {
        License license = licenseRepository.findByIdAndUserId(licenseId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("License", "id", licenseId));
        checkAndUpdateExpiry(license);
        return license;
    }

    @Transactional
    public License getLicenseByKey(String licenseKey) {
        License license = licenseRepository.findByLicenseKey(licenseKey)
                .orElseThrow(() -> new ResourceNotFoundException("License", "licenseKey", licenseKey));
        checkAndUpdateExpiry(license);
        return license;
    }

    @Transactional
    public DeviceActivation activateDevice(Long userId, String licenseKey, DeviceActivationRequest request) {
        License license = licenseRepository.findByLicenseKey(licenseKey)
                .orElseThrow(() -> new ResourceNotFoundException("License", "licenseKey", licenseKey));

        if (userId != null && license.getUser() != null && !license.getUser().getId().equals(userId)) {
            throw new BadRequestException("Unauthorized: License belongs to another user.");
        }

        checkAndUpdateExpiry(license);

        if (license.getStatus() != LicenseStatus.ACTIVE) {
            throw new BadRequestException("Cannot activate device: License is " + license.getStatus());
        }

        // Check if device already activated for this license
        Optional<DeviceActivation> existingOpt = deviceActivationRepository.findByLicenseIdAndDeviceIdentifier(
                license.getId(), request.getDeviceIdentifier());

        int currentCount = license.getActivationCount() != null ? license.getActivationCount() : 0;
        int limit = license.getActivationLimit() != null ? license.getActivationLimit() : 1;

        if (existingOpt.isPresent()) {
            DeviceActivation existing = existingOpt.get();
            if (existing.isActive()) {
                existing.setLastSeenAt(LocalDateTime.now());
                return deviceActivationRepository.save(existing);
            } else {
                existing.setActive(true);
                existing.setLastSeenAt(LocalDateTime.now());
                deviceActivationRepository.save(existing);
                license.setActivationCount(currentCount + 1);
                licenseRepository.save(license);
                return existing;
            }
        }

        // Enforce activation limit
        if (currentCount >= limit) {
            throw new BadRequestException("Activation limit reached for license (" + limit + " max).");
        }

        DeviceActivation activation = DeviceActivation.builder()
                .license(license)
                .deviceIdentifier(request.getDeviceIdentifier())
                .deviceName(request.getDeviceName())
                .operatingSystem(request.getOperatingSystem())
                .applicationVersion(request.getApplicationVersion())
                .active(true)
                .build();

        DeviceActivation saved = deviceActivationRepository.save(activation);

        license.setActivationCount(currentCount + 1);
        licenseRepository.save(license);

        return saved;
    }

    @Transactional
    public DeviceActivation deactivateDevice(Long userId, String licenseKey, String deviceIdentifier) {
        License license = licenseRepository.findByLicenseKey(licenseKey)
                .orElseThrow(() -> new ResourceNotFoundException("License", "licenseKey", licenseKey));

        if (userId != null && license.getUser() != null && !license.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("License", "licenseKey", licenseKey);
        }

        DeviceActivation activation = deviceActivationRepository.findByLicenseIdAndDeviceIdentifier(
                license.getId(), deviceIdentifier)
                .orElseThrow(() -> new ResourceNotFoundException("DeviceActivation", "deviceIdentifier", deviceIdentifier));

        if (activation.isActive()) {
            activation.setActive(false);
            deviceActivationRepository.save(activation);

            license.setActivationCount(Math.max(0, license.getActivationCount() - 1));
            licenseRepository.save(license);
        }

        return activation;
    }

    public List<DeviceActivation> getLicenseDevices(String licenseKey) {
        License license = licenseRepository.findByLicenseKey(licenseKey)
                .orElseThrow(() -> new ResourceNotFoundException("License", "licenseKey", licenseKey));

        return deviceActivationRepository.findByLicenseId(license.getId());
    }

    @Transactional
    public List<License> getAllLicensesAdmin() {
        List<License> licenses = licenseRepository.findAll();
        licenses.forEach(this::checkAndUpdateExpiry);
        return licenses;
    }

    @Transactional
    public License getLicenseByIdAdmin(Long licenseId) {
        License license = licenseRepository.findById(licenseId)
                .orElseThrow(() -> new ResourceNotFoundException("License", "id", licenseId));
        checkAndUpdateExpiry(license);
        return license;
    }

    @Transactional
    public License updateLicenseStatusAdmin(Long licenseId, LicenseStatus status) {
        License license = licenseRepository.findById(licenseId)
                .orElseThrow(() -> new ResourceNotFoundException("License", "id", licenseId));

        license.setStatus(status);
        if (status == LicenseStatus.REVOKED) {
            license.setRevokedAt(LocalDateTime.now());
        }
        return licenseRepository.save(license);
    }

    @Transactional
    public License revokeLicenseAdmin(Long licenseId) {
        return updateLicenseStatusAdmin(licenseId, LicenseStatus.REVOKED);
    }

    public void checkAndUpdateExpiry(License license) {
        if (license.getExpiresAt() != null &&
            license.getExpiresAt().isBefore(LocalDateTime.now()) &&
            license.getStatus() == LicenseStatus.ACTIVE) {
            
            license.setStatus(LicenseStatus.EXPIRED);
            licenseRepository.save(license);
        }
    }
}
