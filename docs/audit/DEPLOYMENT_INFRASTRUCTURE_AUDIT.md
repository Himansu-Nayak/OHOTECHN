# OHO TECH — Deployment & Infrastructure Forensic Audit Report

**Audit Target:** Hostinger VPS `200.97.161.128` (srv2000528)  
**Date:** 2026-10-14  
**Auditor:** DevOps & Infrastructure Engineering Team  

---

## 1. Production Topology & Service Map

```
Internet (HTTPS 443)
       │
       ▼
[ NGINX 1.28.3 Reverse Proxy ]
       ├── api.ohotechn.com ───> 127.0.0.1:8080 (Spring Boot JAR / Java 21 / systemd)
       └── ohotechn.com     ───> 127.0.0.1:3000 (Next.js 16.3 / PM2 App 0 / root)
                                         │
                                         ▼
                            [ PostgreSQL 18-main :5432 ]
```

---

## 2. Infrastructure Findings

### [INF-001] Single Point of Failure: No Offsite Backup Replication
- **Severity:** High
- **Confidence:** Confirmed
- **Evidence:** Encrypted database dumps (`ohotech_db_*.dump.enc`) are written only to local `/var/backups/postgresql/` on `/dev/sda1`.
- **Impact:** Server disk failure or accidental VPS deletion permanently destroys both live data and backups.
- **Fix:** Add an `rclone` or AWS S3 upload step in `/usr/local/sbin/ohotech-db-backup.sh`.

### [INF-002] Dual Source Repositories on VPS
- **Severity:** High
- **Confidence:** Confirmed
- **Evidence:** Two separate clones exist on the server: `/opt/oho-tech/source` (used for backend build) and `/home/ohotech/oho_tech` (used for frontend build).
- **Impact:** Manual deployment to two directories increases the risk of desynchronized API contracts and build drift.
- **Fix:** Standardize on a single canonical repository path.

### [INF-003] Next.js Running Under `root` via PM2
- **Severity:** High
- **Confidence:** Confirmed
- **Evidence:** `pm2 describe 0` shows user `root` executing `npm start`.
- **Impact:** Severe privilege escalation vulnerability if an SSRF or RCE vulnerability is exploited in Next.js.
- **Fix:** Run PM2 under dedicated unprivileged user `ohotech`.

### [INF-004] Zero Swap Space Configured
- **Severity:** Medium
- **Confidence:** Confirmed
- **Evidence:** `free -m` reports `Swap: total 0, used 0, free 0`.
- **Impact:** Sudden memory spikes during Maven builds or Next.js SSR bursts can trigger Linux OOM termination of PostgreSQL or Spring Boot.
- **Fix:** Provision a 4 GB swapfile with `vm.swappiness=10`.
