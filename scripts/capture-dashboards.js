const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');

const PORT = 3088;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const OUTPUT_DIR = 'C:\\Users\\himan\\.gemini\\antigravity\\brain\\1c20c6b6-d483-485b-8869-fbc468c7c17d';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

function waitForServer(url, timeoutMs = 45000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      http.get(url, (res) => {
        resolve();
      }).on('error', (err) => {
        if (Date.now() - start > timeoutMs) {
          reject(new Error(`Server did not respond within ${timeoutMs}ms`));
        } else {
          setTimeout(check, 1000);
        }
      });
    };
    check();
  });
}

async function run() {
  console.log(`Starting Next.js server on port ${PORT}...`);
  const server = spawn('npx.cmd', ['next', 'start', '-p', String(PORT)], {
    cwd: process.cwd(),
    shell: true,
    stdio: 'inherit'
  });

  server.on('error', (err) => {
    console.error('Failed to spawn Next.js server:', err);
  });

  try {
    console.log('Waiting for Next.js to start...');
    await waitForServer(BASE_URL);
    console.log('Server is online! Launching Puppeteer...');

    const browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--window-size=1440,900']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });

    // 1. Customer Dashboard (/dashboard)
    console.log('Navigating to Customer Dashboard (/dashboard)...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'ROLE_CUSTOMER'
      }));
      localStorage.setItem('accessToken', 'mock-valid-token');
    });
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle0', timeout: 30000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 2000));
    const customerSs = path.join(OUTPUT_DIR, 'customer-dashboard-v15.png');
    await page.screenshot({ path: customerSs, fullPage: true });
    console.log(`Saved customer screenshot to: ${customerSs}`);

    // 2. Admin Dashboard (/admin)
    console.log('Navigating to Admin Dashboard (/admin)...');
    await page.evaluate(() => {
      localStorage.setItem('user', JSON.stringify({
        id: 2,
        name: 'System Admin',
        email: 'admin@ohotech.com',
        role: 'ROLE_ADMIN'
      }));
      localStorage.setItem('accessToken', 'mock-valid-token');
    });
    await page.goto(`${BASE_URL}/admin`, { waitUntil: 'networkidle0', timeout: 30000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 2000));
    const adminSs = path.join(OUTPUT_DIR, 'admin-dashboard-v15.png');
    await page.screenshot({ path: adminSs, fullPage: true });
    console.log(`Saved admin screenshot to: ${adminSs}`);

    // 3. Developer Dashboard (/developer)
    console.log('Navigating to Developer Studio (/developer)...');
    await page.evaluate(() => {
      localStorage.setItem('user', JSON.stringify({
        id: 3,
        name: 'Chief Architect',
        email: 'architect@ohotech.com',
        role: 'ROLE_DEVELOPER'
      }));
      localStorage.setItem('accessToken', 'mock-valid-token');
    });
    await page.goto(`${BASE_URL}/developer`, { waitUntil: 'networkidle0', timeout: 30000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 2000));
    const devSs = path.join(OUTPUT_DIR, 'developer-dashboard-v15.png');
    await page.screenshot({ path: devSs, fullPage: true });
    console.log(`Saved developer screenshot to: ${devSs}`);

    await browser.close();
    console.log('All screenshots captured successfully!');
  } catch (err) {
    console.error('Error during screenshot capture:', err);
  } finally {
    console.log('Stopping Next.js server...');
    server.kill();
    // On windows ensure child processes killed
    spawn('taskkill', ['/pid', String(server.pid), '/f', '/t'], { shell: true });
  }
}

run();
