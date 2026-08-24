package com.ohotech.backend.repository;

import com.ohotech.backend.entity.DeviceActivation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeviceActivationRepository extends JpaRepository<DeviceActivation, Long> {
    List<DeviceActivation> findByLicenseId(Long licenseId);
    List<DeviceActivation> findByLicenseIdAndActiveTrue(Long licenseId);
    Optional<DeviceActivation> findByLicenseIdAndDeviceIdentifier(Long licenseId, String deviceIdentifier);
}
