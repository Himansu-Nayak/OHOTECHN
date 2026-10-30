# OHO TECH — Architecture Baseline Report

**Repository:** `https://github.com/Himansu-Nayak/OHOTECHN`  
**Current Branch:** `feat/crm-architecture-consolidation-production`  
**HEAD Commit:** `3b5109bf094120e9c019508cdb4addeb61140c04`  
**Author:** Himansu-Nayak <himansunayak183@gmail.com>  
**Remote Tracking:** `origin/feat/crm-architecture-consolidation-production` (Up to date)  
**Working Tree:** Clean (0 unstaged / uncommitted files)  
**Audit Phase:** Phase 1 — Comprehensive Read-Only Repository Architecture Discovery  
**Audit Timestamp:** October 30, 2026 — 11:35 IST  

---

## 1. Executive Summary

OHO TECH operates as an enterprise dual-tier hybrid monolith consisting of:
1. **Next.js 16 (React 19, TypeScript 5, Tailwind v4)** frontend client and public marketing application.
2. **Spring Boot 4.1.0 (OpenJDK 21, Spring Security 6, Spring Data JPA)** backend API service engine.
3. **PostgreSQL 17** transactional relational database running on default port 5432.
4. **NGINX Reverse Proxy** managing HTTPS routing, TLS termination, static asset compression, and backend microservice proxies.
5. **Hostinger KVM 2 VPS (2 vCPU, 8 GB RAM, 100 GB NVMe SSD)** as the validated target production infrastructure.

The codebase features advanced production modules including a 28-product turnkey commerce engine, self-hosted UPI QR checkout with observer alerts, an interactive Counter Billing POS terminal, an integrated multi-channel CRM with Meta WhatsApp Business Cloud API webhooks and Resend/SMTP email outbox, and zero-disk-leak PDF invoice streaming.

---

## 2. Git & Version Control Baseline

### 2.1 Branch Topology
- **Active Branch:** `feat/crm-architecture-consolidation-production`
- **Main Production Branch:** `main` (Last commit `0fd4abf`)
- **Active Feature Branches:**
  - `feat/crm-architecture-consolidation-production` (Current HEAD: WhatsApp Cloud API webhooks & duplicate protection)
  - `feat/self-hosted-upi-checkout-pos`
  - `feature/custom-support-platform`
  - `feature/scroll-3d-effects`
  - `feature/youpi-upi-prototype`
  - `fix/security-data-exposure`

### 2.2 Working Tree Integrity
- Uncommitted changes: `0`
- Untracked files: `0`
- Git working tree is completely clean and verified.

---

## 3. Technology Stack & Dependency Matrix

### 3.1 Frontend Dependencies (`package.json`)
| Package | Version | Classification | Purpose |
| :--- | :--- | :--- | :--- |
| `next` | `16.4.3` | Core Framework | App Router, SSR, Server-side API endpoints |
| `react` / `react-dom` | `19.2.8` | Core Library | Modern React runtime |
| `typescript` | `^5` | Language | Strict type definitions |
| `tailwindcss` | `^4` | Styling Engine | CSS design token styling |
| `@tailwindcss/postcss` | `^4` | PostCSS Plugin | Tailwind v4 compilation pipeline |
| `gsap` | `^3.15.0` | Animation Engine | ScrollTrigger and cinematic section sequencing |
| `three` / `@react-three/fiber` | `^0.186.0` / `^9.7.0` | 3D Graphics | WebGL panoramic hero experience |
| `lenis` | `^1.1.20` | Smooth Scroll | Momentum-based viewport scrolling |
| `lucide-react` | `^1.31.0` | UI Icons | SVG icon library (optimized via Next imports) |
| `@prisma/client` / `prisma` | `^7.9.1` | ORM Tooling | Legacy schema definition in `prisma/` (dormant in `src/`) |
| `qrcode` | `^1.5.4` | Utilities | Dynamic UPI QR code generation |
| `resend` | `^6.20.0` | Email SDK | Direct Next.js transactional email API |

### 3.2 Backend Dependencies (`backend/pom.xml`)
| Dependency | Version | Scope | Purpose |
| :--- | :--- | :--- | :--- |
| `spring-boot-starter-parent` | `4.1.0` | BOM Parent | Enterprise Java framework |
| `java.version` | `21` | Toolchain | Modern OpenJDK LTS |
| `spring-boot-starter-data-jpa` | `4.1.0` | Compile | Hibernate ORM persistence |
| `spring-boot-starter-security` | `4.1.0` | Compile | Stateless authentication & filter chain |
| `spring-boot-starter-webmvc` | `4.1.0` | Compile | REST controller dispatching |
| `spring-boot-starter-validation` | `4.1.0` | Compile | Jakarta bean validation (`@Valid`, `@NotNull`) |
| `spring-boot-starter-mail` | `4.1.0` | Compile | JavaMailSender for SMTP dispatch |
| `io.jsonwebtoken:jjwt-api` | `0.12.6` | Compile | JWT token generation and parsing |
| `com.google.firebase:firebase-admin`| `9.4.3` | Compile | Firebase authentication and token verification |
| `org.springdoc:springdoc-openapi-starter-webmvc-ui` | `2.8.5` | Compile | Swagger / OpenAPI 3 interactive documentation |
| `org.postgresql:postgresql` | Runtime | Runtime | PostgreSQL JDBC driver |
| `com.github.librepdf:openpdf` | `2.0.3` | Compile | In-memory stream PDF invoice generator |
| `com.razorpay:razorpay-java` | `1.4.8` | Compile | Razorpay payment gateway integration |
| `com.h2database:h2` | `2.x` | Test | In-memory test database fixture |

---

## 4. Root Directory Structure & File Map

```
c:\Users\himan\OneDrive\Desktop\oho_tech\
├── .github/                      # CI/CD Workflows (ci.yml, deploy.yml)
├── backend/                      # Spring Boot 4.1 Maven project
│   ├── src/main/java/com/ohotech/backend/
│   │   ├── adapter/              # Third-party integrations
│   │   ├── config/               # Security, Firebase, Swagger, Seeding configs
│   │   ├── controller/           # 44 REST controllers
│   │   ├── dto/                  # Request / Response DTOs
│   │   ├── entity/               # 55 JPA entities
│   │   ├── exception/            # Global exception handlers
│   │   ├── repository/           # 37 Spring Data JPA repositories
│   │   ├── security/             # JWT, filters, and authentication handlers
│   │   └── service/              # Core business services & submodules
│   ├── src/main/resources/       # application.properties & SQL patch scripts
│   └── pom.xml                   # Maven project descriptor
├── docs/                         # Architecture, audit, and deployment specs
├── prisma/                       # Prisma database schema definition (schema.prisma)
├── public/                       # Static public assets, logos, and illustrations
├── src/                          # Next.js 16 Application Codebase
│   ├── api/                      # 24 Typed API client service modules
│   ├── app/                      # Next.js 16 App Router (routes, layouts, API)
│   ├── components/               # UI components grouped by feature domain
│   ├── config/                   # Static site and navigation configuration
│   ├── context/                  # Client React contexts (Auth, Cart, UI)
│   ├── hooks/                    # Custom React hooks
│   └── utils/                    # Formatters and helper utilities
├── package.json                  # Node.js dependencies and build scripts
└── next.config.ts                # Next.js compiler and security headers config
```

---

## 5. Summary Baseline Finding

The repository has achieved architectural maturity with zero TypeScript compile errors and passing automated test suites. However, architectural discrepancies exist regarding:
1. Dormant Prisma dependencies in `package.json` while JPA manages PostgreSQL persistence.
2. Hardcoded fallback secrets in `application.properties`.
3. Redundant client redirect rules in `next.config.ts`.
4. Windows OneDrive environment race conditions on ephemeral `.next/` cache writes.

Subsequent reports detail specific findings across each layer.
