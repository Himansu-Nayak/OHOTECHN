package com.ohotech.backend.repository;

import com.ohotech.backend.entity.AIUsage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AIUsageRepository extends JpaRepository<AIUsage, Long> {
    List<AIUsage> findByUserIdOrderByTimestampDesc(Long userId);
}
