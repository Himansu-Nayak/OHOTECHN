# OHO TECH — Codebase Cleanup & Deprecation Audit Log

**Status:** ACTIVE & MAINTAINED  
**Last Updated:** 2026-10-14  

---

## 1. Cleanup Policy

No code or dependency is deleted based on guesswork or naive string searching. Every candidate for removal must pass a 6-step verification:
1. Identify candidate file, component, or utility.
2. Search all direct and indirect references.
3. Check framework discovery, Next.js routing, Spring Boot component scanning, and dynamic reflection.
4. Verify use in test suites, CI scripts, or deployment configurations.
5. Demonstrate redundancy or supersede status with verified proof.
6. Run full validation checks (`npx tsc`, `npm run lint`, `npm run build`, `mvn test`) before and after removal.

---

## 2. Completed Cleanups & Refactoring Actions

| Date | Target | Type | Action Taken | Rationale & Evidence |
|---|---|---|---|---|
| 2026-10-14 | `src/app/(marketing)/checkout/page.tsx` | Component Extraction | Extracted `PaymentStatusFeedback.tsx` | Decoupled animated feedback UI from 892-line checkout container. Preserved UTR/phone messaging. Verified with 122 pages build. |
| 2026-10-14 | `src/app/(marketing)/checkout/page.tsx` | Component Extraction | Extracted `CheckoutAmountBreakdown.tsx` | Decoupled cart itemization and price calculations according to ADR 002. Reduced checkout page size to 810 lines. |
| 2026-10-14 | `src/app/(marketing)/dashboard/page.tsx` | Bug Fix | Moved `realActivities` hook call above conditional return | Fixed React Hook rule violation (`react-hooks/rules-of-hooks`). |
| 2026-10-14 | `eslint.config.mjs` | Lint Config | Added `".agents/**"` to `globalIgnores` | Prevented false-positive lint errors on agent skills assets. `npm run lint -- --quiet` now passes with 0 errors. |
| 2026-10-14 | `src/api/types.ts` | Type Modularization (FE-03) | Split into 14 domain modules under `src/api/types/` | Replaced 887-line monolith with domain-bounded modules while preserving 100% backward compatibility via root re-exporter. |
| 2026-10-14 | `src/app/(marketing)/products/[id]/page.tsx` | Component Extraction (FE-04) | Extracted `ProductTechnicalTabs.tsx`, `ProductEngineeringCallout.tsx`, `ProductPurchaseSuccessSection.tsx` | Extracted 355 lines of technical architecture tabs, post-purchase modal/licensing display, and engineering callout. Cleaned dead `faqs` state. Reduced page from 1615 to 1070 lines. Build: 122/122 pages passed. |

---

## 3. Candidates Under Evaluation (Non-Destructive)

| Candidate | Location | Current Role | Recommendation |
|---|---|---|---|
| `src/lib/api.ts` | Compatibility shim | Re-exports `src/api/client.ts` | Retain as zero-overhead backward-compatibility re-export shim to protect external/dynamic consumers (ADR 001). |
