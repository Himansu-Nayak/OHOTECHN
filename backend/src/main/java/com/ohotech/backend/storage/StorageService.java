package com.ohotech.backend.storage;

import org.springframework.core.io.Resource;

import java.io.InputStream;

public interface StorageService {

    /**
     * Uploads a file input stream to storage.
     */
    StorageFileUploadResult uploadFile(String directory, String fileName, InputStream content, long contentLength, String contentType);

    /**
     * Retrieves file content as byte array.
     */
    byte[] downloadFileBytes(String filePath);

    /**
     * Retrieves file as Spring Resource for streaming downloads.
     */
    Resource getFileResource(String filePath);

    /**
     * Generates a secure, time-limited presigned download URL for entitled users.
     */
    String generatePresignedDownloadUrl(String filePath, int expirationMinutes);

    /**
     * Deletes a file from storage.
     */
    void deleteFile(String filePath);

    /**
     * Returns the active storage provider identifier (e.g., LOCAL, S3, R2, MINIO).
     */
    String getProviderType();
}
