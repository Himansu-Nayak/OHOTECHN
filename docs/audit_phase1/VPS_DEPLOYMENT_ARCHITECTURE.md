# OHO TECH — Hostinger KVM 2 VPS Deployment Architecture Audit

**Target Environment:** Hostinger KVM 2 VPS (Plan KVM 2)  
**Specifications:** 2 vCPU cores, 8 GB RAM, 100 GB NVMe Storage, 8 TB Bandwidth, Ubuntu 22.04/24.04 LTS  
**Audit Scope:** Process Management, NGINX Reverse Proxy, Firewall, Memory Budgeting, and Disaster Recovery  

---

## 1. Target VPS Topology & Traffic Flow

```mermaid
flowchart TD
    WAN["Public Internet / DNS (ohotechn.com)"] -->|TCP 443 / 80| UFW["UFW Firewall (Allow: 22, 80, 443)"]
    UFW --> NGINX["NGINX 1.24+ (Reverse Proxy & TLS 1.3 Termination)"]
    
    subgraph LOCAL_LOOPBACK["VPS Localhost Isolation (127.0.0.1)"]
        NGINX -->|Path / (SSR, Static Assets)| PM2["PM2 Process Manager (Cluster: 2 Workers)<br/>Next.js 16 on 127.0.0.1:3000"]
        NGINX -->|Path /api/* (REST APIs & Webhooks)| SYSTEMD["systemd Service (ohotech-backend.service)<br/>OpenJDK 21 / Spring Boot on 127.0.0.1:8080"]
        SYSTEMD -->|JDBC Pool (HikariCP 10)| PG["PostgreSQL 17 Database on 127.0.0.1:5432"]
    end
```

---

## 2. Resource Allocation & Memory Budget (8 GB Ceiling)

| Component | CPU Allocation | Memory Budget | Notes |
| :--- | :--- | :--- | :--- |
| **Ubuntu Linux OS & Kernel** | Shared (0.2 vCPU) | **750 MB** | Systemd, journald, networking stack |
| **PostgreSQL 17 Database** | Shared (0.4 vCPU) | **1,500 MB** | `shared_buffers = 1GB`, `work_mem = 32MB` |
| **Spring Boot Application JAR** | Shared (0.7 vCPU) | **2,048 MB** | JVM flags: `-Xms1024m -Xmx2048m -XX:+UseG1GC` |
| **Next.js 16 Frontend (PM2)** | Shared (0.5 vCPU) | **1,200 MB** | 2 cluster worker threads (~600 MB each) |
| **NGINX Reverse Proxy** | Shared (0.2 vCPU) | **150 MB** | Gzip buffer caches, worker connections 1024 |
| **Free Operating Headroom** | Available reserve | **2,352 MB** | OS page cache, burst requests, backup jobs |
| **Total Allocation** | **2.0 vCPU** | **8,000 MB** | **Safe Operating Margin: >29% Headroom** |

---

## 3. Forensic Findings & Infrastructure Defects

### Finding INF-01: Discrepancy in Deployment Directories in GitHub Actions (High)
* **Severity:** High
* **File:** `.github/workflows/deploy.yml#L61-L66`
* **Actual Problem:**
  `deploy.yml` attempts to locate the project across three competing paths:
  ```bash
  DEPLOY_DIR="/opt/ohotech"
  SOURCE_DIR="/opt/oho-tech/source"
  if [ ! -d "$SOURCE_DIR" ]; then
    SOURCE_DIR="/home/ohotech/oho_tech"
  fi
  ```
  If directories are split across multiple user home roots, file permissions (`chown ohotech:ohotech`) become fragmented between root and non-root users.
* **Business / Technical Impact:**
  Automated deployment failures during git pull or JAR replacement due to permission denied (`EACCES`) errors.
* **Recommended Correction:**
  Standardize the production directory tree across the server:
  - Source & Build: `/opt/ohotech/source`
  - Runtime Deployment: `/opt/ohotech/current`
  - Database Backups: `/var/backups/ohotech`
* **Dependencies & Risks:** Low risk; purely organizational.
* **Verification Method:** Perform deployment dry-run and verify single canonical owner (`ohotech`).

---

### Finding INF-02: Missing Logrotate Configuration for PM2 and Spring Boot Logs (Medium)
* **Severity:** Medium
* **Files:** `.github/workflows/deploy.yml`, systemd definitions
* **Actual Problem:**
  Neither PM2 logs (`~/.pm2/logs/`) nor Spring Boot log streams have an automated `logrotate` configuration in `/etc/logrotate.d/ohotech`.
* **Business / Technical Impact:**
  Under high-volume WhatsApp webhook processing and application traffic, unrotated log files can silently consume all 100 GB of NVMe SSD space over months, eventually causing PostgreSQL disk write freezes.
* **Recommended Correction:**
  Install `pm2-logrotate` (`pm2 install pm2-logrotate`) and establish a systemd logrotate policy in `/etc/logrotate.d/ohotech` with 14-day retention and gzip compression.
* **Dependencies & Risks:** Operational task on VPS.
* **Verification Method:** Run `logrotate --force /etc/logrotate.d/ohotech` and check compressed `.gz` archives.
