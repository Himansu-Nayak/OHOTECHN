# OHO TECH Reseller Marketplace — Deployment & Provisioning Workflow

## 1. Operational Lifecycle
The OHO TECH software provisioning pipeline models real infrastructure tasks executed by systems engineers, rejecting simulated or fake cloud launch bars.

```
+----------------------------------------------------------------------------+
|                             CUSTOMER ORDER                                 |
+----------------------------------------------------------------------------+
                                      |
                                      v
+----------------------------------------------------------------------------+
|             VERIFIED PAYMENT (Razorpay SDK / Offline Approved UTR)          |
+----------------------------------------------------------------------------+
                                      |
                 +--------------------+--------------------+
                 |                                         |
                 v                                         v
   [ Subscription Created ]                     [ License Key Generated ]
                 |                                         |
                 +--------------------+--------------------+
                                      |
                                      v
+----------------------------------------------------------------------------+
|                   DEPLOYMENT RECORD INITIALIZED (PENDING)                  |
|    - Associated: Order, Product, User, License                            |
|    - Dispatch: SoftwareProvisioningService -> Provider Strategy           |
+----------------------------------------------------------------------------+
                                      |
                                      v
+----------------------------------------------------------------------------+
|                    DEVELOPER / OPERATIONS QUEUE (/developer)               |
|                                                                            |
|  1. ASSIGN              -> Sets assigned engineer                          |
|  2. START CONFIGURATION -> Allocates VPS container/subdomain (CONFIGURING) |
|  3. MARK TESTING        -> Verifies database migrations & SSL (TESTING)    |
|  4. MARK READY          -> QA verified, ready for release (READY)          |
|  5. MARK LIVE           -> Sets accessUrl and customer handoff (LIVE)      |
+----------------------------------------------------------------------------+
                                      |
                                      v
+----------------------------------------------------------------------------+
|                     CUSTOMER PORTAL (/my-products)                         |
|  - Real-time status badge                                                  |
|  - One-click [ LAUNCH APPLICATION ] CTA                                    |
|  - Handover documentation & support links                                  |
+----------------------------------------------------------------------------+
```

---

## 2. Provisioning Strategy Handlers (`SoftwareProvisioningProvider`)

1. **Manual Provisioning Provider (`MANUAL`)**:
   - Default for software without external automation APIs.
   - Enqueues to the internal DevOps queue. Displays honest instructions: *"Queued for operational engineering assignment."*
2. **Dedicated Instance Provider (`DEDICATED_INSTANCE`)**:
   - Initiates isolated VPS container provisioning and static IP allocation.
3. **Hosted SaaS Provider (`HOSTED_SAAS`)**:
   - Manages tenant space allocation and organization workspace activation.
4. **API Provisioning Provider (`API`)**:
   - Dispatches programmatic requests to agency APIs when endpoints and credentials are provided. If unconfigured, falls back to manual queue safely.
5. **Webhook Provisioning Provider (`WEBHOOK`)**:
   - Fires fulfillment payloads to provider webhooks.

---

## 3. Operational State Machine Validation
| Action | Initial State | Target State | Required Inputs |
| :--- | :--- | :--- | :--- |
| `ASSIGN` | `PENDING` | `ASSIGNED` | `assignedEngineer` |
| `START_CONFIGURATION` | `ASSIGNED` | `CONFIGURING` | None |
| `MARK_TESTING` | `CONFIGURING` | `TESTING` | None |
| `MARK_READY` | `TESTING` | `READY` | None |
| `MARK_LIVE` | `READY` | `LIVE` | `accessUrl` |
| `SUSPEND` | Any | `SUSPENDED` | `adminNotes` |
| `CANCEL` | Any | `CANCELLED` | `adminNotes` |
