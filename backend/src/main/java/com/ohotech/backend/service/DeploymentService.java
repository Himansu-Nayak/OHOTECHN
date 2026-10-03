package com.ohotech.backend.service;

import com.ohotech.backend.dto.DeploymentDto;
import com.ohotech.backend.entity.*;
import com.ohotech.backend.exception.ResourceNotFoundException;
import com.ohotech.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DeploymentService {

    private final DeploymentRepository deploymentRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final LicenseRepository licenseRepository;
    private final AuditService auditService;

    public Page<DeploymentDto> getDeploymentsAdmin(int page, int size, DeploymentStatus status) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Deployment> deployments;
        if (status != null) {
            deployments = deploymentRepository.findByStatusOrderByCreatedAtDesc(status, pageable);
        } else {
            deployments = deploymentRepository.findAll(pageable);
        }
        return deployments.map(this::mapToDto);
    }

    public List<DeploymentDto> getUserDeployments(Long userId) {
        return deploymentRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToCustomerDto)
                .collect(Collectors.toList());
    }

    public DeploymentDto getDeploymentById(Long id) {
        Deployment deployment = deploymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Deployment", "id", id));
        return mapToDto(deployment);
    }

    @Transactional
    public DeploymentDto createDeployment(DeploymentDto dto) {
        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", dto.getProductId()));

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", dto.getUserId()));

        Order order = null;
        if (dto.getOrderId() != null) {
            order = orderRepository.findById(dto.getOrderId()).orElse(null);
        }

        License license = null;
        if (dto.getLicenseId() != null) {
            license = licenseRepository.findById(dto.getLicenseId()).orElse(null);
        }

        Deployment deployment = Deployment.builder()
                .product(product)
                .user(user)
                .order(order)
                .license(license)
                .status(dto.getStatus() != null ? dto.getStatus() : DeploymentStatus.PENDING)
                .targetEnvironment(dto.getTargetEnvironment() != null ? dto.getTargetEnvironment() : "CLOUD_MANAGED")
                .accessUrl(dto.getAccessUrl())
                .assignedEngineer(dto.getAssignedEngineer())
                .adminNotes(dto.getAdminNotes())
                .customerNotes(dto.getCustomerNotes())
                .build();

        return mapToDto(deploymentRepository.save(deployment));
    }

    @Transactional
    public DeploymentDto updateDeploymentStatus(Long id, DeploymentStatus status, String adminNotes, String accessUrl, String assignedEngineer) {
        Deployment deployment = deploymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Deployment", "id", id));

        if (status != null) {
            deployment.setStatus(status);
            if (status == DeploymentStatus.LIVE && deployment.getCompletedAt() == null) {
                deployment.setCompletedAt(LocalDateTime.now());
            }
        }
        if (adminNotes != null) {
            deployment.setAdminNotes(adminNotes);
        }
        if (accessUrl != null) {
            deployment.setAccessUrl(accessUrl);
        }
        if (assignedEngineer != null) {
            deployment.setAssignedEngineer(assignedEngineer);
        }

        return mapToDto(deploymentRepository.save(deployment));
    }

    @Transactional
    public DeploymentDto updateDeploymentCustomerNotes(Long id, String customerNotes) {
        Deployment deployment = deploymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Deployment", "id", id));
        deployment.setCustomerNotes(customerNotes);
        return mapToDto(deploymentRepository.save(deployment));
    }

    @Transactional
    public DeploymentDto transitionDeployment(Long id, com.ohotech.backend.dto.DeploymentTransitionRequest request, User operator) {
        Deployment deployment = deploymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Deployment", "id", id));

        DeploymentStatus previousStatus = deployment.getStatus();
        String action = request.getAction() != null ? request.getAction().toUpperCase().trim() : "";

        switch (action) {
            case "ASSIGN" -> {
                deployment.setStatus(DeploymentStatus.ASSIGNED);
                if (request.getAssignedEngineer() != null && !request.getAssignedEngineer().isBlank()) {
                    deployment.setAssignedEngineer(request.getAssignedEngineer().trim());
                }
            }
            case "START_CONFIGURATION", "CONFIGURING" -> deployment.setStatus(DeploymentStatus.CONFIGURING);
            case "MARK_TESTING", "TESTING" -> deployment.setStatus(DeploymentStatus.TESTING);
            case "MARK_READY", "READY" -> deployment.setStatus(DeploymentStatus.READY);
            case "MARK_LIVE", "LIVE" -> {
                deployment.setStatus(DeploymentStatus.LIVE);
                if (request.getAccessUrl() != null && !request.getAccessUrl().isBlank()) {
                    deployment.setAccessUrl(request.getAccessUrl().trim());
                }
                if (deployment.getCompletedAt() == null) {
                    deployment.setCompletedAt(LocalDateTime.now());
                }
            }
            case "SUSPEND" -> deployment.setStatus(DeploymentStatus.SUSPENDED);
            case "CANCEL" -> deployment.setStatus(DeploymentStatus.CANCELLED);
            default -> throw new com.ohotech.backend.exception.BadRequestException("Invalid transition action: " + action);
        }

        if (request.getCustomerNotes() != null && !request.getCustomerNotes().isBlank()) {
            deployment.setCustomerNotes(request.getCustomerNotes().trim());
        }
        if (request.getAdminNotes() != null && !request.getAdminNotes().isBlank()) {
            deployment.setAdminNotes(request.getAdminNotes().trim());
        }
        if (request.getAccessUrl() != null && !request.getAccessUrl().isBlank()) {
            deployment.setAccessUrl(request.getAccessUrl().trim());
        }

        Deployment saved = deploymentRepository.save(deployment);

        // Audit Trail
        String auditDetails = String.format("Transitioned deployment #%d for product '%s' from %s to %s via action %s",
                id, deployment.getProduct() != null ? deployment.getProduct().getName() : "Unknown",
                previousStatus, saved.getStatus(), action);
        auditService.logUserEvent(operator, "DEPLOYMENT_STATE_TRANSITION", "Deployment", String.valueOf(id), auditDetails);

        return mapToDto(saved);
    }

    public DeploymentDto mapToDto(Deployment deployment) {
        Long providerId = null;
        String providerName = null;
        if (deployment.getProduct() != null && deployment.getProduct().getProvider() != null) {
            providerId = deployment.getProduct().getProvider().getId();
            providerName = deployment.getProduct().getProvider().getName();
        }

        return DeploymentDto.builder()
                .id(deployment.getId())
                .orderId(deployment.getOrder() != null ? deployment.getOrder().getId() : null)
                .productId(deployment.getProduct() != null ? deployment.getProduct().getId() : null)
                .productName(deployment.getProduct() != null ? deployment.getProduct().getName() : null)
                .providerId(providerId)
                .providerName(providerName)
                .userId(deployment.getUser() != null ? deployment.getUser().getId() : null)
                .userEmail(deployment.getUser() != null ? deployment.getUser().getEmail() : null)
                .userName(deployment.getUser() != null ? deployment.getUser().getName() : null)
                .licenseId(deployment.getLicense() != null ? deployment.getLicense().getId() : null)
                .licenseKey(deployment.getLicense() != null ? deployment.getLicense().getLicenseKey() : null)
                .status(deployment.getStatus())
                .targetEnvironment(deployment.getTargetEnvironment())
                .accessUrl(deployment.getAccessUrl())
                .assignedEngineer(deployment.getAssignedEngineer())
                .adminNotes(deployment.getAdminNotes())
                .customerNotes(deployment.getCustomerNotes())
                .completedAt(deployment.getCompletedAt())
                .createdAt(deployment.getCreatedAt())
                .updatedAt(deployment.getUpdatedAt())
                .build();
    }

    public DeploymentDto mapToCustomerDto(Deployment deployment) {
        DeploymentDto dto = mapToDto(deployment);
        dto.setAdminNotes(null); // Customer must not see internal admin notes
        dto.setProviderId(null); // Customer must never see provider identity
        dto.setProviderName(null); // Customer must never see provider identity
        return dto;
    }
}
