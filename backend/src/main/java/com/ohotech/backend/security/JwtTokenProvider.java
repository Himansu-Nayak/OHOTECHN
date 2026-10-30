package com.ohotech.backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtTokenProvider {

    private static final Logger logger = LoggerFactory.getLogger(JwtTokenProvider.class);

    private final SecretKey key;
    private final long jwtExpirationInMs;

    public JwtTokenProvider(
            @Value("${app.jwt.secret:}") String jwtSecret,
            @Value("${spring.profiles.active:default}") String activeProfile,
            @Value("${app.jwt.expiration-ms:86400000}") long jwtExpirationInMs) {
        boolean isProduction = "prod".equalsIgnoreCase(activeProfile) || "production".equalsIgnoreCase(activeProfile);

        String effectiveSecret = jwtSecret != null ? jwtSecret.trim() : "";
        if (effectiveSecret.isEmpty()) {
            if (isProduction) {
                throw new IllegalStateException("FATAL SECURITY CONFIGURATION ERROR: Running in production requires an explicit, secure app.jwt.secret of at least 32 characters! Set JWT_SECRET environment variable.");
            }
            logger.warn("SECURITY WARNING: app.jwt.secret is empty. Defaulting to an ephemeral development key. DO NOT USE IN PRODUCTION.");
            effectiveSecret = "defaultSecretKeyForDevelopmentPhaseThatIsLongEnoughAndSecure32Bytes!";
        } else if (effectiveSecret.length() < 32) {
            throw new IllegalStateException("FATAL SECURITY CONFIGURATION ERROR: app.jwt.secret must be at least 32 characters (256 bits). Current length: " + effectiveSecret.length());
        } else if (isProduction && effectiveSecret.contains("defaultSecretKeyForDevelopmentPhase")) {
            throw new IllegalStateException("FATAL SECURITY CONFIGURATION ERROR: Running in production profile requires an explicit, secure app.jwt.secret. Known development fallback secrets are strictly rejected.");
        }

        this.key = Keys.hmacShaKeyFor(effectiveSecret.getBytes(StandardCharsets.UTF_8));
        this.jwtExpirationInMs = jwtExpirationInMs;
    }

    public String generateToken(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        return generateTokenFromUserId(userPrincipal.getId());
    }

    public String generateTokenFromUserId(Long userId) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);

        return Jwts.builder()
                .subject(Long.toString(userId))
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(key)
                .compact();
    }

    public Long getUserIdFromJWT(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return Long.parseLong(claims.getSubject());
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parser().verifyWith(key).build().parseSignedClaims(authToken);
            return true;
        } catch (JwtException | IllegalArgumentException ex) {
            logger.error("Invalid JWT token: {}", ex.getMessage());
        }
        return false;
    }
}
