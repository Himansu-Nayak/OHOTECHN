package com.ohotech.backend.repository;

import com.ohotech.backend.entity.WebhookEvent;
import com.ohotech.backend.entity.WebhookEventStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WebhookEventRepository extends JpaRepository<WebhookEvent, Long> {

    Optional<WebhookEvent> findByProviderAndExternalEventId(String provider, String externalEventId);

    Optional<WebhookEvent> findByProviderAndExternalLeadId(String provider, String externalLeadId);

    boolean existsByProviderAndExternalEventId(String provider, String externalEventId);

    boolean existsByProviderAndExternalLeadIdAndStatus(String provider, String externalLeadId, WebhookEventStatus status);

    java.util.List<WebhookEvent> findTop50ByOrderByReceivedAtDesc();

    java.util.List<WebhookEvent> findByProviderOrderByReceivedAtDesc(String provider);
}
