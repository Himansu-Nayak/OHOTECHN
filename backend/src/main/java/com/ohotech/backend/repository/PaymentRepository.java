package com.ohotech.backend.repository;

import com.ohotech.backend.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    @Query("SELECT p FROM Payment p WHERE p.order.id = :orderId")
    Optional<Payment> findByOrderId(@Param("orderId") Long orderId);

    Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);

    @Query("SELECT p FROM Payment p WHERE LOWER(p.transactionReference) = LOWER(:utr) AND p.order.id <> :orderId AND p.status = com.ohotech.backend.entity.PaymentStatus.SUCCESSFUL")
    Optional<Payment> findDuplicateVerifiedUtr(@Param("utr") String utr, @Param("orderId") Long orderId);
}
