package com.ohotech.backend.service;

import com.ohotech.backend.dto.*;
import com.ohotech.backend.entity.*;
import com.ohotech.backend.exception.ResourceNotFoundException;
import com.ohotech.backend.repository.ContactRepository;
import com.ohotech.backend.repository.LeadRepository;
import com.ohotech.backend.repository.ProductRepository;
import com.ohotech.backend.repository.UserRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LeadService {

    private final LeadRepository leadRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ContactRepository contactRepository;
    private final AuditService auditService;

    @Transactional(readOnly = true)
    public Page<LeadDto> getLeads(String search, LeadStatus status, LeadSource source, LeadPriority priority,
                                  Long assignedToId, LocalDate startDate, LocalDate endDate, Pageable pageable) {
        Specification<Lead> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(search)) {
                String pattern = "%" + search.trim().toLowerCase() + "%";
                Predicate fName = cb.like(cb.lower(root.get("firstName")), pattern);
                Predicate lName = cb.like(cb.lower(root.get("lastName")), pattern);
                Predicate email = cb.like(cb.lower(root.get("email")), pattern);
                Predicate phone = cb.like(cb.lower(root.get("phone")), pattern);
                Predicate company = cb.like(cb.lower(root.get("companyName")), pattern);
                Predicate product = cb.like(cb.lower(root.get("interestedProduct")), pattern);
                predicates.add(cb.or(fName, lName, email, phone, company, product));
            }

            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }
            if (source != null) {
                predicates.add(cb.equal(root.get("source"), source));
            }
            if (priority != null) {
                predicates.add(cb.equal(root.get("priority"), priority));
            }
            if (assignedToId != null) {
                predicates.add(cb.equal(root.get("assignedTo").get("id"), assignedToId));
            }
            if (startDate != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("createdAt"), startDate.atStartOfDay()));
            }
            if (endDate != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("createdAt"), endDate.atTime(LocalTime.MAX)));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return leadRepository.findAll(spec, pageable).map(this::mapToDto);
    }

    @Transactional(readOnly = true)
    public LeadDto getLeadById(Long id) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead", "id", id));
        return mapToDto(lead);
    }

    @Transactional
    public LeadDto createLead(CreateLeadRequest request) {
        User assignedTo = null;
        if (request.getAssignedToId() != null) {
            assignedTo = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getAssignedToId()));
        }

        Product productRef = null;
        if (request.getInterestedProductId() != null) {
            productRef = productRepository.findById(request.getInterestedProductId())
                    .orElse(null);
        }

        ContactEnquiry enquiryRef = null;
        if (request.getContactEnquiryId() != null) {
            enquiryRef = contactRepository.findById(request.getContactEnquiryId())
                    .orElse(null);
        }

        Lead lead = Lead.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .companyName(request.getCompanyName())
                .designation(request.getDesignation())
                .industry(request.getIndustry())
                .city(request.getCity())
                .state(request.getState())
                .country(request.getCountry())
                .interestedProduct(request.getInterestedProduct())
                .interestedProductRef(productRef)
                .source(request.getSource() != null ? request.getSource() : LeadSource.MANUAL)
                .sourceDetails(request.getSourceDetails())
                .campaign(request.getCampaign())
                .medium(request.getMedium())
                .landingPage(request.getLandingPage())
                .utmSource(request.getUtmSource())
                .utmMedium(request.getUtmMedium())
                .utmCampaign(request.getUtmCampaign())
                .utmTerm(request.getUtmTerm())
                .utmContent(request.getUtmContent())
                .status(request.getStatus() != null ? request.getStatus() : LeadStatus.NEW)
                .priority(request.getPriority() != null ? request.getPriority() : LeadPriority.MEDIUM)
                .assignedTo(assignedTo)
                .contactEnquiry(enquiryRef)
                .estimatedValue(request.getEstimatedValue())
                .notes(request.getNotes())
                .lastContactedAt(request.getLastContactedAt())
                .nextFollowUpAt(request.getNextFollowUpAt())
                .build();

        Lead saved = leadRepository.save(lead);

        auditService.logEvent("LEAD_CREATED", "CRM_LEAD", saved.getId().toString(),
                "Created CRM Lead for " + saved.getEmail() + " from source " + saved.getSource());

        return mapToDto(saved);
    }

    @Transactional
    public LeadDto updateLead(Long id, UpdateLeadRequest request) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead", "id", id));

        String prevVal = "Status: " + lead.getStatus() + ", Priority: " + lead.getPriority();

        if (request.getFirstName() != null) lead.setFirstName(request.getFirstName());
        if (request.getLastName() != null) lead.setLastName(request.getLastName());
        if (request.getEmail() != null) lead.setEmail(request.getEmail());
        if (request.getPhone() != null) lead.setPhone(request.getPhone());
        if (request.getCompanyName() != null) lead.setCompanyName(request.getCompanyName());
        if (request.getDesignation() != null) lead.setDesignation(request.getDesignation());
        if (request.getIndustry() != null) lead.setIndustry(request.getIndustry());
        if (request.getCity() != null) lead.setCity(request.getCity());
        if (request.getState() != null) lead.setState(request.getState());
        if (request.getCountry() != null) lead.setCountry(request.getCountry());
        if (request.getInterestedProduct() != null) lead.setInterestedProduct(request.getInterestedProduct());
        if (request.getSource() != null) lead.setSource(request.getSource());
        if (request.getSourceDetails() != null) lead.setSourceDetails(request.getSourceDetails());
        if (request.getCampaign() != null) lead.setCampaign(request.getCampaign());
        if (request.getMedium() != null) lead.setMedium(request.getMedium());
        if (request.getLandingPage() != null) lead.setLandingPage(request.getLandingPage());
        if (request.getUtmSource() != null) lead.setUtmSource(request.getUtmSource());
        if (request.getUtmMedium() != null) lead.setUtmMedium(request.getUtmMedium());
        if (request.getUtmCampaign() != null) lead.setUtmCampaign(request.getUtmCampaign());
        if (request.getUtmTerm() != null) lead.setUtmTerm(request.getUtmTerm());
        if (request.getUtmContent() != null) lead.setUtmContent(request.getUtmContent());
        if (request.getStatus() != null) lead.setStatus(request.getStatus());
        if (request.getPriority() != null) lead.setPriority(request.getPriority());
        if (request.getEstimatedValue() != null) lead.setEstimatedValue(request.getEstimatedValue());
        if (request.getNotes() != null) lead.setNotes(request.getNotes());
        if (request.getLastContactedAt() != null) lead.setLastContactedAt(request.getLastContactedAt());
        if (request.getNextFollowUpAt() != null) lead.setNextFollowUpAt(request.getNextFollowUpAt());

        if (request.getInterestedProductId() != null) {
            Product productRef = productRepository.findById(request.getInterestedProductId()).orElse(null);
            lead.setInterestedProductRef(productRef);
        }

        if (request.getAssignedToId() != null) {
            User assignedTo = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getAssignedToId()));
            lead.setAssignedTo(assignedTo);
        }

        Lead updated = leadRepository.save(lead);

        String newVal = "Status: " + updated.getStatus() + ", Priority: " + updated.getPriority();
        auditService.logEvent("LEAD_UPDATED", "CRM_LEAD", updated.getId().toString(),
                "Updated CRM Lead #" + updated.getId() + " (" + updated.getEmail() + ")");

        return mapToDto(updated);
    }

    @Transactional
    public LeadDto updateLeadStatus(Long id, LeadStatus newStatus) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead", "id", id));

        LeadStatus oldStatus = lead.getStatus();
        lead.setStatus(newStatus);
        Lead updated = leadRepository.save(lead);

        auditService.logEvent("LEAD_STATUS_CHANGED", "CRM_LEAD", updated.getId().toString(),
                "Changed status of CRM Lead #" + updated.getId() + " from " + oldStatus + " to " + newStatus);

        return mapToDto(updated);
    }

    @Transactional
    public LeadDto assignLead(Long id, Long assignedToId) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead", "id", id));

        User assignedUser = null;
        if (assignedToId != null) {
            assignedUser = userRepository.findById(assignedToId)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", assignedToId));
        }

        lead.setAssignedTo(assignedUser);
        Lead updated = leadRepository.save(lead);

        String assigneeName = assignedUser != null ? assignedUser.getName() : "Unassigned";
        auditService.logEvent("LEAD_ASSIGNED", "CRM_LEAD", updated.getId().toString(),
                "Assigned CRM Lead #" + updated.getId() + " to " + assigneeName);

        return mapToDto(updated);
    }

    @Transactional
    public void deleteLead(Long id) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead", "id", id));

        leadRepository.delete(lead);

        auditService.logEvent("LEAD_DELETED", "CRM_LEAD", id.toString(),
                "Deleted CRM Lead #" + id + " (" + lead.getEmail() + ")");
    }

    public LeadDto mapToDto(Lead lead) {
        return LeadDto.builder()
                .id(lead.getId())
                .firstName(lead.getFirstName())
                .lastName(lead.getLastName())
                .email(lead.getEmail())
                .phone(lead.getPhone())
                .companyName(lead.getCompanyName())
                .designation(lead.getDesignation())
                .industry(lead.getIndustry())
                .city(lead.getCity())
                .state(lead.getState())
                .country(lead.getCountry())
                .interestedProduct(lead.getInterestedProduct())
                .interestedProductId(lead.getInterestedProductRef() != null ? lead.getInterestedProductRef().getId() : null)
                .interestedProductName(lead.getInterestedProductRef() != null ? lead.getInterestedProductRef().getName() : null)
                .source(lead.getSource())
                .sourceDetails(lead.getSourceDetails())
                .campaign(lead.getCampaign())
                .medium(lead.getMedium())
                .landingPage(lead.getLandingPage())
                .utmSource(lead.getUtmSource())
                .utmMedium(lead.getUtmMedium())
                .utmCampaign(lead.getUtmCampaign())
                .utmTerm(lead.getUtmTerm())
                .utmContent(lead.getUtmContent())
                .status(lead.getStatus())
                .priority(lead.getPriority())
                .assignedToId(lead.getAssignedTo() != null ? lead.getAssignedTo().getId() : null)
                .assignedToName(lead.getAssignedTo() != null ? lead.getAssignedTo().getName() : null)
                .assignedToEmail(lead.getAssignedTo() != null ? lead.getAssignedTo().getEmail() : null)
                .contactEnquiryId(lead.getContactEnquiry() != null ? lead.getContactEnquiry().getId() : null)
                .estimatedValue(lead.getEstimatedValue())
                .notes(lead.getNotes())
                .createdAt(lead.getCreatedAt())
                .updatedAt(lead.getUpdatedAt())
                .lastContactedAt(lead.getLastContactedAt())
                .nextFollowUpAt(lead.getNextFollowUpAt())
                .convertedAt(lead.getConvertedAt())
                .convertedById(lead.getConvertedBy() != null ? lead.getConvertedBy().getId() : null)
                .convertedByName(lead.getConvertedBy() != null ? lead.getConvertedBy().getName() : null)
                .convertedUserId(lead.getConvertedUser() != null ? lead.getConvertedUser().getId() : null)
                .convertedUserName(lead.getConvertedUser() != null ? lead.getConvertedUser().getName() : null)
                .convertedUserEmail(lead.getConvertedUser() != null ? lead.getConvertedUser().getEmail() : null)
                .isConverted(lead.getConvertedUser() != null)
                .build();
    }
}
