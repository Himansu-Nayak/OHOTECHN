const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const outputDir = path.join(__dirname, '../public/qa/live-clean');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const viewports = [
    { name: '1920x1080_desktop', width: 1920, height: 1080 },
    { name: '1600x900_laptop_wide', width: 1600, height: 900 },
    { name: '1440x900_laptop_med', width: 1440, height: 900 },
    { name: '1366x768_laptop_std', width: 1366, height: 768 },
    { name: '1280x720_laptop_720p', width: 1280, height: 720 },
    { name: '1024x768_tablet_land', width: 1024, height: 768 },
    { name: '768x1024_tablet_port', width: 768, height: 1024 },
    { name: '430x932_iphone_promax', width: 430, height: 932 },
    { name: '390x844_iphone_pro', width: 390, height: 844 },
    { name: '375x812_mobile_std', width: 375, height: 812 }
  ];

  try {
    const page = await browser.newPage();
    const consoleLogs = [];
    page.on('console', msg => consoleLogs.push(`[${msg.type()}] ${msg.text()}`));
    page.on('pageerror', err => consoleLogs.push(`[PAGE ERROR] ${err.toString()}`));

    console.log('--- 1. DESKTOP AUDIT (1920x1080) ON LIVE https://ohotechn.com ---');
    await page.setViewport({ width: 1920, height: 1080 });
    const response = await page.goto('https://ohotechn.com', { waitUntil: 'networkidle2', timeout: 45000 });
    console.log('HTTP Status:', response.status());

    // Check unwanted marker UI elements
    const pageText = await page.evaluate(() => document.body.innerText);
    const hasStudioMarker = pageText.includes('01 • Studio') || pageText.includes('01 • STUDIO');
    const hasBillboardMarker = pageText.includes('02 • Billboard') || pageText.includes('02 • BILLBOARD');
    const hasAutoScrollMarker = pageText.includes('AUTO-SCROLL');
    console.log('Marker "01 • Studio" present:', hasStudioMarker);
    console.log('Marker "02 • Billboard" present:', hasBillboardMarker);
    console.log('Marker "AUTO-SCROLL" present:', hasAutoScrollMarker);

    const prevBtn = await page.$('#hero-slide-prev');
    const nextBtn = await page.$('#hero-slide-next');
    console.log('Prev button present:', prevBtn !== null);
    console.log('Next button present:', nextBtn !== null);

    const customCursor = await page.$('#custom-cursor');
    console.log('Custom cursor present:', customCursor !== null);

    const canvasCount = await page.$$eval('canvas', els => els.length);
    console.log('Canvas count:', canvasCount);

    // Check edge-to-edge coverage of hero section
    const heroBox = await page.$eval('#hero', el => {
      const rect = el.getBoundingClientRect();
      return { width: rect.width, height: rect.height, left: rect.left, right: rect.right };
    });
    console.log('Hero section bounding box:', heroBox);

    // Check image bounding boxes and styles
    const imageInfo = await page.$$eval('#hero img', imgs => imgs.map(img => {
      const rect = img.getBoundingClientRect();
      const style = window.getComputedStyle(img);
      return {
        src: img.src,
        width: rect.width,
        height: rect.height,
        left: rect.left,
        objectFit: style.objectFit,
        objectPosition: style.objectPosition
      };
    }));
    console.log('Hero images info:', imageInfo);

    // Verify auto-scroll movement
    console.log('--- 2. VERIFYING AUTO-SCROLL MOTION ---');
    const initialTransform = await page.$eval('#hero div[style*="transform"]', el => el.style.transform);
    console.log('Initial track transform at t=0s:', initialTransform);

    console.log('Waiting 5.5s for auto-scroll transition...');
    await new Promise(r => setTimeout(r, 5500));

    const transitionedTransform = await page.$eval('#hero div[style*="transform"]', el => el.style.transform);
    console.log('Track transform after 5.5s:', transitionedTransform);
    const autoScrollWorking = initialTransform !== transitionedTransform;
    console.log('Auto-scroll actively transitioning:', autoScrollWorking);

    // Capture screenshots across viewports
    console.log('--- 3. CAPTURING RESPONSIVE VIEWPORT SCREENSHOTS ---');
    for (const vp of viewports) {
      await page.setViewport({ width: vp.width, height: vp.height });
      await new Promise(r => setTimeout(r, 600));
      const ssPath = path.join(outputDir, `${vp.name}.png`);
      await page.screenshot({ path: ssPath, fullPage: false });
      console.log(`Saved screenshot: ${vp.name}.png (${vp.width}x${vp.height})`);
    }

    console.log('\n======================================================');
    console.log('FINAL AUDIT SUMMARY:');
    console.log('- Marker UI removed:', !hasStudioMarker && !hasBillboardMarker && !hasAutoScrollMarker && prevBtn === null && nextBtn === null);
    console.log('- Side bars eliminated (Edge-to-Edge object-cover):', imageInfo.every(img => img.objectFit === 'cover'));
    console.log('- Auto-scroll active:', autoScrollWorking);
    console.log('- Custom cursor eliminated:', customCursor === null);
    console.log('- Canvas particles eliminated:', canvasCount === 0);
    console.log('======================================================');

  } catch (err) {
    console.error('Audit failed:', err);
  } finally {
    await browser.close();
  }
})();
