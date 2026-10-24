# YouPI-PG UPI Prototype — OHO TECH

Status: **disabled by default; prototype only; not approved for production**.

This integration calls the separately deployed YouPI-PG merchant REST API. It does not copy YouPI-PG source into OHO TECH. The upstream repository currently describes itself as experimental and lists a commercial license; obtain written permission and the applicable terms before use or redistribution.

## Existing production behaviour

- Existing Razorpay endpoints and checkout remain unchanged.
- Existing direct-UPI/UTR flow remains unchanged.
- The prototype endpoint is separate: `POST /api/payments/youpi/create-order`.
- The webhook endpoint is separate: `POST /api/payments/youpi/webhook`.
- `app.payment.youpi-enabled` defaults to `false`. Do not enable it for real customer payments.

## Configuration (server-side only)

Set these environment variables only in an isolated development environment:

- `YOUPI_ENABLED=false`
- `YOUPI_BASE_URL=https://your-isolated-youpi-api.example`
- `YOUPI_CHECKOUT_BASE_URL=https://your-isolated-youpi-checkout.example`
- `YOUPI_MERCHANT_ID=`
- `YOUPI_MERCHANT_API_KEY=`
- `YOUPI_WEBHOOK_SECRET=`

Do not commit values, add them to `NEXT_PUBLIC_*`, embed them in browser bundles, or put them in Android apps. Use HTTPS outside localhost.

## Flow

1. Authenticated customer requests a session for their own OHO order.
2. Backend loads the order from the database and derives the INR amount; browser-supplied amounts are never accepted.
3. Backend calls `POST /api/v1/payments` with a stable `OHO-{orderId}` external order ID, merchant credentials, and idempotency key.
4. Backend stores the returned session ID and returns the hosted checkout URL.
5. YouPI calls the OHO webhook. OHO verifies HMAC-SHA256 against the **raw request bytes** using constant-time comparison, checks the delivery ID, session ID, OHO order mapping, INR amount, and currency.
6. Only a valid signed `SUCCESS` event marks payment successful and confirms the order. Browser events and customer-submitted UTRs are not payment proof.

## Known gaps / gates before enabling

- No licence grant has been verified. Written permission and legal review are required.
- YouPI-PG describes itself as experimental, not bank/NPCI-certified, audited, or production-ready. Obtain qualified compliance advice and confirmation from the receiving bank before any live-money use.
- Independently audit YouPI observer, device pairing, session access, API authentication, webhook retry behaviour, privacy and retention.
- Verify that the exact upstream build supports the configured merchant API key and webhook secret.
- Add integration tests for bad signatures, duplicate delivery IDs, amount/currency mismatch, cross-user order access, replay, expired sessions, and concurrent requests.
- Test a successful signed webhook end-to-end against an isolated test deployment. The current prototype must not be treated as verified until those tests pass.
- Confirm the project builds with the repository's exact Java/Spring versions and run the full backend test suite before merge.

## Upstream contract references

- Merchant integration guide: https://github.com/youpi-pg/YouPI-PG/blob/main/docs/MERCHANT_INTEGRATION.md
- API specification: https://github.com/youpi-pg/YouPI-PG/blob/main/openapi.yaml
- Upstream risk notice: https://github.com/youpi-pg/YouPI-PG
