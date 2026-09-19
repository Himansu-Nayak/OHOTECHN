package com.ohotech.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import com.ohotech.backend.dto.FirebaseVerifiedUser;
import com.ohotech.backend.exception.BadRequestException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Service
@Slf4j
public class FirebaseService {

    @Value("${app.firebase.mock-enabled:false}")
    private boolean mockEnabled;

    @Value("${app.firebase.api-key:${FIREBASE_API_KEY:}}")
    private String firebaseApiKey;

    public FirebaseVerifiedUser verifyToken(String idToken) {
        if (!StringUtils.hasText(idToken)) {
            throw new BadRequestException("Firebase ID token cannot be empty.");
        }

        // Support mock tokens for automated testing / offline staging
        if (mockEnabled && idToken.startsWith("mock-test-token-")) {
            log.info("Processing mock Firebase ID token for testing.");
            return parseMockToken(idToken);
        }

        // If Firebase Admin SDK was initialized with service account credentials, use it
        if (!FirebaseApp.getApps().isEmpty()) {
            try {
                FirebaseToken token = FirebaseAuth.getInstance().verifyIdToken(idToken);
                String uid = token.getUid();
                if (!StringUtils.hasText(uid)) {
                    throw new BadRequestException("Invalid Firebase ID token: missing UID.");
                }

                String email = token.getEmail();
                boolean emailVerified = token.isEmailVerified();
                String phone = (String) token.getClaims().get("phone_number");
                String name = token.getName();
                String picture = token.getPicture();

                return FirebaseVerifiedUser.builder()
                        .uid(uid)
                        .email(StringUtils.hasText(email) ? email.trim().toLowerCase() : null)
                        .emailVerified(emailVerified)
                        .phone(StringUtils.hasText(phone) ? phone.trim() : null)
                        .name(StringUtils.hasText(name) ? name.trim() : null)
                        .picture(picture)
                        .build();

            } catch (Exception ex) {
                log.error("Firebase Admin SDK ID token verification failed: {}", ex.getMessage());
                throw new BadRequestException("Firebase token verification failed. The token is invalid or expired.");
            }
        }

        // Fallback: Verify ID token securely via Google's Identity Toolkit REST API
        log.info("FirebaseApp Admin SDK not initialized with service account; falling back to Google Identity Toolkit REST verification.");
        return verifyTokenViaGoogleIdentityToolkit(idToken);
    }

    private FirebaseVerifiedUser verifyTokenViaGoogleIdentityToolkit(String idToken) {
        if (!StringUtils.hasText(firebaseApiKey)) {
            throw new BadRequestException("Firebase Admin is not configured and FIREBASE_API_KEY is missing on backend.");
        }

        try {
            String url = "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=" + firebaseApiKey.trim();
            Map<String, String> body = Map.of("idToken", idToken);

            RestClient restClient = RestClient.builder().build();
            String responseStr = restClient.post()
                    .uri(url)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(String.class);

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(responseStr);
            JsonNode usersNode = root.path("users");
            if (!usersNode.isArray() || usersNode.isEmpty()) {
                throw new BadRequestException("Firebase token verification returned no user profile.");
            }

            JsonNode userNode = usersNode.get(0);
            String uid = userNode.path("localId").asText(null);
            if (!StringUtils.hasText(uid)) {
                throw new BadRequestException("Invalid Firebase token: missing UID.");
            }

            String email = userNode.path("email").asText(null);
            boolean emailVerified = userNode.path("emailVerified").asBoolean(false);
            String phone = userNode.path("phoneNumber").asText(null);
            String displayName = userNode.path("displayName").asText(null);
            String photoUrl = userNode.path("photoUrl").asText(null);

            log.info("Successfully verified Firebase ID token via Google Identity Toolkit REST API for uid: {}", uid);

            return FirebaseVerifiedUser.builder()
                    .uid(uid)
                    .email(StringUtils.hasText(email) ? email.trim().toLowerCase() : null)
                    .emailVerified(emailVerified)
                    .phone(StringUtils.hasText(phone) ? phone.trim() : null)
                    .name(StringUtils.hasText(displayName) ? displayName.trim() : null)
                    .picture(photoUrl)
                    .build();

        } catch (BadRequestException ex) {
            throw ex;
        } catch (Exception ex) {
            log.error("Google Identity Toolkit token verification failed: {}", ex.getMessage());
            throw new BadRequestException("Firebase token verification failed. The token is invalid or expired.");
        }
    }

    private FirebaseVerifiedUser parseMockToken(String mockToken) {
        // Format: mock-test-token-google:email:name:verified OR mock-test-token-phone:phoneNumber
        String[] parts = mockToken.split(":");
        if (mockToken.startsWith("mock-test-token-google")) {
            String email = parts.length > 1 ? parts[1] : "google_user@ohotechn.com";
            String name = parts.length > 2 ? parts[2] : "Google Verified User";
            boolean verified = parts.length <= 3 || Boolean.parseBoolean(parts[3]);
            return FirebaseVerifiedUser.builder()
                    .uid("firebase_uid_mock_g_" + email.replaceAll("[^a-zA-Z0-9]", "_"))
                    .email(email.toLowerCase())
                    .emailVerified(verified)
                    .name(name)
                    .build();
        } else if (mockToken.startsWith("mock-test-token-phone")) {
            String phone = parts.length > 1 ? parts[1] : "+919876543210";
            return FirebaseVerifiedUser.builder()
                    .uid("firebase_uid_mock_p_" + phone.replaceAll("[^0-9]", ""))
                    .phone(phone)
                    .name("Mobile User " + (phone.length() >= 4 ? phone.substring(phone.length() - 4) : phone))
                    .build();
        } else {
            return FirebaseVerifiedUser.builder()
                    .uid("firebase_uid_mock_generic")
                    .email("mock_user@ohotechn.com")
                    .emailVerified(true)
                    .name("Mock User")
                    .build();
        }
    }
}
