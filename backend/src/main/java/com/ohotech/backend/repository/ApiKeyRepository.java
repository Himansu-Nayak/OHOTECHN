package com.ohotech.backend.repository;

import com.ohotech.backend.entity.ApiKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApiKeyRepository extends JpaRepository<ApiKey, Long> {
    List<ApiKey> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<ApiKey> findAllByOrderByCreatedAtDesc();
    Optional<ApiKey> findByKeyHash(String keyHash);
    long countByActiveTrue();
}
