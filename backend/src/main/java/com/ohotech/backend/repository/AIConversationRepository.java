package com.ohotech.backend.repository;

import com.ohotech.backend.entity.AIConversation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AIConversationRepository extends JpaRepository<AIConversation, Long> {
    List<AIConversation> findByUserIdOrderByUpdatedAtDesc(Long userId);
    Page<AIConversation> findByUserIdOrderByUpdatedAtDesc(Long userId, Pageable pageable);
    Optional<AIConversation> findByIdAndUserId(Long id, Long userId);
    Optional<AIConversation> findBySessionId(String sessionId);
}
