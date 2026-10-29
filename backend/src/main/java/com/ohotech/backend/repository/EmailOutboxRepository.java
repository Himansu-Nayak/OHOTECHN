package com.ohotech.backend.repository;

import com.ohotech.backend.entity.EmailOutbox;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface EmailOutboxRepository extends JpaRepository<EmailOutbox, Long> {

    Page<EmailOutbox> findByStatus(String status, Pageable pageable);

    Page<EmailOutbox> findByCategory(String category, Pageable pageable);

    Page<EmailOutbox> findByStatusAndCategory(String status, String category, Pageable pageable);

    Optional<EmailOutbox> findByIdempotencyKey(String idempotencyKey);

    boolean existsByRecipientAndSubjectAndCreatedAtAfter(String recipient, String subject, LocalDateTime after);

    long countByStatus(String status);
}
