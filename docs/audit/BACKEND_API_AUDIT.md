# OHO TECH — Backend & API Forensic Audit Report

**Audit Target:** Spring Boot 4.1.0 / Java 21 / PostgreSQL 18  
**Date:** 2026-10-14  
**Auditor:** Forensic Backend Architecture Team  

---

## 1. Package Structure & Architectural Layering

- **Controllers:** 35 `@RestController`s, 1 `@RestControllerAdvice`
- **Services:** 42 service components across core domain, AI, payments, and provisioning
- **Entities & Enums:** 31 `@Entity` classes, 17 domain enums
- **Repositories:** 30 Spring Data JPA interfaces
- **DTOs:** 91 classes (80 root + 11 AI-specific)

### Architectural Deficiencies:
1. **Flat Packaging:** All controllers, entities, repositories, and DTOs sit in flat layer packages rather than domain modules (`billing`, `catalog`, `identity`, `licensing`, `orders`).
2. **Direct Repository Injection:** `AdminController` injects 10 repositories directly, bypassing services. `DeveloperController` and `SupportController` also bypass service layers.

---

## 2. Key Backend Findings

### [BE-001] Public PII & BCrypt Hash Leakage (`SEC-001`)
- **Severity:** Critical
- **Confidence:** Confirmed
- **Evidence:** `LicenseController.getLicenseByKey` returns the raw `License` entity, which eagerly fetches `User`. `User.passwordHash` has no `@JsonIgnore`. `SecurityConfig` permits all requests to `/api/licenses/key/**`.
- **Impact:** Live verification confirmed that unauthenticated requests can view user passwords, phone numbers, addresses, and transaction signatures.
- **Fix:** Add `@JsonIgnore` to `User.passwordHash` and map `License` to a sanitized `LicensePublicDto`.

### [BE-002] Free Order Confirmation Endpoint (`PAY-001`)
- **Severity:** High
- **Confidence:** Confirmed
- **Evidence:** `POST /api/payments/demo-pay` in `PaymentController.java` is accessible to regular customers and transitions orders to `CONFIRMED` without payment.
- **Impact:** Any user can mark orders as paid without transaction verification.
- **Fix:** Restrict to `@Profile({"dev", "test"})` or require `ROLE_ADMIN`.

### [BE-003] Information Leakage in Global Exception Handler
- **Severity:** Medium
- **Confidence:** Confirmed
- **Evidence:** `GlobalExceptionHandler.java#L69-L72` returns `ex.getMessage()` in HTTP 500 responses.
- **Impact:** Leaks internal database table names, constraint definitions, and SQL errors to API consumers.
- **Fix:** Sanitize generic 500 responses to return standard error messages while logging details internally.

### [BE-004] Cascading EAGER Fetching on Core Relations
- **Severity:** Medium
- **Confidence:** Confirmed
- **Evidence:** `Order.java` eagerly fetches `User`, `Payment`, and `List<OrderItem>`. `OrderItem.java` eagerly fetches `Product` and `ProductPlan`.
- **Impact:** Severe N+1 query proliferation and memory consumption during high-traffic order queries.
- **Fix:** Convert relationships to `FetchType.LAZY` and use JOIN FETCH queries or EntityGraphs where needed.

### [BE-005] In-Memory Heap Aggregation in Admin Dashboard
- **Severity:** Medium
- **Confidence:** Confirmed
- **Evidence:** `AdminController.java#L60-L65` executes `orderRepository.findAll()` and streams through all orders in JVM memory to calculate total revenue.
- **Impact:** High memory consumption and CPU spikes as order volume grows.
- **Fix:** Replace with JPQL aggregation query: `SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.status = ...`.
