# OHO TECH — Unified Error Handling Architecture

**Status:** APPROVED & ACTIVE  
**Last Updated:** 2026-10-14  

---

## 1. Overview

Reliable error handling in OHO TECH ensures that user-facing errors are clear, actionable, and secure, while backend diagnostics are structured, audited, and confidential.

---

## 2. Frontend Error Handling (Next.js & TypeScript)

### A. Normalized API Errors (`ApiError`)
The central HTTP client in `src/api/client.ts` intercepts non-2xx responses and formats them into a normalized `ApiError` class:
```typescript
export class ApiError extends Error {
  status: number;
  data: any;
  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}
```

### B. Categorized UI Feedback
1. **Network / Server Down (Status 0 or 502/503/504):**
   - Displays retryable toast or inline status badge without breaking the current view.
   - Preserves user input and cart state in `CartContext`.
2. **Unauthorized (Status 401):**
   - Clears stale tokens from `localStorage` and routes to `/login?redirect=...`.
3. **Forbidden (Status 403):**
   - Notifies user that elevated permissions are required (e.g. attempting to approve a payment or trigger an admin deployment without `ROLE_ADMIN`).
4. **Validation Failure (Status 400 / 422):**
   - Highlights the specific form fields with actionable validation messages.
5. **Payment Failure:**
   - Handled gracefully via `PaymentStatusFeedback.tsx`. User cart is maintained and alternative payment methods (Direct UPI QR / Bank Transfer) are offered.

---

## 3. Backend Error Handling (Spring Boot 4.1.0)

### A. Centralized Exception Handler (`GlobalExceptionHandler.java`)
All uncaught exceptions are intercepted by a Spring `@RestControllerAdvice` which transforms them into standard `ApiResponse<T>` envelopes:
```json
{
  "success": false,
  "message": "Human-readable sanitized error description",
  "data": null,
  "timestamp": "2026-10-14T12:00:00Z",
  "path": "/api/payments/verify"
}
```

### B. Security & Sanitization Rules
1. **Stack Trace Suppression:** Production environments never serialize internal stack traces or database error messages in API responses.
2. **Confidential Server Details:** Database connection strings, credentials, and internal hostnames are strictly excluded from HTTP response payloads.
3. **Deterministic Idempotency on Errors:** Failed webhook signature checks return immediate HTTP 401 Unauthorized without mutating database state.
