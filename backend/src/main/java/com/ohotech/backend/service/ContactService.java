package com.ohotech.backend.service;

import com.ohotech.backend.dto.ContactRequest;
import com.ohotech.backend.entity.ContactEnquiry;
import com.ohotech.backend.exception.ResourceNotFoundException;
import com.ohotech.backend.repository.ContactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactRepository contactRepository;
    private final EmailService emailService;

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
