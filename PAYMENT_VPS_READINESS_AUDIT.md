# OHO TECH — Phase 12: Production VPS Readiness Audit

**Auditor:** Principal DevSecOps Engineer & Independent Infrastructure Security Auditor  
**Date:** 2026-10-31  
**Target Environment:** Hostinger Cloud VPS (`200.97.161.128`), Ubuntu 24.04 LTS  
**Audit Context:** Pre-Deployment Production Verification  
**Evaluation Rule:** If runtime access to live VPS is unavailable, mark checks **NOT VERIFIED**. Never print raw production credentials.  

---

## 1. Production Runtime Environment Check

| Component / Variable | Expected Production Value | Local Repo Template Evidence | Live VPS Verification Status |
|:---|:---|:---:|:---:|
| `CASHFREE_CLIENT_ID` | Production Merchant App ID | `.env.example#L37` | **NOT VERIFIED** (VPS access offline) |
| `CASHFREE_CLIENT_SECRET` | Production API Secret Key | `.env.example#L38` | **NOT VERIFIED** (VPS access offline) |
| `CASHFREE_WEBHOOK_SECRET` | Production Webhook HMAC Secret | `.env.example#L39` | **NOT VERIFIED** (VPS access offline) |
| `CASHFREE_ENVIRONMENT` | `PRODUCTION` | `.env.example#L40` | **NOT VERIFIED** (VPS access offline) |
| `APP_PAYMENT_CASHFREE_ENABLED` | `true` | `.env.example#L42` | **NOT VERIFIED** (VPS access offline) |
| `RAZORPAY_KEY_ID` | `rzp_live_...` | `.env.example#L33` | **NOT VERIFIED** (VPS access offline) |
| `RAZORPAY_KEY_SECRET` | Production Razorpay Secret | `.env.example#L34` | **NOT VERIFIED** (VPS access offline) |
| `RAZORPAY_WEBHOOK_SECRET` | Production Webhook Secret | `application.properties#L77` | **NOT VERIFIED** (VPS access offline) |
| `APP_PAYMENT_TEST_MODE` | `false` | Code default `false` | **NOT VERIFIED** (VPS access offline) |
| `APP_RAZORPAY_TEST_MODE` | `false` | Code default `false` | **NOT VERIFIED** (VPS access offline) |
| Database (`ohotech_db`) | PostgreSQL 18 on localhost:5432 | Verified compatible SQL scripts | **NOT VERIFIED** (VPS access offline) |
| Backend Systemd Service | `ohotech-backend.service` (Active) | Systemd unit template | **NOT VERIFIED** (VPS access offline) |
| Frontend PM2 Process | `oho_tech` (Next.js 16 cluster) | PM2 ecosystem template | **NOT VERIFIED** (VPS access offline) |
| Reverse Proxy & TLS | Nginx with Let's Encrypt SSL | Standard config template | **NOT VERIFIED** (VPS access offline) |
| Public Webhook Endpoints | `https://ohotechn.com/api/webhooks/cashfree` | Controller routes verified locally | **NOT VERIFIED** (Live DNS/SSL unreachable offline) |
| Nightly Cron Scheduler | 02:00 AM IST (`Asia/Kolkata`) | Verified in Spring context | **NOT VERIFIED** (VPS access offline) |

---

## 2. Infrastructure Verification Assessment

1. **Local Architecture Verification:**
   All configuration properties, environment variable injections (`@Value("${cashfree.client-id:${CASHFREE_CLIENT_ID:}}")`), and fallback mechanisms have been forensically verified in the source code.
2. **Network / Host Boundary:**
   In compliance with Rule 6 ("Do not deploy or modify the production VPS") and Rule 11 ("If VPS access is unavailable, mark these checks NOT VERIFIED"), the actual production values on the live VPS host `200.97.161.128` have not been altered or queried via direct external shell connections.
3. **Pre-Deployment Checklist for Operations Team:**
   Before promoting this release to live production traffic, the operations engineer must verify:
   ```bash
   # 1. Check systemd environment overrides
   sudo systemctl cat ohotech-backend.service
   
   # 2. Confirm NTP synchronization (required for 5-minute replay window)
   timedatectl status
   
   # 3. Confirm PostgreSQL 18 migration execution
   sudo -u postgres psql -d ohotech_db -c "\d payment_reconciliation_logs"
   sudo -u postgres psql -d ohotech_db -c "\d+ orders" | grep version
   sudo -u postgres psql -d ohotech_db -c "\d+ payments" | grep version
   ```

**Production VPS Readiness Verdict: NOT VERIFIED (STAGING PASS, LIVE CREDENTIAL AUDIT PENDING)**
