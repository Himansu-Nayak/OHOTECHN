import puppeteer from 'puppeteer';
import fs from 'fs';

async function captureUC() {
  console.log('Launching browser to capture unitedcarriers.com...');
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu'
    ]
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36');
  await page.setViewport({ width: 1440, height: 900 });

  try {
    console.log('Navigating to unitedcarriers.com...');
    await page.goto('https://unitedcarriers.com/', { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(r => setTimeout(r, 4000));

    await page.screenshot({ path: 'public/uc-hero-real.png', fullPage: false });
    console.log('Captured UC hero');

    await page.evaluate(() => window.scrollBy(0, 1400));
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: 'public/uc-scroll-real.png', fullPage: false });
    console.log('Captured UC scroll section');

    await page.evaluate(() => window.scrollBy(0, 2200));
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: 'public/uc-services-real.png', fullPage: false });
    console.log('Captured UC services section');

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: 'public/uc-footer-real.png', fullPage: false });
    console.log('Captured UC footer');

  } catch (e) {
    console.log('Capture error or timeout:', e.message);
  } finally {
    await browser.close();
  }
}

captureUC();
