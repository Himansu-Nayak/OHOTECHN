package com.ohotech.backend.service.provisioning;

import com.ohotech.backend.entity.Deployment;
import com.ohotech.backend.entity.DeploymentStatus;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class ManualProvisioningProvider implements SoftwareProvisioningProvider {

    @Override
    public String getSupportedType() {
        return "MANUAL";
    }

    @Override
    public ProvisioningResult initiateProvisioning(Deployment deployment) {
        log.info("Manual provisioning initialized for deployment #{} (Product: {})",
                deployment.getId(), deployment.getProduct() != null ? deployment.getProduct().getName() : "Unknown");

        return ProvisioningResult.builder()
                .success(true)
                .targetStatus(DeploymentStatus.PENDING)
                .message("Manual provisioning queued. Assigned to engineering team for VPS/infrastructure provisioning.")
                .customerInstructions("Your order has been confirmed. Our engineering team is preparing your dedicated instance environment. You will receive an update once configuration begins.")
                .build();
    }
}
