package com.ohotech.backend.storage;

public class StorageFileUploadResult {
    private String filePath;
    private String fileName;
    private long fileSize;
    private String contentType;
    private String storageProvider;
    private String publicOrSignedUrl;

    public StorageFileUploadResult() {
    }

    public StorageFileUploadResult(String filePath, String fileName, long fileSize, String contentType, String storageProvider, String publicOrSignedUrl) {
        this.filePath = filePath;
        this.fileName = fileName;
        this.fileSize = fileSize;
        this.contentType = contentType;
        this.storageProvider = storageProvider;
        this.publicOrSignedUrl = publicOrSignedUrl;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String filePath;
        private String fileName;
        private long fileSize;
        private String contentType;
        private String storageProvider;
        private String publicOrSignedUrl;

        public Builder filePath(String filePath) {
            this.filePath = filePath;
            return this;
        }

        public Builder fileName(String fileName) {
            this.fileName = fileName;
            return this;
        }

        public Builder fileSize(long fileSize) {
            this.fileSize = fileSize;
            return this;
        }

        public Builder contentType(String contentType) {
            this.contentType = contentType;
            return this;
        }

        public Builder storageProvider(String storageProvider) {
            this.storageProvider = storageProvider;
            return this;
        }

        public Builder publicOrSignedUrl(String publicOrSignedUrl) {
            this.publicOrSignedUrl = publicOrSignedUrl;
            return this;
        }

        public StorageFileUploadResult build() {
            return new StorageFileUploadResult(filePath, fileName, fileSize, contentType, storageProvider, publicOrSignedUrl);
        }
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public long getFileSize() {
        return fileSize;
    }

    public void setFileSize(long fileSize) {
        this.fileSize = fileSize;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public String getStorageProvider() {
        return storageProvider;
    }

    public void setStorageProvider(String storageProvider) {
        this.storageProvider = storageProvider;
    }

    public String getPublicOrSignedUrl() {
        return publicOrSignedUrl;
    }

    public void setPublicOrSignedUrl(String publicOrSignedUrl) {
        this.publicOrSignedUrl = publicOrSignedUrl;
    }
}
