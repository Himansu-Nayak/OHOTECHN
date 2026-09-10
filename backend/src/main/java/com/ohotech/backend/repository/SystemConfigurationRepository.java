package com.ohotech.backend.repository;

import com.ohotech.backend.entity.SystemConfiguration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SystemConfigurationRepository extends JpaRepository<SystemConfiguration, Long> {
    Optional<SystemConfiguration> findByConfigKey(String configKey);
    List<SystemConfiguration> findByConfigType(String configType);
    boolean existsByConfigKey(String configKey);
}
