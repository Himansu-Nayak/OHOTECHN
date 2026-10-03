package com.ohotech.backend.service;

import com.ohotech.backend.dto.ProviderDto;
import com.ohotech.backend.entity.Provider;
import com.ohotech.backend.exception.ResourceNotFoundException;
import com.ohotech.backend.repository.ProviderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProviderService {

    private final ProviderRepository providerRepository;
    private final AuditService auditService;

    public Page<ProviderDto> getProviders(int page, int size, String search) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        Page<Provider> providers;
        if (search != null && !search.trim().isEmpty()) {
            String q = search.trim();
            providers = providerRepository.findByNameContainingIgnoreCaseOrCompanyNameContainingIgnoreCase(q, q, pageable);
        } else {
            providers = providerRepository.findAll(pageable);
        }
        return providers.map(this::mapToDto);
    }

    public List<ProviderDto> getActiveProviders() {
        return providerRepository.findAll(Sort.by("name").ascending()).stream()
                .filter(Provider::isActive)
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public ProviderDto getProviderById(Long id) {
        Provider provider = providerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Provider", "id", id));
        return mapToDto(provider);
    }

    @Transactional
    public ProviderDto createProvider(ProviderDto dto) {
        Provider provider = Provider.builder()
                .name(dto.getName())
                .companyName(dto.getCompanyName())
                .contactPerson(dto.getContactPerson())
                .contactEmail(dto.getContactEmail())
                .contactPhone(dto.getContactPhone())
                .website(dto.getWebsite())
                .commercialTerms(dto.getCommercialTerms())
                .commissionRate(dto.getCommissionRate())
                .technicalIntegrationType(dto.getTechnicalIntegrationType() != null ? dto.getTechnicalIntegrationType() : "MANUAL")
                .integrationStatus(dto.getIntegrationStatus() != null ? dto.getIntegrationStatus() : "Integration pending provider/API information")
                .supportResponsibility(dto.getSupportResponsibility() != null ? dto.getSupportResponsibility() : "OHO_TECH")
                .deploymentResponsibility(dto.getDeploymentResponsibility() != null ? dto.getDeploymentResponsibility() : "OHO_TECH")
                .contractStatus(dto.getContractStatus() != null ? dto.getContractStatus() : "ACTIVE")
                .notes(dto.getNotes())
                .active(dto.isActive())
                .build();

        Provider saved = providerRepository.save(provider);
        auditService.logEvent("PROVIDER_CREATED", "Provider", String.valueOf(saved.getId()),
                "Registered software provider agency: " + saved.getName());
        return mapToDto(saved);
    }

    @Transactional
    public ProviderDto updateProvider(Long id, ProviderDto dto) {
        Provider provider = providerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Provider", "id", id));

        if (dto.getName() != null) provider.setName(dto.getName());
        if (dto.getCompanyName() != null) provider.setCompanyName(dto.getCompanyName());
        if (dto.getContactPerson() != null) provider.setContactPerson(dto.getContactPerson());
        if (dto.getContactEmail() != null) provider.setContactEmail(dto.getContactEmail());
        if (dto.getContactPhone() != null) provider.setContactPhone(dto.getContactPhone());
        if (dto.getWebsite() != null) provider.setWebsite(dto.getWebsite());
        if (dto.getCommercialTerms() != null) provider.setCommercialTerms(dto.getCommercialTerms());
        if (dto.getCommissionRate() != null) provider.setCommissionRate(dto.getCommissionRate());
        if (dto.getTechnicalIntegrationType() != null) provider.setTechnicalIntegrationType(dto.getTechnicalIntegrationType());
        if (dto.getIntegrationStatus() != null) provider.setIntegrationStatus(dto.getIntegrationStatus());
        if (dto.getSupportResponsibility() != null) provider.setSupportResponsibility(dto.getSupportResponsibility());
        if (dto.getDeploymentResponsibility() != null) provider.setDeploymentResponsibility(dto.getDeploymentResponsibility());
        if (dto.getContractStatus() != null) provider.setContractStatus(dto.getContractStatus());
        if (dto.getNotes() != null) provider.setNotes(dto.getNotes());
        provider.setActive(dto.isActive());

        Provider updated = providerRepository.save(provider);
        auditService.logEvent("PROVIDER_UPDATED", "Provider", String.valueOf(updated.getId()),
                "Updated software provider agency: " + updated.getName());
        return mapToDto(updated);
    }

    @Transactional
    public ProviderDto toggleProviderStatus(Long id, boolean active) {
        Provider provider = providerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Provider", "id", id));
        provider.setActive(active);
        Provider saved = providerRepository.save(provider);
        auditService.logEvent("PROVIDER_STATUS_TOGGLED", "Provider", String.valueOf(saved.getId()),
                "Toggled provider active status to " + active + " for: " + saved.getName());
        return mapToDto(saved);
    }

    @Transactional
    public void deleteProvider(Long id) {
        Provider provider = providerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Provider", "id", id));
        provider.setActive(false);
        providerRepository.save(provider);
        auditService.logEvent("PROVIDER_DEACTIVATED", "Provider", String.valueOf(provider.getId()),
                "Deactivated software provider agency: " + provider.getName());
    }

    public ProviderDto mapToDto(Provider provider) {
        return ProviderDto.builder()
                .id(provider.getId())
                .name(provider.getName())
                .companyName(provider.getCompanyName())
                .contactPerson(provider.getContactPerson())
                .contactEmail(provider.getContactEmail())
                .contactPhone(provider.getContactPhone())
                .website(provider.getWebsite())
                .commercialTerms(provider.getCommercialTerms())
                .commissionRate(provider.getCommissionRate())
                .technicalIntegrationType(provider.getTechnicalIntegrationType())
                .integrationStatus(provider.getIntegrationStatus())
                .supportResponsibility(provider.getSupportResponsibility())
                .deploymentResponsibility(provider.getDeploymentResponsibility())
                .contractStatus(provider.getContractStatus())
                .notes(provider.getNotes())
                .active(provider.isActive())
                .productsCount(provider.getProducts() != null ? provider.getProducts().size() : 0)
                .createdAt(provider.getCreatedAt())
                .updatedAt(provider.getUpdatedAt())
                .build();
    }
}
