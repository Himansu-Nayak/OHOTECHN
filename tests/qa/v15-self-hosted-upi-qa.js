const path = require('path');
const os = require('os');
const crypto = require('crypto');
const fs = require('fs');
const puppeteer = require(path.resolve(process.cwd(), 'node_modules/puppeteer'));

const JWT_SECRET = 'M9SVJ6KRSj7R5jUlXe2azJsNrDkv8LqTn2iwkrkrinhjd4gwzTc7KCu8WuXoiexy';

function base64url(str) {
  return Buffer.from(str).toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function generateToken(userId, role = 'ROLE_ADMIN', email = 'admin@ohotech.com', name = 'Admin Cashier') {
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const now = Math.floor(Date.now() / 1000);
  const exp = now + 86400;
  const payload = base64url(JSON.stringify({
    sub: String(userId),
    role: role,
    email: email,
    name: name,
    iat: now,
    exp: exp
  }));
  const signature = crypto.createHmac('sha256', JWT_SECRET)
    .update(`${header}.${payload}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  return `${header}.${payload}.${signature}`;
}

async function runSelfHostedUpiQa() {
  const outputDir = path.resolve(process.cwd(), 'public/qa/v15_readiness');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('=== OHO TECH SELF-HOSTED UPI & COUNTER BILLING QA AUTOMATION ===');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--window-size=1440,900']
  });

  const results = {
    counterBillingTabFound: false,
    counterBillingRendered: false,
    checkoutPageLoaded: false,
    screenshots: []
  };

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    const adminToken = generateToken(1, 'ROLE_ADMIN', 'admin@ohotech.com', 'Admin Cashier');

    // 1. Inject Admin Auth
    await page.evaluateOnNewDocument((token) => {
      localStorage.setItem('accessToken', token);
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        email: 'admin@ohotech.com',
        name: 'Admin Cashier',
        role: 'ROLE_ADMIN',
        emailVerified: true
      }));
    }, adminToken);

    await page.setCookie({
      name: 'token',
      value: adminToken,
      domain: 'localhost',
      path: '/',
      httpOnly: false,
      secure: false,
      sameSite: 'Lax'
    });

    // ==========================================
    // STEP 1: Verify Counter Billing POS Terminal
    // ==========================================
    console.log('[1/2] Navigating to Admin Transaction Operations Center (/admin?tab=payments)...');
    await page.goto('http://localhost:3000/admin?tab=payments', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await new Promise(r => setTimeout(r, 4000));

    // Try finding #btn-counter-billing or click Payments in sidebar
    let foundTab = false;
    try {
      await page.waitForSelector('#btn-counter-billing', { timeout: 5000 });
      await page.click('#btn-counter-billing');
      foundTab = true;
    } catch {
      // If not yet visible, try clicking Payments in sidebar
      console.log('Switching to Payments tab via sidebar click...');
      await page.evaluate(() => {
        const items = Array.from(document.querySelectorAll('button, a'));
        const payBtn = items.find(el => el.textContent && el.textContent.includes('Payments'));
        if (payBtn) payBtn.click();
      });
      await new Promise(r => setTimeout(r, 2000));
      try {
        await page.waitForSelector('#btn-counter-billing', { timeout: 10000 });
        await page.click('#btn-counter-billing');
        foundTab = true;
      } catch (err) {
        console.warn('Could not locate #btn-counter-billing after sidebar click');
      }
    }

    if (foundTab) {
      console.log('✓ Successfully clicked "POS Counter Billing" tab');
      results.counterBillingTabFound = true;
      await new Promise(r => setTimeout(r, 2000));

      const hasPosHeader = await page.evaluate(() => {
        return document.body.innerText.includes('Counter POS & Billing Terminal') ||
               document.body.innerText.includes('Cash in Drawer') ||
               document.body.innerText.includes('LIVE REGISTER');
      });

      if (hasPosHeader) {
        console.log('✓ Counter POS & Billing Terminal successfully rendered with Live Register metrics');
        results.counterBillingRendered = true;
      }

      const posScreenshotPath = path.join(outputDir, 'counter_billing_pos.png');
      await page.screenshot({ path: posScreenshotPath, fullPage: false });
      results.screenshots.push(posScreenshotPath);
      console.log(`✓ Screenshot captured: ${posScreenshotPath}`);
    }

    // ==========================================
    // STEP 2: Verify Checkout & Self-Hosted UPI
    // ==========================================
    console.log('[2/2] Navigating to Checkout (/checkout)...');
    
    // Inject Customer Auth & Active Cart
    await page.evaluateOnNewDocument((token) => {
      localStorage.setItem('accessToken', token);
      localStorage.setItem('user', JSON.stringify({
        id: 2,
        email: 'customer@ohotech.com',
        name: 'Enterprise Customer',
        role: 'ROLE_CUSTOMER',
        phone: '+91 98765 43210',
        emailVerified: true
      }));
      localStorage.setItem('oho_cart', JSON.stringify({
        items: [
          {
            id: 1,
            productId: 1,
            title: 'Cloud Core AI Microservices Suite',
            name: 'Cloud Core AI Microservices Suite',
            price: 4999,
            quantity: 1,
            productType: 'SOFTWARE_LICENSE'
          }
        ],
        totalAmount: 4999
      }));
    }, generateToken(2, 'ROLE_CUSTOMER', 'customer@ohotech.com', 'Enterprise Customer'));

    await page.goto('http://localhost:3000/checkout', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await new Promise(r => setTimeout(r, 3000));

    results.checkoutPageLoaded = await page.evaluate(() => {
      return document.body.innerText.includes('Checkout') || document.body.innerText.includes('Payable Amount');
    });

    const checkoutScreenshotPath = path.join(outputDir, 'self_hosted_upi_checkout.png');
    await page.screenshot({ path: checkoutScreenshotPath, fullPage: false });
    results.screenshots.push(checkoutScreenshotPath);
    console.log(`✓ Screenshot captured: ${checkoutScreenshotPath}`);

    console.log('\n=== QA EXECUTION SUMMARY ===');
    console.log(`POS Tab Detected:      ${results.counterBillingTabFound ? 'PASS' : 'FAIL'}`);
    console.log(`POS UI Rendered:       ${results.counterBillingRendered ? 'PASS' : 'FAIL'}`);
    console.log(`Checkout Loaded:       ${results.checkoutPageLoaded ? 'PASS' : 'FAIL'}`);
    console.log(`Screenshots Saved:     ${results.screenshots.length} files in public/qa/v15_readiness/`);
    console.log('============================\n');

  } catch (err) {
    console.error('QA Automation Error:', err);
  } finally {
    await browser.close();
  }
}

runSelfHostedUpiQa();
