package com.ohotech.backend.repository;

import com.ohotech.backend.entity.PaymentSlotLease;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentSlotLeaseRepository extends JpaRepository<PaymentSlotLease, Long> {

    Optional<PaymentSlotLease> findByOrderId(Long orderId);

    @Query("SELECT p FROM PaymentSlotLease p WHERE p.orderId = :orderId AND p.status = 'ACTIVE' AND p.expiresAt > :now")
    Optional<PaymentSlotLease> findActiveByOrderId(@Param("orderId") Long orderId, @Param("now") LocalDateTime now);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM PaymentSlotLease p WHERE p.merchantVpa = :merchantVpa AND p.status = 'ACTIVE' AND p.expiresAt > :now ORDER BY p.acquiredAt ASC")
    List<PaymentSlotLease> findActiveLeasesWithLock(@Param("merchantVpa") String merchantVpa, @Param("now") LocalDateTime now);

    @Query("SELECT p FROM PaymentSlotLease p WHERE p.status = 'ACTIVE' AND p.expiresAt <= :now")
    List<PaymentSlotLease> findExpiredActiveLeases(@Param("now") LocalDateTime now);
}
