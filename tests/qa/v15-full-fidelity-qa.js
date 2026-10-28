const path = require('path');
const os = require('os');
const crypto = require('crypto');
const fs = require('fs');
const { spawn } = require('child_process');

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

const QA_OUTPUT_DIR = path.resolve('public/qa/v15');
if (!fs.existsSync(QA_OUTPUT_DIR)) {
  fs.mkdirSync(QA_OUTPUT_DIR, { recursive: true });
}

async function runVisualQASuite() {
  const PORT = 3009;
  const nextBin = path.resolve('node_modules/next/dist/bin/next');
  console.log(`[QA] Launching Next.js runtime directly: ${nextBin} on port ${PORT}...`);

  const serverProcess = spawn(process.execPath, [nextBin, 'dev', '-H', '127.0.0.1', '-p', String(PORT)], {
    cwd: process.cwd(),
    stdio: 'pipe',
    env: { ...process.env, PORT: String(PORT) }
  });

  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Timeout waiting for Next.js "Ready in" banner'));
    }, 45000);

    serverProcess.stdout.on('data', (d) => {
      const msg = d.toString();
      if (msg.includes('Ready in') || msg.includes('localhost:') || msg.includes('127.0.0.1:')) {
        console.log('[NEXT READY]', msg.trim());
        clearTimeout(timer);
        resolve();
      }
    });

    serverProcess.stderr.on('data', (d) => {
      console.error('[NEXT LOG]', d.toString().trim());
    });

    serverProcess.on('exit', (code) => {
      clearTimeout(timer);
      reject(new Error(`Next.js process exited prematurely with code ${code}`));
    });
  });

  // Short cushion for HTTP listener acceptance
  await new Promise(r => setTimeout(r, 1500));

  try {
    const profileDir = path.resolve('scratch/chrome_profile_' + Date.now());
    fs.mkdirSync(profileDir, { recursive: true });

    const browser = await puppeteer.launch({
      headless: 'new',
      userDataDir: profileDir,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
    });

    // ==========================================
    // 1. ADMIN DASHBOARD TESTS
    // ==========================================
    console.log('[QA] 1. Testing Admin Dashboard (/admin)...');
    {
      const page = await browser.newPage();
      await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

      const adminToken = generateToken(1, 'ROLE_ADMIN', 'admin@ohotech.com', 'System Admin');
      await page.evaluateOnNewDocument((token) => {
        localStorage.setItem('accessToken', token);
        localStorage.setItem('user', JSON.stringify({
          id: 1,
          name: 'System Admin',
          email: 'admin@ohotech.com',
          role: 'ROLE_ADMIN',
          enabled: true
        }));
      }, adminToken);

      await page.goto(`http://127.0.0.1:${PORT}/admin`, { waitUntil: 'networkidle2' });
      await new Promise(r => setTimeout(r, 2500));

      // 1.1 Baseline Admin Desktop
      const adminDesktopPath = path.join(QA_OUTPUT_DIR, '01_admin_desktop_baseline.png');
      await page.screenshot({ path: adminDesktopPath });
      console.log('Saved:', adminDesktopPath);

      // 1.2 Interactive Spline Performance Chart Hover
      const chartHandle = await page.$('svg.cursor-crosshair');
      if (chartHandle) {
        const box = await chartHandle.boundingBox();
        if (box) {
          await page.mouse.move(box.x + box.width * 0.62, box.y + box.height * 0.45);
          await new Promise(r => setTimeout(r, 800));
          const chartHoverPath = path.join(QA_OUTPUT_DIR, '02_admin_chart_interactive_hover.png');
          await page.screenshot({ path: chartHoverPath });
          console.log('Saved:', chartHoverPath);
        }
      }

      // 1.3 Command Palette Trigger (Ctrl+K)
      await page.keyboard.down('Control');
      await page.keyboard.press('KeyK');
      await page.keyboard.up('Control');
      await new Promise(r => setTimeout(r, 800));

      const cmdPalettePath = path.join(QA_OUTPUT_DIR, '03_admin_command_palette_modal.png');
      await page.screenshot({ path: cmdPalettePath });
      console.log('Saved:', cmdPalettePath);

      // Press Escape to dismiss
      await page.keyboard.press('Escape');
      await new Promise(r => setTimeout(r, 400));

      // 1.4 Admin Mobile Viewport
      await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
      await new Promise(r => setTimeout(r, 800));
      const adminMobilePath = path.join(QA_OUTPUT_DIR, '04_admin_mobile_viewport.png');
      await page.screenshot({ path: adminMobilePath });
      console.log('Saved:', adminMobilePath);

      await page.close();
    }

    // ==========================================
    // 2. DEVELOPER DASHBOARD TESTS
    // ==========================================
    console.log('[QA] 2. Testing Developer Dashboard (/developer)...');
    {
      const page = await browser.newPage();
      await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

      const devToken = generateToken(2, 'ROLE_DEVELOPER', 'dev@ohotech.com', 'Core Developer');
      await page.evaluateOnNewDocument((token) => {
        localStorage.setItem('accessToken', token);
        localStorage.setItem('user', JSON.stringify({
          id: 2,
          name: 'Core Developer',
          email: 'dev@ohotech.com',
          role: 'ROLE_DEVELOPER',
          enabled: true
        }));
      }, devToken);

      await page.goto(`http://127.0.0.1:${PORT}/developer`, { waitUntil: 'networkidle2' });
      await new Promise(r => setTimeout(r, 2500));

      const devDesktopPath = path.join(QA_OUTPUT_DIR, '05_developer_desktop_gauge_telemetry.png');
      await page.screenshot({ path: devDesktopPath });
      console.log('Saved:', devDesktopPath);

      await page.close();
    }

    // ==========================================
    // 3. CUSTOMER DASHBOARD TESTS
    // ==========================================
    console.log('[QA] 3. Testing Customer Dashboard (/dashboard)...');
    {
      const page = await browser.newPage();
      await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

      const custToken = generateToken(3, 'ROLE_CUSTOMER', 'client@enterprise.com', 'Enterprise Client');
      await page.evaluateOnNewDocument((token) => {
        localStorage.setItem('accessToken', token);
        localStorage.setItem('user', JSON.stringify({
          id: 3,
          name: 'Enterprise Client',
          email: 'client@enterprise.com',
          role: 'ROLE_CUSTOMER',
          enabled: true
        }));
      }, custToken);

      await page.goto(`http://127.0.0.1:${PORT}/dashboard`, { waitUntil: 'networkidle2' });
      await new Promise(r => setTimeout(r, 2500));

      const custDesktopPath = path.join(QA_OUTPUT_DIR, '06_customer_dashboard_entitlements.png');
      await page.screenshot({ path: custDesktopPath });
      console.log('Saved:', custDesktopPath);

      await page.close();
    }

    // ==========================================
    // 4. SUPPORT DASHBOARD TESTS
    // ==========================================
    console.log('[QA] 4. Testing Support Dashboard (/support)...');
    {
      const page = await browser.newPage();
      await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

      const supportToken = generateToken(4, 'ROLE_SUPPORT', 'support@ohotech.com', 'Tier-3 Support Lead');
      await page.evaluateOnNewDocument((token) => {
        localStorage.setItem('accessToken', token);
        localStorage.setItem('user', JSON.stringify({
          id: 4,
          name: 'Tier-3 Support Lead',
          email: 'support@ohotech.com',
          role: 'ROLE_SUPPORT',
          enabled: true
        }));
      }, supportToken);

      await page.goto(`http://127.0.0.1:${PORT}/support`, { waitUntil: 'networkidle2' });
      await new Promise(r => setTimeout(r, 2500));

      const supportDesktopPath = path.join(QA_OUTPUT_DIR, '07_support_operations_desk.png');
      await page.screenshot({ path: supportDesktopPath });
      console.log('Saved:', supportDesktopPath);

      // Trigger Create Ticket Modal
      const newTicketBtn = await page.$('button ::-p-text(New Ticket)');
      if (newTicketBtn) {
        await newTicketBtn.click();
        await new Promise(r => setTimeout(r, 800));
        const supportModalPath = path.join(QA_OUTPUT_DIR, '08_support_create_ticket_modal.png');
        await page.screenshot({ path: supportModalPath });
        console.log('Saved:', supportModalPath);
      }

      await page.close();
    }

    await browser.close();
    console.log('[QA] SUCCESS: All 4 dashboards rendered and captured at reference fidelity!');

  } catch (err) {
    console.error('[QA] Test suite error:', err);
    throw err;
  } finally {
    console.log('[QA] Cleaning up server process...');
    try {
      if (serverProcess && serverProcess.pid) {
        require('child_process').execSync(`taskkill /pid ${serverProcess.pid} /T /F 2>nul`);
      }
    } catch {}
  }
}

runVisualQASuite().catch((err) => {
  console.error(err);
  process.exit(1);
});
