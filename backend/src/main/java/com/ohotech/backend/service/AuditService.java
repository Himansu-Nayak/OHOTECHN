package com.ohotech.backend.service;

import com.ohotech.backend.dto.AuditLogDto;
import com.ohotech.backend.entity.AuditLog;
import com.ohotech.backend.entity.User;
import com.ohotech.backend.repository.AuditLogRepository;
import com.ohotech.backend.security.UserPrincipal;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Service
@RequiredArgsConstructor
public class AuditService {

    private static final Logger logger = LoggerFactory.getLogger(AuditService.class);

    private final AuditLogRepository auditLogRepository;

    @Async
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logAsync(String action, String entityType, String entityId, String description) {
        logEventInternal(null, action, entityType, entityId, description, null, null);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logEvent(String action, String entityType, String entityId, String description) {
        logEventInternal(null, action, entityType, entityId, description, null, null);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logUserEvent(User actor, String action, String entityType, String entityId, String description) {
        logEventInternal(actor, action, entityType, entityId, description, null, null);
    }

    private void logEventInternal(User actor, String action, String entityType, String entityId,
                                 String description, String prevVal, String newVal) {
        try {
            Long actorId = null;
            String actorName = "Anonymous/System";
            String actorEmail = null;
            String actorRole = "SYSTEM";

            if (actor != null) {
                actorId = actor.getId();
                actorName = actor.getName();
                actorEmail = actor.getEmail();
                actorRole = actor.getRole() != null ? actor.getRole().name() : "ROLE_CUSTOMER";
            } else {
                Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                if (auth != null && auth.getPrincipal() instanceof UserPrincipal principal) {
                    actorId = principal.getId();
                    actorName = principal.getUsername();
                    actorEmail = principal.getEmail();
                    actorRole = auth.getAuthorities() != null && !auth.getAuthorities().isEmpty()
                            ? auth.getAuthorities().iterator().next().getAuthority()
                            : "USER";
                }
            }

            String ipAddress = "127.0.0.1";
            String userAgent = "Unknown";

            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                ipAddress = request.getHeader("X-Forwarded-For");
                if (ipAddress == null || ipAddress.isEmpty()) {
                    ipAddress = request.getRemoteAddr();
                }
                userAgent = request.getHeader("User-Agent");
            }

            // Sensitive data masking safety check
            String safeDescription = sanitize(description);
            String safePrevVal = sanitize(prevVal);
            String safeNewVal = sanitize(newVal);

            AuditLog log = AuditLog.builder()
                    .actorUserId(actorId)
                    .actorName(actorName)
                    .actorEmail(actorEmail)
                    .actorRole(actorRole)
                    .action(action)
                    .entityType(entityType)
                    .entityId(entityId)
                    .description(safeDescription)
                    .previousValue(safePrevVal)
                    .newValue(safeNewVal)
                    .ipAddress(ipAddress)
                    .userAgent(userAgent != null && userAgent.length() > 250 ? userAgent.substring(0, 250) : userAgent)
                    .build();

            auditLogRepository.save(log);
        } catch (Exception e) {
            logger.warn("Audit logging failed silently: {}", e.getMessage());
        }
    }

    private String sanitize(String input) {
        if (input == null) return null;
        return input.replaceAll("(?i)(password|token|secret|razorpay_signature)=[^&\\s]+", "$1=******");
    }

    @Transactional(readOnly = true)
    public Page<AuditLogDto> getAuditLogs(String action, String entityType, String search,
                                         LocalDate startDate, LocalDate endDate, Pageable pageable) {

        String trimmedAction = (action != null && !action.trim().isEmpty()) ? action.trim() : null;
        String trimmedEntityType = (entityType != null && !entityType.trim().isEmpty()) ? entityType.trim() : null;
        String searchPattern = (search != null && !search.trim().isEmpty())
                ? "%" + search.trim().toLowerCase() + "%"
                : null;

        LocalDateTime start = startDate != null ? startDate.atStartOfDay() : null;
        LocalDateTime end = endDate != null ? endDate.atTime(LocalTime.MAX) : null;

        if (trimmedAction == null && trimmedEntityType == null && searchPattern == null && start == null && end == null) {
            return auditLogRepository.findByOrderByCreatedAtDesc(pageable).map(this::mapToDto);
        }

        return auditLogRepository.filterAuditLogs(trimmedAction, trimmedEntityType, searchPattern, start, end, pageable)
                .map(this::mapToDto);
    }

    public AuditLogDto mapToDto(AuditLog log) {
        return AuditLogDto.builder()
                .id(log.getId())
                .actorUserId(log.getActorUserId())
                .actorName(log.getActorName())
                .actorEmail(log.getActorEmail())
                .actorRole(log.getActorRole())
                .action(log.getAction())
                .entityType(log.getEntityType())
                .entityId(log.getEntityId())
                .description(log.getDescription())
                .previousValue(log.getPreviousValue())
                .newValue(log.getNewValue())
                .ipAddress(log.getIpAddress())
                .userAgent(log.getUserAgent())
                .createdAt(log.getCreatedAt())
                .build();
    }
}
