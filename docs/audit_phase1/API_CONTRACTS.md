# OHO TECH — API Contracts & Integration Audit Report

**Audit Target:** Frontend-to-Backend API Mappings & DTO Consistency  
**Client Base:** `src/api/*.ts` (24 API Service Modules)  
**Server Base:** `backend/src/main/java/com/ohotech/backend/controller/*.java` (44 REST Controllers)  
**Data Exchange Standard:** JSON (`ApiResponse<T>` wrapper)  

---

## 1. Unified API Mapping Matrix

| Domain | Frontend Client | HTTP Method & Path | Backend Controller | Auth Level | DTO Alignment |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Auth** | `src/api/auth.ts` | `POST /api/auth/register` | `AuthController.java` | PermitAll | Aligned (`RegisterRequest` / `AuthResponse`) |
| **Auth** | `src/api/auth.ts` | `POST /api/auth/login` | `AuthController.java` | PermitAll | Aligned (`LoginRequest` / `AuthResponse`) |
| **Auth** | `src/api/auth.ts` | `POST /api/auth/refresh` | `AuthController.java` | PermitAll | Aligned (`RefreshTokenRequest` / `TokenRefreshResponse`) |
| **Auth** | `src/api/auth.ts` | `POST /api/auth/phone-otp/send` | `PhoneVerificationController.java` | PermitAll | Aligned (`PhoneOtpRequest`) |
| **Products**| `src/api/products.ts` | `GET /api/products` | `ProductController.java` | PermitAll | Aligned (`List<ProductDto>`) |
| **Products**| `src/api/products.ts` | `GET /api/products/{id}` | `ProductController.java` | PermitAll | Aligned (`ProductDto`) |
| **Commerce**| `src/api/orders.ts` | `POST /api/orders` | `OrderController.java` | Authenticated | Aligned (`CreateOrderRequest` / `OrderDto`) |
| **Commerce**| `src/api/orders.ts` | `GET /api/orders/{id}/invoice`| `OrderController.java` | Authenticated | Binary stream (`application/pdf`) |
| **POS** | `src/api/payments.ts` | `POST /api/admin/counter-billing/checkout` | `CounterBillingController.java` | Admin | Aligned (`CounterBillingRequest` / `CounterBillingResponse`) |
| **Payments**| `src/api/payments.ts` | `POST /api/payments/upi/initiate` | `UpiCheckoutController.java` | PermitAll | Aligned (`UpiInitiateRequest` / `UpiInitiateResponse`) |
| **Payments**| `src/api/payments.ts` | `GET /api/payments/upi/status/{id}` | `UpiCheckoutController.java` | PermitAll | Aligned (`UpiStatusResponse`) |
| **CRM** | `src/api/crm.ts` | `POST /api/leads` | `LeadController.java` | PermitAll | Aligned (`LeadCreateRequest` / `LeadDto`) |
| **CRM** | `src/api/crm.ts` | `GET /api/admin/crm/pipeline` | `CrmPipelineController.java` | Admin | Aligned (`CrmPipelineDto`) |
| **WhatsApp**| `src/api/whatsapp.ts`| `POST /api/admin/whatsapp/send` | `AdminWhatsAppController.java`| Admin | Aligned (`SendWhatsAppMessageRequest`) |
| **WhatsApp**| `src/api/whatsapp.ts`| `GET /api/admin/whatsapp/consent` | `AdminWhatsAppController.java`| Admin | Aligned (`List<CrmWhatsAppConsent>`) |
| **Email** | `src/api/email.ts` | `GET /api/admin/email/outbox` | `AdminEmailController.java` | Admin | Aligned (`Page<EmailOutboxDto>`) |

---

## 2. Forensic Findings & Contract Inconsistencies

### Finding API-01: Meta Cloud API Webhook Challenge Response Payload (Medium)
* **Severity:** Medium
* **Files:** `backend/src/main/java/com/ohotech/backend/controller/WhatsAppWebhookController.java#L48-L62`
* **Actual Problem:**
  Meta Cloud API verification expects a raw plain-text HTTP 200 containing `hub.challenge`. The controller correctly returns `ResponseEntity.ok(challenge)`, but global `ApiResponse` interceptors or content negotiation must never wrap this endpoint in a JSON body (`{"success": true, "data": "..."}`).
* **Business / Technical Impact:**
  If an interceptor wraps the response in JSON, Meta’s webhook validation scanner will reject verification, failing production WhatsApp webhook registration.
* **Recommended Correction:**
  Explicitly specify `produces = MediaType.TEXT_PLAIN_VALUE` on `@GetMapping("/webhook")` in `WhatsAppWebhookController.java`.
* **Dependencies & Risks:** Low risk; protects third-party integration stability.
* **Verification Method:** Send GET with `hub.mode=subscribe&hub.challenge=1158201444&hub.verify_token=...` and verify Content-Type is `text/plain` with raw challenge string.

---

### Finding API-02: Public Unauthenticated AI Chat Abuse Risk (Medium)
* **Severity:** Medium
* **Files:** `backend/src/main/java/com/ohotech/backend/security/SecurityConfig.java#L114`, `AiController.java`
* **Actual Problem:**
  `/api/ai/chat` is configured as `.permitAll()` in `SecurityConfig.java`. While rate limiting is applied via `RateLimitingFilter`, rate limiting relies on IP headers without client session fingerprinting.
* **Business / Technical Impact:**
  Distributed bot traffic or rotated proxies could deplete Google Gemini API token quotas ($60\text{ RPM}$ tier), exhausting API allowances for genuine enterprise users.
* **Recommended Correction:**
  Require an anonymous session token or Turnstile/reCAPTCHA token on public AI endpoints before forwarding queries to `GeminiService`.
* **Dependencies & Risks:** Requires adding client-side verification badge.
* **Verification Method:** Benchmark simulated burst requests to `/api/ai/chat` and verify IP + session threshold throttling.
