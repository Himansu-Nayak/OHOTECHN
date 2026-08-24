package com.ohotech.backend.repository;

import com.ohotech.backend.entity.Subscription;
import com.ohotech.backend.entity.SubscriptionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    List<Subscription> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<Subscription> findByIdAndUserId(Long id, Long userId);
    List<Subscription> findByUserIdAndProductId(Long userId, Long productId);
    Optional<Subscription> findFirstByUserIdAndProductIdAndStatusIn(Long userId, Long productId, List<SubscriptionStatus> statuses);
    Optional<Subscription> findByOrderId(Long orderId);
    List<Subscription> findByStatus(SubscriptionStatus status);
}
