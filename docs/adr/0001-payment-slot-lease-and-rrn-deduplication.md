# ADR 0001: Payment Slot Lease Allocation & Bank Credit Alert RRN Deduplication

## Status
Accepted

## Context
In OHO TECH's self-hosted UPI payment system (UPIHost), customers pay directly to the merchant's bank account via dynamic QR codes. To confirm transactions without manual reconciliation delays, an automated observer device captures incoming bank credit SMS/notification alerts and matches them against active payment leases.

Two core financial integrity hazards were identified:
1. **Paise/Slot Collision**: Concurrent customers paying identical amounts could be conflated.
2. **RRN/UTR Replay**: A malicious customer might submit an already matched or existing RRN/UTR to claim a second order for free.

## Decision
1. **Dynamic Slot Lease**: A `PaymentSlotLease` is acquired with a strict lease timeout (15 minutes). It reserves a unique paise offset or dynamic reference that identifies the exact incoming bank credit alert.
2. **Atomic RRN Matching**: When a customer submits an RRN or an alert is ingested:
   - The system verifies the alert's status is strictly unallocated/unmatched.
   - The alert and order are bound inside a database transaction with row-level locking (`SELECT ... FOR UPDATE`).
   - A unique constraint on `bank_credit_alert.rrn` and `payment_transaction.rrn` guarantees no RRN can ever be processed twice.
   - Any alert already marked `MATCHED` immediately rejects subsequent matching attempts (`SEC-01` remediation).

## Consequences
- **Positive**: Eliminates payment hijacking, double crediting, and concurrent transaction conflation.
- **Trade-off**: Requires customers to pay within the 15-minute lease window; expired leases must be explicitly renewed or re-created.
