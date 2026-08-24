package com.ohotech.backend.repository;

import com.ohotech.backend.entity.License;
import com.ohotech.backend.entity.LicenseStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LicenseRepository extends JpaRepository<License, Long> {
    List<License> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<License> findByIdAndUserId(Long id, Long userId);
    Optional<License> findByLicenseKey(String licenseKey);
    List<License> findByUserIdAndProductId(Long userId, Long productId);
    Optional<License> findFirstByUserIdAndProductIdAndStatus(Long userId, Long productId, LicenseStatus status);
    Optional<License> findBySubscriptionId(Long subscriptionId);
}
