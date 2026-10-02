package com.ohotech.backend.service.provisioning;

import com.ohotech.backend.entity.Deployment;
import com.ohotech.backend.entity.DeploymentStatus;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class WebhookProvisioningProvider implements SoftwareProvisioningProvider {

    @Override
    public String getSupportedType() {
        return "WEBHOOK";
    }

    @Override
    public ProvisioningResult initiateProvisioning(Deployment deployment) {
        log.info("Webhook provisioning event prepared for deployment #{}", deployment.getId());
        return ProvisioningResult.builder()
                .success(true)
                .targetStatus(DeploymentStatus.PENDING)
                .message("Webhook provisioning notification queued.")
                .customerInstructions("Deployment notification dispatched to agency fulfillment webhook.")
                .build();
    }
}
