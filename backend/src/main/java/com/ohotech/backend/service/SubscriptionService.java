package com.ohotech.backend.service;

import com.ohotech.backend.entity.Subscription;
import com.ohotech.backend.entity.SubscriptionStatus;
import com.ohotech.backend.exception.ResourceNotFoundException;
import com.ohotech.backend.repository.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;

    @Transactional
    public List<Subscription> getUserSubscriptions(Long userId) {
        List<Subscription> subscriptions = subscriptionRepository.findByUserIdOrderByCreatedAtDesc(userId);
        subscriptions.forEach(this::checkAndUpdateExpiry);
        return subscriptions;
    }

    @Transactional
    public Subscription getSubscriptionById(Long userId, Long subscriptionId) {
        Subscription subscription = subscriptionRepository.findByIdAndUserId(subscriptionId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription", "id", subscriptionId));
        checkAndUpdateExpiry(subscription);
        return subscription;
    }

    @Transactional
    public Subscription cancelSubscription(Long userId, Long subscriptionId) {
        Subscription subscription = subscriptionRepository.findByIdAndUserId(subscriptionId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription", "id", subscriptionId));

        subscription.setStatus(SubscriptionStatus.CANCELLED);
        subscription.setAutoRenew(false);
        return subscriptionRepository.save(subscription);
    }

    @Transactional
    public List<Subscription> getAllSubscriptionsAdmin() {
        List<Subscription> subscriptions = subscriptionRepository.findAll();
        subscriptions.forEach(this::checkAndUpdateExpiry);
        return subscriptions;
    }

    @Transactional
    public Subscription getSubscriptionByIdAdmin(Long subscriptionId) {
        Subscription subscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription", "id", subscriptionId));
        checkAndUpdateExpiry(subscription);
        return subscription;
    }

    @Transactional
    public Subscription updateSubscriptionStatusAdmin(Long subscriptionId, SubscriptionStatus status) {
        Subscription subscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription", "id", subscriptionId));

        subscription.setStatus(status);
        return subscriptionRepository.save(subscription);
    }

    public void checkAndUpdateExpiry(Subscription subscription) {
        if (subscription.getExpiryDate() != null &&
            subscription.getExpiryDate().isBefore(LocalDateTime.now()) &&
            (subscription.getStatus() == SubscriptionStatus.ACTIVE || subscription.getStatus() == SubscriptionStatus.TRIAL)) {
            
            subscription.setStatus(SubscriptionStatus.EXPIRED);
            subscriptionRepository.save(subscription);
        }
    }
}
