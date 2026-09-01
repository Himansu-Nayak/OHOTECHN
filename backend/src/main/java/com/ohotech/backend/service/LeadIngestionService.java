package com.ohotech.backend.service;

import com.ohotech.backend.dto.LeadDto;
import com.ohotech.backend.dto.NormalizedLeadInput;
import com.ohotech.backend.entity.*;
import com.ohotech.backend.repository.LeadRepository;
import com.ohotech.backend.repository.UserRepository;
import com.ohotech.backend.repository.WebhookEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class LeadIngestionService {

    private final LeadRepository leadRepository;
    private final UserRepository userRepository;
    private final WebhookEventRepository webhookEventRepository;
    private final LeadService leadService;
    private final AuditService auditService;

    @Transactional
    public LeadDto ingestLead(NormalizedLeadInput input) {
        if (input == null || input.getSource() == null) {
            throw new IllegalArgumentException("Normalized lead input and source are required");
        }

        String providerName = input.getSourceName() != null ? input.getSourceName().toUpperCase() : input.getSource().name();
        String externalEventId = input.getExternalEventId();
        String externalLeadId = input.getExternalLeadId();

        // 1. Idempotency Check by Event ID or Lead ID
        if (externalEventId != null && webhookEventRepository.existsByProviderAndExternalEventId(providerName, externalEventId)) {
            log.info("Idempotent duplicate webhook event [{}] received for provider [{}]; skipping lead creation", externalEventId, providerName);
            saveWebhookLog(providerName, externalEventId, externalLeadId, "LEAD_INGESTION", WebhookEventStatus.DUPLICATE, null, "Duplicate event delivery");
            
            // Return existing lead if found
            Optional<Lead> existing = findExistingLead(externalLeadId, input.getEmail(), input.getPhone());
            if (existing.isPresent()) {
                return leadService.mapToDto(existing.get());
            }
        }

        if (externalLeadId != null && webhookEventRepository.existsByProviderAndExternalLeadIdAndStatus(providerName, externalLeadId, WebhookEventStatus.PROCESSED)) {
            log.info("Idempotent duplicate webhook lead ID [{}] already processed for provider [{}]; updating existing lead", externalLeadId, providerName);
            saveWebhookLog(providerName, externalEventId, externalLeadId, "LEAD_INGESTION", WebhookEventStatus.DUPLICATE, null, "Duplicate lead ID delivery");
        }

        // 2. Normalize contact data
        String emailClean = input.getEmail() != null ? input.getEmail().trim().toLowerCase() : null;
        String phoneClean = input.getPhone() != null ? input.getPhone().trim().replaceAll("[^0-9+]", "") : null;

        if ((emailClean == null || emailClean.isBlank()) && (phoneClean == null || phoneClean.isBlank()) && (externalLeadId == null || externalLeadId.isBlank())) {
            saveWebhookLog(providerName, externalEventId, externalLeadId, "LEAD_INGESTION", WebhookEventStatus.FAILED, "Missing email, phone, and external lead ID", "Validation failed");
            throw new IllegalArgumentException("Lead payload must contain at least email, phone, or external lead ID");
        }

        // 3. Deduplication Check (Priority: External ID -> Email -> Phone)
        Optional<Lead> existingLeadOpt = findExistingLead(externalLeadId, emailClean, phoneClean);

        Lead savedLead;
        if (existingLeadOpt.isPresent()) {
            // Update existing lead
            Lead existing = existingLeadOpt.get();
            log.info("Found existing CRM Lead #{} matching external lead input ({})", existing.getId(), emailClean);

            existing.setLastContactedAt(LocalDateTime.now());
            if (existing.getExternalLeadId() == null && externalLeadId != null) existing.setExternalLeadId(externalLeadId);
            if (input.getFirstName() != null && existing.getFirstName() == null) existing.setFirstName(input.getFirstName());
            if (input.getLastName() != null && existing.getLastName() == null) existing.setLastName(input.getLastName());
            if (phoneClean != null && existing.getPhone() == null) existing.setPhone(phoneClean);
            if (input.getCompany() != null && existing.getCompanyName() == null) existing.setCompanyName(input.getCompany());
            if (input.getDesignation() != null && existing.getDesignation() == null) existing.setDesignation(input.getDesignation());
            if (input.getProductInterest() != null && existing.getInterestedProduct() == null) existing.setInterestedProduct(input.getProductInterest());

            // Update attribution if missing
            if (existing.getCampaign() == null && input.getCampaign() != null) existing.setCampaign(input.getCampaign());
            if (existing.getMedium() == null && input.getMedium() != null) existing.setMedium(input.getMedium());
            if (existing.getUtmSource() == null && input.getUtmSource() != null) existing.setUtmSource(input.getUtmSource());
            if (existing.getUtmMedium() == null && input.getUtmMedium() != null) existing.setUtmMedium(input.getUtmMedium());
            if (existing.getUtmCampaign() == null && input.getUtmCampaign() != null) existing.setUtmCampaign(input.getUtmCampaign());
            if (existing.getExternalAdSetId() == null && input.getAdSetId() != null) existing.setExternalAdSetId(input.getAdSetId());
            if (existing.getExternalAdId() == null && input.getAdId() != null) existing.setExternalAdId(input.getAdId());

            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
            String noteEntry = "\n\n[External Ingestion - " + providerName + " - " + timestamp + "]: " + (input.getMessage() != null ? input.getMessage() : "Re-engaged from marketing campaign");
            existing.setNotes(existing.getNotes() != null ? existing.getNotes() + noteEntry : noteEntry.trim());

            savedLead = leadRepository.save(existing);
            auditService.logEvent("LEAD_UPDATED_WEBHOOK", "CRM_LEAD", savedLead.getId().toString(),
                    "Updated existing CRM Lead #" + savedLead.getId() + " from " + providerName + " webhook");
        } else {
            // Create new lead
            Lead lead = Lead.builder()
                    .firstName(input.getFirstName())
                    .lastName(input.getLastName())
                    .email(emailClean != null ? emailClean : ("external_" + System.currentTimeMillis() + "@ohotech.crm"))
                    .phone(phoneClean)
                    .companyName(input.getCompany())
                    .designation(input.getDesignation())
                    .industry(input.getIndustry())
                    .city(input.getCity())
                    .state(input.getState())
                    .country(input.getCountry())
                    .interestedProduct(input.getProductInterest())
                    .source(input.getSource())
                    .sourceDetails("Webhook Ingestion: " + providerName)
                    .campaign(input.getCampaign() != null ? input.getCampaign() : input.getCampaignId())
                    .medium(input.getMedium() != null ? input.getMedium() : "cpc")
                    .landingPage(input.getLandingPage())
                    .externalLeadId(externalLeadId)
                    .externalCampaignId(input.getCampaignId())
                    .externalAdSetId(input.getAdSetId())
                    .externalAdSet(input.getAdSet())
                    .externalAdId(input.getAdId())
                    .externalAd(input.getAd())
                    .utmSource(input.getUtmSource() != null ? input.getUtmSource() : providerName.toLowerCase())
                    .utmMedium(input.getUtmMedium() != null ? input.getUtmMedium() : "cpc")
                    .utmCampaign(input.getUtmCampaign() != null ? input.getUtmCampaign() : input.getCampaignId())
                    .utmTerm(input.getUtmTerm())
                    .utmContent(input.getUtmContent())
                    .status(input.getStatus() != null ? input.getStatus() : LeadStatus.NEW)
                    .priority(input.getPriority() != null ? input.getPriority() : LeadPriority.MEDIUM)
                    .notes(input.getMessage())
                    .lastContactedAt(LocalDateTime.now())
                    .build();

            savedLead = leadRepository.save(lead);
            auditService.logEvent("LEAD_INGESTED_WEBHOOK", "CRM_LEAD", savedLead.getId().toString(),
                    "Ingested new CRM Lead #" + savedLead.getId() + " (" + savedLead.getEmail() + ") from " + providerName + " webhook");
        }

        // Save webhook log event
        saveWebhookLog(providerName, externalEventId, externalLeadId, "LEAD_INGESTION", WebhookEventStatus.PROCESSED, null,
                "Successfully processed lead for " + savedLead.getEmail());

        return leadService.mapToDto(savedLead);
    }

    private Optional<Lead> findExistingLead(String externalLeadId, String email, String phone) {
        if (externalLeadId != null && !externalLeadId.isBlank()) {
            Optional<Lead> byExtId = leadRepository.findByExternalLeadId(externalLeadId);
            if (byExtId.isPresent()) return byExtId;
        }

        if (email != null && !email.isBlank()) {
            Optional<Lead> byEmail = leadRepository.findByEmail(email);
            if (byEmail.isPresent()) return byEmail;
        }

        if (phone != null && !phone.isBlank()) {
            Optional<Lead> byPhone = leadRepository.findByPhone(phone);
            if (byPhone.isPresent()) return byPhone;
        }

        return Optional.empty();
    }

    private void saveWebhookLog(String provider, String eventId, String leadId, String eventType,
                                WebhookEventStatus status, String errorReason, String summary) {
        try {
            String uniqueEventId = eventId;
            if (eventId != null && webhookEventRepository.existsByProviderAndExternalEventId(provider, eventId)) {
                uniqueEventId = eventId + "_dup_" + System.currentTimeMillis();
            }

            WebhookEvent logEntry = WebhookEvent.builder()
                    .provider(provider)
                    .externalEventId(uniqueEventId != null ? uniqueEventId : ("EVT_" + System.currentTimeMillis()))
                    .externalLeadId(leadId)
                    .eventType(eventType)
                    .status(status)
                    .processedAt(LocalDateTime.now())
                    .errorReason(errorReason)
                    .payloadSummary(summary)
                    .build();
            webhookEventRepository.save(logEntry);
        } catch (Exception e) {
            log.warn("Failed to persist webhook log entry: {}", e.getMessage());
        }
    }
}
