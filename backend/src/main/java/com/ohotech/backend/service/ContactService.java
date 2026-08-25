package com.ohotech.backend.service;

import com.ohotech.backend.dto.ContactRequest;
import com.ohotech.backend.entity.*;
import com.ohotech.backend.exception.ResourceNotFoundException;
import com.ohotech.backend.repository.ContactRepository;
import com.ohotech.backend.repository.LeadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactRepository contactRepository;
    private final LeadRepository leadRepository;
    private final EmailService emailService;
    private final AuditService auditService;

    @Value("${app.contact.admin-email:admin@ohotech.com}")
    private String adminEmail;

    @Transactional
    public ContactEnquiry createEnquiry(ContactRequest request) {
        ContactEnquiry enquiry = ContactEnquiry.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .subject(request.getSubject())
                .message(request.getMessage())
                .status("PENDING")
                .build();

        ContactEnquiry saved = contactRepository.save(enquiry);

        // Process CRM Lead: Deduplication or New Lead Creation
        try {
            String emailClean = request.getEmail() != null ? request.getEmail().trim().toLowerCase() : "";
            String fullName = request.getName() != null ? request.getName().trim() : "";
            String firstName = fullName;
            String lastName = "";
            if (fullName.contains(" ")) {
                String[] parts = fullName.split("\\s+", 2);
                firstName = parts[0];
                lastName = parts[1];
            }

            LeadSource source = request.getSource();
            if (source == null) {
                source = LeadSource.CONTACT_FORM;
                if (request.getSubject() != null) {
                    String sub = request.getSubject().toLowerCase();
                    if (sub.contains("demo")) {
                        source = LeadSource.DEMO_REQUEST;
                    } else if (sub.contains("quote")) {
                        source = LeadSource.QUOTE_REQUEST;
                    } else if (sub.contains("product")) {
                        source = LeadSource.WEBSITE_PRODUCT;
                    }
                }
            }

            String productInterest = request.getInterestedProduct();
            if (productInterest == null || productInterest.isBlank()) {
                productInterest = request.getSubject();
            }

            String campaignName = request.getUtmCampaign() != null ? request.getUtmCampaign() : request.getSubject();
            String mediumName = request.getUtmMedium() != null ? request.getUtmMedium() : "website";

            // Check duplicate lead by email
            Optional<Lead> existingOpt = leadRepository.findByEmail(emailClean);

            if (existingOpt.isPresent()) {
                // Update existing lead (deduplication)
                Lead existing = existingOpt.get();
                existing.setLastContactedAt(LocalDateTime.now());
                if (request.getPhone() != null && !request.getPhone().isBlank()) existing.setPhone(request.getPhone());
                if (request.getCompany() != null && !request.getCompany().isBlank()) existing.setCompanyName(request.getCompany());
                if (productInterest != null && !productInterest.isBlank()) existing.setInterestedProduct(productInterest);

                if (request.getUtmSource() != null) existing.setUtmSource(request.getUtmSource());
                if (request.getUtmMedium() != null) existing.setUtmMedium(request.getUtmMedium());
                if (request.getUtmCampaign() != null) existing.setUtmCampaign(request.getUtmCampaign());
                if (request.getUtmTerm() != null) existing.setUtmTerm(request.getUtmTerm());
                if (request.getUtmContent() != null) existing.setUtmContent(request.getUtmContent());
                if (request.getLandingPage() != null) existing.setLandingPage(request.getLandingPage());

                if (request.getUtmCampaign() != null) existing.setCampaign(request.getUtmCampaign());
                if (request.getUtmMedium() != null) existing.setMedium(request.getUtmMedium());

                String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
                String appendMsg = "\n\n[" + source + " - " + timestamp + "]: " + request.getMessage();
                existing.setNotes(existing.getNotes() != null ? existing.getNotes() + appendMsg : request.getMessage());
                existing.setContactEnquiry(saved);

                Lead updatedLead = leadRepository.save(existing);
                auditService.logEvent("LEAD_UPDATED", "CRM_LEAD", updatedLead.getId().toString(),
                        "Updated existing CRM Lead #" + updatedLead.getId() + " from " + source);
            } else {
                // Create new lead
                Lead lead = Lead.builder()
                        .firstName(firstName)
                        .lastName(lastName)
                        .email(emailClean)
                        .phone(request.getPhone())
                        .companyName(request.getCompany())
                        .interestedProduct(productInterest)
                        .source(source)
                        .sourceDetails(request.getSubject())
                        .campaign(campaignName)
                        .medium(mediumName)
                        .landingPage(request.getLandingPage())
                        .utmSource(request.getUtmSource())
                        .utmMedium(request.getUtmMedium())
                        .utmCampaign(request.getUtmCampaign())
                        .utmTerm(request.getUtmTerm())
                        .utmContent(request.getUtmContent())
                        .status(LeadStatus.NEW)
                        .priority(LeadPriority.MEDIUM)
                        .contactEnquiry(saved)
                        .notes(request.getMessage())
                        .build();

                Lead createdLead = leadRepository.save(lead);
                auditService.logEvent("LEAD_CREATED", "CRM_LEAD", createdLead.getId().toString(),
                        "Created CRM Lead #" + createdLead.getId() + " from website form " + source);
            }
        } catch (Exception e) {
            // Preserves core enquiry flow if CRM processing encounters unexpected condition
        }

        // Notify user
        emailService.sendEmail(saved.getEmail(), "OHO TECHN - We received your enquiry",
                "Hello " + saved.getName() + ",\n\nThank you for contacting OHO TECHN! We have received your message and will respond shortly.");

        // Notify admin
        emailService.sendEmail(adminEmail, "New Contact Enquiry from " + saved.getName(),
                "New enquiry received:\nName: " + saved.getName() + "\nEmail: " + saved.getEmail() + "\nMessage: " + saved.getMessage());

        return saved;
    }

    public List<ContactEnquiry> getAllEnquiriesForAdmin() {
        return contactRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional
    public ContactEnquiry updateEnquiryStatus(Long id, String status) {
        ContactEnquiry enquiry = contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ContactEnquiry", "id", id));
        enquiry.setStatus(status);
        return contactRepository.save(enquiry);
    }
}
