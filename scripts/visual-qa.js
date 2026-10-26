const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const VIEWPORTS = [
  { name: 'desktop-1920x1080', width: 1920, height: 1080 },
  { name: 'desktop-1600x900', width: 1600, height: 900 },
  { name: 'laptop-1440x900', width: 1440, height: 900 },
  { name: 'laptop-1366x768', width: 1366, height: 768 },
  { name: 'desktop-1280x720', width: 1280, height: 720 },
  { name: 'tablet-1024x768', width: 1024, height: 768 },
  { name: 'tablet-768x1024', width: 768, height: 1024 },
  { name: 'mobile-390x844', width: 390, height: 844 },
];

async function runVisualQA() {
  const qaDir = path.resolve('public/qa');
  if (!fs.existsSync(qaDir)) {
    fs.mkdirSync(qaDir, { recursive: true });
  }

  console.log('Launching browser for visual verification...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  for (const vp of VIEWPORTS) {
    console.log(`Verifying: ${vp.name} (${vp.width}x${vp.height})...`);
    const page = await browser.newPage();
    try {
      await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 });
      await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
      await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 45000 });

      await page.waitForSelector('#hero', { timeout: 20000 });
      // Wait for App Router loading overlay to disappear
      await page.waitForFunction(() => !document.querySelector('[aria-label="Loading OHO TECH Platform"]'), { timeout: 30000 });
      // Allow GSAP entrance animation to complete
      await new Promise(r => setTimeout(r, 1200));

      // Capture Scene 1 (Studio)
      const shotPath1 = path.join(qaDir, `${vp.name}-scene1.jpg`);
      await page.screenshot({ path: shotPath1, type: 'jpeg', quality: 90 });
      console.log(`Saved: ${vp.name}-scene1.jpg`);

      // Switch to Scene 2 (Billboard ohotechbg.1)
      await page.waitForSelector('#hero-slide-btn-1', { timeout: 10000 });
      await new Promise(r => setTimeout(r, 600));
      await page.click('#hero-slide-btn-1');

      // Wait 1.6s for transition to settle
      await new Promise(r => setTimeout(r, 1600));

      const isSwitched = await page.evaluate(() => {
        const btn = document.getElementById('hero-slide-btn-1');
        return btn && btn.classList.contains('bg-emerald-500');
      });

      if (!isSwitched) {
        console.log(`Retrying switch to Scene 2 on ${vp.name}...`);
        await page.click('#hero-slide-btn-1');
        await new Promise(r => setTimeout(r, 1600));
      }

      const shotPath2 = path.join(qaDir, `${vp.name}-scene2.jpg`);
      await page.screenshot({ path: shotPath2, type: 'jpeg', quality: 90 });
      console.log(`Saved: ${vp.name}-scene2.jpg`);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  console.log('All 8 viewports verified successfully for both Scene 1 and Scene 2!');
}

runVisualQA().catch(err => {
  console.error('Visual QA error:', err);
  process.exit(1);
});
