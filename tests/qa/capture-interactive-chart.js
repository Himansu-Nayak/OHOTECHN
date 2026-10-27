const path = require('path');
const os = require('os');
const puppeteer = require(path.resolve(process.cwd(), 'node_modules/puppeteer'));
const crypto = require('crypto');

const secret = 'M9SVJ6KRSj7R5jUlXe2azJsNrDkv8LqTn2iwkrkrinhjd4gwzTc7KCu8WuXoiexy';

function base64url(str) {
  return Buffer.from(str).toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function generateToken(userId) {
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const now = Math.floor(Date.now() / 1000);
  const exp = now + 86400;
  const payload = base64url(JSON.stringify({
    sub: String(userId),
    iat: now,
    exp: exp
  }));
  const signature = crypto.createHmac('sha256', secret)
    .update(`${header}.${payload}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  return `${header}.${payload}.${signature}`;
}

const artifactDir = 'C:\\Users\\himan\\.gemini\\antigravity\\brain\\1c20c6b6-d483-485b-8869-fbc468c7c17d';

async function run() {
  const userDataDir = path.join(os.tmpdir(), 'chrome_data_chart_' + Date.now());
  const browser = await puppeteer.launch({
    headless: 'new',
    userDataDir,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });

  const adminToken = generateToken(1);

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.evaluateOnNewDocument((token) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('user', JSON.stringify({
      id: 1,
      name: 'System Admin',
      email: 'admin@ohotech.com',
      role: 'ROLE_ADMIN',
      enabled: true
    }));
  }, adminToken);

  console.log('Navigating to https://ohotechn.com/admin ...');
  await page.goto('https://ohotechn.com/admin', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 3500));
  console.log('Admin Page URL:', page.url());

  // Scroll to bring the chart cleanly into view
  await page.evaluate(() => {
    window.scrollBy(0, 360);
  });
  await new Promise(r => setTimeout(r, 1200));

  // Find the chart SVG
  const svgHandle = await page.$('svg.cursor-crosshair');
  if (svgHandle) {
    const box = await svgHandle.boundingBox();
    if (box) {
      console.log(`Found performance chart SVG at (${box.x}, ${box.y}, ${box.width}x${box.height})`);
      // Hover across the curve at 60% of width
      const targetX = box.x + box.width * 0.6;
      const targetY = box.y + box.height * 0.45;
      await page.mouse.move(targetX, targetY);
      console.log(`Hovered at (${targetX.toFixed(1)}, ${targetY.toFixed(1)})`);
      await new Promise(r => setTimeout(r, 1500));
    }
  } else {
    console.log('SVG cursor-crosshair selector not matched, searching SVGs in page');
    const svgs = await page.$$('svg');
    for (const svg of svgs) {
      const box = await svg.boundingBox();
      if (box && box.width > 300 && box.height > 120) {
        console.log(`Found large chart SVG at (${box.x}, ${box.y}, ${box.width}x${box.height})`);
        await page.mouse.move(box.x + box.width * 0.6, box.y + box.height * 0.45);
        await new Promise(r => setTimeout(r, 1500));
        break;
      }
    }
  }

  const screenshotPath = path.join(artifactDir, 'admin_v15_chart_tooltip_live.png');
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log('Saved Chart Tooltip Screenshot to:', screenshotPath);

  await browser.close();
}

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
