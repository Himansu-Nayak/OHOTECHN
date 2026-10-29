# OHO TECH — Self-Hosted UPI Checkout & Merchant Payment Operations
## Threat Model & Security Posture

### 1. Adversary Analysis & Attack Vectors

| Attack Vector | Vulnerability / Threat | Mitigation Strategy | Verification Mechanism |
|---|---|---|---|
| **OTP Brute-Force** | Attacker attempts to guess 6-digit verification code. | Max 3 incorrect attempts locks the verification request. 60-second cooldown on resends. 5-minute expiry. Cryptographically secure `SecureRandom`. | Integration tests asserting lockout on 4th attempt; HTTP 429 on rapid requests. |
| **Cleartext OTP Leak** | Attacker reads database or log files to obtain active OTPs. | Store salted SHA-256 hash in database (`otp_hash`). Zero raw OTP logged in application stdout/files or frontend responses. | Code audit and test asserting `otp_hash` differs from plaintext. |
| **Slot Race & Starvation** | Malicious users spam checkout to monopolize the direct VPA queue slot. | Slots expire automatically after 10 minutes (`lease_expires_at`). IP & user rate limiting. Customer must hold a valid unfulfilled order. | Concurrency tests testing simultaneous slot acquisition. |
| **Forged Observer Alerts** | Attacker sends fake HTTP POST claiming a bank credit of ₹10,000. | All observer requests require a cryptographically hashed device bearer token (`ObserverDevice`) registered by an Admin. Token is checked in constant time. | Unit/Integration tests verifying 401 Unauthorized for invalid device tokens. |
| **Replay of Bank Alerts** | Attacker intercepts a valid bank alert and replays it to credit a second order. | Unique database constraint on `bank_credit_alerts.rrn` (`uk_bank_alert_rrn`). Duplicate deliveries are flagged as `DUPLICATE` without credit. | Replay test verifying HTTP 200 with `DUPLICATE` status and zero duplicate entitlement creation. |
| **Price Tampering** | Customer modifies client-side payload to pay ₹1 for a ₹9,999 software suite. | Amount is strictly sourced from server-side `Order.totalAmount` in PostgreSQL. Browser-provided amount is ignored. | Server-side validation rejecting any amount differing from order record. |
| **Counter Billing Theft** | Unauthorized employee records false card payments. | Endpoint requires `ROLE_ADMIN`. Cashier user ID, timestamp, and external card terminal transaction ref are permanently logged to audit tables. | Role-based access control tests. |

---

### 2. Secrets Management & Isolation
- Real merchant VPA keys, observer tokens, and webhook secrets reside exclusively in environment variables (`UPI_ID`, `OBSERVER_SECRET`, etc.).
- Automated test runs strictly utilize local H2 in-memory databases and mock fixtures. Zero real money or live SMS/WhatsApp traffic is generated during QA.
