package com.ohotech.backend.repository;

import com.ohotech.backend.entity.CrmWhatsAppMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CrmWhatsAppMessageRepository extends JpaRepository<CrmWhatsAppMessage, Long> {

    Page<CrmWhatsAppMessage> findByStatus(String status, Pageable pageable);

    Optional<CrmWhatsAppMessage> findByWamid(String wamid);

    long countByStatus(String status);
}
