package com.ohotech.backend.repository;

import com.ohotech.backend.entity.Platform;
import com.ohotech.backend.entity.SoftwareRelease;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SoftwareReleaseRepository extends JpaRepository<SoftwareRelease, Long> {
    List<SoftwareRelease> findByProductId(Long productId);
    List<SoftwareRelease> findByProductIdAndActiveTrue(Long productId);
    List<SoftwareRelease> findByProductIdAndPlatformAndActiveTrue(Long productId, Platform platform);
    Optional<SoftwareRelease> findByIdAndProductId(Long id, Long productId);
}
