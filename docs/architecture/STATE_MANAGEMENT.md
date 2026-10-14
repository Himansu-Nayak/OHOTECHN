# OHO TECH — State Management Architecture & Boundaries

**Status:** APPROVED & ACTIVE  
**Last Updated:** 2026-10-14  

---

## 1. Overview & Principles

OHO TECH employs a domain-bounded, pragmatic state management strategy that avoids unnecessary external state-library bloat (such as Redux or Zustand) while guaranteeing strict synchronization across user sessions, commerce carts, and transient UI interactions.

---

## 2. State Tiers & Ownership

### A. Global Application State (React Context)
1. **`AuthContext` (`src/context/AuthContext.tsx`):**
   - **Ownership:** User authentication lifecycle, JWT token retrieval, profile state, and login/logout orchestration.
   - **Persistence:** LocalStorage for access tokens (`accessToken`); in-memory for live `UserDto`.
2. **`CartContext` (`src/context/CartContext.tsx`):**
   - **Ownership:** Active cart itemization, quantity mutations, plan selections, and cart totals.
   - **Synchronization:** Persisted to LocalStorage for guest users and synced with the backend `/api/cart` endpoint for authenticated users.
3. **`ToastContext` (`src/context/ToastContext.tsx`):**
   - **Ownership:** Ephemeral notifications, feedback alerts, and auto-dismissing toast messages.

### B. Route / URL State (Next.js App Router)
- **Search & Filtering:** Software catalog categories, search queries, pagination offsets, and active tabs are stored in URL query parameters (`/products?category=...&page=...`) to ensure shareable, bookmarkable links.
- **Deep Linking:** Hash navigation (e.g. `#amount-payment-section`) for smooth scrolling to checkout and payment areas.

### C. Local Feature State (Hooks & Components)
- **Form States:** Controlled form inputs in checkout, lead capture, and contact enquiry forms.
- **Payment Verification States:** Ephemeral countdowns, QR generation, UTR entry, and celebratory animation states in `PaymentStatusFeedback.tsx`.
- **Modals & Drawers:** Toggled via localized `useState` in container components.

---

## 3. Data Synchronization Rules

1. **No Duplicate Single Sources of Truth:** Server state (e.g. product catalog, live order status) is fetched on demand and not duplicated across competing global stores.
2. **Payment Failure Recovery:** If a payment attempt fails or cancels, `CartContext` remains populated so the user can immediately select an alternative payment method without re-adding items.
3. **Cart Invalidation:** `clearCart()` is invoked only after an order has been successfully confirmed or placed.
