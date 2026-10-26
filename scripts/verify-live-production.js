const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const outputDir = path.join(__dirname, '../public/qa/live');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    const page = await browser.newPage();
    const consoleLogs = [];
    page.on('console', msg => consoleLogs.push(`[${msg.type()}] ${msg.text()}`));
    page.on('pageerror', err => consoleLogs.push(`[PAGE ERROR] ${err.toString()}`));

    console.log('1. Loading LIVE website https://ohotechn.com at 1920x1080...');
    await page.setViewport({ width: 1920, height: 1080 });
    const response = await page.goto('https://ohotechn.com', { waitUntil: 'networkidle2', timeout: 45000 });
    console.log('HTTP Status:', response.status());

    // Check for unwanted custom-cursor
    const cursorEl = await page.$('#custom-cursor');
    console.log('LIVE #custom-cursor present:', cursorEl !== null);

    // Check for canvas elements
    const canvases = await page.$$eval('canvas', els => els.map(c => ({
      className: c.className,
      id: c.id,
      width: c.width,
      height: c.height
    })));
    console.log('LIVE <canvas> elements count:', canvases.length, canvases);

    // Simulate mouse movements across hero and content
    console.log('2. Simulating mouse interaction across the live page...');
    for (const [x, y] of [[200, 200], [500, 400], [960, 540], [1400, 700], [1800, 900]]) {
      await page.mouse.move(x, y);
      await new Promise(r => setTimeout(r, 100));
    }

    const cursorAfterMove = await page.$('#custom-cursor');
    console.log('LIVE #custom-cursor after mouse movement:', cursorAfterMove !== null);

    // Check circular arrow element
    const circularArrow = await page.$$eval('[class*="rounded-full"][class*="border-emerald"]', els => els.length);
    console.log('LIVE circular emerald elements count (should only be legitimate badge dots):', circularArrow);

    // Capture desktop screenshot
    await page.screenshot({ path: path.join(outputDir, 'live-desktop-hero.png'), fullPage: false });
    console.log('Desktop screenshot saved to public/qa/live/live-desktop-hero.png');

    // Tablet check
    console.log('3. Checking tablet viewport (1024x768)...');
    await page.setViewport({ width: 1024, height: 768 });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(outputDir, 'live-tablet-hero.png'), fullPage: false });

    // Mobile check
    console.log('4. Checking mobile viewport (375x812)...');
    await page.setViewport({ width: 375, height: 812 });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(outputDir, 'live-mobile-hero.png'), fullPage: false });

    console.log('\n--- VERIFICATION SUMMARY ---');
    console.log('Unwanted green floating dots / GlobalCanvas: ' + (canvases.length === 0 ? 'CLEAN (NONE FOUND)' : 'FAILED'));
    console.log('Unwanted circular cursor arrow: ' + (cursorEl === null ? 'CLEAN (NONE FOUND)' : 'FAILED'));
    console.log('Console Errors/Logs count:', consoleLogs.filter(l => l.includes('ERROR') || l.includes('error')).length);

  } catch (err) {
    console.error('Live verification error:', err);
  } finally {
    await browser.close();
  }
})();
