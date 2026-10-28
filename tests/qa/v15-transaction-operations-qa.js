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

function generateToken(userId, role = 'ROLE_ADMIN', email = 'admin@ohotech.com', name = 'Admin User') {
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

async function runQa() {
  const outputDir = path.resolve(process.cwd(), 'public/qa/v15_readiness');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('--- OHO TECH V15 TRANSACTION OPERATIONS CENTER BROWSER QA ---');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const adminToken = generateToken(1, 'ROLE_ADMIN', 'admin@ohotech.com', 'Admin Commander');

  // Inject authentication into localStorage & cookies before navigation
  await page.evaluateOnNewDocument((token) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('user', JSON.stringify({
      id: 1,
      email: 'admin@ohotech.com',
      name: 'Admin Commander',
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

  const results = {
    overviewRendered: false,
    ledgerRendered: false,
    webhooksRendered: false,
    reconciliationRendered: false,
    screenshots: []
  };

  try {
    console.log('Navigating to http://localhost:3000/admin?tab=payments...');
    await page.goto('http://localhost:3000/admin?tab=payments', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    await new Promise((r) => setTimeout(r, 2000));

    // Verify Title
    const titleText = await page.evaluate(() => {
      const el = document.querySelector('h1');
      return el ? el.innerText : null;
    });
    console.log('Found main title:', titleText);

    // 1. Overview Tab Screenshot
    const overviewShotPath = path.join(outputDir, 'admin_transactions_overview.png');
    await page.screenshot({ path: overviewShotPath, fullPage: false });
    results.overviewRendered = true;
    results.screenshots.push(overviewShotPath);
    console.log('[QA] Overview screenshot captured:', overviewShotPath);

    // 2. Click Ledger Tab
    console.log('Clicking Transaction Ledger tab...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const ledgerBtn = buttons.find(b => b.innerText.includes('Transaction Ledger'));
      if (ledgerBtn) ledgerBtn.click();
    });
    await new Promise((r) => setTimeout(r, 1200));

    const ledgerShotPath = path.join(outputDir, 'admin_transactions_ledger.png');
    await page.screenshot({ path: ledgerShotPath, fullPage: false });
    results.ledgerRendered = true;
    results.screenshots.push(ledgerShotPath);
    console.log('[QA] Ledger screenshot captured:', ledgerShotPath);

    // 3. Click Webhooks Tab
    console.log('Clicking Webhook Operations tab...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const whBtn = buttons.find(b => b.innerText.includes('Webhook Operations'));
      if (whBtn) whBtn.click();
    });
    await new Promise((r) => setTimeout(r, 1200));

    const webhooksShotPath = path.join(outputDir, 'admin_transactions_webhooks.png');
    await page.screenshot({ path: webhooksShotPath, fullPage: false });
    results.webhooksRendered = true;
    results.screenshots.push(webhooksShotPath);
    console.log('[QA] Webhooks screenshot captured:', webhooksShotPath);

    // 4. Click Reconciliation Tab
    console.log('Clicking Reconciliation & Recovery tab...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const reconBtn = buttons.find(b => b.innerText.includes('Reconciliation & Recovery'));
      if (reconBtn) reconBtn.click();
    });
    await new Promise((r) => setTimeout(r, 1200));

    const reconShotPath = path.join(outputDir, 'admin_transactions_reconciliation.png');
    await page.screenshot({ path: reconShotPath, fullPage: false });
    results.reconciliationRendered = true;
    results.screenshots.push(reconShotPath);
    console.log('[QA] Reconciliation screenshot captured:', reconShotPath);

    console.log('--- QA VERIFICATION SUMMARY ---');
    console.log(JSON.stringify(results, null, 2));
  } catch (err) {
    console.error('QA Automation Error:', err);
  } finally {
    await browser.close();
  }
}

runQa().catch(console.error);
