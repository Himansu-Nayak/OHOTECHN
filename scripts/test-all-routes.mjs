import puppeteer from 'puppeteer';

const ROUTES = [
  '/',
  '/about',
  '/services',
  '/products',
  '/developer',
  '/admin',
  '/login',
  '/register',
  '/get-quote',
  '/book-demo',
  '/careers',
  '/contact',
  '/privacy-policy',
  '/terms-and-conditions'
];

async function testAllRoutes() {
  console.log('--- TESTING ALL PRODUCTION ROUTES ---');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  let passCount = 0;
  let failCount = 0;

  for (const route of ROUTES) {
    try {
      const url = `http://localhost:3000${route}`;
      const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
      const status = res.status();
      const title = await page.title();
      
      if (status >= 200 && status < 400) {
        console.log(`[PASS] ${route.padEnd(24)} -> HTTP ${status} | "${title.slice(0, 40)}..."`);
        passCount++;
      } else {
        console.error(`[FAIL] ${route.padEnd(24)} -> HTTP ${status}`);
        failCount++;
      }
    } catch (err) {
      console.error(`[ERROR] ${route.padEnd(24)} -> ${err.message}`);
      failCount++;
    }
  }

  await browser.close();
  console.log(`\nROUTE RESULTS: ${passCount} PASSED, ${failCount} FAILED out of ${ROUTES.length} total.`);
  if (failCount > 0) process.exit(1);
}

testAllRoutes();
