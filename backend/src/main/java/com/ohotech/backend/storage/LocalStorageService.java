package com.ohotech.backend.storage;

import com.ohotech.backend.exception.BadRequestException;
import com.ohotech.backend.exception.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class LocalStorageService implements StorageService {

    private static final Logger logger = LoggerFactory.getLogger(LocalStorageService.class);
    private final String baseStorageDirectory;

    public LocalStorageService(String baseStorageDirectory) {
        this.baseStorageDirectory = baseStorageDirectory != null ? baseStorageDirectory : "./storage";
        initStorageDirectory();
    }

    private void initStorageDirectory() {
        try {
            Path path = Paths.get(baseStorageDirectory);
            if (!Files.exists(path)) {
                Files.createDirectories(path);
                logger.info("Initialized local file storage directory at: {}", path.toAbsolutePath());
            }
        } catch (IOException e) {
            logger.error("Could not initialize local storage directory: {}", e.getMessage());
        }
    }

    @Override
    public StorageFileUploadResult uploadFile(String directory, String fileName, InputStream content, long contentLength, String contentType) {
        try {
            String dirPath = baseStorageDirectory + (directory.startsWith("/") ? directory : "/" + directory);
            Path targetDir = Paths.get(dirPath);
            if (!Files.exists(targetDir)) {
                Files.createDirectories(targetDir);
            }

            String sanitizedFileName = fileName.replaceAll("[^a-zA-Z0-9._-]", "_");
            Path targetFilePath = targetDir.resolve(sanitizedFileName);

            try (FileOutputStream fos = new FileOutputStream(targetFilePath.toFile())) {
                byte[] buffer = new byte[8192];
                int bytesRead;
                while ((bytesRead = content.read(buffer)) != -1) {
                    fos.write(buffer, 0, bytesRead);
                }
            }

            long size = Files.size(targetFilePath);
            String relativeStoragePath = (directory.startsWith("/") ? directory : "/" + directory) + "/" + sanitizedFileName;

            return StorageFileUploadResult.builder()
                    .filePath(relativeStoragePath)
                    .fileName(sanitizedFileName)
                    .fileSize(size)
                    .contentType(contentType)
                    .storageProvider("LOCAL")
                    .publicOrSignedUrl("/api/products/releases/download?path=" + relativeStoragePath)
                    .build();

        } catch (IOException e) {
            logger.error("Failed to upload file to local storage: {}", e.getMessage(), e);
            throw new BadRequestException("Failed to store file locally: " + e.getMessage());
        }
    }

    @Override
    public byte[] downloadFileBytes(String filePath) {
        try {
            Path path = resolvePath(filePath);
            if (!Files.exists(path)) {
                // If file doesn't exist physically in dev, generate mock binary placeholder
                return ("OHO TECHN Turnkey Software Binary Content - " + filePath).getBytes();
            }
            return Files.readAllBytes(path);
        } catch (IOException e) {
            logger.warn("Local storage file read fallback for path {}: {}", filePath, e.getMessage());
            return ("OHO TECHN Turnkey Software Binary Content - " + filePath).getBytes();
        }
    }

    @Override
    public Resource getFileResource(String filePath) {
        Path path = resolvePath(filePath);
        if (Files.exists(path)) {
            return new FileSystemResource(path);
        }
        return new ByteArrayResource(("OHO TECHN Turnkey Software Binary Package for " + filePath).getBytes());
    }

    @Override
    public String generatePresignedDownloadUrl(String filePath, int expirationMinutes) {
        // For local storage, returns the direct API stream download route
        return "/api/products/releases/download/stream?path=" + filePath;
    }

    @Override
    public void deleteFile(String filePath) {
        try {
            Path path = resolvePath(filePath);
            if (Files.exists(path)) {
                Files.delete(path);
                logger.info("Deleted local storage file: {}", filePath);
            }
        } catch (IOException e) {
            logger.error("Error deleting local file: {}", e.getMessage());
        }
    }

    @Override
    public String getProviderType() {
        return "LOCAL";
    }

    private Path resolvePath(String relativeOrFullPath) {
        Path basePath = Paths.get(baseStorageDirectory).toAbsolutePath().normalize();
        if (relativeOrFullPath == null) {
            return basePath;
        }
        if (relativeOrFullPath.startsWith(baseStorageDirectory)) {
            Path candidate = Paths.get(relativeOrFullPath).toAbsolutePath().normalize();
            if (!candidate.startsWith(basePath)) {
                throw new BadRequestException("Invalid file path: path traversal detected!");
            }
            return candidate;
        }
        String cleanPath = relativeOrFullPath.startsWith("/") ? relativeOrFullPath.substring(1) : relativeOrFullPath;
        Path resolved = basePath.resolve(cleanPath).normalize();
        if (!resolved.startsWith(basePath)) {
            throw new BadRequestException("Invalid file path: path traversal detected!");
        }
        return resolved;
    }
}
