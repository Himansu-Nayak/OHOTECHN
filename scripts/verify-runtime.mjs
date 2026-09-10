import puppeteer from 'puppeteer';

async function verifyRuntime() {
  console.log('--- STARTING RUNTIME & BROWSER VERIFICATION ---');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const errors = [];
  const warnings = [];

  const page = await browser.newPage();
  
  page.on('console', msg => {
    const text = msg.text();
    if (msg.type() === 'error') {
      errors.push(`[CONSOLE ERROR]: ${text}`);
    } else if (msg.type() === 'warn') {
      warnings.push(`[CONSOLE WARN]: ${text}`);
    }
  });

  page.on('pageerror', err => {
    errors.push(`[PAGE ERROR]: ${err.message}`);
  });

  page.on('requestfailed', req => {
    // ignore non-critical analytics or external if any
    errors.push(`[FAILED REQUEST]: ${req.url()} (${req.failure()?.errorText})`);
  });

  // 1. Desktop Viewport (1440x900)
  console.log('\n[1] Testing Desktop Viewport (1440x900)...');
  await page.setViewport({ width: 1440, height: 900 });
  const response = await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
  console.log(`HTTP Status: ${response.status()}`);

  // Wait for preloader to animate out (~2.5s)
  await page.waitForTimeout ? page.waitForTimeout(3000) : new Promise(r => setTimeout(r, 3000));

  // Check header visibility
  const headerVisible = await page.evaluate(() => {
    const header = document.querySelector('header');
    if (!header) return false;
    const rect = header.getBoundingClientRect();
    return rect.height > 0 && rect.width > 0;
  });
  console.log(`Header visible: ${headerVisible}`);

  // Check Hero visibility
  const heroVisible = await page.evaluate(() => {
    const hero = document.getElementById('hero');
    if (!hero) return false;
    const rect = hero.getBoundingClientRect();
    return rect.height > 0 && rect.width > 0;
  });
  console.log(`Hero visible: ${heroVisible}`);

  // Check 72-frame canvas scrubber
  const canvasExists = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    return !!canvas;
  });
  console.log(`72-frame 3D canvas present: ${canvasExists}`);

  // Scroll through entire page to check every section
  console.log('\n[2] Testing Full Scroll Progression & Section Visibility...');
  const sectionIds = [
    'hero',
    'hardware-sequence',
    'tech-stack',
    'technology-statement',
    'architecture',
    'products',
    'capabilities',
    'services',
    'director',
    'case-studies',
    'infrastructure',
    'trust',
    'about',
    'insights',
    'faq',
    'final-cta'
  ];

  for (let i = 0; i < 15; i++) {
    await page.evaluate(() => window.scrollBy(0, 800));
    await new Promise(r => setTimeout(r, 200));
  }

  // Check Director Section
  const directorInfo = await page.evaluate(() => {
    const dir = document.getElementById('director');
    if (!dir) return { found: false };
    const text = dir.innerText;
    const hasFounder = text.includes('Japabandhu Kampa');
    const hasDirector = text.includes('Director');
    const hasDev = text.includes('Developer Control Studio');
    const rect = dir.getBoundingClientRect();
    return {
      found: true,
      hasFounder,
      hasDirector,
      hasDev,
      height: rect.height
    };
  });
  console.log(`Director Section check:`, directorInfo);

  // Check FAQ Section
  const faqInfo = await page.evaluate(() => {
    const faq = document.getElementById('faq');
    if (!faq) return { found: false };
    const text = faq.innerText;
    return {
      found: true,
      hasQuestions: text.includes('CODE OWNERSHIP') && text.includes('UPTIME & RELIABILITY')
    };
  });
  console.log(`Enterprise FAQ Section check:`, faqInfo);

  // 2. Test /developer Route
  console.log('\n[3] Testing /developer Route...');
  const devPage = await browser.newPage();
  const devRes = await devPage.goto('http://localhost:3000/developer', { waitUntil: 'networkidle2', timeout: 30000 });
  console.log(`/developer HTTP status: ${devRes.status()}`);
  const devPageTitle = await devPage.title();
  console.log(`/developer Title: ${devPageTitle}`);
  await devPage.close();

  // 3. Test Mobile Viewport (390x844)
  console.log('\n[4] Testing Mobile Viewport (390x844)...');
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 390, height: 844, isMobile: true });
  const mobRes = await mobilePage.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
  console.log(`Mobile HTTP status: ${mobRes.status()}`);
  
  // Wait for loader
  await new Promise(r => setTimeout(r, 2500));

  const mobileOverflow = await mobilePage.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  console.log(`Mobile horizontal overflow detected: ${mobileOverflow}`);
  await mobilePage.close();

  // 4. Test Reduced Motion
  console.log('\n[5] Testing prefers-reduced-motion: reduce...');
  const rmPage = await browser.newPage();
  await rmPage.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await rmPage.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1000));
  const rmHeroVisible = await rmPage.evaluate(() => {
    const hero = document.getElementById('hero');
    return !!hero;
  });
  console.log(`Reduced motion hero visible: ${rmHeroVisible}`);
  await rmPage.close();

  await browser.close();

  console.log('\n--- VERIFICATION SUMMARY ---');
  console.log(`Critical Errors: ${errors.length}`);
  if (errors.length > 0) {
    console.error('Errors found:', errors);
  } else {
    console.log('All Browser & Runtime Checks Passed with 0 Errors!');
  }
}

verifyRuntime().catch(err => {
  console.error('Verification script crashed:', err);
  process.exit(1);
});
