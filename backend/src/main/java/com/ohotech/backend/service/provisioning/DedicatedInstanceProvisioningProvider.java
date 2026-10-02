package com.ohotech.backend.service.provisioning;

import com.ohotech.backend.entity.Deployment;
import com.ohotech.backend.entity.DeploymentStatus;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class DedicatedInstanceProvisioningProvider implements SoftwareProvisioningProvider {

    @Override
    public String getSupportedType() {
        return "DEDICATED_INSTANCE";
    }

    @Override
    public ProvisioningResult initiateProvisioning(Deployment deployment) {
        log.info("Dedicated VPS instance provisioning queued for deployment #{}", deployment.getId());
        return ProvisioningResult.builder()
                .success(true)
                .targetStatus(DeploymentStatus.PENDING)
                .message("Dedicated instance queued for VPS resource allocation.")
                .customerInstructions("Your dedicated VPS environment is being allocated. Our system administrators will configure your isolated database and application container.")
                .build();
    }
}
