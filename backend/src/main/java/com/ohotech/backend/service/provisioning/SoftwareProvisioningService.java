package com.ohotech.backend.service.provisioning;

import com.ohotech.backend.entity.Deployment;
import com.ohotech.backend.entity.Provider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class SoftwareProvisioningService {

    private final List<SoftwareProvisioningProvider> provisioningProviders;
    private final ManualProvisioningProvider defaultManualProvider;

    public ProvisioningResult dispatchProvisioning(Deployment deployment) {
        String integrationType = "MANUAL";
        if (deployment.getProduct() != null && deployment.getProduct().getProvider() != null) {
            Provider provider = deployment.getProduct().getProvider();
            if (provider.getTechnicalIntegrationType() != null && !provider.getTechnicalIntegrationType().isBlank()) {
                integrationType = provider.getTechnicalIntegrationType().toUpperCase().trim();
            }
        }

        final String targetType = integrationType;
        SoftwareProvisioningProvider selectedProvider = provisioningProviders.stream()
                .filter(p -> p.getSupportedType().equalsIgnoreCase(targetType))
                .findFirst()
                .orElse(defaultManualProvider);

        log.info("Dispatching deployment #{} to provisioning strategy: {}", deployment.getId(), selectedProvider.getSupportedType());
        return selectedProvider.initiateProvisioning(deployment);
    }
}
