#!/bin/bash
set -e

sudo -u postgres psql -d ohotech_db -P pager=off << 'SQL'
\echo '=== 1. ORPHAN CHECK: ORDERS WITHOUT USERS ==='
SELECT count(*) AS orphaned_orders FROM orders o LEFT JOIN users u ON o.user_id = u.id WHERE u.id IS NULL;

\echo '=== 2. ORPHAN CHECK: ORDER_ITEMS WITHOUT ORDERS OR PRODUCTS ==='
SELECT count(*) AS orphaned_items_no_order FROM order_items oi LEFT JOIN orders o ON oi.order_id = o.id WHERE o.id IS NULL;
SELECT count(*) AS orphaned_items_no_product FROM order_items oi LEFT JOIN products p ON oi.product_id = p.id WHERE p.id IS NULL;

\echo '=== 3. ORPHAN CHECK: PAYMENTS WITHOUT ORDERS ==='
SELECT count(*) AS orphaned_payments FROM payments p LEFT JOIN orders o ON p.order_id = o.id WHERE o.id IS NULL;

\echo '=== 4. ORPHAN CHECK: CARTS / CART_ITEMS ==='
SELECT count(*) AS orphaned_carts FROM carts c LEFT JOIN users u ON c.user_id = u.id WHERE u.id IS NULL;
SELECT count(*) AS orphaned_cart_items FROM cart_items ci LEFT JOIN carts c ON ci.cart_id = c.id WHERE c.id IS NULL;

\echo '=== 5. ORPHAN CHECK: SUBSCRIPTIONS & LICENSES ==='
SELECT count(*) AS orphaned_subscriptions_user FROM subscriptions s LEFT JOIN users u ON s.user_id = u.id WHERE u.id IS NULL;
SELECT count(*) AS orphaned_subscriptions_order FROM subscriptions s LEFT JOIN orders o ON s.order_id = o.id WHERE s.order_id IS NOT NULL AND o.id IS NULL;
SELECT count(*) AS orphaned_licenses_user FROM licenses l LEFT JOIN users u ON l.user_id = u.id WHERE u.id IS NULL;

\echo '=== 6. ORPHAN CHECK: SUPPORT TICKETS & MESSAGES ==='
SELECT count(*) AS orphaned_tickets_customer FROM support_tickets st LEFT JOIN users u ON st.customer_user_id = u.id WHERE st.customer_user_id IS NOT NULL AND u.id IS NULL;
SELECT count(*) AS orphaned_tickets_order FROM support_tickets st LEFT JOIN orders o ON st.order_id = o.id WHERE st.order_id IS NOT NULL AND o.id IS NULL;
SELECT count(*) AS orphaned_tickets_deployment FROM support_tickets st LEFT JOIN deployments d ON st.deployment_id = d.id WHERE st.deployment_id IS NOT NULL AND d.id IS NULL;
SELECT count(*) AS orphaned_ticket_messages FROM support_ticket_messages stm LEFT JOIN support_tickets st ON stm.ticket_id = st.id WHERE st.id IS NULL;

\echo '=== 7. CRITICAL NULL CHECKS ==='
SELECT 'users.email' AS col, count(*) FROM users WHERE email IS NULL
UNION ALL SELECT 'users.password_hash', count(*) FROM users WHERE password_hash IS NULL
UNION ALL SELECT 'users.role', count(*) FROM users WHERE role IS NULL
UNION ALL SELECT 'orders.user_id', count(*) FROM orders WHERE user_id IS NULL
UNION ALL SELECT 'orders.total_amount', count(*) FROM orders WHERE total_amount IS NULL
UNION ALL SELECT 'orders.status', count(*) FROM orders WHERE status IS NULL
UNION ALL SELECT 'payments.order_id', count(*) FROM payments WHERE order_id IS NULL
UNION ALL SELECT 'payments.amount', count(*) FROM payments WHERE amount IS NULL
UNION ALL SELECT 'payments.status', count(*) FROM payments WHERE status IS NULL
UNION ALL SELECT 'licenses.license_key', count(*) FROM licenses WHERE license_key IS NULL
UNION ALL SELECT 'licenses.user_id', count(*) FROM licenses WHERE user_id IS NULL
UNION ALL SELECT 'subscriptions.user_id', count(*) FROM subscriptions WHERE user_id IS NULL;

\echo '=== 8. CHECK CONFLICTS / DUPLICATES ==='
SELECT email, count(*) FROM users GROUP BY email HAVING count(*) > 1;
SELECT license_key, count(*) FROM licenses GROUP BY license_key HAVING count(*) > 1;

SQL
