import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

const ARTIFACT_DIR = 'C:\\Users\\himan\\.gemini\\antigravity\\brain\\3abc3ce4-8357-4f9c-8c4b-b72b9ebabc99';

async function runVisualAudit() {
  console.log('=== STARTING VISUAL VERIFICATION & SCREENSHOT AUDIT ===\n');

  if (!fs.existsSync(ARTIFACT_DIR)) {
    fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // ─────────────────────────────────────────────────────────────
  // 1. DESKTOP VIEWPORT AUDIT (1440x900)
  // ─────────────────────────────────────────────────────────────
  console.log('[1/2] Capturing Desktop Viewport Screenshots (1440x900)...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 20000 });

  // Wait for initial loaders & animations
  await new Promise(r => setTimeout(r, 2500));

  // Screenshot: Hero & Stat Counter Strip (Task 1)
  const statCounterEl = await page.$('#stat-counter-strip');
  if (statCounterEl) {
    await statCounterEl.scrollIntoView();
    await new Promise(r => setTimeout(r, 600));
    await statCounterEl.screenshot({ path: path.join(ARTIFACT_DIR, 'task1_stat_counter_desktop.png') });
    console.log('  ✔ Saved: task1_stat_counter_desktop.png');
  } else {
    console.error('  ✖ Error: #stat-counter-strip not found!');
  }

  // Screenshot: Partner Marquee (Task 6)
  const marqueeEl = await page.$('#partners-marquee');
  if (marqueeEl) {
    await marqueeEl.scrollIntoView();
    await new Promise(r => setTimeout(r, 600));
    await marqueeEl.screenshot({ path: path.join(ARTIFACT_DIR, 'task6_marquee_desktop.png') });
    console.log('  ✔ Saved: task6_marquee_desktop.png');
  } else {
    console.error('  ✖ Error: #partners-marquee not found!');
  }

  // Screenshot: Layered Parallax Section (Task 3)
  const parallaxEl = await page.$('#parallax-architecture');
  if (parallaxEl) {
    await parallaxEl.scrollIntoView();
    await new Promise(r => setTimeout(r, 600));
    await parallaxEl.screenshot({ path: path.join(ARTIFACT_DIR, 'task3_parallax_desktop.png') });
    console.log('  ✔ Saved: task3_parallax_desktop.png');
  } else {
    console.error('  ✖ Error: #parallax-architecture not found!');
  }

  // Screenshot: Testimonials Carousel (Task 4)
  const testimonialsEl = await page.$('#testimonials');
  if (testimonialsEl) {
    await testimonialsEl.scrollIntoView();
    await new Promise(r => setTimeout(r, 600));
    await testimonialsEl.screenshot({ path: path.join(ARTIFACT_DIR, 'task4_testimonials_desktop.png') });
    console.log('  ✔ Saved: task4_testimonials_desktop.png');
  } else {
    console.error('  ✖ Error: #testimonials not found!');
  }

  // Screenshot: FAQ Accordion (Task 4) - Test single-open toggle
  const faqEl = await page.$('#faq');
  if (faqEl) {
    await faqEl.scrollIntoView();
    await new Promise(r => setTimeout(r, 500));
    // Click question 2 to verify toggle
    const buttons = await faqEl.$$('button');
    if (buttons.length > 1) {
      await buttons[1].click();
      await new Promise(r => setTimeout(r, 400));
    }
    await faqEl.screenshot({ path: path.join(ARTIFACT_DIR, 'task4_faq_desktop.png') });
    console.log('  ✔ Saved: task4_faq_desktop.png');
  } else {
    console.error('  ✖ Error: #faq not found!');
  }

  // Screenshot: Footer (Task 5)
  const footerEl = await page.$('footer');
  if (footerEl) {
    await footerEl.scrollIntoView();
    await new Promise(r => setTimeout(r, 600));
    await footerEl.screenshot({ path: path.join(ARTIFACT_DIR, 'task5_footer_desktop.png') });
    console.log('  ✔ Saved: task5_footer_desktop.png');
  } else {
    console.error('  ✖ Error: footer not found!');
  }

  // Screenshot: Sticky Header CTA (Task 7)
  await page.evaluate(() => window.scrollTo(0, 1500));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'task7_sticky_cta_desktop.png') });
  console.log('  ✔ Saved: task7_sticky_cta_desktop.png');

  // Screenshot: Mega Menu Overlay (Task 2)
  // Trigger mega menu open via custom event or button click
  await page.evaluate(() => {
    window.dispatchEvent(new CustomEvent('open-mega-menu'));
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'task2_megamenu_open_desktop.png') });
  console.log('  ✔ Saved: task2_megamenu_open_desktop.png');

  // ─────────────────────────────────────────────────────────────
  // 2. MOBILE VIEWPORT AUDIT (390x844)
  // ─────────────────────────────────────────────────────────────
  console.log('\n[2/2] Capturing Mobile Viewport Screenshots (390x844)...');
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 20000 });
  await new Promise(r => setTimeout(r, 2000));

  // Check mobile overflow
  const horizontalOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  console.log(`  Mobile Horizontal Overflow: ${horizontalOverflow ? 'FAIL (overflow detected)' : 'PASS (0px overflow)'}`);

  // Mobile Screenshots
  const mobileStatEl = await page.$('#stat-counter-strip');
  if (mobileStatEl) {
    await mobileStatEl.scrollIntoView();
    await new Promise(r => setTimeout(r, 500));
    await mobileStatEl.screenshot({ path: path.join(ARTIFACT_DIR, 'task1_stat_counter_mobile.png') });
    console.log('  ✔ Saved: task1_stat_counter_mobile.png');
  }

  const mobileFooterEl = await page.$('footer');
  if (mobileFooterEl) {
    await mobileFooterEl.scrollIntoView();
    await new Promise(r => setTimeout(r, 500));
    await mobileFooterEl.screenshot({ path: path.join(ARTIFACT_DIR, 'task5_footer_mobile.png') });
    console.log('  ✔ Saved: task5_footer_mobile.png');
  }

  // Mega menu on mobile
  await page.evaluate(() => {
    window.dispatchEvent(new CustomEvent('open-mega-menu'));
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'task2_megamenu_open_mobile.png') });
  console.log('  ✔ Saved: task2_megamenu_open_mobile.png');

  await browser.close();
  console.log('\n=== VISUAL AUDIT COMPLETED SUCCESSFULLY ===');
}

runVisualAudit().catch(err => {
  console.error('Audit Script Failed:', err);
  process.exit(1);
});
