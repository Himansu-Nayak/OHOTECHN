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
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2500));

  // Helper function to capture section
  async function captureSection(selector, filename) {
    const el = await page.$(selector);
    if (el) {
      await el.scrollIntoView();
      await new Promise(r => setTimeout(r, 600));
      await el.screenshot({ path: path.join(ARTIFACT_DIR, filename) });
      console.log(`  ✔ Saved: ${filename}`);
      return true;
    } else {
      console.warn(`  ✖ Not found by selector: ${selector}`);
      return false;
    }
  }

  // 01. Hero
  await captureSection('#hero', 'section_01_hero.png');

  // 02. Stat Counter Strip (Task 1)
  await captureSection('#stat-counter-strip', 'task1_stat_counter_desktop.png');

  // 03. 3D Hardware Turntable Sequence
  await captureSection('#hardware-sequence', 'section_03_turntable.png');

  // 04. Partner Logos Marquee (Task 6)
  await captureSection('#partners-marquee', 'task6_marquee_desktop.png');

  // 05. Technology Statement
  await captureSection('#technology-statement', 'section_05_technology_statement.png');

  // 06. Horizontal Services Showcase
  await captureSection('#services-showcase', 'section_06_horizontal_services.png');

  // 07. System Architecture Flow
  await captureSection('#architecture', 'section_07_system_architecture.png');

  // 08. Layered Parallax Section (Task 3)
  await captureSection('#parallax-architecture', 'task3_parallax_desktop.png');

  // 09. Products Showcase
  await captureSection('#products', 'section_09_products_showcase.png');

  // 10. Capability Explorer
  await captureSection('#capabilities', 'section_10_capability_explorer.png');

  // 11. Services Explorer
  await captureSection('#services-explorer', 'section_11_services_explorer.png');

  // 12. Director Leadership Section
  await captureSection('#director', 'section_12_director_leadership.png');

  // 13. Verified Case Studies
  await captureSection('#case-studies', 'section_13_verified_case_studies.png');

  // 14. Infrastructure Stack
  await captureSection('#infrastructure-stack', 'section_14_infrastructure_stack.png');

  // 15. Global Infrastructure Map
  await captureSection('#global-network', 'section_15_global_map.png');

  // 16. Trust Proof Section
  await captureSection('#trust-proof', 'section_16_trust_proof.png');

  // 17. Editorial About Section
  await captureSection('#about', 'section_17_editorial_about.png');

  // 18. Technical Insights Showcase
  await captureSection('#insights', 'section_18_insights_showcase.png');

  // 19. Testimonials Carousel (Task 4)
  await captureSection('#testimonials', 'task4_testimonials_desktop.png');

  // 20. Enterprise FAQ Section (Task 4)
  const faqEl = await page.$('#faq');
  if (faqEl) {
    await faqEl.scrollIntoView();
    await new Promise(r => setTimeout(r, 500));
    const buttons = await faqEl.$$('button');
    if (buttons.length > 1) {
      await buttons[1].click();
      await new Promise(r => setTimeout(r, 400));
    }
    await faqEl.screenshot({ path: path.join(ARTIFACT_DIR, 'task4_faq_desktop.png') });
    console.log('  ✔ Saved: task4_faq_desktop.png');
  }

  // 21. Final Cinematic CTA
  await captureSection('#contact-cta', 'section_21_final_cta.png');

  // 22. Footer (Task 5)
  await captureSection('footer', 'task5_footer_desktop.png');

  // 23. Sticky Header CTA (Task 7)
  await page.evaluate(() => window.scrollTo(0, 1500));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'task7_sticky_cta_desktop.png') });
  console.log('  ✔ Saved: task7_sticky_cta_desktop.png');

  // 24. Mega Menu Overlay (Task 2)
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

  await captureSection('#stat-counter-strip', 'task1_stat_counter_mobile.png');
  await captureSection('footer', 'task5_footer_mobile.png');

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


