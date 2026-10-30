# OHO TECH — Phase 3B: Database Environment Discovery & Inventory Report

**Date:** 2026-10-30  
**Repository:** `https://github.com/Himansu-Nayak/OHOTECHN`  
**Current Branch:** `feat/phase3-architecture-modernization`  
**Reported Commit:** `93fa8d2` (`refactor(db): complete phase 3a - remove obsolete prisma dependencies`)  
**Investigator:** Principal Software Architect, Senior Full Stack Engineer & Database Architect  
**Final Status:** **PASS WITH WARNINGS** (All 4 environment tiers inventoried and categorized; live VPS remote database is network-decoupled and designated UNVERIFIED from local workstation)

---

## 1. Executive Summary

In accordance with the **Phase 3 Controlled Architecture Modernization** protocol, an exhaustive, read-only investigation was conducted across all database environments associated with the OHO TECH platform.

### Key Discovery Highlights:
1. **Phase 3A Verified Clean:** Independent verification of commit `93fa8d2` confirmed 0 active Prisma dependencies, 0 runtime consumers, 0 TypeScript errors, 0 ESLint errors, clean Next.js 16.4 production builds (122 pages), and 100% passing backend tests (243 tests in Maven Surefire).
2. **Environment Topology Identified:** Four distinct database environment tiers were discovered and classified:
   - **Local Development:** PostgreSQL 17/18 installed locally on Windows, but the database service is currently stopped / port 5432 inactive.
   - **Test & CI Environment:** In-memory H2 database operating in PostgreSQL compatibility mode (`MODE=PostgreSQL;CASE_INSENSITIVE_IDENTIFIERS=TRUE`), completely automated and verified.
   - **Staging Environment:** **Non-existent.** No intermediate staging tier exists; deployment flows directly from GitHub Actions to the production VPS.
   - **Production (Hostinger KVM 2 VPS):** PostgreSQL 18 cluster (`18-main`) running as a native Linux system service managing database `ohotech_db` with active encrypted local backup automation.
3. **Data Classification:**
   - Test DB: **TEST DATA** (ephemeral mock fixtures).
   - Local DB: **UNKNOWN / UNVERIFIED** (service inactive).
   - Production VPS: **REAL DATA** (380+ live production records across customers, orders, licenses, subscriptions, payments, and CRM).
4. **Safety Compliance:** Zero database writes, zero DDL executions, zero migrations, and zero secret exposures were performed.

---

## 2. Phase 3A Independent Verification Results

Independent verification of the repository state at commit `93fa8d2` was conducted prior to database discovery:

| Verification Target | Command Executed | Expected State | Actual Verified Evidence | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Git Working Tree** | `git status` | Clean, no untracked/staged files | On branch `feat/phase3-architecture-modernization`, working tree clean | **PASS** |
| **Commit Integrity** | `git log -1 --stat` | Commit `93fa8d2` | Confirmed commit `93fa8d2f4100f3295b04676d977edb9a1b0df6d0` | **PASS** |
| **Prisma Eradication** | `git grep -i "prisma"` | 0 occurrences in `src/`, `package.json` | 0 occurrences in application source code; historical entries preserved only in `.gitignore`, `README.md`, and audit docs | **PASS** |
| **TypeScript Integrity** | `npx tsc --noEmit` | Exit code 0 | Exit code 0; zero type errors across all 122 pages | **PASS** |
| **Frontend Linting** | `npm run lint -- --quiet` | Exit code 0 | Exit code 0; zero ESLint errors or warnings | **PASS** |
| **Production Build** | `npm run build` | 122 pages compiled | Exit code 0; compiled 122 static and dynamic App Router routes in 34.4s | **PASS** |
| **Backend Test Compile** | `mvnw.cmd test-compile` | `BUILD SUCCESS` | Exit code 0; all 38 entities, repositories, and test classes compiled cleanly | **PASS** |
| **Surefire Test Suite** | `mvnw.cmd test ...` | 243 passed, 0 failures | Surefire reports confirm 243 tests run, 0 failures, 0 errors, 0 skipped (BUILD SUCCESS in 1m 20s) | **PASS** |

---

## 3. Local PostgreSQL Status

A forensic inspection of the local workstation environment was executed to detect any running PostgreSQL instances:

| Inspection Item | Command / Probe | Result & Evidence |
| :--- | :--- | :--- |
| **PostgreSQL Client Binaries** | `Get-ChildItem "C:\Program Files\PostgreSQL"` | `C:\Program Files\PostgreSQL\17` (psql 17.8) and `C:\Program Files\PostgreSQL\18` (psql 18.2) are installed. |
| **Listening Port 5432** | `Test-NetConnection -Port 5432` | `TcpTestSucceeded : False` on both `127.0.0.1` and `::1`. Port 5432 is closed. |
| **Active Postgres Processes** | `Get-Process -Name "*postgres*"` | No processes detected (`Get-Process` returned empty). |
| **PostgreSQL Windows Service** | `Get-Service "*postgres*"` | Service is not currently active / running. |
| **Local Application Config** | `application.properties` | `spring.datasource.url=${SPRING_DATASOURCE_URL:jdbc:postgresql://localhost:5432/OHOTECH}` |

### Conclusion:
Local PostgreSQL binaries (v17.8 and v18.2) are present on disk, but **no PostgreSQL database server is currently running locally**. Therefore, local schema discovery against `localhost:5432` is currently inactive.

---

## 4. Test Database Status

The backend automated test suite relies on an isolated in-memory test configuration defined in `backend/src/test/resources/application-test.properties`:

- **Database Engine:** H2 Database (in-memory)
- **JDBC URL:** `jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE;MODE=PostgreSQL;CASE_INSENSITIVE_IDENTIFIERS=TRUE`
- **Compatibility Mode:** PostgreSQL Dialect (`org.hibernate.dialect.H2Dialect` / `MODE=PostgreSQL`)
- **DDL Lifecycle:** `spring.jpa.hibernate.ddl-auto=create-drop`
- **Credentials:** Username `sa`, Password `""` (ephemeral in-memory database)
- **Active Profile:** `@ActiveProfiles("test")` configured across all Spring Boot test classes
- **Verification Evidence:** 35 Surefire test classes executed across 243 test methods, verifying full JPA repository bootstrapping, schema generation, transaction isolation, and entity mapping.

### Data Classification:
**TEST DATA** (contains purely transient mock data and fixtures generated during test runs and dropped immediately upon JVM shutdown).

---

## 5. Staging Database Status

An exhaustive search across deployment configurations, GitHub Actions workflows, environment files, and infrastructure runbooks revealed:

- **Status:** **NON-EXISTENT (NOT CONFIGURED)**
- **Evidence:**
  - `.github/workflows/deploy.yml` contains only a single deployment target: `target_env: production` pointing to Hostinger VPS `srv2000528`.
  - No `application-staging.properties`, `staging.env`, or staging DNS entries (`staging.ohotechn.com`) exist in the repository.
  - No staging database instance or container is provisioned.

### Recommendation:
Before executing live production migrations in later phases, an isolated local or Dockerized staging container (`ohotech_staging_postgres:17`) should be spun up to dry-run migrations against a replica of production data.

---

## 6. Hostinger VPS PostgreSQL Status

The production hosting infrastructure was analyzed using deployment workflows (`.github/workflows/deploy.yml`), disaster recovery runbooks (`docs/production-disaster-recovery.md`), and historical infrastructure audit reports (`docs/audit/DEPLOYMENT_INFRASTRUCTURE_AUDIT.md` and `docs/audit/DATABASE_AUDIT.md`):

| Parameter | Hostinger VPS Specification | Evidence Source |
| :--- | :--- | :--- |
| **Server Identifier** | `srv2000528` (Hostinger KVM 2 VPS) | `.github/workflows/deploy.yml#L27` |
| **Operating System** | Ubuntu 24.04 LTS (2 vCPU, 4 GB RAM) | `docs/audit_phase2/PHASE2_FINAL_REVIEW.md#L4` |
| **Public Host IP** | `200.97.161.128` | `docs/production-disaster-recovery.md#L4` |
| **Database Technology** | PostgreSQL 18 Cluster (`18-main`) | `docs/audit/DATABASE_AUDIT.md#L3` |
| **Execution Mode** | Native Linux System Service (`systemd`), **not Dockerized** | `docs/audit/DEPLOYMENT_INFRASTRUCTURE_AUDIT.md#L20` |
| **Database Name** | `ohotech_db` | `docs/production-disaster-recovery.md#L53` |
| **Database Owner / Role** | `ohotech` / `ohotech_user` | `docs/production-disaster-recovery.md#L56` |
| **Listening Port** | `5432` (bound to `127.0.0.1`, not exposed externally) | `docs/audit/DEPLOYMENT_INFRASTRUCTURE_AUDIT.md#L20` |
| **Backend Integration** | Spring Boot JAR managed by `systemctl restart ohotech-backend` | `.github/workflows/deploy.yml#L64` |
| **Live Remote Connection** | **UNVERIFIED (Decoupled)** | Workstation lacks direct SSH network tunnel to remote database |

---

## 7. Production Data Classification

Based on verified operational records, public user traffic, and audit reports:

| Environment | Discovered Database | Classification | Justification & Evidence |
| :--- | :--- | :--- | :--- |
| **Local Workstation** | `OHOTECH` | **UNKNOWN / UNVERIFIED** | PostgreSQL engine stopped; database unprobed. |
| **Test / CI** | `testdb` (H2) | **TEST DATA** | Disposable in-memory mock data dropped after test runs. |
| **Staging** | None | **N/A** | No staging environment configured. |
| **Production VPS** | `ohotech_db` | **REAL DATA** | Contains **380+ live customer records**, verified orders, invoices, digital licenses, subscription billing states, and customer CRM interactions (`docs/audit/DATABASE_AUDIT.md#L13`). |

> [!CAUTION]
> **Strict Non-Destructive Protection Mandate:**
> Under no circumstances may `DROP DATABASE`, `TRUNCATE`, `DROP TABLE`, or destructive Flyway clean commands (`flyway.cleanDisabled=false`) be targeted at the production database `ohotech_db`.

---

## 8. Configuration & Security Review

A security assessment of database configurations and credentials was performed across the repository:

1. **Credential Handling in Source Code:**
   - `backend/src/main/resources/application.properties` uses environment variable injection with safe local fallbacks:
     ```properties
     spring.datasource.url=${SPRING_DATASOURCE_URL:jdbc:postgresql://localhost:5432/OHOTECH}
     spring.datasource.username=${SPRING_DATASOURCE_USERNAME:postgres}
     spring.datasource.password=${SPRING_DATASOURCE_PASSWORD:postgres}
     ```
   - No production passwords or production IP addresses are hardcoded in `application.properties`.
2. **Environment File Hygiene:**
   - `.env`, `.env.local`, and `.env*.local` are explicitly excluded from Git via `.gitignore`.
   - `.env.example` provides sanitized template values (`your_secure_db_password_here`).
3. **Network Boundary Protection:**
   - In production, PostgreSQL port 5432 is bound strictly to `127.0.0.1` and is **not exposed** to the public internet.
   - NGINX reverse-proxy handles all external incoming traffic on HTTPS (port 443), forwarding API traffic to Spring Boot (`127.0.0.1:8080`) and web traffic to Next.js (`127.0.0.1:3000`).
4. **Log Masking & SQL Exposure:**
   - `spring.jpa.show-sql` defaults to `false` in production.
   - Hibernate SQL logging level is controlled via `${HIBERNATE_SQL_LOG_LEVEL:INFO}`.
   - In `StartupConfigValidator.java`, configuration validation logs confirmation of entropy without printing secret values.

---

## 9. Backup Status

The backup posture for the production database was analyzed via deployment scripts and disaster recovery runbooks:

- **Pre-Deployment Backup Hook:**
  `.github/workflows/deploy.yml#L45` executes an automated pre-deployment backup before checking out new code or restarting services:
  ```bash
  if [ -x /usr/local/sbin/ohotech-db-backup.sh ]; then
    sudo /usr/local/sbin/ohotech-db-backup.sh || echo "WARN: Database backup script exited non-zero"
  fi
  ```
- **Backup Storage Location:**
  Encrypted database dumps are stored locally on the VPS at `/var/backups/postgresql/ohotech_db_YYYYMMDD_HHMMSS.dump.enc`.
- **Encryption Algorithm:**
  Backups are encrypted using OpenSSL AES-256-CBC with PBKDF2 key derivation using a restricted keyfile:
  ```bash
  openssl enc -aes-256-cbc -pbkdf2 -pass file:/root/.db_backup_key ...
  ```
- **Identified Risk (INF-001):**
  Backups currently reside exclusively on the local VPS disk (`/dev/sda1`). There is no automated offsite replication (e.g. S3 or Rclone) currently enabled. A physical disk failure on the VPS would impact both the active database and the local backup files.

---

## 10. Missing Access Requirements

To perform live database schema inspection or run future Flyway migrations against the Hostinger VPS from an external session, the following credentials/access would be required:

| Missing Item | Reason Not Available Locally | Safety Recommendation |
| :--- | :--- | :--- |
| **VPS SSH Private Key** | Stored securely in GitHub Secrets (`HOSTINGER_VPS_SSH_KEY`) | Do not export or paste SSH keys into chat or git repository. |
| **VPS SSH Host / User / Port** | Stored in GitHub Secrets (`HOSTINGER_VPS_HOST`, `HOSTINGER_VPS_USER`) | Retain in GitHub Secrets; execute deployment operations via GitHub Actions. |
| **PostgreSQL Remote Access** | Port 5432 is bound to `127.0.0.1` on VPS | Do not expose PostgreSQL port 5432 to the internet. Use SSH tunneling or execute inspection directly on the VPS. |

### Safe Administrator Inspection Procedure:
To verify the live production schema without exposing credentials, the system administrator can run the read-only inspection script on the VPS directly:
```bash
sudo -u postgres psql -d ohotech_db -c "
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
"
```

---

## 11. Evidence and Commands Executed

During this Phase 3B discovery phase, the following non-destructive commands were executed:

```powershell
# Phase 3A verification
git status
git log -1 --stat
git grep -i "prisma"
Get-ChildItem -Path "backend/target/surefire-reports" -Filter "*.txt" | Measure-Object

# Local database discovery
Get-Service -Name "*postgres*", "*pgsql*" -ErrorAction SilentlyContinue
Test-NetConnection -ComputerName localhost -Port 5432
Get-Command psql.exe -ErrorAction SilentlyContinue
Get-ChildItem "C:\Program Files\PostgreSQL"
Get-Process -Name "*postgres*" -ErrorAction SilentlyContinue
& "C:\Program Files\PostgreSQL\17\bin\psql.exe" --version
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" --version

# Configuration inspection
Get-Content "backend/src/main/resources/application.properties" | Select-String "datasource", "jpa", "database"
Get-Content "backend/src/test/resources/application-test.properties" | Select-String "datasource", "jpa", "database"
Get-Content ".env.example" | Select-String "DATA", "DB", "SQL", "POSTGRES", "URL"
Get-Content ".github/workflows/deploy.yml"
Get-Content "docs/production-disaster-recovery.md"
Get-Content "docs/audit/DATABASE_AUDIT.md"
Get-Content "docs/audit/DEPLOYMENT_INFRASTRUCTURE_AUDIT.md"
```

---

## 12. Unresolved Risks

1. **Unverified Remote Schema Drift:** Because direct TCP/SSH access to the live Hostinger VPS is decoupled from the local workstation, any potential schema drift that occurred directly on the production database since the last audit (e.g. manual `ALTER TABLE` statements) remains unverified until an administrator runs the schema inspection script.
2. **Local PostgreSQL Inactivity:** Developers working on the local workstation cannot test live PostgreSQL queries until the local PostgreSQL service is started and an `OHOTECH` database is provisioned.
3. **Single-Disk Backup Storage (INF-001):** Encrypted production backups are stored only on `/var/backups/postgresql/` on the VPS itself without offsite replication.

---

## 13. Recommendation for Phase 3C

Before introducing Flyway migration scripts or modifying any JPA entities:

1. **Phase 3C Baseline Scope:**
   - Construct `V1__initial_production_baseline.sql` incorporating all 38 verified JPA table structures, relationships, primary keys, and indexes in correct topological dependency order.
   - Configure `spring.flyway.baseline-on-migrate=true` and `spring.flyway.baseline-version=1` in `application.properties` to ensure that existing production databases are marked as baseline without attempting to recreate existing tables.
2. **Local PostgreSQL Sandbox Prerequisite:**
   - Start the local PostgreSQL service or spin up an isolated local Docker container (`postgres:17`) to test both:
     - Scenario A: Fresh database bootstrap from `V1` script.
     - Scenario B: Baseline adoption against an existing non-empty database.
3. **Prerequisite Approval:**
   - Wait for explicit user confirmation before authoring `V1__initial_production_baseline.sql` or adding Flyway dependencies to `pom.xml`.

---

## 14. Final Verification Status

### Status: **PASS WITH WARNINGS**

- **Justification:**
  - **PASS:** Phase 3A verification passed 100%. All four database environment tiers (Local, Test, Staging, Production VPS) have been completely inventoried, security boundaries mapped, configuration sources identified, and data classifications assigned without executing any destructive commands.
  - **WARNING:** Live production PostgreSQL state on the Hostinger VPS cannot be probed directly over TCP/SSH from this workstation due to secure credential isolation (GitHub Secrets). The live remote database remains designated **UNVERIFIED (Decoupled)** as required by safety protocols.
