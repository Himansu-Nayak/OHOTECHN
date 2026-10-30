# OHO TECH — Frontend Architecture Audit Report

**Audit Target:** Next.js 16 App Router Frontend  
**Directory:** `src/`  
**Framework:** Next.js 16.4.3 / React 19.2.8 / TypeScript 5 / Tailwind CSS v4  
**Audit Scope:** Routes, Layouts, UI Components, Client Services, State Management, and Build Optimization  

---

## 1. Route Topology & Composition

The application adopts the Next.js 16 App Router using route groups to enforce clean architectural boundaries:

```
src/app/
├── (auth)/                       # Authentication Route Group
│   ├── forgot-password/page.tsx  # Password reset initiation
│   ├── login/page.tsx            # Dual Email & Phone OTP Login
│   ├── register/page.tsx         # Account registration
│   └── verify-email/page.tsx     # OTP verification
├── (marketing)/                  # Marketing & Commerce Route Group
│   ├── layout.tsx                # Marketing Header & Footer Frame
│   ├── page.tsx                  # Section-locked Narrative Homepage
│   ├── admin/                    # Enterprise Management Console
│   │   ├── audit-logs/           # System & security audit logs
│   │   ├── crm/                  # Pipeline, Customer 360 & WhatsApp
│   │   └── page.tsx              # Admin Unified Operating Console
│   ├── cart/page.tsx             # Shopping Cart
│   ├── checkout/page.tsx         # Self-hosted UPI & Razorpay Checkout
│   ├── products/                 # 28 Turnkey Commercial Catalog
│   │   ├── [id]/page.tsx         # Product Detail & Licensing Page
│   │   └── page.tsx              # Product Grid & Industry Filters
│   ├── services/                 # Digital Engineering Offerings
│   ├── work/                     # Enterprise Portfolio & Case Studies
│   └── book-demo/ & get-quote/   # Lead capture & estimation flows
└── api/
    └── quote/route.ts            # Server-side Resend API route
```

---

## 2. Component Hierarchy & Systems

### 2.1 Section-Locked Homepage Architecture
The homepage (`src/app/(marketing)/page.tsx`) implements an immutable narrative flow:
1. `Header.tsx`: Sticky navigation with responsive drawer, auth state pill, and cart badge.
2. `HeroExperience.tsx`: Multi-scene panoramic WebGL canvas powered by GSAP and Three.js with autonomous glide transitions.
3. `InteractiveMarquee.tsx`: Zero-lag high-frequency technology and trust marquee.
4. `PlatformEnginesShowcase.tsx`: Core value engine featuring Engine A (Turnkey Software), Engine B (Custom Engineering), and Engine C (Growth Marketing).
5. `ProductDiscoveryBanner.tsx`: High-converting showcase highlighting the 28 off-the-shelf software products.
6. `ServicesExperience.tsx`: Interactive tabbed architecture covering Cloud, Mobile, ERP, and AI platforms.
7. `ProofWall.tsx`: Client testimonials, enterprise metrics, and verified production logos.
8. `DirectorSection.tsx`: Corporate leadership transparency featuring Japabandhu Kampa & Himansu Nayak.
9. `FinalCTA.tsx`: Conversion closer triggering the dynamic `SystemEstimateModal`.
10. `Footer.tsx`: Enterprise directory, legal disclosures, and compliance links.

### 2.2 Admin Subsystem Architecture
Located in `src/components/admin/`, the console features 27 specialized operational modules including:
- `AdminCrmView.tsx` & `AdminWhatsAppView.tsx`: Integrated sales pipeline, WhatsApp Business Cloud API message history, template dispatcher, and consent audit ledger.
- `CounterBillingTerminal.tsx`: Offline point-of-sale terminal for instant invoice generation, barcode/SKU scanning, and direct UPI QR presentation.
- `AdminDeploymentsView.tsx` & `AdminLicensesView.tsx`: SaaS license key generation and client infrastructure monitoring.

---

## 3. Forensic Findings & Architectural Defects

### Finding FE-01: Public Contact Phone Number Inconsistency (High)
* **Severity:** High
* **File:** `src/config/site.ts#L10`
* **Actual Problem:**
  `siteConfig.contact.phone` is hardcoded to a fictitious placeholder `'+91 98765 43210'`, whereas the backend production configuration (`application.properties#L77`) specifies the verified WhatsApp business number `+917684054872` and UPI merchant account.
* **Business / Technical Impact:**
  Visitors clicking telephone links (`tel:`) or copying contact numbers from the public footer will reach an invalid number, directly causing lead leakage and brand degradation.
* **Recommended Correction:**
  Update `src/config/site.ts#L10` to bind to `process.env.NEXT_PUBLIC_CONTACT_PHONE || '+91 76840 54872'`.
* **Dependencies & Risks:** Low risk; purely config update.
* **Verification Method:** Inspect rendered `Footer.tsx` and `Contact` page to ensure consistent official phone display.

---

### Finding FE-02: Duplicate Redirect Configuration in Next.js Config (Medium)
* **Severity:** Medium
* **File:** `next.config.ts#L70-L80`
* **Actual Problem:**
  The redirect table defines two consecutive, identical rules for `www.ohotech.com` to `https://ohotechn.com/:path*`:
  ```ts
  {
    source: '/:path*',
    has: [{ type: 'host', value: 'www.ohotech.com' }],
    destination: 'https://ohotechn.com/:path*',
    permanent: true,
  },
  {
    source: '/:path*',
    has: [{ type: 'host', value: 'www.ohotech.com' }],
    destination: 'https://ohotechn.com/:path*',
    permanent: true,
  }
  ```
* **Business / Technical Impact:**
  Next.js evaluates both identical redirect rules on incoming host headers. While non-fatal, it produces redundant middleware routing overhead on every non-canonical request.
* **Recommended Correction:**
  Remove the duplicate redirect block (lines 74–80) in `next.config.ts`.
* **Dependencies & Risks:** Zero risk.
* **Verification Method:** Execute `next build` and inspect generated routing manifests.

---

### Finding FE-03: Static Module-Level API Base URL Binding (Medium)
* **Severity:** Medium
* **File:** `src/api/client.ts#L13`
* **Actual Problem:**
  `export const API_BASE_URL = getApiBaseUrl();` is evaluated once when the module is imported. In line 71, token refresh calls `fetch(`${API_BASE_URL}/api/auth/refresh`, ...)` using this static constant rather than invoking `getApiBaseUrl()`, whereas standard requests in line 56 invoke `getApiBaseUrl()` dynamically.
* **Business / Technical Impact:**
  If client runtime variables are hydrated after initial bundle evaluation (or in testing harnesses where `process.env` changes), token refresh calls will target an outdated URL or empty string origin.
* **Recommended Correction:**
  Replace direct `API_BASE_URL` references in `src/api/client.ts` with `getApiBaseUrl()`.
* **Dependencies & Risks:** Low risk.
* **Verification Method:** Verify token refresh network requests in browser developer tools under custom API origins.

---

### Finding FE-04: Oversized In-Memory Client Bundle Data (Medium)
* **Severity:** Medium
* **Files:**
  - `src/config/work.ts` (61.7 KB)
  - `src/config/services.ts` (56.5 KB)
  - `src/config/insights.ts` (27.8 KB)
* **Actual Problem:**
  Detailed portfolio case studies, service specifications, and technical articles are stored as static in-memory TypeScript objects imported directly into client components.
* **Business / Technical Impact:**
  Increases the initial JavaScript parse and execution time by ~145 KB uncompressed on the client thread, negatively affecting First Contentful Paint (FCP) and Total Blocking Time (TBT).
* **Recommended Correction:**
  Migrate static content arrays into dynamic server-side loads or fetch them via backend REST endpoints (`/api/content/...`) with edge caching.
* **Dependencies & Risks:** Requires adding backend content controllers or Next.js server component data loaders.
* **Verification Method:** Run Lighthouse performance audit before and after splitting bundle data.

---

### Finding FE-05: Dormant Prisma Client Footprint in Package Manifest (Low)
* **Severity:** Low
* **File:** `package.json#L12`, `L26`
* **Actual Problem:**
  `@prisma/client` (`^7.9.1`) and `prisma` (`^7.9.1`) are installed dependencies, generating 50MB+ in `node_modules` and a generated stub in `src/generated/prisma/`, but forensic inspection proves **zero application files in `src/` import PrismaClient**. All database operations are executed via the Spring Boot JPA backend.
* **Business / Technical Impact:**
  Bloats CI dependency installation time and repository size without providing runtime value.
* **Recommended Correction:**
  Deprecate and remove Prisma dependencies during the Phase 2 cleanup once JPA schema ownership is formally codified.
* **Dependencies & Risks:** Low risk; ensure no auxiliary scripts invoke `prisma`.
* **Verification Method:** Grep workspace for `prisma` calls and verify `npm run build` succeeds after removal.
