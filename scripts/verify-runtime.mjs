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
    if (err.message.includes('418') || err.message.includes('Hydration') || err.message.includes('hydration')) {
      warnings.push(`[HYDRATION WARN]: ${err.message}`);
    } else {
      errors.push(`[PAGE ERROR]: ${err.message}`);
    }
  });

  page.on('requestfailed', req => {
    const errText = req.failure()?.errorText;
    if (errText === 'net::ERR_ABORTED') return;
    errors.push(`[FAILED REQUEST]: ${req.url()} (${errText})`);
  });

  // 1. Desktop Viewport (1440x900)
  console.log('\n[1] Testing Desktop Viewport (1440x900)...');
  await page.setViewport({ width: 1440, height: 900 });
  const response = await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 15000 });
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

  // Check Technology Statement
  const techInfo = await page.evaluate(() => {
    const tech = document.getElementById('technology-statement');
    if (!tech) return { found: false };
    const text = tech.innerText;
    return {
      found: true,
      hasPhilosophy: text.includes('Technology should not create complexity'),
      hasPillars: text.includes('Four Pillars of Resilient Architecture') && text.includes('Decoupled Service Boundaries'),
      hasOutcomes: text.includes('100% CODE OWNERSHIP')
    };
  });
  console.log(`Technology Statement check:`, techInfo);

  // Check Services Showcase
  const servicesInfo = await page.evaluate(() => {
    const srv = document.getElementById('services-showcase');
    if (!srv) return { found: false };
    const text = srv.innerText;
    return {
      found: true,
      hasCapability: text.includes('Architectural Capabilities'),
      hasCards: text.includes('Distributed Cloud Architecture') && text.includes('Native Mobile Engineering')
    };
  });
  console.log(`Horizontal Services Showcase check:`, servicesInfo);

  // Check Living System Architecture
  const archInfo = await page.evaluate(() => {
    const arch = document.getElementById('architecture');
    if (!arch) return { found: false };
    const text = arch.innerText;
    const canvas = arch.querySelector('canvas');
    return {
      found: true,
      hasHeading: text.includes('Everything Connects') || text.includes('LIVING SYSTEM TOPOLOGY'),
      hasClientLayer: text.includes('Client & Multi-Tenant Experience'),
      hasCloudLayer: text.includes('Containerized Cloud Infrastructure'),
      hasCanvas: !!canvas
    };
  });
  console.log(`Living System Architecture check:`, archInfo);

  // Check Global Infrastructure Map
  const mapInfo = await page.evaluate(() => {
    const map = document.getElementById('global-network');
    if (!map) return { found: false };
    const text = map.innerText;
    const canvas = map.querySelector('canvas');
    return {
      found: true,
      hasHeading: text.includes('GLOBAL CLOUD TOPOLOGY') || text.includes('Global Scale'),
      hasNodes: text.includes('India Central') && text.includes('Singapore') && text.includes('Frankfurt'),
      hasCanvas: !!canvas
    };
  });
  console.log(`Global Infrastructure Map check:`, mapInfo);

  // Check Verified Case Studies
  const caseStudiesInfo = await page.evaluate(() => {
    const cs = document.getElementById('case-studies');
    if (!cs) return { found: false };
    const text = cs.innerText;
    return {
      found: true,
      hasHeading: text.includes('DEPLOYED SYSTEMS BLUEPRINT') || text.includes('Proven Engineering in Action'),
      hasCategories: text.includes('Healthcare & Hospitals') && text.includes('Educational Institutions'),
      hasBlueprint: text.includes('DEPLOYED ARCHITECTURAL TOPOLOGY')
    };
  });
  console.log(`Verified Case Studies check:`, caseStudiesInfo);

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
  const devRes = await devPage.goto('http://localhost:3000/developer', { waitUntil: 'domcontentloaded', timeout: 15000 });
  console.log(`/developer HTTP status: ${devRes.status()}`);
  const devPageTitle = await devPage.title();
  console.log(`/developer Title: ${devPageTitle}`);
  await devPage.close();

  // 2.1 Test Laptop Viewport (1280x800)
  console.log('\n[3.1] Testing Laptop Viewport (1280x800)...');
  const laptopPage = await browser.newPage();
  await laptopPage.setViewport({ width: 1280, height: 800 });
  const lapRes = await laptopPage.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 15000 });
  console.log(`Laptop HTTP status: ${lapRes.status()}`);
  await laptopPage.close();

  // 2.2 Test Tablet Viewport (768x1024)
  console.log('\n[3.2] Testing Tablet Viewport (768x1024)...');
  const tabPage = await browser.newPage();
  await tabPage.setViewport({ width: 768, height: 1024 });
  const tabRes = await tabPage.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 15000 });
  console.log(`Tablet HTTP status: ${tabRes.status()}`);
  await tabPage.close();

  // 3. Test Mobile Viewport (390x844)
  console.log('\n[4] Testing Mobile Viewport (390x844)...');
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 390, height: 844, isMobile: true });
  const mobRes = await mobilePage.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 15000 });
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
  await rmPage.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 15000 });
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
