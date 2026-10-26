const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    console.log('Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });

    // 1. Check for custom-cursor element
    const customCursor = await page.$('#custom-cursor');
    console.log('Custom cursor element present:', customCursor !== null);

    // 2. Check for GlobalCanvas or Three.js particle canvas
    const canvases = await page.$$eval('canvas', (els) => {
      return els.map(c => ({
        id: c.id,
        className: c.className,
        width: c.width,
        height: c.height,
        parent: c.parentElement ? c.parentElement.className : null
      }));
    });
    console.log('Canvases found on page:', canvases);

    // 3. Move mouse around to see if any cursor or particles spawn
    await page.mouse.move(500, 500);
    await new Promise(r => setTimeout(r, 500));
    await page.mouse.move(800, 600);
    await new Promise(r => setTimeout(r, 500));

    const customCursorAfterMove = await page.$('#custom-cursor');
    console.log('Custom cursor element after mouse move:', customCursorAfterMove !== null);

    // 4. Capture screenshot
    await page.screenshot({ path: 'public/qa/qa-clean-check.png', fullPage: false });
    console.log('Screenshot saved to public/qa/qa-clean-check.png');

  } catch (err) {
    console.error('Error during verification:', err);
  } finally {
    await browser.close();
  }
})();
