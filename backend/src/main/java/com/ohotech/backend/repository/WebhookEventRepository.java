package com.ohotech.backend.repository;

import com.ohotech.backend.entity.WebhookEvent;
import com.ohotech.backend.entity.WebhookEventStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WebhookEventRepository extends JpaRepository<WebhookEvent, Long>, JpaSpecificationExecutor<WebhookEvent> {

    Optional<WebhookEvent> findByProviderAndExternalEventId(String provider, String externalEventId);

    Optional<WebhookEvent> findByProviderAndExternalLeadId(String provider, String externalLeadId);

    boolean existsByProviderAndExternalEventId(String provider, String externalEventId);

    boolean existsByProviderAndExternalLeadIdAndStatus(String provider, String externalLeadId, WebhookEventStatus status);

    List<WebhookEvent> findTop50ByOrderByReceivedAtDesc();

    List<WebhookEvent> findByProviderOrderByReceivedAtDesc(String provider);

    long countByStatus(WebhookEventStatus status);
}
