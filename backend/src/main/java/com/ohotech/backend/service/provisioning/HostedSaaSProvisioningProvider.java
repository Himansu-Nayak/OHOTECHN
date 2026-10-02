package com.ohotech.backend.service.provisioning;

import com.ohotech.backend.entity.Deployment;
import com.ohotech.backend.entity.DeploymentStatus;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class HostedSaaSProvisioningProvider implements SoftwareProvisioningProvider {

    @Override
    public String getSupportedType() {
        return "HOSTED_SAAS";
    }

    @Override
    public ProvisioningResult initiateProvisioning(Deployment deployment) {
        log.info("Hosted SaaS tenant provisioning queued for deployment #{}", deployment.getId());
        return ProvisioningResult.builder()
                .success(true)
                .targetStatus(DeploymentStatus.PENDING)
                .message("Multi-tenant SaaS workspace allocation queued.")
                .customerInstructions("Your SaaS organization workspace is being provisioned. Access credentials will be provided upon tenant activation.")
                .build();
    }
}
