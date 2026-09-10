package com.ohotech.backend.storage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

@Configuration
public class StorageConfig {

    private static final Logger logger = LoggerFactory.getLogger(StorageConfig.class);

    @Value("${app.storage.provider:LOCAL}")
    private String storageProvider;

    @Value("${app.storage.local.base-dir:./storage}")
    private String localBaseDir;

    @Value("${app.storage.s3.bucket:ohotech-releases}")
    private String s3Bucket;

    @Value("${app.storage.s3.region:us-east-1}")
    private String s3Region;

    @Value("${app.storage.s3.endpoint:}")
    private String s3Endpoint;

    @Value("${app.storage.s3.access-key:}")
    private String s3AccessKey;

    @Value("${app.storage.s3.secret-key:}")
    private String s3SecretKey;

    @Value("${app.storage.s3.path-style:false}")
    private boolean s3PathStyle;

    @Bean
    @Primary
    public StorageService storageService() {
        String provider = storageProvider != null ? storageProvider.trim().toUpperCase() : "LOCAL";

        if ("S3".equals(provider) || "R2".equals(provider) || "MINIO".equals(provider)) {
            logger.info("Initializing Cloud Object Storage Provider: {}", provider);
            return new S3CompatibleStorageService(
                    provider,
                    s3Bucket,
                    s3Region,
                    s3Endpoint,
                    s3AccessKey,
                    s3SecretKey,
                    "MINIO".equals(provider) || s3PathStyle
            );
        }

        logger.info("Initializing Local File Storage Provider with base directory: {}", localBaseDir);
        return new LocalStorageService(localBaseDir);
    }
}
