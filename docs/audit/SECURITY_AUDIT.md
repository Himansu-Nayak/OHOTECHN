# OHO TECH — Security & Vulnerability Forensic Audit Report

**Date:** 2026-10-14  
**Auditor:** Application Security Team  
**Verification Scope:** Spring Boot Security, Next.js Dependencies, API Authorization, Nginx TLS & Headers  

---

## 1. Security Findings Matrix

| Finding ID | Title | Severity | Confidence | Status |
|:---|:---|:---:|:---:|:---:|
| **SEC-001** | Public PII & BCrypt Password Hash Leakage via License Endpoint | **Critical** | Confirmed | Live Production Verified |
| **DEP-001** | Next.js 16.3.0 Critical Remote Code Execution Advisories | **Critical** | Confirmed | `npm audit` Verified |
| **PAY-001** | Customer-Accessible Demo Quick Pay Order Confirmation | **High** | Confirmed | Source Verified |
| **SEC-002** | Missing Server-Side Logout & Active Refresh Token Persistence | **High** | Confirmed | Source Verified |
| **SEC-003** | Pre-Seeded Default Demo Customer Account in Production | **Medium** | Confirmed | Source Verified |
| **SEC-004** | Insecure Fallback Default Secrets in `application.properties` | **Medium** | Confirmed | Source Verified |
| **SEC-005** | Rate Limit Bypass via `X-Forwarded-For` & Memory Leak in Filter | **Medium** | Confirmed | Source Verified |
| **SEC-006** | IDOR on Device Activations Endpoint | **Medium** | Confirmed | Source Verified |
| **INF-001** | Missing Nginx Security Headers & Server Banner Disclosure | **Medium** | Confirmed | Live Production Verified |
| **SEC-007** | High Blast-Radius Demo Data Purge Endpoint | **Low** | Confirmed | Source Verified |
| **SEC-008** | Unescaped HTML in Frontend SEO JSON-LD Component | **Low** | Confirmed | Source Verified |

---

## 2. Deep-Dive Analysis on Critical Findings

### [SEC-001] Public PII & BCrypt Password Hash Exposure
- **Endpoint:** `GET /api/licenses/key/{licenseKey}`
- **Vulnerability:** Unauthenticated public route returns the full JPA `License` entity with `User` association without filtering sensitive fields.
- **Evidence:** `curl -s http://127.0.0.1:8080/api/licenses/key/OHO-L9HY-VZC9-B3OB-RZUH` returned full user profile including `"passwordHash":"$2a$10$U5tJOC5j19yLEzSyzYYXRe0xISJYjkqjqXKo7nqrsbu9ospDcU1L2"`.
- **Immediate Mitigation:**
  1. Add `@JsonIgnore` to `passwordHash` in `User.java`.
  2. Implement `LicensePublicDto` exposing only license metadata.

### [DEP-001] Next.js 16.3.0 RCE & Cache Poisoning Vulnerabilities
- **Vulnerability:** Next.js 16.3.0 has 1 Critical and 18 High severity vulnerabilities per `npm audit` (GHSA-p293-qw3h-jr36, GHSA-2xp9-vwfh-vxw4).
- **Immediate Mitigation:** Upgrade `next` in `package.json` to `>=16.4.0` or latest patched release.

### [SEC-002] Missing Server-Side Token Revocation
- **Vulnerability:** Logout removes tokens only from browser `localStorage`. Stolen JWTs remain valid for 24 hours; database refresh tokens remain active for 7 days.
- **Mitigation:** Implement `POST /api/auth/logout` that deletes `RefreshToken` from the database.
