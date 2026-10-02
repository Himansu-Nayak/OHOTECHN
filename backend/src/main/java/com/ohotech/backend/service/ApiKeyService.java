package com.ohotech.backend.service;

import com.ohotech.backend.dto.ApiKeyDto;
import com.ohotech.backend.dto.CreateApiKeyRequest;
import com.ohotech.backend.entity.ApiKey;
import com.ohotech.backend.entity.Role;
import com.ohotech.backend.entity.User;
import com.ohotech.backend.exception.BadRequestException;
import com.ohotech.backend.exception.ResourceNotFoundException;
import com.ohotech.backend.repository.ApiKeyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ApiKeyService {

    private final ApiKeyRepository apiKeyRepository;
    private final AuditService auditService;
    private final SecureRandom secureRandom = new SecureRandom();

    @Transactional
    public ApiKeyDto createApiKey(User user, CreateApiKeyRequest request) {
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new BadRequestException("API Key name cannot be blank.");
        }

        // Generate 24 secure random bytes => 48 hex chars
        byte[] randomBytes = new byte[24];
        secureRandom.nextBytes(randomBytes);
        String randomHex = HexFormat.of().formatHex(randomBytes);
        String plaintextToken = "oho_live_" + randomHex;

        // Prefix for safe display: e.g. "oho_live_a1b2••••"
        String prefix = plaintextToken.substring(0, 13) + "••••";

        // Hash plaintext with SHA-256 for storage
        String keyHash = hashToken(plaintextToken);

        ApiKey apiKey = ApiKey.builder()
                .name(request.getName().trim())
                .keyPrefix(prefix)
                .keyHash(keyHash)
                .user(user)
                .scope(request.getScope() != null && !request.getScope().isBlank() ? request.getScope().trim() : "read_write")
                .active(true)
                .createdAt(LocalDateTime.now())
                .build();

        apiKey = apiKeyRepository.save(apiKey);

        auditService.logUserEvent(user, "API_KEY_CREATED", "ApiKey", String.valueOf(apiKey.getId()),
                "Created API key: " + apiKey.getName() + " with scope " + apiKey.getScope());

        log.info("User #{} created API key #{}: {}", user.getId(), apiKey.getId(), apiKey.getName());

        return ApiKeyDto.builder()
                .id(apiKey.getId())
                .name(apiKey.getName())
                .keyPrefix(apiKey.getKeyPrefix())
                .plaintextSecret(plaintextToken) // Returned only ONCE upon creation!
                .scope(apiKey.getScope())
                .active(apiKey.isActive())
                .createdAt(apiKey.getCreatedAt())
                .lastUsedAt(apiKey.getLastUsedAt())
                .createdByEmail(user.getEmail())
                .build();
    }

    @Transactional(readOnly = true)
    public List<ApiKeyDto> getApiKeysForUser(User user) {
        List<ApiKey> keys;
        if (user.getRole() == Role.ROLE_ADMIN) {
            keys = apiKeyRepository.findAllByOrderByCreatedAtDesc();
        } else {
            keys = apiKeyRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        }

        return keys.stream()
                .map(this::mapToDto)
                .toList();
    }

    @Transactional
    public ApiKeyDto revokeApiKey(Long keyId, User user) {
        ApiKey apiKey = apiKeyRepository.findById(keyId)
                .orElseThrow(() -> new ResourceNotFoundException("ApiKey", "id", keyId));

        if (user.getRole() != Role.ROLE_ADMIN && !apiKey.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("You do not have permission to revoke this API key.");
        }

        apiKey.setActive(false);
        apiKey = apiKeyRepository.save(apiKey);

        auditService.logUserEvent(user, "API_KEY_REVOKED", "ApiKey", String.valueOf(apiKey.getId()),
                "Revoked API key: " + apiKey.getName());

        log.info("User #{} revoked API key #{}", user.getId(), apiKey.getId());
        return mapToDto(apiKey);
    }

    private ApiKeyDto mapToDto(ApiKey key) {
        return ApiKeyDto.builder()
                .id(key.getId())
                .name(key.getName())
                .keyPrefix(key.getKeyPrefix())
                .plaintextSecret(null) // Never disclose secret in read operations
                .scope(key.getScope())
                .active(key.isActive())
                .createdAt(key.getCreatedAt())
                .lastUsedAt(key.getLastUsedAt())
                .expiresAt(key.getExpiresAt())
                .createdByEmail(key.getUser() != null ? key.getUser().getEmail() : "system")
                .build();
    }

    private String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (Exception e) {
            throw new RuntimeException("SHA-256 hashing error", e);
        }
    }
}
