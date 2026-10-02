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

    public DeploymentDto mapToDto(Deployment deployment) {
        return DeploymentDto.builder()
                .id(deployment.getId())
                .orderId(deployment.getOrder() != null ? deployment.getOrder().getId() : null)
                .productId(deployment.getProduct() != null ? deployment.getProduct().getId() : null)
                .productName(deployment.getProduct() != null ? deployment.getProduct().getName() : null)
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
        return dto;
    }
}
