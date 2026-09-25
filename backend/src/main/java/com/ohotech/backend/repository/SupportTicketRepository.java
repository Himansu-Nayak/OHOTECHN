package com.ohotech.backend.repository;

import com.ohotech.backend.entity.SupportTicket;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SupportTicketRepository extends JpaRepository<SupportTicket, Long>, JpaSpecificationExecutor<SupportTicket> {

    Optional<SupportTicket> findByTicketCode(String ticketCode);

    List<SupportTicket> findByCustomerIdOrderByCreatedAtDesc(Long customerId);

    List<SupportTicket> findByClientEmailIgnoreCaseOrderByCreatedAtDesc(String clientEmail);

    List<SupportTicket> findAllByOrderByCreatedAtDesc();

    long countByStatus(String status);

    long countByStatusIn(List<String> statuses);

    @Query("SELECT COUNT(t) FROM SupportTicket t WHERE t.status = 'RESOLVED' AND t.resolvedAt >= :since")
    long countResolvedSince(@Param("since") LocalDateTime since);

    @Query("SELECT COUNT(t) FROM SupportTicket t WHERE t.priority = 'URGENT' AND t.status NOT IN ('RESOLVED', 'CLOSED')")
    long countUrgentPending();
}
