package com.ohotech.backend.repository;

import com.ohotech.backend.entity.Payment;
import com.ohotech.backend.entity.PaymentStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long>, JpaSpecificationExecutor<Payment> {

    @Query("SELECT p FROM Payment p WHERE p.order.id = :orderId")
    Optional<Payment> findByOrderId(@Param("orderId") Long orderId);

    Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Payment p WHERE p.razorpayOrderId = :razorpayOrderId")
    Optional<Payment> findByRazorpayOrderIdWithLock(@Param("razorpayOrderId") String razorpayOrderId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Payment p WHERE p.id = :id")
    Optional<Payment> findByIdWithLock(@Param("id") Long id);

    Optional<Payment> findByCashfreeOrderId(String cashfreeOrderId);

    Optional<Payment> findByYoupiPaymentId(String youpiPaymentId);

    @Query("SELECT p FROM Payment p WHERE LOWER(p.transactionReference) = LOWER(:utr) AND p.order.id <> :orderId AND p.status = com.ohotech.backend.entity.PaymentStatus.SUCCESSFUL")
    Optional<Payment> findDuplicateVerifiedUtr(@Param("utr") String utr, @Param("orderId") Long orderId);

    long countByStatus(PaymentStatus status);

    @Query("SELECT COUNT(p) FROM Payment p WHERE (:startDate IS NULL OR p.createdAt >= :startDate) AND (:endDate IS NULL OR p.createdAt <= :endDate)")
    long countTotalInPeriod(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.status = com.ohotech.backend.entity.PaymentStatus.SUCCESSFUL AND (:startDate IS NULL OR p.createdAt >= :startDate) AND (:endDate IS NULL OR p.createdAt <= :endDate)")
    BigDecimal sumSuccessfulAmountInPeriod(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT COUNT(p) FROM Payment p WHERE p.status = :status AND (:startDate IS NULL OR p.createdAt >= :startDate) AND (:endDate IS NULL OR p.createdAt <= :endDate)")
    long countByStatusInPeriod(@Param("status") PaymentStatus status, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.status = :status AND (:startDate IS NULL OR p.createdAt >= :startDate) AND (:endDate IS NULL OR p.createdAt <= :endDate)")
    BigDecimal sumByStatusInPeriod(@Param("status") PaymentStatus status, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
