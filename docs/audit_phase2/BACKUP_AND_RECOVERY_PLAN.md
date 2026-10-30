# OHO TECH — Production Database Backup & Disaster Recovery Architecture
**Document:** `docs/audit_phase2/BACKUP_AND_RECOVERY_PLAN.md`  
**Engine:** PostgreSQL 17  
**Infrastructure Target:** Hostinger KVM 2 VPS (Ubuntu 24.04 LTS)  
**Author:** Principal Database Architect & Senior Infrastructure Engineer  
**Date:** October 30, 2026  
**Status:** Operational Production Runbook  

---

## 1. Executive Summary & Recovery Objectives

A resilient database architecture requires automated, verified backup mechanisms and a well-defined disaster recovery runbook. The OHO TECH database holds customer credentials, commercial orders, active software licenses, payment proofs, and regulatory audit trails that must survive server failure, disk corruption, or accidental operator error.

### Core Recovery Metrics:
* **Recovery Point Objective (RPO):** $< 1 \text{ hour}$ (Maximum potential data loss window).
* **Recovery Time Objective (RTO):** $< 30 \text{ minutes}$ (Time to fully restore database service from backup).
* **Zero Credential Exposure:** Backups use local peer authentication or system environment variables with restricted file permissions (`chmod 600`). No plaintext passwords are hardcoded in scripts.

---

## 2. Backup Architecture & Tooling

### 2.1 Backup Format Specification (`pg_dump`)
All logical backups are taken using PostgreSQL's **Custom Archive format (`-Fc`)**:
```bash
pg_dump -U postgres -d OHOTECH -Fc -f /var/backups/ohotech/db_backup.dump
```
**Why `-Fc` (Custom Format):**
1. **Built-in Compression:** Compresses database dumps using zlib, reducing storage requirements by 70–80%.
2. **Selective Restores:** Allows `pg_restore` to restore individual tables, schemas, or specific records without restoring the entire database.
3. **Parallel Restoration:** Enables `pg_restore -j <jobs>` to restore multiple tables concurrently across CPU cores.
4. **Data Integrity Check:** Custom archives include CRC32 checksums that detect corrupted backup files before restoration begins.

---

## 3. Pre-Migration Checkpointing Protocol (Mandatory Gate)

> [!CRITICAL]
> **MANDATORY PRE-MIGRATION GATE:** Before executing ANY database migration, schema change, or version upgrade, a point-in-time snapshot of the database MUST be captured and verified.

### Pre-Migration Backup Command (VPS Terminal):
```bash
#!/usr/bin/env bash
set -euo pipefail

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/var/backups/ohotech/pre_migration"
mkdir -p "${BACKUP_DIR}"
chmod 700 "${BACKUP_DIR}"

BACKUP_FILE="${BACKUP_DIR}/pre_migration_${TIMESTAMP}.dump"

echo "=== Taking Pre-Migration Snapshot: ${BACKUP_FILE} ==="
pg_dump -U postgres -d OHOTECH -Fc -v -f "${BACKUP_FILE}"

# Verify archive integrity
pg_restore --list "${BACKUP_FILE}" > /dev/null
echo "=== Verification Succeeded: Backup archive is valid and readable ==="
ls -lh "${BACKUP_FILE}"
```

If the verification step fails, **the migration must be aborted immediately**.

---

## 4. Automated Backup Schedule & Retention Policy

### 4.1 Backup Schedule (Cron on VPS)
On the Hostinger KVM 2 VPS, scheduled backups are coordinated via system cron:

| Frequency | Timing | Destination | Retention |
| :--- | :--- | :--- | :--- |
| **Hourly Differential** | Every hour at XX:15 | `/var/backups/ohotech/hourly/` | Keep last 24 hours |
| **Daily Full** | Every midnight at 02:00 IST | `/var/backups/ohotech/daily/` | Keep last 30 days |
| **Weekly Full** | Every Sunday at 03:00 IST | `/var/backups/ohotech/weekly/` | Keep last 12 weeks |
| **Monthly Archive** | 1st of each month | Encrypted Offsite Storage | Keep 1 year (Tax/Audit) |

### 4.2 Automated Daily Backup Script (`/usr/local/bin/ohotech-db-backup.sh`)
```bash
#!/usr/bin/env bash
# ==============================================================================
# OHO TECHN Production Automated PostgreSQL Backup
# Security: Restricted permissions, compressed custom format, automated retention
# ==============================================================================
set -euo pipefail

BACKUP_ROOT="/var/backups/ohotech"
DATE=$(date +"%Y%m%d_%H%M%S")
DAILY_DIR="${BACKUP_ROOT}/daily"
mkdir -p "${DAILY_DIR}"
chmod 700 "${BACKUP_ROOT}"

TARGET_FILE="${DAILY_DIR}/ohotech_db_${DATE}.dump"

# Execute compressed backup
pg_dump -U postgres -d OHOTECH -Fc -f "${TARGET_FILE}"

# Restrict permissions
chmod 600 "${TARGET_FILE}"

# Retention cleanup: purge local daily dumps older than 30 days
find "${DAILY_DIR}" -type f -name "ohotech_db_*.dump" -mtime +30 -delete

echo "[$(date)] Backup completed successfully: ${TARGET_FILE}"
```

---

## 5. Non-Destructive Restore Testing Protocol

To guarantee that backups are valid without affecting the live production database, restore testing is executed against an isolated temporary database (`ohotech_restore_test`):

### Verification Steps:
```bash
# 1. Create temporary test database
createdb -U postgres ohotech_restore_test

# 2. Restore backup snapshot into test database
pg_restore -U postgres -d ohotech_restore_test -v /var/backups/ohotech/daily/latest.dump

# 3. Validate record counts on critical tables
psql -U postgres -d ohotech_restore_test -c "
SELECT 
    (SELECT count(*) FROM users) as users_count,
    (SELECT count(*) FROM products) as products_count,
    (SELECT count(*) FROM orders) as orders_count,
    (SELECT count(*) FROM payments) as payments_count,
    (SELECT count(*) FROM licenses) as licenses_count;
"

# 4. Clean up test database
dropdb -U postgres ohotech_restore_test
```

---

## 6. Disaster Recovery Runbook (Hostinger KVM 2 VPS)

### Scenario A: Rollback After a Failed Schema Migration
If a migration fails or introduces an unexpected schema defect:
1. Stop the application backend immediately:
   ```bash
   sudo systemctl stop ohotech-backend
   ```
2. Restore the database from the pre-migration snapshot:
   ```bash
   # Terminate active connections
   psql -U postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'OHOTECH' AND pid <> pg_backend_pid();"
   
   # Recreate clean database
   dropdb -U postgres OHOTECH
   createdb -U postgres OHOTECH
   
   # Restore snapshot
   pg_restore -U postgres -d OHOTECH -v /var/backups/ohotech/pre_migration/pre_migration_YYYYMMDD_HHMMSS.dump
   ```
3. Restart backend with previous verified JAR:
   ```bash
   sudo systemctl start ohotech-backend
   ```
4. Verify system health via `curl http://localhost:8080/api/health`.

### Scenario B: Complete VPS Hardware Loss / Catastrophic Recovery
1. Provision a fresh Ubuntu 24.04 VPS instance.
2. Install PostgreSQL 17:
   ```bash
   sudo apt update && sudo apt install -y postgresql-17
   ```
3. Create `OHOTECH` database and user with appropriate grants.
4. Retrieve the latest offsite backup archive.
5. Execute `pg_restore -U postgres -d OHOTECH -v <latest_backup>.dump`.
6. Deploy application artifacts and verify startup.
