package com.ohotech.backend.repository;

import com.ohotech.backend.entity.FeatureFlag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FeatureFlagRepository extends JpaRepository<FeatureFlag, Long> {
    Optional<FeatureFlag> findByFlagKey(String flagKey);
    List<FeatureFlag> findByCategory(String category);
    boolean existsByFlagKey(String flagKey);
}
