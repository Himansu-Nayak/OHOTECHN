# OHO TECH — Self-Hosted UPI Checkout & Merchant Payment Operations
## Implementation Plan

### Phase 1: Database Schema & Entity Enhancements
- [x] Create schema migration `schema_update_self_hosted_upi.sql`:
  - `payment_slot_leases`: Table for FIFO slot leasing per merchant VPA with lease expiry, active order ID, and status (`ACTIVE`, `EXPIRED`, `RELEASED`).
  - `observer_devices`: Table for authenticated mobile/companion observation devices with bearer API token hash, device name, status, last ping.
  - `bank_credit_alerts`: Table for incoming raw bank notifications (SMS/email/push) with amount, RRN / UTR, sender, timestamp, matched payment ID, status (`PENDING`, `MATCHED`, `AMBIGUOUS`, `DUPLICATE`).
  - Add counter billing fields to `payments`: `cashier_user_id`, `cash_tendered`, `change_returned`, `card_terminal_ref`, `card_terminal_id`.
- [x] Create JPA entities:
  - `PaymentSlotLease.java`
  - `ObserverDevice.java`
  - `BankCreditAlert.java`
- [x] Create Spring Data JPA Repositories:
  - `PaymentSlotLeaseRepository.java`
  - `ObserverDeviceRepository.java`
  - `BankCreditAlertRepository.java`

### Phase 2: Phone Verification & WhatsApp OTP Abstraction
- [x] Define `OtpDeliveryService.java` interface with methods: `sendOtp(String phone, String otpCode, String purpose)`.
- [x] Implement `WhatsAppBusinessOtpService.java` for production cloud delivery.
- [x] Implement `DevTestOtpDeliveryService.java` for development and deterministic test sinks.
- [x] Build `PhoneVerificationService.java`:
  - Cryptographically secure 6-digit OTP (`SecureRandom`).
  - SHA-256 hash storage in `otp_verifications`.
  - Rate limiting (max 3 attempts, 60-second resend cooldown, 5-minute expiry).
  - Single-use consumption invalidation.
- [x] Build `PhoneVerificationController.java` (`/api/auth/phone-otp`):
  - `POST /request`: Request phone verification OTP.
  - `POST /verify`: Verify submitted OTP code.

### Phase 3: Self-Hosted UPI Payment Engine & Slot Queue
- [x] Build `SelfHostedUpiService.java`:
  - Dynamic NPCI UPI URI generation: `upi://pay?pa=...&pn=...&am=...&cu=INR&tn=...&tr=...`
  - Deep-link intent generator for GPay, PhonePe, Paytm, BHIM, Navi, Cred.
  - FIFO slot lease manager: Acquires 10-minute lease slot for direct VPA settlement, cleans up expired slots atomically.
  - One-active-payment check: Idempotently returns existing active payment or initiates single slot attempt.
- [x] Build `UpiCheckoutController.java` (`/api/payments/upi`):
  - `POST /initiate`: Initiates or resumes self-hosted UPI checkout attempt.
  - `GET /status/{paymentId}`: Real-time payment session status check.
  - `POST /submit-utr`: Customer UTR submission and immediate match attempt.
  - `POST /cancel/{paymentId}`: Releases settlement slot lease.

### Phase 4: Bank Alert Observer Ingestion
- [x] Build `PaymentObservationService.java`:
  - Validates observer device bearer token (`ObserverDevice`).
  - Ingests incoming bank credit alert with RRN / UTR deduplication.
  - Matches alert against active payment slot lease or recent pending order.
  - Automatically transitions payment to `SUCCESSFUL` and triggers entitlement provisioning upon high confidence.
  - Transitions to `RECONCILIATION_REQUIRED` for ambiguous amounts.
- [x] Build `PaymentObserverController.java` (`/api/payments/observers`):
  - `POST /alerts`: Authenticated bank alert ingestion endpoint.
  - `POST /heartbeat`: Device telemetry and health check.

### Phase 5: Counter Billing (Cash & Card POS)
- [x] Build `CounterBillingService.java`:
  - Cash payment recording with cash tendered, change due calculation, and cash drawer balance log.
  - Card terminal transaction recording with external terminal reference and terminal ID.
  - Instant in-person counter QR bill generation.
  - Automatic entitlement provisioning for counter sales.
- [x] Build `CounterBillingController.java` (`/api/admin/counter-billing`):
  - Protected with `ROLE_ADMIN` / cashier permissions.
  - `POST /cash`: Process cash counter sale.
  - `POST /card`: Process card terminal counter sale.
  - `GET /terminal-status`: Current cash drawer and counter sales statistics.

### Phase 6: Frontend Self-Hosted Checkout & POS UI
- [x] Enhance `/checkout` page with:
  - Phone OTP verification modal (WhatsApp/SMS).
  - High-contrast dynamic QR generator with countdown timer.
  - Mobile quick-pay intent launcher with verified app links (GPay, PhonePe, Paytm, BHIM).
  - Copyable VPA, Amount, and Order Note buttons.
  - Real-time polling feedback state machine (`Awaiting Payment` -> `Verifying` -> `Confirmed`).
- [x] Build `CounterBillingTerminal.tsx` in Admin Console (`/admin?tab=counter-billing` or modal).

### Phase 7: Automated Integration Tests & Browser Verification
- [x] Create comprehensive Spring Boot integration test suite: `SelfHostedUpiPaymentTests.java`.
- [x] Verify phone verification rate limits, SHA-256 hash validation, and single-use consumption.
- [x] Verify slot lease acquisition, timeout expiration, and release.
- [x] Verify observer ingestion and automated order fulfillment.
- [x] Run headless browser QA script with Puppeteer to verify `/checkout` and admin counter billing screens.
