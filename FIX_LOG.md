# Site Audit Fix Log

Branch: `fix/site-audit`
Date: 2026-10-15

## Checklist Status Overview

| ID | Category | Item | Status | Notes |
|---|---|---|---|---|
| P0.1 | Critical | Wrong domain everywhere | TODO | SITE_URL constant from NEXT_PUBLIC_SITE_URL (default `https://ohotechn.com`), eliminate `ohotech.com` |
| P0.2 | Critical | Contact details | BLOCKED | Awaiting user input: `REAL_PHONE` and `REAL_EMAIL` |
| P0.3 | Critical | Unverified proof | TODO | SHOW_TESTIMONIALS=false, hide unverified proof & metrics, /work noindex + placeholder |
| P1.1 | Important | Overpromising claims | TODO | Rewrite/remove "99.99%", "Sub-millisecond", "Zero-downtime", etc. Clarify code ownership |
| P1.2 | Important | Sitemap quality | TODO | Real routes, real lastmod, exclude private/noindex/non-200, no changefreq/priority |
| P1.3 | Important | robots.txt | TODO | Disallow both forms for admin, api, dashboard, cart, checkout, etc. Allow _next, SITE_URL sitemap |
| P1.4 | Important | Broken links and menu bugs | TODO | Fix duplicate category IDs, match Resources dropdown, crawler for internal links, 404 handler |
| P1.5 | Important | Positioning and page count | TODO | 6 services, 5 solutions, 301 redirects for removed URLs, brand "OHO TECH", primary CTA |
| P2.1 | Quality & Growth | Copy | TODO | SMB-focused hero, repo-accurate tech ticker, Go article rewrite/remove, author & date |
| P2.2 | Quality & Growth | Trust and company details | BLOCKED | Awaiting `LEGAL_ENTITY_NAME`, `REGISTERED_ADDRESS`, `GST_NUMBER`, `REAL_PHONE`, `REAL_EMAIL` |
| P2.3 | Quality & Growth | Products and demos | TODO | REAL_CLIENT_PROOF="none yet", PRODUCTS_WITH_LIVE_DEMO="none yet", PRICES_IN_INR="none yet" |
| P2.4 | Quality & Growth | Performance | TODO | Skippable preloader, lazy Three.js/WebGL with static fallback, mobile Lighthouse target |
| P2.5 | Quality & Growth | Security hygiene | TODO | Security headers (HSTS, CSP, etc.), rate limiting, spam protection |

## Execution Log

*(Entries added after each fix iteration)*
