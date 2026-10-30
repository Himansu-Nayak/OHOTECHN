# OHO TECH — Architecture Remediation Roadmap

**Phase:** Post-Discovery Architecture Remediation & Hardening Plan  
**Timeline:** 4 Execution Phases (Zero Disruptive Interruption)  
**Governance:** Antigravity AI Engineering Suite & Principal Software Architect  

---

## 1. Prioritized Findings Matrix

| Finding ID | Domain | Title | Severity | Phase |
| :--- | :--- | :--- | :---: | :---: |
| **SEC-01** | Security | Default Insecure Fallback JWT Secret in Properties | **HIGH** | Phase 1 |
| **FE-01** | Frontend | Public Contact Phone Number Placeholder Inconsistency | **HIGH** | Phase 1 |
| **INT-01** | Security | Committed Firebase API Key in Application Properties | **HIGH** | Phase 1 |
| **DB-01** | Database | Absence of Versioned Migration Engine (Flyway) | **HIGH** | Phase 2 |
| **BE-02** | Backend | Test Profile Air-Gapped Timeout Delay in Test Suite | **MEDIUM** | Phase 1 |
| **FE-02** | Frontend | Duplicate Redirect Configuration in `next.config.ts` | **MEDIUM** | Phase 1 |
| **FE-03** | Frontend | Static Module-Level `API_BASE_URL` Evaluation | **MEDIUM** | Phase 1 |
| **BE-03** | Backend | Open-Session-In-View (`OSIV`) Enabled in Production | **MEDIUM** | Phase 3 |
| **INT-02** | Integration| Synchronous Email Dispatching on Web Request Threads | **MEDIUM** | Phase 3 |
| **INF-01** | DevOps | Inconsistent Deployment Directories in GitHub Actions | **MEDIUM** | Phase 4 |
| **INF-02** | DevOps | Missing Logrotate Policy for PM2 & Spring Boot Logs | **MEDIUM** | Phase 4 |
| **FE-04** | Frontend | Oversized In-Memory Client Bundle Data (`work.ts`, etc.) | **MEDIUM** | Phase 3 |
| **FE-05** | Frontend | Dormant Prisma Dependency Footprint in `package.json` | **LOW** | Phase 2 |
| **SEC-04** | Security | Long-Lived Access Token Window Revocation Gap | **LOW** | Phase 2 |
| **DB-02** | Database | Unindexed Foreign Keys in CRM Message Entities | **LOW** | Phase 2 |

---

## 2. Phase-by-Phase Remediation Plan

### Phase 1: Security Hardening & Zero-Defect Baseline
* **Objective:** Eliminate high-risk vulnerabilities, credential exposures, and client copy inconsistencies without architectural redesign.
* **Tasks:**
  1. **SEC-01 & INT-01:** Enforce production boot crash if `JWT_SECRET` contains default fallback string; extract Firebase API key to environment variables.
  2. **FE-01:** Update `src/config/site.ts` to replace placeholder `+91 98765 43210` with verified production business number `+91 76840 54872`.
  3. **FE-02:** Remove duplicate redirect rule for `www.ohotech.com` in `next.config.ts`.
  4. **BE-02:** Set `gemini.api.key=` in `application-test.properties` to ensure zero network timeout hangs during offline test execution.
* **Verification:** `npx tsc --noEmit`, `npm run lint`, and `mvn test` execute cleanly in air-gapped environments.

---

### Phase 2: Schema Codification & Flyway Migration
* **Objective:** Establish Spring Data JPA / PostgreSQL as sole authoritative schema owner and eliminate dormant ORM artifacts.
* **Tasks:**
  1. **FE-05:** Remove `@prisma/client` and `prisma` dependencies from `package.json`; delete unused `src/generated/prisma` stubs.
  2. **DB-01:** Add `flyway-core` to `pom.xml`; baseline current schema into `V1__init_schema.sql` and convert `schema_update_*.sql` into ordered migrations.
  3. **DB-02:** Add composite indexes to `CrmWhatsAppMessage` (`customer_phone, created_at`) and `Lead` (`status, created_at`).
  4. **SEC-04:** Calibrate access token lifetime to 30 minutes with seamless background refresh.
* **Verification:** Execute Flyway migration on fresh PostgreSQL test container; verify zero schema drift.

---

### Phase 3: Performance, Bundle & Connection Tuning
* **Objective:** Optimize runtime resource utilization for Hostinger KVM 2 VPS (2 vCPU, 8 GB RAM).
* **Tasks:**
  1. **BE-03:** Disable Open-In-View (`spring.jpa.open-in-view=false`) and verify DTO mappers fetch required associations eagerly.
  2. **INT-02:** Ensure all transactional email dispatches utilize `@Async` or route through the database-backed `EmailOutbox` queue.
  3. **FE-04:** Code-split static data modules (`work.ts`, `services.ts`, `insights.ts`) into server-rendered dynamic chunks or REST endpoints.
* **Verification:** Run Apache Benchmark / k6 stress test with 50 concurrent virtual users; verify 0 connection leaks and <150ms P95 latency.

---

### Phase 4: Production VPS Deployment Gate & Monitoring
* **Objective:** Validate automated CI/CD pipeline, NGINX reverse proxy, PM2 cluster, and systemd services.
* **Tasks:**
  1. **INF-01:** Standardize server paths to `/opt/ohotech/current` in `.github/workflows/deploy.yml`.
  2. **INF-02:** Install `pm2-logrotate` and create `/etc/logrotate.d/ohotech` with 14-day retention.
  3. **Deploy Dry-Run:** Run end-to-end smoke tests against staging VPS endpoint:
     - Verify HTTPS redirection and Let's Encrypt TLS certificate.
     - Validate Next.js SSR on `127.0.0.1:3000`.
     - Validate Spring Boot health actuator on `127.0.0.1:8080/api/health`.
* **Verification:** GitHub Actions deployment workflow executes with 100% success and zero manual intervention.
