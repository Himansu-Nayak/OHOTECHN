# OHO TECH — Master Prioritized Improvement Roadmap

**Date:** 2026-10-14  
**Project:** OHO TECH Platform Modernization & Commercial Hardening  
**Roadmap Lead:** Forensic Architecture & DevOps Team  

---

## Roadmap Overview & Prioritization Strategy

Tasks are prioritized into four strict phases:
- **P0: Urgent Security, Financial Integrity & System Stability (Immediate Hotfixes)**
- **P1: Essential Workflow & Reliability Fixes (Sprint 1)**
- **P2: Architecture, Maintainability & Performance Improvements (Sprint 2)**
- **P3: Commercial Features & Product Enhancements (Sprint 3)**

---

## 1. P0: Urgent Security, Financial Integrity & Stability

| ID | Item | Scope | Acceptance Criteria | Effort |
|---|---|---|---|:---:|
| **P0-1** | Sanitize License Endpoint & User Entity | `User.java`, `LicenseController.java` | Add `@JsonIgnore` to `User.passwordHash`. Return `LicensePublicDto` on `/api/licenses/key/**`. Confirm zero PII/hash leaks. | 1–2 hrs |
| **P0-2** | Resolve `support_tickets` Schema Drift & Table Ownership | PostgreSQL `ohotech_db` | Assign table/sequence ownership to `ohotech_user`. Add `product_id` and `issue_ownership` columns. Verify support ticket API returns 200. | 1 hr |
| **P0-3** | Restrict Demo Quick-Pay Endpoint (`/api/payments/demo-pay`) | `PaymentController.java` | Restrict endpoint strictly to `@Profile({"dev", "test"})` or require `ROLE_ADMIN`. Ensure customers receive 403 Forbidden. | 1 hr |
| **P0-4** | Implement App Router Error Boundaries (`error.tsx`) | `src/app/` | Create `src/app/error.tsx` and `src/app/global-error.tsx` with error recovery and retry UI. | 2–3 hrs |
| **P0-5** | Upgrade Next.js & Resolve Critical Vulnerabilities | `package.json` | Upgrade Next.js to `>=16.4.0` or latest patched release to resolve RCE advisories. Verify clean build. | 2–4 hrs |
| **P0-6** | Remove Insecure Fallback Secrets | `application.properties` | Remove default fallback strings for `JWT_SECRET` and `FIREBASE_API_KEY`. Fail startup if secrets are unset in production. | 1 hr |

---

## 2. P1: Essential Workflow & Reliability Fixes

| ID | Item | Scope | Acceptance Criteria | Effort |
|---|---|---|---|:---:|
| **P1-1** | Eliminate 120 FPS Re-render Loop | `MotionContext.tsx` | Decouple GSAP ticker from React `setState`. Store pointer and scroll metrics in mutable refs. | 3–4 hrs |
| **P1-2** | Implement Server-Side Route Guards | `src/middleware.ts` | Intercept `/admin/*` and `/dashboard/*` requests at edge. Redirect unauthenticated users before hydration. | 2–3 hrs |
| **P1-3** | Add Missing Foreign Key Indexes | PostgreSQL `ohotech_db` | Create b-tree indexes on `orders(user_id)`, `order_items(order_id)`, `subscriptions(user_id)`, `licenses(user_id)`. | 1–2 hrs |
| **P1-4** | Fix Checkout Pre-filled Dummy Data | `checkout/page.tsx` | Reset default address and phone to empty strings or authenticated user profile values. Enforce validation. | 1–2 hrs |
| **P1-5** | Fix Auth Hydration Screen Flicker | Multiple customer pages | Check `isLoading` before returning `AccessRestrictedScreen` across checkout, downloads, and CRM pages. | 2 hrs |
| **P1-6** | Implement Server-Side Logout & Token Invalidation | `AuthController.java`, `AuthService.java` | Create `POST /api/auth/logout` that deletes `RefreshToken` records. | 2–3 hrs |
| **P1-7** | Configure Offsite Encrypted Backup Sync | `ohotech-db-backup.sh` | Add automated sync to S3 or Cloudflare R2 bucket after local dump encryption. | 2–3 hrs |

---

## 3. P2: Architecture, Maintainability & Performance

| ID | Item | Scope | Acceptance Criteria | Effort |
|---|---|---|---|:---:|
| **P2-1** | Delete 5,322 Lines of Orphaned Dead Code | `src/components/` (21 files) | Safely remove unreferenced files (`AdminCrmView.tsx`, `HeroWalking3D.tsx`, etc.). Verify 0 build regressions. | 2–3 hrs |
| **P2-2** | Introduce Flyway Database Migrations | Backend `pom.xml`, `resources/db` | Baseline production schema as `V1__baseline.sql`. Set `hibernate.ddl-auto=validate`. | 4–6 hrs |
| **P2-3** | Backend Domain Packaging (`BE-03`) | Backend package structure | Group controllers and entities into domain packages (`billing`, `catalog`, `identity`, `licensing`, `orders`). | 4–6 hrs |
| **P2-4** | Realign EAGER JPA Relationships to LAZY | `Order.java`, `Deployment.java` | Convert `@ManyToOne` and `@OneToMany` to `FetchType.LAZY`. Eliminate N+1 query cascades. | 3–5 hrs |
| **P2-5** | Frontend Cashfree Gateway UI Integration | `checkout/page.tsx` | Add Cashfree JS checkout SDK and option to checkout flow. Verify end-to-end payment with sandbox. | 4–6 hrs |
| **P2-6** | Run Frontend PM2 as Unprivileged User | Hostinger VPS | Reconfigure PM2 to run under service account `ohotech` rather than `root`. | 1–2 hrs |

---

## 4. P3: Commercial Features & Product Enhancements

| ID | Item | Scope | Acceptance Criteria | Effort |
|---|---|---|---|:---:|
| **P3-1** | Guest Cart in `localStorage` | `CartContext.tsx` | Allow unauthenticated users to add products to cart. Merge local cart into database upon login. | 3–4 hrs |
| **P3-2** | Product Catalog Sorting & Global Search | `products/page.tsx`, Header | Add price/popularity sorting and global `Ctrl+K` command palette. | 4–6 hrs |
| **P3-3** | Turnkey Product Static Generation & SEO | `products/[id]/page.tsx` | Export `generateStaticParams()` and `generateMetadata()` for all 28 products. | 4–5 hrs |
| **P3-4** | Branded Subdomain Routing for Live Demos | DNS / Nginx | Migrate live demo URLs from `whitevelvetevents.in` to `*-demo.ohotech.com`. | 2–3 hrs |
| **P3-5** | Self-Service Reseller & Provider Portal | `/partner` route group | Build vendor registration, product submission, and deployment tracking portal. | 2–3 wks |
