package com.ohotech.backend.repository;

import com.ohotech.backend.entity.EmailSuppression;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmailSuppressionRepository extends JpaRepository<EmailSuppression, Long> {

    Optional<EmailSuppression> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);
}
