# OHO TECH — Master Full-Stack Forensic Audit: Executive Summary

**Date:** 2026-10-14  
**Audited Target:** OHO TECH Platform (Frontend, Backend, Database, VPS Infrastructure, Security, UX)  
**Production Domains:** `https://ohotechn.com` | `https://api.ohotechn.com`  
**Hostinger VPS:** `200.97.161.128` (Ubuntu Linux 6.8.0-45-generic / 16 GB RAM / 193 GB Disk)  
**Deployed Commit SHA:** `fe6806c4af25d67669f85b5630178f1758d27fdb`  
**Repository:** `https://github.com/Himansu-Nayak/OHOTECHN` (Branch: `main`)  
**Audit Lead:** Antigravity Full-Stack Forensic Architecture Team  

---

## 1. System Status & Verification Baseline

| Subsystem | Verified Version | Running State | Health Status |
|:---|:---|:---:|:---|
| **Next.js Frontend** | Next.js 16.3.0 / React 19.2.8 | PM2 App `0` (`oho_tech`, PID 1663922) | 🟡 Operates cleanly on `127.0.0.1:3000` behind Nginx; critical vulnerabilities in dependencies & auth flow |
| **Spring Boot Backend** | Spring Boot 4.1.0 / Java 21 | systemd `ohotech-backend.service` (PID 1663891) | 🟡 Active on `127.0.0.1:8080`; 206/206 tests passing; critical PII/hash leak in public endpoint |
| **PostgreSQL Database** | PostgreSQL 18-main | systemd `postgresql@18-main.service` (:5432) | 🟡 31 tables, 0 orphan records; schema drift on support tickets & missing foreign key indexes |
| **Nginx Reverse Proxy** | Nginx 1.28.3 (Ubuntu) | systemd `nginx.service` (:80, :443) | 🟢 SSL termination active with Let's Encrypt; missing HTTP security headers & server banner masked |
| **Encrypted Backups** | AES-256-CBC with PBKDF2 | systemd `ohotech-db-backup.timer` | 🟡 Daily 02:00 UTC backup active; local disk only (single point of failure) |

---

## 2. Strongest Areas of the Codebase

1. **Referential Integrity & Zero Data Corruption:**
   Forensic analysis of all 31 database tables confirmed 0 orphaned orders, 0 orphaned payments, 0 orphaned licenses, and 0 orphaned cart items. Foreign key cascades and primary key relationships are strictly maintained.
2. **Cryptographic Payment Webhook Hardening:**
   Both Cashfree and Razorpay webhooks enforce constant-time HMAC-SHA256 signature verification (`MessageDigest.isEqual`), preventing timing side-channel attacks. Both enforce database deduplication via `WebhookEventRepository`.
3. **Phase 10 Entitlement Safeguards:**
   Software license generation and downloadable binaries are strictly decoupled from raw gateway success. Successful payments advance orders to `CONFIRMED`. Entitlements are created only upon explicit administrator approval (`PaymentService.adminVerifyPayment`).
4. **Backend Test Quality:**
   All 206 Maven automated tests pass with 0 failures, 0 errors, and 0 skipped tests across payment security, auth, licensing, and AI desk flows.

---

## 3. Highest-Risk Critical Findings (Top 5 P0 Risks)

1. **[CRITICAL] SEC-001: Public Exposure of Customer PII, Addresses & BCrypt Hashes via `/api/licenses/key/**`**
   - **Root Cause:** `License.java` eagerly fetches `User.java`, which lacks `@JsonIgnore` on `private String passwordHash`. `SecurityConfig.java` declares `/api/licenses/key/**` as `permitAll()`.
   - **Verified Evidence:** Live query on production `curl -s http://127.0.0.1:8080/api/licenses/key/<VALID_KEY>` dumps customer full name, personal phone, email, shipping address, Razorpay payment ID, and raw BCrypt password hash.
2. **[CRITICAL] DEP-001: Next.js 16.3.0 Remote Code Execution (RCE) Vulnerabilities**
   - **Root Cause:** Next.js 16.3.0 contains known critical security advisories (GHSA-p293-qw3h-jr36, GHSA-2xp9-vwfh-vxw4, GHSA-vcvr-r3jv-pc5j).
   - **Verified Evidence:** `npm audit` flags 19 vulnerabilities (1 Critical, 18 High).
3. **[CRITICAL] DB-001: Schema Drift & Table Ownership Failure on `support_tickets`**
   - **Root Cause:** Table `support_tickets` is owned by `postgres` instead of `ohotech_user`. Spring Boot startup fails Hibernate auto-update with `PSQLException: ERROR: must be owner of table support_tickets`.
   - **Verified Evidence:** Columns `product_id` and `issue_ownership` are missing from the production database table, causing runtime 500 crashes whenever support ticket endpoints are invoked.
4. **[CRITICAL] F-01 & PROD-003: Total Absence of App Router Error Boundaries (`error.tsx`)**
   - **Root Cause:** Zero `error.tsx` or `global-error.tsx` files exist in `src/app/`.
   - **Verified Evidence:** Any uncaught client error in Three.js Canvas, Lenis scroll, or dynamic hydration results in a total unstyled white-screen crash with zero recovery path.
5. **[CRITICAL] PAY-001: Unprotected Demo Quick-Pay Endpoint (`/api/payments/demo-pay`)**
   - **Root Cause:** Endpoint is exposed to any authenticated user with `ROLE_CUSTOMER` without requiring payment or admin privileges.
   - **Verified Evidence:** Any customer can POST their order ID to `/api/payments/demo-pay` to transition payment to `SUCCESSFUL` (`DEMO_GATEWAY`) and order to `CONFIRMED`.

---

## 4. Major Missing Capabilities

1. **Cashfree Frontend Integration:** Backend Spring Boot service and webhooks are 100% complete and tested, but the Next.js checkout page contains 0 lines of Cashfree UI code.
2. **Edge / Server-Side Authentication Guards (`middleware.ts`):** All route protection (`/admin`, `/dashboard`, `/orders`) relies exclusively on client-side React `useEffect` hooks, causing client bundle exposure and authentication flashes.
3. **Offsite Backup Replication:** Daily encrypted database backups reside exclusively on the VPS local `/dev/sda1` drive. Hardware failure results in complete data loss.
4. **Automated Migration Tooling:** No Flyway or Liquibase configuration exists. Schema updates are performed via manual ad-hoc SQL executions.
5. **Self-Service Provider / Reseller Portal:** `/partner` is a static marketing page; external vendors cannot register, list products, or track deployments.

---

## 5. Recommended Immediate Actions (P0 Execution Order)

1. **Hotfix SEC-001:** Add `@JsonIgnore` to `User.passwordHash` and sanitize `LicenseController.getLicenseByKey` to return a `LicensePublicDto`.
2. **Hotfix DB-001:** Reassign ownership of `support_tickets` to `ohotech_user` and add missing columns `product_id` and `issue_ownership`.
3. **Hotfix PAY-001:** Restrict `/api/payments/demo-pay` strictly to `@Profile({"dev", "test"})` or require `hasAuthority("ROLE_ADMIN")`.
4. **Add Error Boundaries (F-01 / PROD-003):** Create `src/app/error.tsx` and `src/app/global-error.tsx`.
5. **Harden Environment & Secrets:** Remove hardcoded fallback JWT secrets in `application.properties` and add Nginx security headers.
