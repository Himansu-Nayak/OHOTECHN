package com.ohotech.backend.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ohotech.backend.dto.ApiResponse;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private static final int MAX_REQUESTS_PER_MINUTE = 20;
    private static final long ONE_MINUTE_MS = 60000;

    private final Map<String, RequestBucket> bucketMap = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static class RequestBucket {
        long startTime = System.currentTimeMillis();
        AtomicInteger count = new AtomicInteger(0);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        String uri = request.getRequestURI();

        // Target sensitive security, checkout, and AI compute endpoints
        if (uri.startsWith("/api/auth/login") ||
            uri.startsWith("/api/auth/firebase-login") ||
            uri.startsWith("/api/auth/register") ||
            uri.startsWith("/api/auth/send-otp") ||
            uri.startsWith("/api/payments/verify") ||
            uri.startsWith("/api/ai/") ||
            uri.contains("/activate") ||
            uri.contains("/trial")) {

            String clientIp = request.getHeader("X-Forwarded-For");
            if (clientIp != null && !clientIp.isBlank()) {
                if (clientIp.contains(",")) {
                    clientIp = clientIp.split(",")[0].trim();
                }
            } else {
                clientIp = request.getRemoteAddr();
            }

            String key = clientIp + ":" + uri;
            long now = System.currentTimeMillis();

            RequestBucket bucket = bucketMap.compute(key, (k, existing) -> {
                if (existing == null || (now - existing.startTime) > ONE_MINUTE_MS) {
                    RequestBucket newBucket = new RequestBucket();
                    newBucket.count.set(1);
                    return newBucket;
                } else {
                    existing.count.incrementAndGet();
                    return existing;
                }
            });

            if (bucket.count.get() > MAX_REQUESTS_PER_MINUTE) {
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                ApiResponse<String> apiResponse = ApiResponse.error("Rate limit exceeded. Too many requests to sensitive endpoint. Please wait a minute before retrying.");
                response.getWriter().write(objectMapper.writeValueAsString(apiResponse));
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}
