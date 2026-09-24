package com.ohotech.backend.repository;

import com.ohotech.backend.entity.AuditLog;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long>, JpaSpecificationExecutor<AuditLog> {

    Page<AuditLog> findByOrderByCreatedAtDesc(Pageable pageable);

    default Page<AuditLog> filterAuditLogs(
            String action,
            String entityType,
            String searchPattern,
            LocalDateTime startDate,
            LocalDateTime endDate,
            Pageable pageable) {

        Specification<AuditLog> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (action != null && !action.trim().isEmpty()) {
                predicates.add(cb.equal(root.get("action"), action.trim()));
            }
            if (entityType != null && !entityType.trim().isEmpty()) {
                predicates.add(cb.equal(root.get("entityType"), entityType.trim()));
            }
            if (searchPattern != null && !searchPattern.trim().isEmpty()) {
                String pattern = searchPattern.trim();
                if (!pattern.startsWith("%") && !pattern.endsWith("%")) {
                    pattern = "%" + pattern.toLowerCase() + "%";
                }
                Predicate descMatch = cb.like(cb.lower(cb.coalesce(root.get("description"), "")), pattern);
                Predicate emailMatch = cb.like(cb.lower(cb.coalesce(root.get("actorEmail"), "")), pattern);
                predicates.add(cb.or(descMatch, emailMatch));
            }
            if (startDate != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("createdAt"), startDate));
            }
            if (endDate != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("createdAt"), endDate));
            }

            if (query != null) {
                query.orderBy(cb.desc(root.get("createdAt")));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return findAll(spec, pageable);
    }
}
