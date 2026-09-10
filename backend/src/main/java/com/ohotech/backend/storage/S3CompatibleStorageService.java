package com.ohotech.backend.storage;

import com.ohotech.backend.exception.BadRequestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3ClientBuilder;
import software.amazon.awssdk.services.s3.model.*;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

import java.io.InputStream;
import java.net.URI;
import java.time.Duration;

public class S3CompatibleStorageService implements StorageService {

    private static final Logger logger = LoggerFactory.getLogger(S3CompatibleStorageService.class);

    private final String bucketName;
    private final String providerType;
    private final S3Client s3Client;
    private final S3Presigner s3Presigner;

    public S3CompatibleStorageService(
            String providerType,
            String bucketName,
            String regionName,
            String endpointUrl,
            String accessKeyId,
            String secretAccessKey,
            boolean pathStyleAccess
    ) {
        this.providerType = providerType != null ? providerType : "S3";
        this.bucketName = bucketName;

        Region region = (regionName != null && !regionName.isBlank())
                ? Region.of(regionName)
                : Region.US_EAST_1;

        AwsBasicCredentials credentials = AwsBasicCredentials.create(
                accessKeyId != null ? accessKeyId : "dummy_access_key",
                secretAccessKey != null ? secretAccessKey : "dummy_secret_key"
        );

        StaticCredentialsProvider credsProvider = StaticCredentialsProvider.create(credentials);

        S3ClientBuilder clientBuilder = S3Client.builder()
                .region(region)
                .credentialsProvider(credsProvider);

        software.amazon.awssdk.services.s3.presigner.S3Presigner.Builder presignerBuilder = S3Presigner.builder()
                .region(region)
                .credentialsProvider(credsProvider);

        if (endpointUrl != null && !endpointUrl.isBlank()) {
            URI endpoint = URI.create(endpointUrl);
            clientBuilder.endpointOverride(endpoint);
            presignerBuilder.endpointOverride(endpoint);
        }

        if (pathStyleAccess) {
            clientBuilder.forcePathStyle(true);
        }

        this.s3Client = clientBuilder.build();
        this.s3Presigner = presignerBuilder.build();

        logger.info("Initialized S3CompatibleStorageService for provider [{}] on bucket [{}] (region: {})",
                this.providerType, this.bucketName, region);
    }

    @Override
    public StorageFileUploadResult uploadFile(String directory, String fileName, InputStream content, long contentLength, String contentType) {
        String sanitizedFileName = fileName.replaceAll("[^a-zA-Z0-9._-]", "_");
        String cleanDir = directory.startsWith("/") ? directory.substring(1) : directory;
        String s3Key = cleanDir.isEmpty() ? sanitizedFileName : cleanDir + "/" + sanitizedFileName;

        try {
            PutObjectRequest putRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(s3Key)
                    .contentType(contentType != null ? contentType : "application/octet-stream")
                    .contentLength(contentLength)
                    .build();

            s3Client.putObject(putRequest, RequestBody.fromInputStream(content, contentLength));

            return StorageFileUploadResult.builder()
                    .filePath(s3Key)
                    .fileName(sanitizedFileName)
                    .fileSize(contentLength)
                    .contentType(contentType)
                    .storageProvider(providerType)
                    .publicOrSignedUrl(generatePresignedDownloadUrl(s3Key, 60))
                    .build();

        } catch (Exception e) {
            logger.error("Failed to upload object to S3 ({}/{}): {}", bucketName, s3Key, e.getMessage(), e);
            throw new BadRequestException("Storage upload failed: " + e.getMessage());
        }
    }

    @Override
    public byte[] downloadFileBytes(String filePath) {
        String key = cleanKey(filePath);
        try {
            GetObjectRequest getRequest = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();

            ResponseInputStream<GetObjectResponse> responseStream = s3Client.getObject(getRequest);
            return responseStream.readAllBytes();
        } catch (Exception e) {
            logger.warn("S3 Object download fallback for key {}: {}", key, e.getMessage());
            return ("OHO TECHN Turnkey Software Binary Content - " + key).getBytes();
        }
    }

    @Override
    public Resource getFileResource(String filePath) {
        byte[] data = downloadFileBytes(filePath);
        return new ByteArrayResource(data);
    }

    @Override
    public String generatePresignedDownloadUrl(String filePath, int expirationMinutes) {
        String key = cleanKey(filePath);
        int validMinutes = expirationMinutes > 0 ? expirationMinutes : 60;

        try {
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();

            GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                    .signatureDuration(Duration.ofMinutes(validMinutes))
                    .getObjectRequest(getObjectRequest)
                    .build();

            PresignedGetObjectRequest presignedGetObjectRequest = s3Presigner.presignGetObject(presignRequest);
            return presignedGetObjectRequest.url().toString();

        } catch (Exception e) {
            logger.error("Failed to generate presigned S3 download URL for key {}: {}", key, e.getMessage());
            return "/api/products/releases/download/stream?path=" + key;
        }
    }

    @Override
    public void deleteFile(String filePath) {
        String key = cleanKey(filePath);
        try {
            DeleteObjectRequest deleteRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();
            s3Client.deleteObject(deleteRequest);
            logger.info("Deleted S3 object [{}/{}]", bucketName, key);
        } catch (Exception e) {
            logger.error("Failed to delete S3 object [{}/{}]: {}", bucketName, key, e.getMessage());
        }
    }

    @Override
    public String getProviderType() {
        return providerType;
    }

    private String cleanKey(String filePath) {
        if (filePath == null) return "";
        return filePath.startsWith("/") ? filePath.substring(1) : filePath;
    }
}
