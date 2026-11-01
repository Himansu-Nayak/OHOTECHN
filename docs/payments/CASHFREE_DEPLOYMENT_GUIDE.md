# Cashfree Production Deployment & Operational Guide

**System**: OHO TECH Platform  
**Target Environment**: Hostinger Ubuntu VPS (`200.97.161.128`) & Vercel  
**Date**: November 1, 2026  
**Status**: PRODUCTION READY (AWAITING USER AUTHORIZATION FOR LIVE KEYS)  

---

## 1. Production Architecture Endpoints

| Component | Target URL | Protocol & Ports | Supervision |
|---|---|---|---|
| **Frontend** | `https://ohotechn.com` | HTTPS (Port 443) / Next.js (Port 3000) | Vercel / PM2 (`oho_tech`) |
| **Backend API** | `https://api.ohotechn.com` | HTTPS (Port 443) / Spring Boot (Port 8080) | Systemd (`ohotech-backend.service`) |
| **Cashfree Webhook URL** | `https://api.ohotechn.com/api/webhooks/cashfree` | HTTPS POST (Port 443) | Spring Boot (`CashfreeWebhookController`) |

---

## 2. Cashfree Merchant Dashboard Configuration

To receive production webhooks and authorize transactions, configure the following in the official Cashfree Merchant Dashboard (`https://merchant.cashfree.com`):

1. **Navigate to**: `Payment Gateway` → `Developers` → `Webhooks`.
2. **Add Webhook Endpoint**:
   - **URL**: `https://api.ohotechn.com/api/webhooks/cashfree`
   - **API Version**: `2025-01-01`
   - **Events Subscribed**:
     - `PAYMENT_SUCCESS_WEBHOOK`
     - `PAYMENT_FAILED_WEBHOOK`
     - `PAYMENT_USER_DROPPED_WEBHOOK`
     - `REFUND_STATUS_WEBHOOK`
3. **Webhook Secret**:
   - Copy the generated Webhook Secret from the Cashfree dashboard into the VPS backend environment.

---

## 3. Hostinger VPS Environment Setup

In the VPS systemd configuration `/etc/systemd/system/ohotech-backend.service.d/override.conf` (or `/etc/environment`):

```bash
# Cashfree Production Environment Variables
Environment="CASHFREE_APP_ID=134622058f170bb82c5576251370226431"
Environment="CASHFREE_SECRET_KEY=cfsk_ma_prod_••••••••••••••••••••••••••••••••_adbecfed"
Environment="CASHFREE_WEBHOOK_SECRET=<copied-from-cashfree-dashboard>"
Environment="CASHFREE_ENVIRONMENT=PRODUCTION"
Environment="CASHFREE_API_VERSION=2025-01-01"
Environment="PAYMENT_CASHFREE_ENABLED=true"
```

Reload and restart the backend service:
```bash
sudo systemctl daemon-reload
sudo systemctl restart ohotech-backend.service
sudo journalctl -u ohotech-backend.service -f
```

---

## 4. Database Migration Execution

If deploying to an environment where the migration has not yet been executed:
```bash
psql -U postgres -d ohotech_db -f backend/src/main/resources/schema_update_cashfree.sql
```
This applies:
- `cashfree_order_id VARCHAR(255)` with index `idx_payments_cashfree_order_id`
- `cashfree_payment_id VARCHAR(255)` with index `idx_payments_cashfree_payment_id`

---

## 5. Pre-Cutover Verification Checklist

1. [ ] Database migration applied and verified in PostgreSQL.
2. [ ] Environment variables populated without trailing whitespace.
3. [ ] Webhook URL registered in Cashfree Dashboard.
4. [ ] Backend health check confirms `Cashfree connection authenticated (LIVE MODE)`.
5. [ ] Frontend checkout card renders `Cashfree PG (₹ INR)`.
6. [ ] User explicitly approves production key activation.

---

## 6. Rollback Procedure

If Cashfree experiences provider-side degradation or unexpected errors:

### Immediate Mitigation (Zero Downtime)
Disable Cashfree without redeploying code:
```bash
# In VPS environment:
Environment="PAYMENT_CASHFREE_ENABLED=false"
sudo systemctl restart ohotech-backend.service
```
This leaves Razorpay, UPIHost, Direct UPI, and COD fully operational.

### Database Rollback
The added columns in `payments` are nullable and non-destructive. No table rollback is required.
