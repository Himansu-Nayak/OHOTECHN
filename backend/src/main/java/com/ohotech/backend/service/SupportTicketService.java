package com.ohotech.backend.service;

import com.ohotech.backend.dto.*;
import com.ohotech.backend.entity.*;
import com.ohotech.backend.exception.BadRequestException;
import com.ohotech.backend.exception.ResourceNotFoundException;
import com.ohotech.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SupportTicketService {

    private static final Logger logger = LoggerFactory.getLogger(SupportTicketService.class);

    private final SupportTicketRepository ticketRepository;
    private final SupportTicketMessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ContactRepository contactRepository;
    private final NotificationService notificationService;
    private final EmailService emailService;
    private final AuditService auditService;

    private final Random random = new Random();

    @Transactional
    public SupportTicketDto createCustomerTicket(Long customerId, CreateTicketRequest request) {
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", customerId));

        String ticketCode = generateUniqueTicketCode();
        String priority = request.getPriority() != null ? request.getPriority().toUpperCase() : "MEDIUM";
        String department = request.getDepartment() != null ? request.getDepartment().toUpperCase() : "TECHNICAL";

        SupportTicket ticket = SupportTicket.builder()
                .ticketCode(ticketCode)
                .subject(request.getSubject().trim())
                .description(request.getDescription().trim())
                .department(department)
                .priority(priority)
                .status("OPEN")
                .customer(customer)
                .clientName(customer.getName())
                .clientEmail(customer.getEmail())
                .clientPhone(customer.getPhone())
                .orderId(request.getOrderId())
                .build();

        ticket = ticketRepository.save(ticket);

        // Add initial ticket opening message
        SupportTicketMessage initialMsg = SupportTicketMessage.builder()
                .ticket(ticket)
                .sender(customer)
                .senderName(customer.getName())
                .senderRole("CUSTOMER")
                .message(request.getDescription().trim())
                .internalNote(false)
                .build();
        messageRepository.save(initialMsg);

        // Audit & Notification
        auditService.logUserEvent(customer, "TICKET_CREATED", "SupportTicket", String.valueOf(ticket.getId()),
                "Customer created support ticket " + ticketCode + " - " + ticket.getSubject());

        try {
            notificationService.createNotification(
                    customerId,
                    "Support Ticket Registered",
                    "Your support ticket #" + ticketCode + " has been received by our technical desk. An engineer will respond shortly.",
                    NotificationType.INFO,
                    NotificationCategory.SYSTEM,
                    "/support"
            );

            if (customer.getEmail() != null) {
                emailService.sendEmail(customer.getEmail(),
                        "OHO TECHN - Support Ticket #" + ticketCode + " Registered",
                        "Hello " + customer.getName() + ",\n\nWe have received your support request (" + ticketCode + ": " + ticket.getSubject() + ").\n\nDepartment: " + department + "\nPriority: " + priority + "\n\nOur team will review your query and reply directly to your ticket.\n\nThank you,\nOHO TECHN Support Operations");
            }
        } catch (Exception e) {
            logger.warn("Notification/Email warning on ticket creation: {}", e.getMessage());
        }

        return mapTicketToDto(ticket, true);
    }

    @Transactional
    public SupportTicketDto createGuestTicket(CreateTicketRequest request) {
        String ticketCode = generateUniqueTicketCode();
        String priority = request.getPriority() != null ? request.getPriority().toUpperCase() : "MEDIUM";
        String department = request.getDepartment() != null ? request.getDepartment().toUpperCase() : "GENERAL";

        if (request.getClientName() == null || request.getClientEmail() == null) {
            throw new BadRequestException("Name and email are required for public support requests.");
        }

        SupportTicket ticket = SupportTicket.builder()
                .ticketCode(ticketCode)
                .subject(request.getSubject().trim())
                .description(request.getDescription().trim())
                .department(department)
                .priority(priority)
                .status("OPEN")
                .clientName(request.getClientName().trim())
                .clientEmail(request.getClientEmail().trim().toLowerCase())
                .clientPhone(request.getClientPhone() != null ? request.getClientPhone().trim() : null)
                .orderId(request.getOrderId())
                .build();

        ticket = ticketRepository.save(ticket);

        SupportTicketMessage initialMsg = SupportTicketMessage.builder()
                .ticket(ticket)
                .senderName(request.getClientName().trim())
                .senderRole("CUSTOMER")
                .message(request.getDescription().trim())
                .internalNote(false)
                .build();
        messageRepository.save(initialMsg);

        try {
            emailService.sendEmail(ticket.getClientEmail(),
                    "OHO TECHN - Query Ticket #" + ticketCode + " Created",
                    "Hello " + ticket.getClientName() + ",\n\nYour query has been logged under ticket reference #" + ticketCode + ".\n\nSubject: " + ticket.getSubject() + "\n\nOur team is working on resolving it.\n\nBest regards,\nOHO TECHN Support Desk");
        } catch (Exception e) {
            logger.warn("Guest ticket email warning: {}", e.getMessage());
        }

        return mapTicketToDto(ticket, true);
    }

    @Transactional
    public SupportTicketDto convertEnquiryToTicket(Long enquiryId, Long staffUserId) {
        ContactEnquiry enquiry = contactRepository.findById(enquiryId)
                .orElseThrow(() -> new ResourceNotFoundException("ContactEnquiry", "id", enquiryId));

        User staffUser = userRepository.findById(staffUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", staffUserId));

        String ticketCode = generateUniqueTicketCode();
        SupportTicket ticket = SupportTicket.builder()
                .ticketCode(ticketCode)
                .subject(enquiry.getSubject() != null && !enquiry.getSubject().isBlank() ? enquiry.getSubject() : "Website Enquiry #" + enquiry.getId())
                .description(enquiry.getMessage())
                .department("GENERAL")
                .priority("MEDIUM")
                .status("OPEN")
                .clientName(enquiry.getName())
                .clientEmail(enquiry.getEmail())
                .clientPhone(enquiry.getPhone())
                .assignedTo(staffUser)
                .build();

        ticket = ticketRepository.save(ticket);

        SupportTicketMessage initialMsg = SupportTicketMessage.builder()
                .ticket(ticket)
                .senderName(enquiry.getName())
                .senderRole("CUSTOMER")
                .message(enquiry.getMessage())
                .internalNote(false)
                .build();
        messageRepository.save(initialMsg);

        enquiry.setStatus("RESPONDED");
        contactRepository.save(enquiry);

        auditService.logUserEvent(staffUser, "ENQUIRY_CONVERTED_TO_TICKET", "ContactEnquiry", String.valueOf(enquiryId),
                "Converted enquiry #" + enquiryId + " to support ticket " + ticketCode);

        return mapTicketToDto(ticket, true);
    }

    @Transactional(readOnly = true)
    public List<SupportTicketDto> getStaffTickets(String status, String department, String priority, String search) {
        List<SupportTicket> all = ticketRepository.findAllByOrderByCreatedAtDesc();

        return all.stream()
                .filter(t -> status == null || status.equalsIgnoreCase("ALL") || t.getStatus().equalsIgnoreCase(status))
                .filter(t -> department == null || department.equalsIgnoreCase("ALL") || t.getDepartment().equalsIgnoreCase(department))
                .filter(t -> priority == null || priority.equalsIgnoreCase("ALL") || t.getPriority().equalsIgnoreCase(priority))
                .filter(t -> {
                    if (search == null || search.isBlank()) return true;
                    String q = search.trim().toLowerCase();
                    return t.getTicketCode().toLowerCase().contains(q) ||
                            t.getSubject().toLowerCase().contains(q) ||
                            t.getClientName().toLowerCase().contains(q) ||
                            t.getClientEmail().toLowerCase().contains(q) ||
                            (t.getClientPhone() != null && t.getClientPhone().contains(q));
                })
                .map(t -> mapTicketToDto(t, false))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SupportTicketDto> getCustomerTickets(Long customerId) {
        List<SupportTicket> tickets = ticketRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
        return tickets.stream().map(t -> mapTicketToDto(t, false)).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SupportTicketDto getTicketDetailsForStaff(Long ticketId) {
        SupportTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("SupportTicket", "id", ticketId));
        return mapTicketToDto(ticket, true);
    }

    @Transactional(readOnly = true)
    public SupportTicketDto getTicketDetailsForCustomer(Long customerId, Long ticketId) {
        SupportTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("SupportTicket", "id", ticketId));

        if (ticket.getCustomer() == null || !ticket.getCustomer().getId().equals(customerId)) {
            throw new ResourceNotFoundException("SupportTicket", "id", ticketId);
        }

        // Return only public messages for customer
        SupportTicketDto dto = mapTicketToDto(ticket, false);
        List<SupportTicketMessage> publicMsgs = messageRepository.findByTicketIdAndInternalNoteFalseOrderByCreatedAtAsc(ticketId);
        dto.setMessages(publicMsgs.stream().map(this::mapMessageToDto).collect(Collectors.toList()));
        return dto;
    }

    @Transactional
    public SupportTicketDto addStaffReply(Long staffUserId, Long ticketId, TicketReplyRequest request) {
        SupportTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("SupportTicket", "id", ticketId));

        User staffUser = userRepository.findById(staffUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", staffUserId));

        SupportTicketMessage msg = SupportTicketMessage.builder()
                .ticket(ticket)
                .sender(staffUser)
                .senderName(staffUser.getName())
                .senderRole(staffUser.getRole().name().replace("ROLE_", ""))
                .message(request.getMessage().trim())
                .internalNote(request.isInternalNote())
                .build();
        messageRepository.save(msg);

        // Update status if requested
        if (request.getNewStatus() != null && !request.getNewStatus().isBlank()) {
            ticket.setStatus(request.getNewStatus().toUpperCase());
            if ("RESOLVED".equalsIgnoreCase(ticket.getStatus()) || "CLOSED".equalsIgnoreCase(ticket.getStatus())) {
                ticket.setResolvedAt(LocalDateTime.now());
            }
        } else if (!request.isInternalNote() && "OPEN".equalsIgnoreCase(ticket.getStatus())) {
            ticket.setStatus("IN_PROGRESS");
        }

        // Automatically assign staff member if unassigned
        if (ticket.getAssignedTo() == null) {
            ticket.setAssignedTo(staffUser);
        }

        ticket = ticketRepository.save(ticket);

        // Audit & Customer Notification (if public message)
        auditService.logUserEvent(staffUser, "TICKET_REPLIED", "SupportTicket", String.valueOf(ticket.getId()),
                "Staff replied to ticket " + ticket.getTicketCode() + (request.isInternalNote() ? " (Internal Note)" : ""));

        if (!request.isInternalNote()) {
            try {
                if (ticket.getCustomer() != null) {
                    notificationService.createNotification(
                            ticket.getCustomer().getId(),
                            "Support Reply: #" + ticket.getTicketCode(),
                            staffUser.getName() + " from Support Desk replied to: \"" + ticket.getSubject() + "\"",
                            NotificationType.INFO,
                            NotificationCategory.SYSTEM,
                            "/support"
                    );
                }

                if (ticket.getClientEmail() != null) {
                    emailService.sendEmail(ticket.getClientEmail(),
                            "OHO TECHN Support Update - Ticket #" + ticket.getTicketCode(),
                            "Dear " + ticket.getClientName() + ",\n\nOur support team has posted an update to your ticket #" + ticket.getTicketCode() + " (" + ticket.getSubject() + "):\n\n\"" + request.getMessage().trim() + "\"\n\nStatus: " + ticket.getStatus() + "\n\nBest regards,\nOHO TECHN Support Desk");
                }
            } catch (Exception e) {
                logger.warn("Notification/Email warning on staff reply: {}", e.getMessage());
            }
        }

        return mapTicketToDto(ticket, true);
    }

    @Transactional
    public SupportTicketDto addCustomerReply(Long customerId, Long ticketId, TicketReplyRequest request) {
        SupportTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("SupportTicket", "id", ticketId));

        if (ticket.getCustomer() == null || !ticket.getCustomer().getId().equals(customerId)) {
            throw new ResourceNotFoundException("SupportTicket", "id", ticketId);
        }

        User customer = ticket.getCustomer();

        SupportTicketMessage msg = SupportTicketMessage.builder()
                .ticket(ticket)
                .sender(customer)
                .senderName(customer.getName())
                .senderRole("CUSTOMER")
                .message(request.getMessage().trim())
                .internalNote(false)
                .build();
        messageRepository.save(msg);

        // Reopen ticket if it was resolved/closed
        if ("RESOLVED".equalsIgnoreCase(ticket.getStatus()) || "CLOSED".equalsIgnoreCase(ticket.getStatus())) {
            ticket.setStatus("OPEN");
        } else {
            ticket.setStatus("OPEN");
        }

        ticket = ticketRepository.save(ticket);

        auditService.logUserEvent(customer, "TICKET_CUSTOMER_REPLIED", "SupportTicket", String.valueOf(ticket.getId()),
                "Customer added follow-up reply to ticket " + ticket.getTicketCode());

        // Notify assigned staff if present
        try {
            if (ticket.getAssignedTo() != null) {
                notificationService.createNotification(
                        ticket.getAssignedTo().getId(),
                        "Customer Replied: #" + ticket.getTicketCode(),
                        customer.getName() + " updated ticket #" + ticket.getTicketCode(),
                        NotificationType.WARNING,
                        NotificationCategory.SYSTEM,
                        "/support"
                );
            }
        } catch (Exception e) {
            logger.warn("Staff notification warning: {}", e.getMessage());
        }

        return mapTicketToDto(ticket, false);
    }

    @Transactional
    public SupportTicketDto updateTicketStatus(Long staffUserId, Long ticketId, TicketStatusUpdateRequest request) {
        SupportTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("SupportTicket", "id", ticketId));

        User staffUser = userRepository.findById(staffUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", staffUserId));

        String oldStatus = ticket.getStatus();
        String newStatus = request.getStatus().trim().toUpperCase();
        ticket.setStatus(newStatus);

        if ("RESOLVED".equalsIgnoreCase(newStatus) || "CLOSED".equalsIgnoreCase(newStatus)) {
            ticket.setResolvedAt(LocalDateTime.now());
        }

        if (request.getNote() != null && !request.getNote().isBlank()) {
            SupportTicketMessage noteMsg = SupportTicketMessage.builder()
                    .ticket(ticket)
                    .sender(staffUser)
                    .senderName(staffUser.getName())
                    .senderRole(staffUser.getRole().name().replace("ROLE_", ""))
                    .message("Status changed from " + oldStatus + " to " + newStatus + ": " + request.getNote().trim())
                    .internalNote(true)
                    .build();
            messageRepository.save(noteMsg);
        }

        ticket = ticketRepository.save(ticket);

        auditService.logUserEvent(staffUser, "TICKET_STATUS_CHANGED", "SupportTicket", String.valueOf(ticket.getId()),
                "Status of ticket " + ticket.getTicketCode() + " changed from " + oldStatus + " to " + newStatus);

        return mapTicketToDto(ticket, true);
    }

    @Transactional
    public SupportTicketDto assignTicket(Long staffUserId, Long ticketId, Long targetStaffId) {
        SupportTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("SupportTicket", "id", ticketId));

        User staffUser = userRepository.findById(staffUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", staffUserId));

        User targetStaff = userRepository.findById(targetStaffId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", targetStaffId));

        ticket.setAssignedTo(targetStaff);
        ticket = ticketRepository.save(ticket);

        auditService.logUserEvent(staffUser, "TICKET_ASSIGNED", "SupportTicket", String.valueOf(ticket.getId()),
                "Assigned ticket " + ticket.getTicketCode() + " to " + targetStaff.getName());

        return mapTicketToDto(ticket, true);
    }

    @Transactional(readOnly = true)
    public SupportStatsDto getSupportStats() {
        long total = ticketRepository.count();
        long open = ticketRepository.countByStatus("OPEN");
        long inProgress = ticketRepository.countByStatus("IN_PROGRESS");
        long urgent = ticketRepository.countUrgentPending();
        long resolvedToday = ticketRepository.countResolvedSince(LocalDateTime.now().toLocalDate().atStartOfDay());

        long totalEnquiries = contactRepository.count();
        long pendingEnquiries = contactRepository.findAll().stream()
                .filter(c -> "PENDING".equalsIgnoreCase(c.getStatus()))
                .count();

        return SupportStatsDto.builder()
                .totalTickets(total)
                .openTickets(open)
                .inProgressTickets(inProgress)
                .urgentTickets(urgent)
                .resolvedToday(resolvedToday)
                .totalEnquiries(totalEnquiries)
                .pendingEnquiries(pendingEnquiries)
                .build();
    }

    private String generateUniqueTicketCode() {
        int codeNum = 1000 + random.nextInt(9000);
        String code = "TCK-" + codeNum;
        int attempts = 0;
        while (ticketRepository.findByTicketCode(code).isPresent() && attempts < 10) {
            codeNum = 1000 + random.nextInt(9000);
            code = "TCK-" + codeNum;
            attempts++;
        }
        return code;
    }

    private SupportTicketDto mapTicketToDto(SupportTicket ticket, boolean includeMessages) {
        Double slaHoursRemaining = null;
        if (ticket.getSlaDueAt() != null) {
            long seconds = Duration.between(LocalDateTime.now(), ticket.getSlaDueAt()).getSeconds();
            slaHoursRemaining = Math.max(0.0, Math.round((seconds / 3600.0) * 10.0) / 10.0);
        }

        List<SupportTicketMessageDto> msgDtos = new ArrayList<>();
        String lastReply = null;

        if (includeMessages) {
            List<SupportTicketMessage> msgs = messageRepository.findByTicketIdOrderByCreatedAtAsc(ticket.getId());
            msgDtos = msgs.stream().map(this::mapMessageToDto).collect(Collectors.toList());
            if (!msgs.isEmpty()) {
                lastReply = msgs.get(msgs.size() - 1).getMessage();
            }
        } else {
            List<SupportTicketMessage> msgs = messageRepository.findByTicketIdOrderByCreatedAtAsc(ticket.getId());
            if (!msgs.isEmpty()) {
                lastReply = msgs.get(msgs.size() - 1).getMessage();
            }
        }

        return SupportTicketDto.builder()
                .id(ticket.getId())
                .ticketCode(ticket.getTicketCode())
                .subject(ticket.getSubject())
                .description(ticket.getDescription())
                .department(ticket.getDepartment())
                .priority(ticket.getPriority())
                .status(ticket.getStatus())
                .customerId(ticket.getCustomer() != null ? ticket.getCustomer().getId() : null)
                .clientName(ticket.getClientName())
                .clientEmail(ticket.getClientEmail())
                .clientPhone(ticket.getClientPhone())
                .assignedToId(ticket.getAssignedTo() != null ? ticket.getAssignedTo().getId() : null)
                .assignedToName(ticket.getAssignedTo() != null ? ticket.getAssignedTo().getName() : null)
                .assignedToEmail(ticket.getAssignedTo() != null ? ticket.getAssignedTo().getEmail() : null)
                .orderId(ticket.getOrderId())
                .slaDueAt(ticket.getSlaDueAt())
                .slaHoursRemaining(slaHoursRemaining)
                .createdAt(ticket.getCreatedAt())
                .updatedAt(ticket.getUpdatedAt())
                .resolvedAt(ticket.getResolvedAt())
                .lastReply(lastReply)
                .messages(msgDtos)
                .build();
    }

    private SupportTicketMessageDto mapMessageToDto(SupportTicketMessage msg) {
        return SupportTicketMessageDto.builder()
                .id(msg.getId())
                .ticketId(msg.getTicket().getId())
                .senderId(msg.getSender() != null ? msg.getSender().getId() : null)
                .senderName(msg.getSenderName())
                .senderRole(msg.getSenderRole())
                .message(msg.getMessage())
                .internalNote(msg.isInternalNote())
                .createdAt(msg.getCreatedAt())
                .build();
    }
}
