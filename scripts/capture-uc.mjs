import puppeteer from 'puppeteer';

async function captureUC() {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process'
    ]
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36');
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to unitedcarriers.com...');
  await page.goto('https://unitedcarriers.com/', { waitUntil: 'load', timeout: 60000 });
  await new Promise(r => setTimeout(r, 4000));
  await page.screenshot({ path: 'public/uc-01-hero.png', fullPage: false });
  console.log('Captured UC hero');

  await page.evaluate(() => window.scrollBy(0, 1500));
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'public/uc-02-scroll.png', fullPage: false });

  await page.evaluate(() => window.scrollBy(0, 2500));
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'public/uc-03-services.png', fullPage: false });

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'public/uc-04-footer.png', fullPage: false });

  console.log('All UC screenshots captured successfully!');
  await browser.close();
}

captureUC().catch(e => console.error(e));
