package com.ohotech.backend.service;

import com.ohotech.backend.dto.*;
import com.ohotech.backend.entity.*;
import com.ohotech.backend.exception.ResourceNotFoundException;
import com.ohotech.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class Customer360Service {

    private final UserRepository userRepository;
    private final LeadRepository leadRepository;
    private final LeadActivityRepository activityRepository;
    private final LeadFollowUpRepository followUpRepository;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final LicenseRepository licenseRepository;
    private final DeviceActivationRepository deviceActivationRepository;
    private final SoftwareReleaseRepository softwareReleaseRepository;

    private final LeadService leadService;
    private final AuditService auditService;
    private final NotificationService notificationService;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public Customer360Dto getCustomer360(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        UserDto profileDto = UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .enabled(user.isEnabled())
                .emailVerified(user.isEmailVerified())
                .phoneVerified(user.isPhoneVerified())
                .createdAt(user.getCreatedAt())
                .build();

        // 1. CRM Leads matching user email, phone, or convertedUser
        List<Lead> linkedLeads = leadRepository.findAll().stream()
                .filter(l -> (l.getConvertedUser() != null && l.getConvertedUser().getId().equals(userId))
                        || (l.getEmail() != null && l.getEmail().equalsIgnoreCase(user.getEmail()))
                        || (user.getPhone() != null && l.getPhone() != null && l.getPhone().equals(user.getPhone())))
                .collect(Collectors.toList());

        List<LeadDto> leadDtos = linkedLeads.stream()
                .map(leadService::mapToDto)
                .collect(Collectors.toList());

        List<LeadActivityDto> allActivities = new ArrayList<>();
        List<LeadFollowUpDto> allFollowUps = new ArrayList<>();
        for (Lead lead : linkedLeads) {
            activityRepository.findByLeadIdOrderByCreatedAtDesc(lead.getId())
                    .forEach(act -> allActivities.add(mapActivityToDto(act)));
            followUpRepository.findByLeadIdOrderByScheduledAtAsc(lead.getId())
                    .forEach(fol -> allFollowUps.add(mapFollowUpToDto(fol)));
        }

        String primaryCompany = linkedLeads.stream()
                .map(Lead::getCompanyName)
                .filter(Objects::nonNull)
                .findFirst().orElse("Individual Account");

        String primaryStatus = linkedLeads.isEmpty() ? "CUSTOMER" : linkedLeads.get(0).getStatus().name();

        // 2. Commerce Orders & Total Spent
        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
        List<OrderDto> orderDtos = orders.stream()
                .map(this::mapOrderToDto)
                .collect(Collectors.toList());

        BigDecimal totalSpent = orders.stream()
                .filter(o -> o.getStatus() == OrderStatus.PAID || o.getStatus() == OrderStatus.DELIVERED)
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 3. Safe Payments
        List<PaymentDto> paymentDtos = new ArrayList<>();
        for (Order order : orders) {
            paymentRepository.findByOrderId(order.getId()).ifPresent(p -> {
                paymentDtos.add(PaymentDto.builder()
                        .id(p.getId())
                        .orderId(p.getOrder().getId())
                        .amount(p.getAmount())
                        .paymentMethod("RAZORPAY")
                        .status(p.getStatus().name())
                        .razorpayOrderId(p.getRazorpayOrderId())
                        .razorpayPaymentId(p.getRazorpayPaymentId())
                        .createdAt(p.getCreatedAt())
                        .build());
            });
        }

        // 4. Subscriptions
        List<SubscriptionDto> subscriptionDtos = subscriptionRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapSubscriptionToDto)
                .collect(Collectors.toList());

        // 5. Licenses & Device Activations
        List<License> licenses = licenseRepository.findByUserIdOrderByCreatedAtDesc(userId);
        List<LicenseDto> licenseDtos = licenses.stream()
                .map(this::mapLicenseToDto)
                .collect(Collectors.toList());

        List<DeviceActivationDto> deviceActivationDtos = new ArrayList<>();
        for (License lic : licenses) {
            deviceActivationRepository.findByLicenseId(lic.getId()).forEach(da -> {
                deviceActivationDtos.add(DeviceActivationDto.builder()
                        .id(da.getId())
                        .licenseId(da.getLicense().getId())
                        .deviceId(da.getDeviceIdentifier())
                        .deviceName(da.getDeviceName())
                        .osName(da.getOperatingSystem())
                        .ipAddress(null)
                        .status(da.isActive() ? "ACTIVE" : "INACTIVE")
                        .activatedAt(da.getActivatedAt())
                        .lastSeenAt(da.getLastSeenAt())
                        .build());
            });
        }

        // 6. Downloads / Software Releases for active products
        Set<Long> productIds = licenses.stream().map(l -> l.getProduct().getId()).collect(Collectors.toSet());
        List<SoftwareReleaseDto> downloadDtos = new ArrayList<>();
        for (Long pid : productIds) {
            softwareReleaseRepository.findByProductId(pid).forEach(sr -> {
                downloadDtos.add(SoftwareReleaseDto.builder()
                        .id(sr.getId())
                        .productId(sr.getProduct().getId())
                        .productName(sr.getProduct().getName())
                        .version(sr.getVersion())
                        .releaseNotes(sr.getReleaseNotes())
                        .releaseDate(sr.getReleaseDate())
                        .filePath(sr.getFilePath())
                        .fileName(sr.getFileName())
                        .fileSize(sr.getFileSize())
                        .platform(sr.getPlatform())
                        .build());
            });
        }

        // 7. Chronological Business Timeline
        List<TimelineEventDto> timeline = buildBusinessTimeline(user, linkedLeads, allActivities, allFollowUps, orders, paymentDtos, licenses);

        return Customer360Dto.builder()
                .profile(profileDto)
                .companyName(primaryCompany)
                .leads(leadDtos)
                .activities(allActivities)
                .followUps(allFollowUps)
                .totalLeadsCount(linkedLeads.size())
                .primaryCrmStatus(primaryStatus)
                .orders(orderDtos)
                .totalOrdersCount(orders.size())
                .totalSpent(totalSpent)
                .payments(paymentDtos)
                .subscriptions(subscriptionDtos)
                .licenses(licenseDtos)
                .deviceActivations(deviceActivationDtos)
                .availableDownloads(downloadDtos)
                .timeline(timeline)
                .build();
    }

    @Transactional(readOnly = true)
    public CustomerMatchResultDto findCustomerMatch(Long leadId) {
        Lead lead = leadRepository.findById(leadId)
                .orElseThrow(() -> new ResourceNotFoundException("Lead", "id", leadId));

        Optional<User> emailMatch = userRepository.findByEmail(lead.getEmail().trim().toLowerCase());
        if (emailMatch.isPresent()) {
            User u = emailMatch.get();
            return CustomerMatchResultDto.builder()
                    .leadId(leadId)
                    .hasExactMatch(true)
                    .matchReason("MATCH_BY_EMAIL")
                    .matchedUser(mapUserToDto(u))
                    .lead(leadService.mapToDto(lead))
                    .build();
        }

        if (lead.getPhone() != null && !lead.getPhone().isBlank()) {
            Optional<User> phoneMatch = userRepository.findByPhone(lead.getPhone().trim());
            if (phoneMatch.isPresent()) {
                User u = phoneMatch.get();
                return CustomerMatchResultDto.builder()
                        .leadId(leadId)
                        .hasExactMatch(true)
                        .matchReason("MATCH_BY_PHONE")
                        .matchedUser(mapUserToDto(u))
                        .lead(leadService.mapToDto(lead))
                        .build();
            }
        }

        return CustomerMatchResultDto.builder()
                .leadId(leadId)
                .hasExactMatch(false)
                .matchReason("NO_MATCH")
                .matchedUser(null)
                .lead(leadService.mapToDto(lead))
                .build();
    }

    @Transactional
    public LeadDto linkCustomerToLead(Long leadId, LinkCustomerRequest request, Long actorUserId) {
        Lead lead = leadRepository.findById(leadId)
                .orElseThrow(() -> new ResourceNotFoundException("Lead", "id", leadId));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getUserId()));

        User actor = actorUserId != null ? userRepository.findById(actorUserId).orElse(null) : null;

        lead.setConvertedUser(user);
        lead.setConvertedAt(LocalDateTime.now());
        lead.setConvertedBy(actor);
        if (lead.getStatus() != LeadStatus.WON && isConvertibleStatus(lead.getStatus())) {
            lead.setStatus(LeadStatus.WON);
        }

        Lead updated = leadRepository.save(lead);

        auditService.logEvent("CUSTOMER_LINKED", "CRM_LEAD", leadId.toString(),
                "Linked Lead #" + leadId + " (" + lead.getEmail() + ") to existing Customer User #" + user.getId() + " (" + user.getName() + ")");

        try {
            notificationService.createNotification(
                    user.getId(),
                    "Account Linked to Lead Record",
                    "Your user account has been linked to CRM lead record #" + leadId,
                    NotificationType.INFO,
                    NotificationCategory.SYSTEM,
                    "/profile"
            );
        } catch (Exception e) {
            // Ignore notification failure
        }

        return leadService.mapToDto(updated);
    }

    @Transactional
    public LeadDto convertLeadToCustomer(Long leadId, ConvertLeadRequest request, Long actorUserId) {
        Lead lead = leadRepository.findById(leadId)
                .orElseThrow(() -> new ResourceNotFoundException("Lead", "id", leadId));

        if (lead.getConvertedUser() != null) {
            throw new IllegalStateException("Lead #" + leadId + " has already been converted to Customer #" + lead.getConvertedUser().getId());
        }

        if (!isConvertibleStatus(lead.getStatus())) {
            throw new IllegalArgumentException("Lead status " + lead.getStatus() + " is invalid for customer conversion.");
        }

        User actor = actorUserId != null ? userRepository.findById(actorUserId).orElse(null) : null;

        String targetEmail = lead.getEmail().trim().toLowerCase();
        Optional<User> existingUserOpt = userRepository.findByEmail(targetEmail);

        User targetCustomer;

        if (existingUserOpt.isPresent()) {
            // Existing user found -> link without duplicate user creation
            targetCustomer = existingUserOpt.get();
            auditService.logEvent("CUSTOMER_LINKED", "CRM_LEAD", leadId.toString(),
                    "Lead conversion matched existing customer account #" + targetCustomer.getId());
        } else {
            // Create new User account with strict ROLE_CUSTOMER
            auditService.logEvent("CUSTOMER_CONVERSION_STARTED", "CRM_LEAD", leadId.toString(),
                    "Initiating new customer account creation for Lead #" + leadId);

            String name = (lead.getFirstName() != null ? lead.getFirstName() + " " + (lead.getLastName() != null ? lead.getLastName() : "") : targetEmail).trim();
            String rawPassword = (request != null && request.getInitialPassword() != null && !request.getInitialPassword().isBlank())
                    ? request.getInitialPassword()
                    : "Pass_" + UUID.randomUUID().toString().substring(0, 8) + "!";

            User newCustomer = User.builder()
                    .name(name)
                    .email(targetEmail)
                    .phone(lead.getPhone())
                    .passwordHash(passwordEncoder.encode(rawPassword))
                    .role(Role.ROLE_CUSTOMER) // STRICTLY ROLE_CUSTOMER!
                    .enabled(true)
                    .emailVerified(true)
                    .build();

            targetCustomer = userRepository.save(newCustomer);

            auditService.logEvent("CUSTOMER_CONVERSION_COMPLETED", "USER", targetCustomer.getId().toString(),
                    "Created new ROLE_CUSTOMER account #" + targetCustomer.getId() + " for converted Lead #" + leadId);
        }

        lead.setConvertedUser(targetCustomer);
        lead.setConvertedAt(LocalDateTime.now());
        lead.setConvertedBy(actor);
        lead.setStatus(LeadStatus.WON);

        Lead updated = leadRepository.save(lead);

        auditService.logEvent("LEAD_CONVERTED", "CRM_LEAD", leadId.toString(),
                "Successfully converted Lead #" + leadId + " to Customer #" + targetCustomer.getId());

        try {
            notificationService.createNotification(
                    targetCustomer.getId(),
                    "Welcome to OHO TECHN",
                    "Your OHO TECHN Customer account has been initialized.",
                    NotificationType.SUCCESS,
                    NotificationCategory.SYSTEM,
                    "/dashboard"
            );
        } catch (Exception e) {
            // Ignore notification failure
        }

        return leadService.mapToDto(updated);
    }

    @Transactional(readOnly = true)
    public Page<UserDto> getCustomersList(String search, Pageable pageable) {
        Page<User> usersPage;
        if (search != null && !search.isBlank()) {
            usersPage = userRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrPhoneContainingIgnoreCase(
                    search.trim(), search.trim(), search.trim(), pageable);
        } else {
            usersPage = userRepository.findByRole(Role.ROLE_CUSTOMER, pageable);
        }

        return usersPage.map(this::mapUserToDto);
    }

    private boolean isConvertibleStatus(LeadStatus status) {
        return status == LeadStatus.QUALIFIED
                || status == LeadStatus.DEMO_COMPLETED
                || status == LeadStatus.QUOTE_SENT
                || status == LeadStatus.NEGOTIATION
                || status == LeadStatus.WON;
    }

    private UserDto mapUserToDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .enabled(user.isEnabled())
                .emailVerified(user.isEmailVerified())
                .phoneVerified(user.isPhoneVerified())
                .createdAt(user.getCreatedAt())
                .build();
    }

    private LeadActivityDto mapActivityToDto(LeadActivity act) {
        return LeadActivityDto.builder()
                .id(act.getId())
                .leadId(act.getLead() != null ? act.getLead().getId() : null)
                .type(act.getType())
                .description(act.getDescription())
                .performedById(act.getPerformedBy() != null ? act.getPerformedBy().getId() : null)
                .performedByName(act.getPerformedBy() != null ? act.getPerformedBy().getName() : "System")
                .createdAt(act.getCreatedAt())
                .build();
    }

    private LeadFollowUpDto mapFollowUpToDto(LeadFollowUp fol) {
        return LeadFollowUpDto.builder()
                .id(fol.getId())
                .leadId(fol.getLead() != null ? fol.getLead().getId() : null)
                .title(fol.getTitle())
                .scheduledAt(fol.getScheduledAt())
                .status(fol.getStatus())
                .createdAt(fol.getCreatedAt())
                .build();
    }

    private OrderDto mapOrderToDto(Order order) {
        return OrderDto.builder()
                .id(order.getId())
                .userId(order.getUser() != null ? order.getUser().getId() : null)
                .userName(order.getUser() != null ? order.getUser().getName() : null)
                .userEmail(order.getUser() != null ? order.getUser().getEmail() : null)
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .shippingAddress(order.getShippingAddress())
                .contactPhone(order.getContactPhone())
                .itemsCount(order.getItems() != null ? order.getItems().size() : 0)
                .createdAt(order.getCreatedAt())
                .build();
    }

    private SubscriptionDto mapSubscriptionToDto(Subscription sub) {
        return SubscriptionDto.builder()
                .id(sub.getId())
                .userId(sub.getUser() != null ? sub.getUser().getId() : null)
                .productId(sub.getProduct() != null ? sub.getProduct().getId() : null)
                .productName(sub.getProduct() != null ? sub.getProduct().getName() : null)
                .productPlanId(sub.getProductPlan() != null ? sub.getProductPlan().getId() : null)
                .productPlanName(sub.getProductPlan() != null ? sub.getProductPlan().getName() : null)
                .orderId(sub.getOrder() != null ? sub.getOrder().getId() : null)
                .status(sub.getStatus())
                .startDate(sub.getStartDate())
                .expiryDate(sub.getExpiryDate())
                .autoRenew(sub.isAutoRenew())
                .createdAt(sub.getCreatedAt())
                .build();
    }

    private LicenseDto mapLicenseToDto(License lic) {
        return LicenseDto.builder()
                .id(lic.getId())
                .userId(lic.getUser() != null ? lic.getUser().getId() : null)
                .productId(lic.getProduct() != null ? lic.getProduct().getId() : null)
                .productName(lic.getProduct() != null ? lic.getProduct().getName() : null)
                .productPlanId(lic.getProductPlan() != null ? lic.getProductPlan().getId() : null)
                .productPlanName(lic.getProductPlan() != null ? lic.getProductPlan().getName() : null)
                .subscriptionId(lic.getSubscription() != null ? lic.getSubscription().getId() : null)
                .licenseKey(lic.getLicenseKey())
                .status(lic.getStatus())
                .activationLimit(lic.getActivationLimit())
                .activationCount(lic.getActivationCount())
                .issuedAt(lic.getIssuedAt())
                .expiresAt(lic.getExpiresAt())
                .revokedAt(lic.getRevokedAt())
                .build();
    }

    private List<TimelineEventDto> buildBusinessTimeline(
            User user, List<Lead> leads, List<LeadActivityDto> activities,
            List<LeadFollowUpDto> followUps, List<Order> orders,
            List<PaymentDto> payments, List<License> licenses) {

        List<TimelineEventDto> events = new ArrayList<>();

        events.add(TimelineEventDto.builder()
                .eventType("USER_REGISTERED")
                .title("Customer Account Registered")
                .description("Customer user account #" + user.getId() + " created.")
                .category("SYSTEM")
                .timestamp(user.getCreatedAt())
                .actorName(user.getName())
                .build());

        for (Lead lead : leads) {
            events.add(TimelineEventDto.builder()
                    .eventType("LEAD_CREATED")
                    .title("Lead Captured")
                    .description("Lead #" + lead.getId() + " captured from source: " + lead.getSource())
                    .category("CRM")
                    .timestamp(lead.getCreatedAt())
                    .actorName("Website / " + lead.getSource())
                    .build());

            if (lead.getConvertedAt() != null) {
                events.add(TimelineEventDto.builder()
                        .eventType("LEAD_CONVERTED")
                        .title("Lead Converted to Customer")
                        .description("Lead #" + lead.getId() + " converted & linked to Customer account.")
                        .category("CRM")
                        .timestamp(lead.getConvertedAt())
                        .actorName(lead.getConvertedBy() != null ? lead.getConvertedBy().getName() : "Admin")
                        .build());
            }
        }

        for (LeadActivityDto act : activities) {
            events.add(TimelineEventDto.builder()
                    .eventType("CRM_ACTIVITY")
                    .title("Sales Activity: " + act.getType())
                    .description(act.getDescription())
                    .category("CRM")
                    .timestamp(act.getCreatedAt())
                    .actorName(act.getPerformedByName())
                    .build());
        }

        for (Order ord : orders) {
            events.add(TimelineEventDto.builder()
                    .eventType("ORDER_CREATED")
                    .title("Order Placed #" + ord.getId())
                    .description("Order for ₹" + ord.getTotalAmount() + " placed. Status: " + ord.getStatus())
                    .category("COMMERCE")
                    .timestamp(ord.getCreatedAt())
                    .actorName(user.getName())
                    .build());
        }

        for (PaymentDto pay : payments) {
            events.add(TimelineEventDto.builder()
                    .eventType("PAYMENT_RECORDED")
                    .title("Payment Received")
                    .description("Payment of ₹" + pay.getAmount() + " processed. Status: " + pay.getStatus())
                    .category("PAYMENT")
                    .timestamp(pay.getCreatedAt())
                    .actorName("Razorpay Gateway")
                    .build());
        }

        for (License lic : licenses) {
            events.add(TimelineEventDto.builder()
                    .eventType("LICENSE_ISSUED")
                    .title("License Issued")
                    .description("Software license key " + lic.getLicenseKey() + " issued for " + lic.getProduct().getName())
                    .category("LICENSE")
                    .timestamp(lic.getIssuedAt())
                    .actorName("System Provisioning")
                    .build());
        }

        events.sort(Comparator.comparing(TimelineEventDto::getTimestamp, Comparator.nullsLast(Comparator.reverseOrder())));
        return events;
    }
}
