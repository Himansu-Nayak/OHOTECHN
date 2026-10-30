# OHO TECH — Backend Architecture Audit Report

**Audit Target:** Spring Boot 4.1 Enterprise Backend  
**Directory:** `backend/`  
**Toolchain:** OpenJDK 21 / Spring Boot 4.1.0 / Spring Security 6 / Spring Data JPA  
**Audit Scope:** REST Controllers, Services, Security Filters, DTOs, Repositories, and Exceptions  

---

## 1. REST Controller & API Topography

The backend exposes **44 REST Controllers** organized cleanly into distinct functional domains:

```
backend/src/main/java/com/ohotech/backend/controller/
├── Auth & User Management:
│   ├── AuthController.java                  # Register, Login, Token Refresh, OTP
│   ├── PhoneVerificationController.java     # Phone number verification & OTP dispatch
│   └── UserController.java                  # User profile & credentials
├── E-Commerce & Product Catalog:
│   ├── ProductController.java               # 28 Turnkey Products catalog & queries
│   ├── ProductPlanController.java           # Plan pricing & tier configurations
│   ├── CategoryController.java              # Product classification
│   ├── CartController.java                  # User cart persistence
│   ├── OrderController.java                 # Checkout, order states, PDF invoices
│   └── LicenseController.java               # License issuance, validation, activation
├── Payments & POS Subsystems:
│   ├── PaymentController.java               # Gateway selection & initiate
│   ├── UpiCheckoutController.java           # Dynamic self-hosted UPI QR generation
│   ├── PaymentObserverController.java       # Observer phone alert ingestion
│   └── CounterBillingController.java        # Offline retail counter POS billing
├── Webhooks & Financial Ingestion:
│   ├── RazorpayWebhookController.java       # Razorpay HMAC signature webhook
│   ├── CashfreeWebhookController.java       # Cashfree payment status webhook
│   ├── MetaWebhookController.java           # Meta lead ad capture webhook
│   ├── WhatsAppWebhookController.java       # Meta Cloud API message/delivery webhook
│   ├── GoogleWebhookController.java         # Google Ads lead webhook
│   └── LinkedInWebhookController.java       # LinkedIn lead capture webhook
├── CRM & Communications:
│   ├── LeadController.java                  # Lead capture, qualification & status
│   ├── CrmPipelineController.java           # Deals, stages, win probability
│   ├── Customer360Controller.java           # Unified 360 customer profile
│   └── CrmMarketingAnalyticsController.java # Multi-channel attribution metrics
└── Admin Console Operations:
    ├── AdminController.java                 # Core admin operations
    ├── AdminAiController.java               # Product copy & enquiry summarization
    ├── AdminDeploymentController.java       # SaaS deployment provisioner
    ├── AdminEmailController.java            # Outbox management & retry queue
    ├── AdminWhatsAppController.java         # Template dispatch & consent registry
    └── AuditLogController.java              # Immutable system audit logs
```

---

## 2. Business Services & Component Structure

The service layer contains **37 service classes** and 4 specialized domain sub-packages:
- `service/payment/`: Strategy-pattern payment gateways (`DirectUpiGateway`, `RazorpayGateway`, `CashfreeGateway`, `CashOnDeliveryGateway`, `PaymentGatewayRegistry`).
- `service/otp/`: Multi-provider OTP routing (`OtpDeliveryRouter`, `DevTestOtpDeliveryService`, `WhatsAppBusinessOtpService`).
- `service/ai/`: Enterprise Gemini AI integrations (`GeminiService`, `AiProductService`, `AiDocumentService`, `AiSemanticSearchService`, `AiSupportAgentService`).
- `service/provisioning/`: Turnkey SaaS software provisioning engines (`HostedSaaSProvisioningProvider`, `DedicatedInstanceProvisioningProvider`, `ApiProvisioningProvider`, `WebhookProvisioningProvider`).

---

## 3. Forensic Findings & Architectural Defects

### Finding BE-01: Hardcoded Fallback JWT Secret in Properties (High)
* **Severity:** High
* **File:** `backend/src/main/resources/application.properties#L23`
* **Actual Problem:**
  `app.jwt.secret` defines a static default string:
  ```properties
  app.jwt.secret=${JWT_SECRET:defaultSecretKeyForDevelopmentPhaseThatIsLongEnoughAndSecure32Bytes!}
  ```
  If an administrator boots the application in production without supplying `JWT_SECRET`, the application starts up with this publicly known fallback key.
* **Business / Technical Impact:**
  An attacker knowing this repository source could forge valid JWT tokens claiming `ROLE_ADMIN` permissions and gain full control over the enterprise console, customer records, and financial transactions.
* **Recommended Correction:**
  In `StartupConfigValidator.java`, enforce that when the `production` profile is active or `spring.profiles.active` is not `test`/`dev`, the application must throw an `IllegalStateException` and refuse to boot if `JWT_SECRET` equals the default string.
* **Dependencies & Risks:** Low risk; requires setting `JWT_SECRET` in production `.env` and systemd environment.
* **Verification Method:** Attempt to start backend with `SPRING_PROFILES_ACTIVE=production` without `JWT_SECRET` and confirm boot failure.

---

### Finding BE-02: Test Profile Network Blockage in Air-Gapped Environments (Medium)
* **Severity:** Medium
* **File:** `backend/src/test/resources/application-test.properties#L17-L20`
* **Actual Problem:**
  The test profile sets `gemini.api.key=test-key-mock` and `gemini.api.timeout-ms=5000`. In `GeminiService.java`, having a non-blank key bypasses the mock fallback and attempts real HTTP socket connections to `generativelanguage.googleapis.com`. In air-gapped CI or local sandboxes without outbound internet, each test hangs for 5,000ms until socket timeout.
* **Business / Technical Impact:**
  Causes massive test suite slowdown (from ~30 seconds to >5 minutes) and potential CI runner timeout cancellations.
* **Recommended Correction:**
  Set `gemini.api.key=` (empty string) in `application-test.properties` so `GeminiService` immediately engages its built-in offline deterministic mock generator.
* **Dependencies & Risks:** Low risk; ensures offline test determinism.
* **Verification Method:** Run `mvn test` in network-isolated terminal and verify instantaneous test execution.

---

### Finding BE-03: Open-In-View Enabled in Production JPA Configuration (Medium)
* **Severity:** Medium
* **File:** `backend/src/main/resources/application.properties#L15`
* **Actual Problem:**
  `spring.jpa.open-in-view=true` is explicitly enabled.
* **Business / Technical Impact:**
  Open-Session-In-View (OSIV) keeps the database connection open for the entire duration of HTTP request processing, including JSON serialization and third-party webhook processing. On a VPS with 8 GB RAM and standard Hikari pool sizes (10 connections), this causes connection pool starvation under modest concurrent loads.
* **Recommended Correction:**
  Set `spring.jpa.open-in-view=false` in `application.properties` and verify all DTO mappers fetch required associations within `@Transactional` service boundaries.
* **Dependencies & Risks:** Medium risk; any un-fetched lazy associations in controllers could throw `LazyInitializationException` if not eagerly loaded or mapped in services.
* **Verification Method:** Set property to `false`, run integration test suite, and check for `LazyInitializationException`.

---

### Finding BE-04: Missing Batch Size on Many-to-One Relationships (Low)
* **Severity:** Low
* **Files:** `backend/src/main/java/com/ohotech/backend/entity/Order.java#L38`, `OrderItem.java#L28`
* **Actual Problem:**
  Entity relationships lack `@BatchSize(size = 25)` or explicit `JOIN FETCH` queries in some repository finder methods (e.g., fetching orders with customer and items).
* **Business / Technical Impact:**
  Generates $N+1$ query cascades when the Admin Orders view loads multiple orders, executing $2N+1$ SQL select statements.
* **Recommended Correction:**
  Add `@BatchSize(size = 25)` to `@OneToMany` collections or implement explicit JPQL fetch joins in `OrderRepository`.
* **Dependencies & Risks:** Low risk.
* **Verification Method:** Enable `spring.jpa.show-sql=true` during test runs and count query logs for order listings.
