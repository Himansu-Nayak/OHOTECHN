package com.ohotech.backend.service;

import com.ohotech.backend.dto.SoftwareReleaseDto;
import com.ohotech.backend.entity.*;
import com.ohotech.backend.exception.BadRequestException;
import com.ohotech.backend.exception.ResourceNotFoundException;
import com.ohotech.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SoftwareReleaseService {

    private final SoftwareReleaseRepository softwareReleaseRepository;
    private final ProductRepository productRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final LicenseRepository licenseRepository;
    private final OrderRepository orderRepository;

    public boolean isUserEntitledToProduct(Long userId, Long productId) {
        // 1. Check Subscriptions
        List<Subscription> subs = subscriptionRepository.findByUserIdAndProductId(userId, productId);
        boolean hasActiveSub = subs.stream().anyMatch(s ->
                (s.getStatus() == SubscriptionStatus.ACTIVE || s.getStatus() == SubscriptionStatus.TRIAL) &&
                (s.getExpiryDate() == null || s.getExpiryDate().isAfter(LocalDateTime.now())));

        if (hasActiveSub) return true;

        // 2. Check Licenses
        List<License> licenses = licenseRepository.findByUserIdAndProductId(userId, productId);
        boolean hasActiveLicense = licenses.stream().anyMatch(l ->
                l.getStatus() == LicenseStatus.ACTIVE &&
                (l.getExpiresAt() == null || l.getExpiresAt().isAfter(LocalDateTime.now())));

        if (hasActiveLicense) return true;

        // 3. Check Order History (PAID / CONFIRMED / DELIVERED orders)
        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return orders.stream().anyMatch(o ->
                (o.getStatus() == OrderStatus.CONFIRMED || o.getStatus() == OrderStatus.PAID || o.getStatus() == OrderStatus.DELIVERED) &&
                o.getItems().stream().anyMatch(item -> item.getProduct().getId().equals(productId)));
    }

    public List<Product> getEntitledProducts(Long userId) {
        Set<Long> productIds = new HashSet<>();

        subscriptionRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .filter(s -> (s.getStatus() == SubscriptionStatus.ACTIVE || s.getStatus() == SubscriptionStatus.TRIAL) &&
                             (s.getExpiryDate() == null || s.getExpiryDate().isAfter(LocalDateTime.now())))
                .forEach(s -> productIds.add(s.getProduct().getId()));

        licenseRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .filter(l -> l.getStatus() == LicenseStatus.ACTIVE &&
                             (l.getExpiresAt() == null || l.getExpiresAt().isAfter(LocalDateTime.now())))
                .forEach(l -> productIds.add(l.getProduct().getId()));

        orderRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .filter(o -> o.getStatus() == OrderStatus.CONFIRMED || o.getStatus() == OrderStatus.PAID || o.getStatus() == OrderStatus.DELIVERED)
                .forEach(o -> o.getItems().forEach(item -> productIds.add(item.getProduct().getId())));

        return productRepository.findAllById(productIds);
    }

    public List<SoftwareReleaseDto> getEntitledProductReleases(Long userId, Long productId) {
        if (!isUserEntitledToProduct(userId, productId)) {
            throw new BadRequestException("You do not have an active subscription or license entitlement for this product.");
        }

        return softwareReleaseRepository.findByProductIdAndActiveTrue(productId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public SoftwareRelease getSoftwareReleaseForDownload(Long userId, Long productId, Long releaseId) {
        if (!isUserEntitledToProduct(userId, productId)) {
            throw new BadRequestException("You do not have an active subscription or license entitlement to download this release.");
        }

        SoftwareRelease release = softwareReleaseRepository.findByIdAndProductId(releaseId, productId)
                .orElseThrow(() -> new ResourceNotFoundException("SoftwareRelease", "id", releaseId));

        if (!release.isActive()) {
            throw new BadRequestException("This release version is currently inactive.");
        }

        return release;
    }

    // Admin CRUD
    public List<SoftwareReleaseDto> getAdminReleases(Long productId) {
        return softwareReleaseRepository.findByProductId(productId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public SoftwareReleaseDto createRelease(Long productId, SoftwareReleaseDto dto) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

        SoftwareRelease release = SoftwareRelease.builder()
                .product(product)
                .version(dto.getVersion())
                .releaseNotes(dto.getReleaseNotes())
                .fileName(dto.getFileName() != null ? dto.getFileName() : product.getName().toLowerCase().replace(" ", "-") + "-v" + dto.getVersion() + ".zip")
                .filePath(dto.getFilePath() != null ? dto.getFilePath() : "/storage/releases/" + dto.getFileName())
                .fileSize(dto.getFileSize() != null ? dto.getFileSize() : 102400L)
                .platform(dto.getPlatform())
                .active(dto.getActive() != null ? dto.getActive() : true)
                .releaseDate(dto.getReleaseDate() != null ? dto.getReleaseDate() : LocalDateTime.now())
                .build();

        SoftwareRelease saved = softwareReleaseRepository.save(release);
        return mapToDto(saved);
    }

    @Transactional
    public SoftwareReleaseDto updateRelease(Long releaseId, SoftwareReleaseDto dto) {
        SoftwareRelease release = softwareReleaseRepository.findById(releaseId)
                .orElseThrow(() -> new ResourceNotFoundException("SoftwareRelease", "id", releaseId));

        if (dto.getVersion() != null) release.setVersion(dto.getVersion());
        if (dto.getReleaseNotes() != null) release.setReleaseNotes(dto.getReleaseNotes());
        if (dto.getFileName() != null) release.setFileName(dto.getFileName());
        if (dto.getFilePath() != null) release.setFilePath(dto.getFilePath());
        if (dto.getFileSize() != null) release.setFileSize(dto.getFileSize());
        if (dto.getPlatform() != null) release.setPlatform(dto.getPlatform());
        if (dto.getActive() != null) release.setActive(dto.getActive());

        SoftwareRelease saved = softwareReleaseRepository.save(release);
        return mapToDto(saved);
    }

    @Transactional
    public SoftwareReleaseDto toggleReleaseStatus(Long releaseId, boolean active) {
        SoftwareRelease release = softwareReleaseRepository.findById(releaseId)
                .orElseThrow(() -> new ResourceNotFoundException("SoftwareRelease", "id", releaseId));

        release.setActive(active);
        SoftwareRelease saved = softwareReleaseRepository.save(release);
        return mapToDto(saved);
    }

    @Transactional
    public void deleteRelease(Long releaseId) {
        SoftwareRelease release = softwareReleaseRepository.findById(releaseId)
                .orElseThrow(() -> new ResourceNotFoundException("SoftwareRelease", "id", releaseId));
        release.setActive(false);
        softwareReleaseRepository.save(release);
    }

    public SoftwareReleaseDto mapToDto(SoftwareRelease release) {
        return SoftwareReleaseDto.builder()
                .id(release.getId())
                .productId(release.getProduct() != null ? release.getProduct().getId() : null)
                .productName(release.getProduct() != null ? release.getProduct().getName() : null)
                .version(release.getVersion())
                .releaseNotes(release.getReleaseNotes())
                .fileName(release.getFileName())
                .filePath(release.getFilePath())
                .fileSize(release.getFileSize())
                .platform(release.getPlatform())
                .active(release.isActive())
                .releaseDate(release.getReleaseDate())
                .createdAt(release.getCreatedAt())
                .build();
    }
}
