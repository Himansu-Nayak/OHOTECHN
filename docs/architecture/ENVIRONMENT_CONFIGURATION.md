# OHO TECH — Environment Configuration & Secret Management

**Status:** APPROVED & ACTIVE  
**Last Updated:** 2026-10-14  

---

## 1. Overview

OHO TECH strictly segregates public frontend configuration from private server-side secrets across all execution environments (Local Development, Testing, Staging, and Production).

---

## 2. Configuration Inventory

### A. Frontend Environment Variables (`.env.local` / Next.js)
| Variable | Scope | Description | Default / Example |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | Public (Browser) | Backend API base URL | Empty (relative `/api`) in prod, `http://127.0.0.1:8080` in local |
| `NEXT_PUBLIC_SITE_URL` | Public (Browser) | Canonical site domain | `https://ohotech.com` |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Public (Browser) | Razorpay public Key ID | Test / Live public key |

*Rule:* Never prefix private server keys with `NEXT_PUBLIC_`.

### B. Backend Environment Variables (Spring Boot & PostgreSQL)
| Variable | Scope | Description | Security Tier |
|---|---|---|:---:|
| `SPRING_DATASOURCE_URL` | Backend | PostgreSQL JDBC connection URL | Secret |
| `SPRING_DATASOURCE_USERNAME` | Backend | PostgreSQL database user | Secret |
| `SPRING_DATASOURCE_PASSWORD` | Backend | PostgreSQL database password | Critical Secret |
| `JWT_SECRET` | Backend | HMAC-SHA512 token signing key | Critical Secret |
| `CASHFREE_ENVIRONMENT` | Backend | Sandbox (`SANDBOX`) or Live (`PRODUCTION`) | Operational |
| `CASHFREE_CLIENT_ID` | Backend | Cashfree App ID | Secret |
| `CASHFREE_CLIENT_SECRET` | Backend | Cashfree App Secret Key | Critical Secret |
| `CASHFREE_WEBHOOK_SECRET` | Backend | Dedicated Cashfree Webhook Secret | Critical Secret |
| `CASHFREE_API_VERSION` | Backend | Supported Cashfree API version (`2025-01-01`) | Operational |
| `RAZORPAY_KEY_ID` | Backend | Razorpay API Key ID | Secret |
| `RAZORPAY_KEY_SECRET` | Backend | Razorpay Secret Key | Critical Secret |

---

## 3. Security Guardrails

1. **Zero Secrets in Repository:** Real secrets must never be committed to Git. `.env.example` provides sanitized placeholders only.
2. **Startup Configuration Validation:** Spring Boot validates required environment variables at application startup via `StartupConfigValidator.java`. If critical variables are missing or default in a production profile, startup is safely halted.
3. **No Secret Logging:** Payment secrets and webhook keys are masked or omitted in all application logs and diagnostics.
