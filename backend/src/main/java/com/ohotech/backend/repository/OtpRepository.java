package com.ohotech.backend.repository;

import com.ohotech.backend.entity.OtpPurpose;
import com.ohotech.backend.entity.OtpVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<OtpVerification, Long> {
    Optional<OtpVerification> findFirstByTargetAndPurposeOrderByCreatedAtDesc(String target, OtpPurpose purpose);
    Optional<OtpVerification> findFirstByTargetOrderByCreatedAtDesc(String target);
    Optional<OtpVerification> findByTargetAndResetToken(String target, String resetToken);
    void deleteByTarget(String target);
}
