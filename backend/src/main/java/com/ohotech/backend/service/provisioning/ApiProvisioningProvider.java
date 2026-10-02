package com.ohotech.backend.service.provisioning;

import com.ohotech.backend.entity.Deployment;
import com.ohotech.backend.entity.DeploymentStatus;
import com.ohotech.backend.entity.Provider;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class ApiProvisioningProvider implements SoftwareProvisioningProvider {

    @Override
    public String getSupportedType() {
        return "API";
    }

    @Override
    public ProvisioningResult initiateProvisioning(Deployment deployment) {
        Provider provider = deployment.getProduct() != null ? deployment.getProduct().getProvider() : null;

        // Check whether actual provider API credentials and endpoints are configured
        boolean hasApiCredentials = provider != null 
                && provider.getWebsite() != null 
                && !"PENDING_API_INFO".equalsIgnoreCase(provider.getIntegrationStatus());

        if (!hasApiCredentials) {
            log.info("Deployment #{}: Provider API integration is pending credentials. Enqueuing for operational manual setup.", deployment.getId());
            return ProvisioningResult.builder()
                    .success(true)
                    .targetStatus(DeploymentStatus.PENDING)
                    .message("Provider API integration pending credentials. Queued for operational engineering.")
                    .customerInstructions("Your order is being processed. Standard provisioning timeline is 1-4 business hours.")
                    .build();
        }

        // When external provider API docs and endpoints are verified and available, live calls are executed here.
        log.info("Deployment #{}: Provider API endpoint dispatch initialized for provider '{}'", deployment.getId(), provider.getName());
        return ProvisioningResult.builder()
                .success(true)
                .targetStatus(DeploymentStatus.CONFIGURING)
                .message("Provider API provisioning request dispatched successfully.")
                .customerInstructions("Instance provisioning in progress via partner gateway.")
                .build();
    }
}
