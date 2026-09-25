package com.ohotech.backend.repository;

import com.ohotech.backend.entity.SupportTicketMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupportTicketMessageRepository extends JpaRepository<SupportTicketMessage, Long> {

    List<SupportTicketMessage> findByTicketIdOrderByCreatedAtAsc(Long ticketId);

    List<SupportTicketMessage> findByTicketIdAndInternalNoteFalseOrderByCreatedAtAsc(Long ticketId);
}
