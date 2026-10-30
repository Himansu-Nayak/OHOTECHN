# OHO TECH — Database Performance, Concurrency & Tuning Audit
**Document:** `docs/audit_phase2/DATABASE_PERFORMANCE_AUDIT.md`  
**Engine:** PostgreSQL 17 / HikariCP / Spring Data JPA  
**Deployment Target:** Hostinger KVM 2 VPS (2 vCPU, 4 GB RAM, NVMe Storage)  
**Author:** Principal Database Architect & Senior Spring Boot Engineer  
**Date:** October 30, 2026  
**Status:** Performance Baseline & Recommendations  

---

## 1. Executive Summary

This performance audit evaluates the database connection pool, transactional boundaries, Hibernate settings, query execution patterns, and index efficiency for the OHO TECH production platform.

Because the production backend shares a 2 vCPU / 4 GB RAM VPS topology with PostgreSQL 17, NGINX, and the Next.js frontend, database connection management, memory footprint, and query selectivity must be strictly optimized to prevent resource starvation.

---

## 2. HikariCP Connection Pool Analysis & Calibration

### 2.1 Current State (Unconfigured Defaults)
In `backend/src/main/resources/application.properties`, no `spring.datasource.hikari.*` properties are defined. Spring Boot defaults to:
* `maximum-pool-size: 10`
* `minimum-idle: 10`
* `connection-timeout: 30000ms` (30 seconds)
* `idle-timeout: 600000ms` (10 minutes)
* `max-lifetime: 1800000ms` (30 minutes)
* `leak-detection-threshold: 0` (Disabled)

### 2.2 Sizing Calculation for Hostinger KVM 2
Using the standard PostgreSQL connection pool formula:
$$\text{Pool Size} = (\text{Core Count} \times 2) + \text{Effective Spindle Count}$$
On a 2 vCPU VPS with local NVMe SSD storage:
$$\text{Pool Size} = (2 \times 2) + 2 = 6 \text{ to } 10 \text{ connections}$$

Configuring a pool larger than 10–12 on a 2 vCPU host increases context switching, memory overhead, and lock contention on PostgreSQL worker processes without increasing throughput.

### 2.3 Recommended HikariCP Configuration (`application-prod.properties`)
```properties
# ==============================================================================
# HIKARICP PRODUCTION CONNECTION POOL TUNING (Hostinger KVM 2: 2 vCPU, 4 GB RAM)
# ==============================================================================
spring.datasource.hikari.pool-name=OhoTechHikariPool
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=4
spring.datasource.hikari.connection-timeout=20000
spring.datasource.hikari.idle-timeout=300000
spring.datasource.hikari.max-lifetime=1200000
spring.datasource.hikari.leak-detection-threshold=2500
spring.datasource.hikari.validation-timeout=3000
```
* **Why `leak-detection-threshold=2500`:** If any request holds a database connection longer than 2.5 seconds without returning it to the pool, HikariCP logs a stack trace identifying the exact method leaking the connection.
* **Why `minimum-idle=4`:** Keeps 4 pre-warmed connections ready for immediate execution, avoiding TCP/TLS handshake latency during sudden traffic bursts.

---

## 3. Open Session In View (OSIV) Architecture Review

### 3.1 Current State
`spring.jpa.open-in-view=true` is currently set in `application.properties`.

### 3.2 The Problem with OSIV in Production
* **Connection Holding:** A database connection is borrowed before controller execution and held open until the HTTP response is completely written over the socket to the client.
* **Pool Starvation Risk:** If a client on a slow cellular connection takes 4 seconds to receive a large JSON response, the database connection remains checked out for the entire 4 seconds, even though the database query finished in 2 milliseconds.
* **With 10 connections in the pool, 10 slow clients will completely exhaust the connection pool**, causing all subsequent requests across the entire site to stall with `ConnectionTimeoutException`.

### 3.3 Path to Disabling OSIV
1. **Short Term (Phase 2):** Retain `open-in-view=true` temporarily while `FetchType.EAGER` is active to prevent immediate `LazyInitializationException` regressions during baseline stabilization.
2. **Phase 3 Recommendation:**
   - Migrate entity references to explicit DTO projections or `@EntityGraph`.
   - Set `spring.jpa.open-in-view=false` in production.
   - Enforce that database transactions open and close strictly inside the `@Service` layer.

---

## 4. Query Patterns & N+1 Prevention

### 4.1 Unbounded Queries (`findAll()`)
Several admin list controllers currently invoke `repository.findAll()` without `Pageable`:
* `CategoryRepository.findAll()`: Safe (typically < 30 categories).
* `ProductRepository.findAll()`: Safe for current 28 products, but requires pagination as the catalog scales.
* `CrmWhatsAppConsentRepository.findAll()`: High risk. Over time, consents will grow to tens of thousands of rows. Loading all into memory will trigger high heap allocation and JVM garbage collection pauses.

**Recommendation:** Enforce `Pageable pageable` across all administrative endpoints returning collections:
```java
Page<CrmWhatsAppConsent> findByOptIn(boolean optIn, Pageable pageable);
```

### 4.2 High-Frequency Transactional Query Optimizations
* **`PaymentRepository.findByRazorpayOrderId` and `findByCashfreeOrderId`:** Indexed with B-tree indexes, ensuring $O(1)$ point lookups during webhook processing.
* **`ObserverDevice.findByTokenHash`:** Token hash is indexed and unique, ensuring sub-millisecond authentication of bank listener devices.
* **`OtpVerification.findByTargetAndPurpose`:** Targets look up in memory with short TTLs.

---

## 5. PostgreSQL Server-Side Configuration Recommendations

For PostgreSQL 17 running on the Hostinger KVM 2 VPS (4 GB total system RAM):

```ini
# /etc/postgresql/17/main/postgresql.conf (VPS Target)
shared_buffers = 1GB                  # 25% of total system RAM
effective_cache_size = 3GB            # 75% of total system RAM
maintenance_work_mem = 256MB          # For index creation and vacuuming
work_mem = 16MB                       # Per-operation sort/hash memory
checkpoint_completion_target = 0.9    # Smooth out I/O spikes
wal_buffers = 16MB                    # Write-ahead log buffer
random_page_cost = 1.1                # Calibrated for NVMe SSD storage
effective_io_concurrency = 200        # Concurrent NVMe I/O operations
min_wal_size = 512MB
max_wal_size = 2GB
max_connections = 50                  # Capped to protect memory
```

---

## 6. Summary of Actionable Changes

| Component | Current State | Target Recommendation | Performance Benefit |
| :--- | :--- | :--- | :--- |
| **Connection Pool** | Default (10 max, uncalibrated) | Calibrated 10 max, 4 idle, 2500ms leak check | Prevents connection leaks and VPS memory spikes |
| **OSIV** | `open-in-view=true` | Short-term keep; Phase 3 transition to `false` | Eliminates connection-holding during slow HTTP responses |
| **Foreign Key Indexes** | Missing on 12 reference columns | Add in `V1__initial_production_baseline.sql` | Converts sequential table scans to instant B-tree seeks |
| **`FetchType.EAGER`** | 22 associations | Transition to `LAZY` + `@EntityGraph` | Eliminates recursive 80-query cascades on list views |
| **PostgreSQL Buffer** | Default 128 MB | Set `shared_buffers = 1GB` for NVMe | Caches hot catalog and auth tables entirely in RAM |
