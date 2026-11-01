# OHO TECH — Initial Architecture Audit Report

**System**: OHO TECH Platform  
**Production Domain**: `https://ohotechn.com`  
**Repository Branch**: `feat/phase3-architecture-modernization`  
**Auditor**: Antigravity Principal Systems Architect & DevSecOps Engineer  
**Date**: November 1, 2026  
**Status**: Comprehensive Baseline Established  

---

## 1. Executive Architecture Overview

OHO TECH operates a hybrid, high-availability e-commerce and digital licensing architecture.
- **Presentation Layer**: Next.js 16 (React 19, TypeScript, Tailwind CSS, App Router) hosted on Vercel and mirrored via PM2 on a production Ubuntu VPS.
- **Application & Domain Services**: Spring Boot 4 (Java 21 LTS) running as a systemd service (`ohotech-backend.service`) on a Hostinger VPS (`200.97.161.128`).
- **Data Persistence**: PostgreSQL (`ohotech_db`) with transactional row-level locking for payment lease allocations and bank credit alert matching.
- **Reverse Proxy & Edge**: Nginx managing TLS termination and proxying traffic to the Spring Boot application (port 8080) and Next.js frontend (port 3000).

```
[ User Browser ]
       │
       ▼
 [ Cloudflare / Nginx (443 / TLS) ]
       │
 ┌─────┴───────────────────────────────┐
 │                                     │
 ▼                                     ▼
[ Next.js 16 Frontend (PM2: 3000) ]   [ Spring Boot Backend (systemd: 8080) ]
 │                                     │
 └─────────────┬───────────────────────┘
               │
               ▼
      [ PostgreSQL 16 DB ]
         (ohotech_db)
               ▲
               │
      [ UPI Observer Device ]
  (Relays bank SMS/notifications)
```

---

## 2. Subsystem Architecture Audits

### 2.1 Next.js Frontend Architecture
- **Location**: `src/` (`app/`, `components/`, `lib/`, `hooks/`, `context/`, `api/`)
- **Framework**: Next.js 16.0.0 with React 19.
- **Component Design**: Astryx design tokens and custom checkout components (`src/components/checkout/`).
- **Key Modules**:
  - `src/app/(marketing)/checkout/page.tsx`: Central checkout orchestrator with multi-gateway routing (`RAZORPAY`, `CASHFREE`, `UPI_HOST`, `DIRECT_UPI`, `COD`, `DEMO`).
  - `src/components/checkout/SelfHostedUpiModal.tsx`: Real-time polling modal with dynamic QR code generation, 15-minute countdown timer, copy-to-clipboard VPA, and manual RRN submission.
- **Strengths**:
  - Fully responsive checkout UI with clear payment method segregation.
  - Client-side error boundary handling and toast feedback.
  - Clean separation between presentation components and API fetch utilities.
- **Risks & Observations**:
  - Offline build runs must avoid network-dependent Google Font requests (`npx tsc --noEmit` should be preferred for CI validation).

### 2.2 Spring Boot Backend Architecture
- **Location**: `backend/src/main/java/com/ohotech/backend/`
- **Language / Runtime**: Java 21, Spring Boot 4.1.
- **Layering**:
  - `controller/`: REST endpoints (`PaymentController`, `SelfHostedUpiController`, `AdminController`, `AuthController`).
  - `service/`: Domain logic (`SelfHostedUpiService`, `PaymentObservationService`, `OrderService`, `ReconciliationService`).
  - `repository/`: Spring Data JPA repositories with custom JPQL queries.
  - `entity/`: JPA entities (`Order`, `PaymentTransaction`, `BankCreditAlert`, `PaymentSlotLease`, `User`, `Entitlement`).
  - `security/`: JWT token validation, Spring Security filters, and RBAC enforcement.
- **Strengths**:
  - Clean layered separation following DDD principles.
  - Explicit transaction boundaries (`@Transactional`).
  - Comprehensive unit test coverage for payment matching in `SelfHostedUpiPaymentTests.java`.

### 2.3 Database Schema & Migration Architecture
- **Engine**: PostgreSQL (`ohotech_db`).
- **Schema Management**: Controlled SQL migrations under `backend/src/main/resources/schema_update_*.sql`.
- **Key Tables**:
  - `orders`: Core commercial order records, payment statuses, and customer references.
  - `payment_transactions`: Gateway references, payment method enums, raw JSON payloads.
  - `bank_credit_alerts`: Ingested bank notification credits, amounts, timestamps, and 12-digit RRNs.
  - `payment_slot_leases`: Time-bounded leases reserving paise offsets or VPA slots.
  - `reconciliation_records`: Automated audit comparison logs.
- **Database Safeguards**:
  - Unique constraints on `bank_credit_alert.rrn` and `payment_transaction.rrn`.
  - Transactional isolation on matching operations to prevent concurrent replay.

### 2.4 Payment Gateways Audit

| Gateway | Status | Flow Type | Validation Mechanism | Idempotency Safeguard |
|---|---|---|---|---|
| **Razorpay** | Active | Standard PG | HMAC-SHA256 signature verification | Order ID deduplication |
| **Cashfree** | Active | Hosted PG | Webhook signature verification | Payment session ID tracking |
| **UPIHost (Self-Hosted UPI)** | Active | Dynamic QR & Bank Credit Matching | Observer device + NPCI 12-digit RRN verification | Lease locking + unique RRN constraint |
| **Direct UPI** | Active | Static QR | Manual UTR submission & admin audit | Manual admin verification |
| **Cash on Delivery (COD)** | Restricted | Offline | Customer confirmation + admin dispatch | Restricted to physical goods |
| **Demo Quick Pay** | Restricted | Sandbox | Mock transaction | Blocked in production runtime |

### 2.5 DevSecOps & Infrastructure Audit
- **Hostinger VPS**: Ubuntu 24.04 LTS (`200.97.161.128`).
- **Process Management**:
  - Backend: `systemctl status ohotech-backend.service` (auto-restart on failure, isolated non-root user).
  - Frontend: `pm2 status oho_tech` (cluster mode with log rotation).
- **Network Security**:
  - UFW firewall blocking non-essential ports.
  - Let's Encrypt automated SSL renewal via Certbot.
  - Strict HTTPS redirection on Nginx.

---

## 3. Findings & Architectural Improvement Recommendations

1. **Standardize Migration Tooling**: Transition raw `schema_update_*.sql` scripts to Flyway or Liquibase for automated, versioned migration rollouts during CI/CD.
2. **Centralize Telemetry**: Implement Prometheus and Grafana dashboards for real-time tracking of payment lease expirations and observer device heartbeat status.
3. **Automate GitHub Issues Integration**: Install and authenticate GitHub CLI (`gh`) on local development environments to link `/to-tickets` directly to remote issue boards.

---

## 4. Assessment Summary

| Dimension | Rating | Description |
|---|---|---|
| **Frontend Code Quality** | **STRONG** | React 19 / Next.js 16, strict type safety, zero linter warnings. |
| **Backend Architecture** | **STRONG** | Clean layered Spring Boot 4 service architecture with transaction boundaries. |
| **Financial Integrity** | **VERY STRONG** | Zero-trust RRN deduplication, lease locking, and multi-gateway webhook validation. |
| **Infrastructure Stability** | **STABLE** | Nginx reverse proxy with systemd and PM2 supervision on Ubuntu VPS. |
| **Overall Release Posture** | **PRODUCTION READY** | Codebase passes all static checks and automated tests. |
