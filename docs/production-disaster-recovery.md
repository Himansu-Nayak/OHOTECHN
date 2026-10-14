# OHO TECH Production Disaster Recovery & Restoration Runbook

## Overview
This runbook outlines operational response procedures for critical failure modes across the OHO TECH production infrastructure on the Hostinger VPS (`200.97.161.128`).

---

## 1. PostgreSQL Database Recovery

### Scenario: Database Corruption or Accidental Table Deletion
**Rule**: NEVER restore backups directly over a live, active database without verifying in an isolated instance first.

#### Step 1: Cease Application Writes
Temporarily halt incoming writes to prevent dirty state creation:
```bash
systemctl stop ohotech-backend
```

#### Step 2: Locate Latest Encrypted Backup
Backups are located under `/var/backups/postgresql/` named `ohotech_db_YYYYMMDD_HHMMSS.dump.enc`:
```bash
ls -lh /var/backups/postgresql/
```

#### Step 3: Decrypt Backup to Temporary Working File
```bash
openssl enc -d -aes-256-cbc -pbkdf2 \
  -pass file:/root/.db_backup_key \
  -in /var/backups/postgresql/<LATEST_BACKUP>.dump.enc \
  -out /tmp/restore_candidate.dump
chmod 600 /tmp/restore_candidate.dump
```

#### Step 4: Validate in an Isolated Database First
```bash
# Create temporary isolated validation database
echo "CREATE DATABASE ohotech_isolated_verify;" | su - postgres -c psql

# Restore dump into isolated database
su - postgres -c "pg_restore -d ohotech_isolated_verify /tmp/restore_candidate.dump"

# Verify table counts and records
echo "SELECT count(*) FROM users; SELECT count(*) FROM contact_enquiries;" | su - postgres -c "psql -d ohotech_isolated_verify"

# Clean up isolated validation database
echo "DROP DATABASE ohotech_isolated_verify;" | su - postgres -c psql
```

#### Step 5: Execute Production Restoration
Once integrity is confirmed:
```bash
# Terminate any remaining open connections to production database
echo "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'ohotech_db' AND pid <> pg_backend_pid();" | su - postgres -c psql

# Drop and recreate clean production database
echo "DROP DATABASE ohotech_db; CREATE DATABASE ohotech_db OWNER ohotech;" | su - postgres -c psql

# Restore from dump
su - postgres -c "pg_restore -d ohotech_db /tmp/restore_candidate.dump"

# Clean up temporary plaintext dump
rm -f /tmp/restore_candidate.dump
```

#### Step 6: Restart Backend & Verify
```bash
systemctl start ohotech-backend
curl -s https://api.ohotechn.com/api/health
```

---

## 2. Service Recovery Procedures

### Scenario A: Frontend (Next.js) Failure
- **Detection**: `https://ohotechn.com` returns 502 Bad Gateway.
- **Action**:
  ```bash
  pm2 status
  pm2 logs oho_tech --lines 50
  pm2 restart oho_tech
  ```
- **Verification**: `curl -sI https://ohotechn.com` returns HTTP 200.

### Scenario B: Backend (Spring Boot) Failure
- **Detection**: `https://api.ohotechn.com/api/health` returns 502 Bad Gateway or connection refused.
- **Action**:
  ```bash
  systemctl status ohotech-backend
  journalctl -u ohotech-backend -n 50 --no-pager
  systemctl restart ohotech-backend
  ```
- **Verification**: `curl -s https://api.ohotechn.com/api/health` returns `{"status":"UP"}`.

### Scenario C: Nginx Reverse Proxy Failure
- **Detection**: Both domains fail to establish TLS connections or drop traffic.
- **Action**:
  ```bash
  nginx -t
  systemctl restart nginx
  ```
- **Verification**: Verify UFW and port listeners: `ss -tulpn | grep -E ':(80|443)'`.

### Scenario D: Faulty Code Release
- **Frontend Rollback**:
  ```bash
  cd /home/ohotech/oho_tech
  git checkout <PREVIOUS_STABLE_COMMIT>
  npm run build
  pm2 restart oho_tech
  ```
- **Backend Rollback**:
  ```bash
  cd /opt/oho-tech/source/backend
  git checkout <PREVIOUS_STABLE_COMMIT>
  ./mvnw clean package -DskipTests
  systemctl restart ohotech-backend
  ```

---

## 3. Server Replacement / Catastrophic VPS Rebuild
In the event of complete VPS loss on Hostinger:
1. Provision fresh Ubuntu 24.04/26.04 VPS with identical IP (`200.97.161.128`) or update DNS A-records.
2. Install dependencies: `nginx`, `postgresql-16/18`, `openjdk-21-jdk`, `nodejs 20`, `pm2`, `certbot`.
3. Clone repository:
   - Frontend: `/home/ohotech/oho_tech`
   - Backend: `/opt/oho-tech/source`
4. Restore `/root/.db_backup_key` from secure offline password manager / secrets vault.
5. Download latest offsite `.dump.enc` archive, decrypt, and load into fresh `ohotech_db`.
6. Restore environment configs (`/opt/oho-tech/source/backend/.env` and `/home/ohotech/oho_tech/.env.local`).
7. Issue TLS certs via Certbot and start PM2 & Systemd services.
