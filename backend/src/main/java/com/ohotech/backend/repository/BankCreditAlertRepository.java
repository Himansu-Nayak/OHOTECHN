package com.ohotech.backend.repository;

import com.ohotech.backend.entity.BankCreditAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BankCreditAlertRepository extends JpaRepository<BankCreditAlert, Long> {

    Optional<BankCreditAlert> findByRrn(String rrn);

    boolean existsByRrn(String rrn);

    @Query("SELECT b FROM BankCreditAlert b WHERE b.amount = :amount AND b.status = 'PENDING' AND b.receivedAt >= :afterTime ORDER BY b.receivedAt DESC")
    List<BankCreditAlert> findPendingByAmountSince(@Param("amount") BigDecimal amount, @Param("afterTime") LocalDateTime afterTime);

    List<BankCreditAlert> findAllByStatusOrderByReceivedAtDesc(String status);
}
