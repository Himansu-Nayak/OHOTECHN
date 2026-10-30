# OHO TECH — Security Architecture Audit Report

**Audit Target:** Full Stack Security Model (Next.js & Spring Boot)  
**Classification:** Restricted / Principal Architect Forensic Assessment  
**Standard:** OWASP ASVS 4.0 / PCI-DSS SAQ-A Compliance Baseline  
**Secrets Policy:** Zero actual credentials or plaintext secrets are exposed in this document.  

---

## 1. Executive Security Evaluation

The application implements robust defensive engineering across its primary entry points:
- **Stateless Authentication:** Dual-tier JSON Web Token architecture with 24-hour access tokens and 7-day refresh tokens.
- **Password Protection:** Industry-standard BCrypt hashing with salt rounds.
- **HMAC Webhook Verification:** Strict deterministic SHA-256 HMAC signature verification on financial and messaging webhooks (Razorpay, Cashfree, Meta WhatsApp).
- **Payment Ingestion Isolation:** Payment observer alerts require authenticated authorization tokens (`X-Observer-Token`).

---

## 2. Forensic Findings (Prioritized by Severity)

### Finding SEC-01: Default Insecure Fallback JWT Secret in Application Properties (High)
* **Severity:** High
* **File:** `backend/src/main/resources/application.properties#L23`
* **Actual Problem:**
  `app.jwt.secret` specifies a development fallback secret string in the checked-in properties file. While `StartupConfigValidator.java` logs a warning if this value is short, it does not crash or halt the application in production mode when this default value is present.
* **Business / Technical Impact:**
  If an operations team launches the VPS container without injecting `JWT_SECRET` via systemd or `.env`, any party with knowledge of the default key can mint arbitrary administrative tokens (`sub: "admin@ohotech.com"`, `roles: ["ROLE_ADMIN"]`), resulting in complete privilege escalation.
* **Recommended Correction:**
  Implement a hard production guard in `StartupConfigValidator.java`:
  ```java
  if (!"test".equals(activeProfile) && (jwtSecret == null || jwtSecret.contains("defaultSecretKey"))) {
      throw new IllegalStateException("CRITICAL: Production boot rejected. A cryptographically random JWT_SECRET must be provided.");
  }
  ```
* **Dependencies & Risks:** Operational dependency on server `.env` deployment.
* **Verification Method:** Attempt to launch JAR with default properties and verify application aborts startup.

---

### Finding SEC-02: Broad Allowed Origin Patterns in CORS Configuration (Medium)
* **Severity:** Medium
* **File:** `backend/src/main/java/com/ohotech/backend/security/SecurityConfig.java#L51-L57`
* **Actual Problem:**
  CORS allows wildcards for development ports and subdomains:
  ```java
  java.util.List<String> origins = new java.util.ArrayList<>(List.of(
      "http://localhost:*",
      "http://127.0.0.1:*",
      "https://ohotechn.com",
      "https://www.ohotech.com",
      "https://*.ohotech.com"
  ));
  ```
  Additionally, `configuration.setAllowCredentials(true)` is enabled concurrently with wildcard patterns.
* **Business / Technical Impact:**
  Any malicious process listening on an arbitrary local port on a client developer's machine, or an attacker controlling an untrusted subdomain (`attacker.ohotech.com`), could trigger authenticated cross-origin requests.
* **Recommended Correction:**
  Conditionally restrict CORS origins: under the `production` Spring profile, omit `http://localhost:*` and `http://127.0.0.1:*`, allowing only explicit, registered domain names.
* **Dependencies & Risks:** Low risk.
* **Verification Method:** Send OPTIONS preflight with `Origin: http://localhost:8081` against a production profile server and verify `403 Forbidden`.

---

### Finding SEC-03: Global CSRF Disabling (Medium)
* **Severity:** Medium
* **File:** `backend/src/main/java/com/ohotech/backend/security/SecurityConfig.java#L81`
* **Actual Problem:**
  `http.csrf(csrf -> csrf.disable())` is applied globally across all HTTP endpoints.
* **Business / Technical Impact:**
  Because authentication uses Bearer tokens stored in `localStorage` rather than HTTP-only cookies, standard CSRF exploitation is mitigated. However, should browser cookies ever be used for session persistence in future phases, the absence of CSRF protection creates an immediate vulnerability.
* **Recommended Correction:**
  Retain CSRF disabled only while tokens remain exclusively Bearer-based; document this architectural invariant in `SecurityConfig.java`. If cookies are introduced for SSR authentication, re-enable `CookieCsrfTokenRepository`.
* **Dependencies & Risks:** Documentation and architectural invariant enforcement.
* **Verification Method:** Confirm all authenticated requests pass tokens exclusively via `Authorization: Bearer <token>` header.

---

### Finding SEC-04: Lack of In-Memory Token Blacklist for Immediate Revocation (Low)
* **Severity:** Low
* **Files:** `backend/src/main/java/com/ohotech/backend/security/JwtAuthenticationFilter.java`, `RefreshTokenRepository.java`
* **Actual Problem:**
  Refresh tokens can be revoked in the database upon logout, but issued 24-hour JWT access tokens remain cryptographically valid until expiration (`exp`).
* **Business / Technical Impact:**
  A compromised access token cannot be immediately revoked before its 24-hour expiration window lapses without restarting the application or changing the signing key.
* **Recommended Correction:**
  Reduce access token expiration to 15–30 minutes in `application.properties` (`app.jwt.expiration-ms=900000`), relying on the seamless refresh token cycle already implemented in `src/api/client.ts`.
* **Dependencies & Risks:** Low risk; client already auto-refreshes on 401.
* **Verification Method:** Issue access token, wait 16 minutes, and confirm client automatically performs silent refresh without user logout.
