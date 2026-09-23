# OHO TECH — PRODUCTION DEPLOYMENT AUDIT CORRECTIONS & VERIFICATION REPORT

**Repository:** `Himansu-Nayak/OHOTECHN`  
**Target Infrastructure:** Hostinger KVM 2 VPS (`USER-PROVIDED TARGET`)  
**Audit Phase:** Phase 1.1 — Verification, Discrepancy Correction, and Ground Truth Freezing  
**Audit Date:** September 2026  
**Auditor:** Antigravity DeepMind Agentic Pair Programmer  

---

## 1. Previous Audit Claims

The initial audit (`PRODUCTION_DEPLOYMENT_READINESS_AUDIT.md`) made several specific architectural and operational claims. These have now been subjected to a rigorous, line-by-line verification against the actual repository source code and build tools.

Key claims from the previous audit included:
1. Spring Boot version was reported ambivalently as `"Spring Boot Starter Parent 4.1.0 / Spring Boot 3.2.x base"`.
2. Total test suite was reported as `134/134` passing tests.
3. Next.js build produces 117 compiled routes.
4. Database has no Flyway/Liquibase migrations; relies on Hibernate DDL `update` and `DataInitializer.java`.
5. Environment variables for PostgreSQL were listed as `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`.
6. Claimed Razorpay webhook exists at `/api/webhooks/razorpay` and requires dashboard registration.
7. Claimed uploaded release binaries can be stored on disk at `/var/www/ohotech/releases`.
8. PDF invoices are generated completely in memory via OpenPDF with zero disk usage.
9. System capacity was estimated as supporting `"50,000+ monthly active users"`.
10. Readiness was scored with arbitrary percentage numbers (`94/100` readiness score and `96%` confidence).
11. Local database backup to `/var/backups/postgresql/` was characterized as a complete disaster recovery plan.

---

## 2. Claims Verified

The following claims from the initial audit were independently re-tested and proven **TRUE** against the live codebase:

1. **Test Suite Execution (134/134 Passed):**
   - Executed: `.\mvnw.cmd test`
   - Result: **Tests run: 134, Failures: 0, Errors: 0, Skipped: 0**. Time elapsed: 02:21 min.
   - Status: **VERIFIED FACT**.

2. **Frontend Build & Route Generation (117 Routes):**
   - Executed: `npm run build` (Next.js 16.3.0 with Turbopack).
   - Result: Compiled successfully in 44s, static page generation in 7.4s. Exactly **117 routes** generated (including dynamic server-rendered routes `ƒ /api/quote` and `ƒ /products/[id]`).
   - TypeScript Check: Finished in 16.1s with 0 errors.
   - Status: **VERIFIED FACT**.

3. **No Flyway or Liquibase Migrations:**
   - Programmatic search for `flyway` or `liquibase` across all repository files returned 0 results.
   - `src/main/resources/db/migration` does not exist.
   - Status: **VERIFIED FACT** (`Flyway is not part of the current production architecture`).

4. **In-Memory PDF Generation:**
   - Inspected: `backend/src/main/java/com/ohotech/backend/service/PdfInvoiceService.java`
   - Uses OpenPDF `2.0.3` writing directly to `ByteArrayOutputStream`. Never writes to local or temporary disk files.
   - Status: **VERIFIED FACT**.

5. **Stateless JWT Security Architecture:**
   - Inspected: `backend/src/main/java/com/ohotech/backend/security/SecurityConfig.java`
   - Enforces `SessionCreationPolicy.STATELESS`, BCrypt password hashing, rate limiting, and JWT token authentication.
   - Status: **VERIFIED FACT**.

6. **Instant Section Navigation Fix:**
   - Inspected: `src/components/providers/ScrollProvider.tsx`
   - The instant section navigation fix is present, functional, and frozen.
   - Status: **VERIFIED FACT**.

---

## 3. Claims Corrected

The following critical discrepancies between the previous report and the actual repository were uncovered and are here corrected:

### A. Spring Boot Version Ambiguity Corrected
- **Previous Claim:** `"Spring Boot Starter Parent 4.1.0 / Spring Boot 3.2.x base"`.
- **Actual Codebase Truth:**
  - `backend/pom.xml` declares `<version>4.1.0</version>` under `<artifactId>spring-boot-starter-parent</artifactId>`.
  - Executed Maven dependency resolution: `.\mvnw.cmd dependency:list`
  - Exact resolved versions:
    - **Spring Boot:** `4.1.0`
    - **Spring Framework:** `7.0.8`
    - **Spring Security:** `7.1.0`
    - **Hibernate ORM Core:** `7.4.1.Final`
    - **PostgreSQL JDBC Driver:** `42.7.11`
    - **JJWT:** `0.12.6`
    - **Java Version:** `21`
  - **Correction:** There is NO Spring Boot 3.2.x in this repository. The project uses Spring Boot `4.1.0` (with Spring Framework 7.0.8 and Hibernate 7.4.1).

### B. Database Environment Variables Corrected
- **Previous Claim:** Required variables: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`.
- **Actual Codebase Truth:**
  - Grep for `DB_HOST` in `backend/` returned 0 matches.
  - `backend/src/main/resources/application.properties` lines 5–7 explicitly read:
    - `spring.datasource.url=${SPRING_DATASOURCE_URL:jdbc:postgresql://localhost:5432/OHOTECH}`
    - `spring.datasource.username=${SPRING_DATASOURCE_USERNAME:postgres}`
    - `spring.datasource.password=${SPRING_DATASOURCE_PASSWORD:postgres}`
  - **Correction:** Supplying `DB_HOST` or `DB_NAME` will fail to configure the database. The exact production environment variables are `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, and `SPRING_DATASOURCE_PASSWORD`.

### C. Razorpay Webhook Existence Corrected
- **Previous Claim:** `"Register webhook URL in Razorpay Dashboard: https://ohotech.com/api/webhooks/razorpay"`.
- **Actual Codebase Truth:**
  - Search across all backend controllers and services revealed: **NO Razorpay webhook endpoint exists**.
  - `PaymentController.java` only exposes:
    1. `POST /api/payments/create-order`
    2. `POST /api/payments/verify`
  - Razorpay payment verification is performed synchronously from the frontend checkout client passing `razorpay_order_id`, `razorpay_payment_id`, and `razorpay_signature`.
  - Existing webhooks in the repository are exclusively CRM lead capture webhooks:
    - `POST /api/webhooks/google/leads`
    - `POST /api/webhooks/linkedin/leads`
    - `POST /api/webhooks/meta/leads`
  - **Correction:** Razorpay webhooks are NOT implemented. Do NOT attempt to configure a Razorpay webhook in production until an endpoint is created.

### D. File Storage & Upload Architecture Corrected
- **Previous Claim:** Binary releases stored on disk at `/var/www/ohotech/releases`.
- **Actual Codebase Truth:**
  - `SoftwareReleaseController.java` does NOT read from disk. Line 70 generates an in-memory mock text/zip byte stream payload with license metadata dynamically.
  - Upload endpoints (`/api/ai/document/analyze` and `/api/ai/image/analyze`) convert `MultipartFile` directly to in-memory Base64 strings for Google Gemini API calls.
  - **Correction:** The backend has **zero disk storage requirements** for user uploads or software releases. The path `/var/www/ohotech/releases` was an unsupported assumption.

### E. Frontend API URL Configuration (`NEXT_PUBLIC_API_URL`) Corrected
- **Previous Claim:** Recommended `NEXT_PUBLIC_API_URL=https://ohotech.com/api`.
- **Actual Codebase Truth:**
  - In `src/api/client.ts` line 45: `const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;`
  - Every API service function (in `auth.ts`, `products.ts`, `orders.ts`, etc.) prepends `/api/` (e.g. `/api/products`, `/api/auth/login`).
  - If `NEXT_PUBLIC_API_URL` was set to `https://ohotech.com/api`, the request URL would become `https://ohotech.com/api/api/products` (a broken double `/api/api` path).
  - **Correction:** When hosting frontend and backend under the same domain (`https://ohotech.com`), `NEXT_PUBLIC_API_URL` must be set to `https://ohotech.com` (WITHOUT `/api`) or left empty (`""`) to issue relative requests.

### F. DataInitializer Security Vulnerability Identified as Production Blocker
- **Previous Claim:** Handled initialization safely.
- **Actual Codebase Truth:**
  - `DataInitializer.java` lines 36–82 contains hardcoded password `"Admin@12345"`:
    - Overwrites `admin@ohotech.com`, `admin@ohotechn.com`, and `himansu@ohotechn.com` passwords to `"Admin@12345"` on **every single boot** of Spring Boot.
    - If an admin changes their password in production, restarting the backend automatically reverts it back to `"Admin@12345"`.
  - **Correction:** Classified as a **CRITICAL PRODUCTION BLOCKER**. This hardcoded password override must be disabled or parameterized before live deployment.

---

## 4. Claims Not Verifiable

The following claims from the previous report cannot be verified from static codebase inspection and are marked as unverified:

1. **User Capacity ("50,000+ monthly active users"):**
   - **Verdict:** **NOT VERIFIED**. No load testing, stress benchmarking, or concurrency profiling has been performed on the repository. Real-world traffic capacity depends on database query latency, Gemini API response times, and network throughput.
2. **Hostinger KVM 2 Specifications:**
   - **Verdict:** **USER-PROVIDED TARGET / REQUIRES HOSTINGER VERIFICATION**. Specifications (2 vCPU, 8 GB RAM, 100 GB NVMe) are external provider parameters that must be verified against the user's active Hostinger control panel.
3. **Off-Server Disaster Recovery:**
   - **Verdict:** **NOT IMPLEMENTED**. A local `pg_dump` cron job in `/var/backups/postgresql/` is a local backup, not an off-site disaster recovery plan. If the VPS disk fails or the instance is terminated, local backups are destroyed.

---

## 5. Actual Spring Boot Version

Definitive build and dependency details:

| Component | Exact Version in Codebase | Source of Verification |
| :--- | :--- | :--- |
| **Java Version** | `21` | `<java.version>21</java.version>` in `backend/pom.xml` |
| **Spring Boot** | `4.1.0` | `<artifactId>spring-boot-starter-parent</artifactId><version>4.1.0</version>` |
| **Spring Framework** | `7.0.8` | Resolved dependency: `org.springframework:spring-core:7.0.8` |
| **Spring Security** | `7.1.0` | Resolved dependency: `org.springframework.security:spring-security-core:7.1.0` |
| **Hibernate ORM** | `7.4.1.Final` | Resolved dependency: `org.hibernate.orm:hibernate-core:7.4.1.Final` |
| **PostgreSQL Driver** | `42.7.11` | Resolved dependency: `org.postgresql:postgresql:42.7.11` |
| **JJWT** | `0.12.6` | Declared in `backend/pom.xml` |
| **OpenPDF** | `2.0.3` | Declared in `backend/pom.xml` |
| **Razorpay Java SDK**| `1.4.8` | Declared in `backend/pom.xml` |
| **Firebase Admin** | `9.4.3` | Declared in `backend/pom.xml` |

---

## 6. Actual Database Migration Strategy

* **Migration Tool:** **None** (neither Flyway nor Liquibase is part of the architecture).
* **Explicit Fact:** `Flyway is not part of the current production architecture.`
* **Schema Evolution Mechanism:** Hibernate auto-DDL (`spring.jpa.hibernate.ddl-auto=${SPRING_JPA_HIBERNATE_DDL_AUTO:update}`).
* **Empty Database First Boot Behavior:**
  1. Hibernate inspects 18 JPA entities and generates tables: `users`, `roles`, `categories`, `products`, `product_plans`, `product_features`, `product_faqs`, `orders`, `order_items`, `payments`, `subscriptions`, `licenses`, `license_activations`, `software_releases`, `leads`, `quotes`, `notifications`, `webhook_events`, `audit_logs`.
  2. Hibernate creates primary keys, unique constraints (e.g. `users.email`, `licenses.license_key`), and foreign keys.
  3. `DataInitializer.java` executes on startup:
     - Checks if `admin@ohotech.com` exists; if not, creates admin account.
     - Checks if `productRepository.count() > 0`; if 0, seeds 6 categories and 28 turnkey products.
* **Production Recommendation:**
  - For the initial bootstrap on an empty PostgreSQL database: `SPRING_JPA_HIBERNATE_DDL_AUTO=update`.
  - Once tables are created and seeded: Freeze schema changes by setting `SPRING_JPA_HIBERNATE_DDL_AUTO=validate`.

---

## 7. Actual Environment Variables

Programmatically extracted from all `${...}` references in `backend/src/main/resources/application.properties` and `process.env.*` in `src/`:

| Variable | Component | Required | Secret | Build / Runtime | Default Value in Code | Production Requirement |
| :--- | :--- | :---: | :---: | :---: | :--- | :--- |
| `PORT` | Backend | NO | NO | Runtime | `8080` | Port for Spring Boot |
| `SPRING_DATASOURCE_URL` | Backend | **YES** | NO | Runtime | `jdbc:postgresql://localhost:5432/OHOTECH` | `jdbc:postgresql://127.0.0.1:5432/ohotech_prod` |
| `SPRING_DATASOURCE_USERNAME` | Backend | **YES** | NO | Runtime | `postgres` | PostgreSQL username |
| `SPRING_DATASOURCE_PASSWORD` | Backend | **YES** | **YES** | Runtime | `postgres` | Strong PostgreSQL password |
| `SPRING_JPA_HIBERNATE_DDL_AUTO` | Backend | NO | NO | Runtime | `update` | `update` on first boot, then `validate` |
| `JWT_SECRET` | Backend | **YES** | **YES** | Runtime | `defaultSecretKeyForDevelopmentPhase...` | High-entropy 256-bit+ secret key |
| `JWT_EXPIRATION_MS` | Backend | NO | NO | Runtime | `86400000` (24h) | Access token expiration |
| `JWT_REFRESH_EXPIRATION_MS` | Backend | NO | NO | Runtime | `604800000` (7d) | Refresh token expiration |
| `app.frontend.url` (`APP_FRONTEND_URL`)| Backend | **YES** | NO | Runtime | `http://localhost:3000` | `https://ohotech.com` |
| `RAZORPAY_KEY_ID` | Backend | **YES** | NO | Runtime | `""` | Live Razorpay Key ID |
| `RAZORPAY_KEY_SECRET` | Backend | **YES** | **YES** | Runtime | `""` | Live Razorpay Key Secret |
| `GEMINI_API_KEY` | Backend | **YES** | **YES** | Runtime | `""` | Google AI Studio API Key |
| `GEMINI_MODEL` | Backend | NO | NO | Runtime | `gemini-1.5-flash` | Gemini model name |
| `SPRING_MAIL_HOST` | Backend | NO | NO | Runtime | `""` | SMTP Host (e.g. `smtp.resend.com`) |
| `SPRING_MAIL_PORT` | Backend | NO | NO | Runtime | `587` | SMTP Port |
| `SPRING_MAIL_USERNAME` | Backend | NO | NO | Runtime | `""` | SMTP Username |
| `SPRING_MAIL_PASSWORD` | Backend | NO | **YES** | Runtime | `""` | SMTP Password / Token |
| `SPRING_MAIL_FROM_ADDRESS` | Backend | NO | NO | Runtime | `onboarding@resend.dev` | Verified sender email address |
| `META_APP_SECRET` | Backend | NO | **YES** | Runtime | `""` | Meta Lead Ad webhook secret |
| `META_VERIFY_TOKEN` | Backend | NO | **YES** | Runtime | `""` | Meta Webhook challenge token |
| `GOOGLE_WEBHOOK_SECRET` | Backend | NO | **YES** | Runtime | `""` | Google Webhook secret |
| `LINKEDIN_WEBHOOK_SECRET` | Backend | NO | **YES** | Runtime | `""` | LinkedIn Webhook secret |
| `FIREBASE_CREDENTIALS_PATH` | Backend | NO | NO | Runtime | `""` | Path to Firebase JSON credentials |
| `FIREBASE_CREDENTIALS_JSON` | Backend | NO | **YES** | Runtime | `""` | Raw Firebase JSON credentials |
| `NEXT_PUBLIC_API_URL` | Frontend | **YES** | NO | Build/Runtime | `http://localhost:8080` | `https://ohotech.com` (WITHOUT `/api`) |
| `RESEND_API_KEY` | Frontend | **YES** | **YES** | Runtime | `""` | Resend API Key for Next.js quote route |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Frontend | NO | NO | Build | `""` | Client-side Razorpay Key ID fallback |
| `NEXT_PUBLIC_FIREBASE_*` | Frontend | NO | NO | Build | `""` | Firebase Web Client config (optional) |

*Note: Variables listed in the previous audit such as `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, and `DB_PASSWORD` do not exist in the codebase and are excluded.*

---

## 8. Actual Frontend Runtime

* **Framework:** Next.js `16.3.0` (Turbopack, React `19.2.8`).
* **Static Export Feasibility:** **NOT POSSIBLE**.
  - Reasons:
    1. Contains dynamic server API route: `src/app/api/quote/route.ts` executing Node.js Resend SDK calls.
    2. Contains dynamic route without static params: `src/app/(marketing)/products/[id]/page.tsx`.
* **Required Runtime:** **Node.js 20 LTS or 22 LTS**.
* **Process Execution:** `next start` on port `3000` (supervised by PM2 or systemd).

---

## 9. Actual Backend Runtime

* **Runtime:** OpenJDK `21` (64-bit Headless).
* **Packaging:** Executable Fat JAR (`backend/target/backend-0.0.1-SNAPSHOT.jar`).
* **JVM Execution Parameters:**
  ```bash
  java -Xms512m -Xmx1280m -XX:+UseG1GC -XX:+ExitOnOutOfMemoryError \
       -Dspring.profiles.active=prod \
       -jar backend-0.0.1-SNAPSHOT.jar
  ```
* **Process Execution:** Supervised by Linux `systemd` (`ohotech-backend.service`).

---

## 10. Actual Payment Architecture

* **Gateway:** Razorpay (Java SDK `1.4.8` on backend; client SDK loaded dynamically in frontend checkout).
* **Payment Flow:**
  1. Frontend calls `POST /api/payments/create-order` with `orderId`.
  2. Backend calls `com.razorpay.RazorpayClient.orders.create(...)` generating a Razorpay Order ID.
  3. Frontend opens Razorpay Checkout modal.
  4. Upon customer payment, modal returns `razorpay_order_id`, `razorpay_payment_id`, and `razorpay_signature`.
  5. Frontend immediately calls `POST /api/payments/verify`.
  6. Backend calculates HMAC-SHA256 (`razorpayOrderId + "|" + razorpayPaymentId` with `razorpayKeySecret`) and strictly verifies the signature.
  7. If signature is valid, updates `Payment` to `SUCCESSFUL`, `Order` to `CONFIRMED`, and creates entitlements (subscriptions and licenses).
* **Webhook Architecture:** **NO WEBHOOK IMPLEMENTED**. All payment verifications are client-initiated synchronous calls.
* **Refund Architecture:** Not implemented.

---

## 11. Actual Email Architecture

The system uses **two independent email mechanisms**:

1. **Next.js Quote / Contact Route (`src/app/api/quote/route.ts`):**
   - Uses the official **Resend REST API SDK** (`new Resend(process.env.RESEND_API_KEY)`).
   - Direct HTTP POST to Resend API.
   - Dispatches quote enquiries to recipient `kampainfraa@gmail.com`.
2. **Spring Boot Backend (`EmailService.java`):**
   - Uses Spring Mail **`JavaMailSender` over SMTP** (port 587 or 465).
   - Does NOT use the Resend SDK directly. Can connect to Resend's SMTP relay (`smtp.resend.com`) or any standard SMTP server.
   - Dispatches OTPs, password reset links, order confirmations, and payment receipts.

---

## 12. Actual File Storage Architecture

* **Release Binaries:**
  - Handled by `SoftwareReleaseController.java` (`/api/products/my/{productId}/download/{releaseId}`).
  - Generates text/zip license byte payloads **completely in memory**.
  - Does NOT read from or write to disk.
* **Invoice PDFs:**
  - Generated on-the-fly via OpenPDF in `PdfInvoiceService.java`.
  - Streamed directly to HTTP response from `ByteArrayOutputStream`. Zero disk footprint.
* **User Uploads (AI Documents & Images):**
  - Read into memory as byte arrays and converted to Base64 strings sent to Google Gemini. Zero disk footprint.
* **Conclusion:** The application requires **zero persistent filesystem storage** for uploads or downloads.

---

## 13. Actual Deployment Architecture

### Recommended Topology: Architecture A (Single Domain with Nginx Routing)

Based on actual repository code analysis, **Architecture A** is the single recommended architecture:

* **Domain:** `https://ohotech.com`
* **Nginx Reverse Proxy:**
  - Listens on `443` (HTTPS) with Let's Encrypt SSL.
  - Exception rule for Next.js internal API:
    ```nginx
    location = /api/quote {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    ```
  - Backend Spring Boot routing:
    ```nginx
    location /api/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    ```
  - Frontend Next.js routing:
    ```nginx
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    ```
* **Why Architecture A is Recommended:**
  1. Completely eliminates CORS preflight requests (`OPTIONS`) for user browsers.
  2. Single SSL certificate covering `ohotech.com` and `www.ohotech.com`.
  3. Seamless cookie and authentication token handling.
  4. The `/api/quote` Nginx exception ensures the Next.js server route functions without conflicting with Spring Boot's `/api/*` routes.

---

## 14. Remaining Production Conditions

Before proceeding to any VPS provisioning, the following conditions must be satisfied:

1. **[CRITICAL SECURITY BLOCKER] Fix Hardcoded Admin Password in `DataInitializer.java`:**
   - Lines 36–82 must be modified to prevent resetting administrator passwords to `"Admin@12345"` on every boot.
   - Passwords must be randomly generated on first seed and logged once, or read from a secure environment variable (`INITIAL_ADMIN_PASSWORD`).
2. **Production Secrets Sourcing:**
   - Live Razorpay API Keys (`rzp_live_...`).
   - Production Google Gemini API Key.
   - Production Resend API Key.
   - Valid SMTP credentials for backend email dispatch.
3. **Domain & DNS Pointing:**
   - A records for `ohotech.com` and `www.ohotech.com` pointing to the VPS IPv4 address.
4. **Hostinger VPS Verification:**
   - Confirm active instance specifications in Hostinger hPanel.

---

## 15. Final Deployment Recommendation

* **CODEBASE STATUS:** **VALIDATED WITH CONDITIONS** (All 134 backend tests pass; Next.js 117-page build succeeds; 1 critical security blocker in `DataInitializer.java` identified).
* **DEPLOYMENT ARCHITECTURE STATUS:** **DEFINED & FROZEN** (Architecture A — Single Domain `https://ohotech.com` with Nginx path routing and `/api/quote` exception).
* **OPERATIONAL STATUS:** **PENDING PRE-DEPLOYMENT FIX** (Fix hardcoded admin credentials; prepare production environment file).
* **EXTERNAL VALIDATION STATUS:** **USER-PROVIDED TARGET** (Hostinger KVM 2 VPS specifications and live third-party keys pending verification).

### Verdict:
**READY WITH CONDITIONS**  
*(Do NOT deploy until the `DataInitializer.java` hardcoded credential override is resolved and production keys are provisioned).*
