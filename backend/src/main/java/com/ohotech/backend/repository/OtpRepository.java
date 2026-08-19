package com.ohotech.backend.repository;

import com.ohotech.backend.entity.OtpVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<OtpVerification, Long> {
    Optional<OtpVerification> findFirstByTargetOrderByCreatedAtDesc(String target);
    void deleteByTarget(String target);
}
