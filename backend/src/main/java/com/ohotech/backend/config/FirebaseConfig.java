package com.ohotech.backend.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.StringUtils;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

@Configuration
@Slf4j
public class FirebaseConfig {

    @Value("${app.firebase.credentials-path:}")
    private String credentialsPath;

    @Value("${app.firebase.credentials-json:}")
    private String credentialsJson;

    @Value("${app.firebase.project-id:oho-tech}")
    private String projectId;

    @PostConstruct
    public void initializeFirebase() {
        if (!FirebaseApp.getApps().isEmpty()) {
            log.info("FirebaseApp is already initialized.");
            return;
        }

        try {
            InputStream credentialsStream = null;

            if (StringUtils.hasText(credentialsJson)) {
                log.info("Initializing Firebase Admin SDK using inline JSON credentials...");
                credentialsStream = new ByteArrayInputStream(credentialsJson.getBytes(StandardCharsets.UTF_8));
            } else if (StringUtils.hasText(credentialsPath)) {
                File credFile = new File(credentialsPath);
                if (credFile.exists()) {
                    log.info("Initializing Firebase Admin SDK from file: {}", credentialsPath);
                    credentialsStream = new FileInputStream(credFile);
                } else {
                    log.warn("Configured Firebase credentials file not found at: {}", credentialsPath);
                }
            }

            GoogleCredentials credentials;
            if (credentialsStream != null) {
                credentials = GoogleCredentials.fromStream(credentialsStream);
            } else {
                try {
                    credentials = GoogleCredentials.getApplicationDefault();
                    log.info("Loaded Application Default Credentials for Firebase Admin SDK.");
                } catch (Exception e) {
                    log.warn("No explicit or default Google credentials found for Firebase. Firebase Admin SDK will remain uninitialized until credentials are provided.");
                    return;
                }
            }

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(credentials)
                    .setProjectId(projectId)
                    .build();

            FirebaseApp.initializeApp(options);
            log.info("Firebase Admin SDK successfully initialized for project: {}", projectId);

        } catch (Exception e) {
            log.error("Failed to initialize Firebase Admin SDK: {}", e.getMessage());
        }
    }
}
