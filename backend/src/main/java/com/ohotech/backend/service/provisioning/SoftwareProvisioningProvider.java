package com.ohotech.backend.service.provisioning;

import com.ohotech.backend.entity.Deployment;

/**
 * Strategy interface for software provisioning models.
 * Strictly avoids simulated automation when external credentials/APIs do not exist.
 */
public interface SoftwareProvisioningProvider {

    /**
     * The technical integration type handled by this provider:
     * e.g., MANUAL, API, WEBHOOK, DEDICATED_INSTANCE, HOSTED_SAAS, SOURCE_CODE
     */
    String getSupportedType();

    /**
     * Initiates the provisioning workflow for a deployment instance.
     */
    ProvisioningResult initiateProvisioning(Deployment deployment);
}
