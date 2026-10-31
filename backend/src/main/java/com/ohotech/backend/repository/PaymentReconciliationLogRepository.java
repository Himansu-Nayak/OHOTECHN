package com.ohotech.backend.repository;

import com.ohotech.backend.entity.PaymentReconciliationLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentReconciliationLogRepository extends JpaRepository<PaymentReconciliationLog, Long> {
    Optional<PaymentReconciliationLog> findTopByOrderByExecutedAtDesc();
    List<PaymentReconciliationLog> findTop10ByOrderByExecutedAtDesc();
}
