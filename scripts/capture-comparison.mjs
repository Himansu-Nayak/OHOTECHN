import puppeteer from 'puppeteer';
import fs from 'fs';

async function captureComparison() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Capturing unitedcarriers.com sections...');
  try {
    await page.goto('https://unitedcarriers.com/', { waitUntil: 'networkidle2', timeout: 45000 });
    await new Promise(r => setTimeout(r, 3000));
    await page.screenshot({ path: 'public/uc-01-hero.png', fullPage: false });

    await page.evaluate(() => window.scrollBy(0, 1200));
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: 'public/uc-02-scroll.png', fullPage: false });

    await page.evaluate(() => window.scrollBy(0, 2000));
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: 'public/uc-03-services.png', fullPage: false });

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: 'public/uc-04-footer.png', fullPage: false });
    console.log('United Carriers screenshots captured!');
  } catch (err) {
    console.error('Error capturing unitedcarriers.com:', err.message);
  }

  console.log('Capturing local OHOTECHN sections...');
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: 'public/oho-01-hero.png', fullPage: false });

    await page.evaluate(() => window.scrollBy(0, 1100));
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: 'public/oho-02-sequence.png', fullPage: false });

    await page.evaluate(() => window.scrollBy(0, 1800));
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: 'public/oho-03-services.png', fullPage: false });

    await page.evaluate(() => window.scrollBy(0, 2000));
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: 'public/oho-04-topology.png', fullPage: false });

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: 'public/oho-05-footer.png', fullPage: false });
    console.log('OHOTECHN screenshots captured!');
  } catch (err) {
    console.error('Error capturing OHOTECHN:', err.message);
  }

  await browser.close();
}

captureComparison();
