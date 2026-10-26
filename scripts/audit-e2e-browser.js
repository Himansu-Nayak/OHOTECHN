const puppeteer = require('puppeteer');
const http = require('http');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const ROUTES = [
  { path: '/', name: 'Homepage' },
  { path: '/pricing', name: 'Pricing & Engagement' },
  { path: '/support', name: 'Support & Help Desk' },
  { path: '/partner', name: 'Partner Ecosystem' },
  { path: '/products', name: 'Products Catalog' },
  { path: '/cart', name: 'Cart' },
  { path: '/checkout', name: 'Checkout' },
  { path: '/login', name: 'Login' },
  { path: '/register', name: 'Register' },
  { path: '/forgot-password', name: 'Forgot Password' },
  { path: '/verify-email', name: 'Verify Email' },
  { path: '/get-quote', name: 'Commercial Quote' },
  { path: '/book-demo', name: 'Book Demo' },
  { path: '/contact', name: 'Contact Us' },
  { path: '/licenses', name: 'My Licenses' },
  { path: '/downloads', name: 'Digital Downloads' },
  { path: '/orders', name: 'Order History' },
  { path: '/subscriptions', name: 'Subscriptions' }
];

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 }
];

function waitForServer(url, timeoutMs = 45000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    function check() {
      http.get(url, (res) => {
        if (res.statusCode >= 200 && res.statusCode < 500) {
          resolve(true);
        } else {
          setTimeout(check, 1000);
        }
      }).on('error', () => {
        if (Date.now() - start > timeoutMs) {
          reject(new Error('Timeout waiting for server at ' + url));
        } else {
          setTimeout(check, 1000);
        }
      });
    }
    check();
  });
}

async function runAudit() {
  console.log('[1/4] Starting Next.js production server on port 3000...');
  const server = spawn('npx', ['next', 'start', '-p', '3000'], {
    shell: true,
    stdio: 'pipe',
    env: { ...process.env, NODE_ENV: 'production' }
  });

  server.stdout.on('data', (d) => process.stdout.write('[Next] ' + d.toString()));
  server.stderr.on('data', (d) => process.stderr.write('[Next ERR] ' + d.toString()));

  try {
    await waitForServer('http://localhost:3000');
    console.log('[2/4] Next.js server is healthy and responding!');

    console.log('[3/4] Launching headless browser for comprehensive Route & Viewport QA...');
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const results = [];
    const page = await browser.newPage();

    for (const route of ROUTES) {
      console.log(`\nTesting Route: ${route.name} (${route.path})`);
      const routeResult = {
        route: route.path,
        name: route.name,
        viewports: {},
        consoleErrors: [],
        hydrationErrors: []
      };

      for (const vp of VIEWPORTS) {
        await page.setViewport({ width: vp.width, height: vp.height });
        const errors = [];
        const hydrationWarns = [];

        const onConsole = (msg) => {
          const text = msg.text();
          if (msg.type() === 'error') {
            errors.push(text);
          }
          if (text.includes('Hydration failed') || text.includes('hydrating') || text.includes('did not match')) {
            hydrationWarns.push(text);
          }
        };

        const onPageError = (err) => {
          errors.push(err.toString());
        };

        page.on('console', onConsole);
        page.on('pageerror', onPageError);

        try {
          const res = await page.goto(`http://localhost:3000${route.path}`, {
            waitUntil: 'networkidle2',
            timeout: 30000
          });

          // Wait 500ms for animations / hydration
          await new Promise(r => setTimeout(r, 500));

          const status = res ? res.status() : 'UNKNOWN';
          const title = await page.title();
          const buttonsCount = await page.$$eval('button, a[role="button"]', els => els.length);

          routeResult.viewports[vp.name] = {
            status,
            title,
            interactiveButtons: buttonsCount,
            errorsCount: errors.length
          };

          if (errors.length > 0) {
            routeResult.consoleErrors.push(...errors);
          }
          if (hydrationWarns.length > 0) {
            routeResult.hydrationErrors.push(...hydrationWarns);
          }

          console.log(`  - [${vp.name}] Status: ${status} | Title: "${title}" | Interactive Buttons: ${buttonsCount}`);
        } catch (navErr) {
          console.error(`  - [${vp.name}] Navigation error: ${navErr.message}`);
          routeResult.viewports[vp.name] = {
            status: 'FAIL',
            error: navErr.message
          };
        } finally {
          page.off('console', onConsole);
          page.off('pageerror', onPageError);
        }
      }

      results.push(routeResult);
    }

    await browser.close();
    console.log('\n[4/4] Browser testing completed. Generating report...');

    const summaryReport = {
      timestamp: new Date().toISOString(),
      totalRoutesTested: results.length,
      viewportsTested: VIEWPORTS.map(v => `${v.name} (${v.width}x${v.height})`),
      results
    };

    fs.writeFileSync('docs/audit/browser_audit_results.json', JSON.stringify(summaryReport, null, 2));
    console.log('Saved report to docs/audit/browser_audit_results.json');

  } catch (err) {
    console.error('Audit execution error:', err);
  } finally {
    console.log('Shutting down Next.js production server...');
    if (process.platform === 'win32') {
      spawn('taskkill', ['/pid', server.pid.toString(), '/f', '/t']);
    } else {
      server.kill('SIGTERM');
    }
  }
}

runAudit();
