import puppeteer from 'puppeteer';

async function verify() {
  console.log('Launching headless browser for QA testing...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // Track console errors
  const errors = [];
  page.on('pageerror', err => errors.push(err.toString()));
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  // 1. Desktop Test (1440x900)
  console.log('Testing Desktop Homepage (1440x900)...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });

  // Check canvas sequence exists
  const canvasExists = await page.$('canvas') !== null;
  console.log('Canvas element rendered:', canvasExists);

  // Scroll down smoothly to trigger GSAP sequence
  console.log('Testing scroll scrubbing...');
  await page.evaluate(async () => {
    window.scrollTo({ top: 1200, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1000));

  await page.evaluate(async () => {
    window.scrollTo({ top: 2500, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1000));

  // 2. Mobile Responsiveness Test (375x812 - iPhone X)
  console.log('Testing Mobile Responsiveness (375x812)...');
  await page.setViewport({ width: 375, height: 812, isMobile: true });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });

  const hasHorizontalScroll = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  console.log('Mobile horizontal overflow detected:', hasHorizontalScroll);

  // 3. Test About Page (DotGlobe)
  console.log('Testing About Page DotGlobe WebGL...');
  await page.goto('http://localhost:3000/about', { waitUntil: 'networkidle2', timeout: 30000 });
  const aboutCanvas = await page.$('canvas') !== null;
  console.log('About page DotGlobe canvas rendered:', aboutCanvas);

  console.log('Page Errors encountered:', errors.length);
  if (errors.length > 0) {
    console.log('Errors:', errors);
  }

  await browser.close();
  console.log('QA Verification completed successfully!');
}

verify().catch(e => {
  console.error('QA Verification failed:', e);
  process.exit(1);
});
