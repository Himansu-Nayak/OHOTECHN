import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import sharp from 'sharp';

const OUTPUT_DIR = path.resolve('public/images/3d');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const VISUALS = [
  {
    name: 'cloud-engine-3d',
    title: 'DISTRIBUTED CLOUD ENGINE',
    subtitle: 'HYPERSCALE ARCHITECTURE',
    accentColor: '#10b981', // Emerald
    accentRgb: '16, 185, 129',
    type: 'cloud',
    spec: 'MULTI-REGION REPLICATION // 99.999% UPTIME',
    telemetry: {
      status: 'ONLINE [CLUSTER-01]',
      metric1: '500K+ RPS',
      metric2: '< 12MS P99'
    }
  },
  {
    name: 'ai-neural-mesh-3d',
    title: 'NEURAL TENSOR NETWORK',
    subtitle: 'AUTONOMOUS AI SYSTEMS',
    accentColor: '#06b6d4', // Cyan
    accentRgb: '6, 182, 212',
    type: 'ai',
    spec: 'LLM INFERENCE & REAL-TIME EMBEDDINGS',
    telemetry: {
      status: 'WEIGHTS LOADED',
      metric1: '128K CTX',
      metric2: '0.04S TTFT'
    }
  },
  {
    name: 'web-platform-3d',
    title: 'ENTERPRISE WEB PLATFORM',
    subtitle: 'HIGH-CONCURRENCY REACT/NEXT',
    accentColor: '#3b82f6', // Blue
    accentRgb: '59, 130, 246',
    type: 'web',
    spec: 'EDGE HYDRATION // ZERO RUNTIME LEAKS',
    telemetry: {
      status: 'EDGE DEPLOYED',
      metric1: '100% SCORE',
      metric2: '42MS FCP'
    }
  },
  {
    name: 'mobile-ecosystem-3d',
    title: 'CROSS-PLATFORM MOBILE NODE',
    subtitle: 'NATIVE SWIFT & KOTLIN CORE',
    accentColor: '#8b5cf6', // Violet
    accentRgb: '139, 92, 246',
    type: 'mobile',
    spec: 'NATIVE 120FPS METAL/VULKAN PIPELINE',
    telemetry: {
      status: 'SYNC ACTIVE',
      metric1: '120 FPS',
      metric2: 'OFFLINE 1ST'
    }
  },
  {
    name: 'enterprise-erp-3d',
    title: 'DISTRIBUTED ERP LEDGER',
    subtitle: 'REAL-TIME ASSET TRACKING',
    accentColor: '#f59e0b', // Amber
    accentRgb: '245, 158, 11',
    type: 'erp',
    spec: 'ZERO-KNOWLEDGE AUDIT TRAIL // REAL-TIME INVENTORY',
    telemetry: {
      status: 'SYNCHRONIZED',
      metric1: '$4.2B FLOW',
      metric2: '0.00% DRIFT'
    }
  },
  {
    name: 'ui-ux-design-3d',
    title: 'SPATIAL DESIGN FRAMEWORK',
    subtitle: 'MICRO-INTERACTION TOKENS',
    accentColor: '#ec4899', // Pink
    accentRgb: '236, 72, 153',
    type: 'design',
    spec: '44PX LUXURY CURVATURE // DYNAMIC TOKENS',
    telemetry: {
      status: 'SYSTEM ACTIVE',
      metric1: '44PX RAD',
      metric2: '60+ TOKENS'
    }
  }
];

async function generateVisuals() {
  console.log('Generating high-craft 3D procedural cards with Puppeteer...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 720, deviceScaleFactor: 2 });

  for (const item of VISUALS) {
    console.log(`Rendering 3D visual: ${item.name}...`);
    
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1200px;
      height: 720px;
      background: #080a0f;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace;
      color: #ffffff;
      overflow: hidden;
    }
    .card-wrap {
      position: relative;
      width: 1100px;
      height: 640px;
      background: radial-gradient(circle at 75% 45%, rgba(${item.accentRgb}, 0.15) 0%, rgba(13, 16, 23, 0.95) 60%, #080a0f 100%);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 44px;
      overflow: hidden;
      display: flex;
      box-shadow: 0 50px 100px -20px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.2);
    }
    .grid-lines {
      position: absolute;
      inset: 0;
      background-image: 
        linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
      background-size: 40px 40px;
      mask-image: radial-gradient(circle at 60% 50%, black 50%, transparent 90%);
    }
    .content-side {
      position: relative;
      width: 520px;
      height: 100%;
      padding: 56px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      z-index: 2;
    }
    .pill-tag {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 8px 18px;
      background: rgba(${item.accentRgb}, 0.1);
      border: 1px solid rgba(${item.accentRgb}, 0.3);
      border-radius: 9999px;
      font-family: monospace;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: ${item.accentColor};
      width: fit-content;
    }
    .pill-dot {
      width: 8px;
      height: 8px;
      background: ${item.accentColor};
      border-radius: 50%;
      box-shadow: 0 0 12px ${item.accentColor};
    }
    .title-group {
      margin-top: 24px;
    }
    .sub-title {
      font-family: monospace;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.2em;
      color: rgba(255, 255, 255, 0.5);
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    .main-title {
      font-size: 38px;
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1.08;
      color: #ffffff;
      text-transform: uppercase;
    }
    .spec-text {
      font-family: monospace;
      font-size: 12px;
      letter-spacing: 0.08em;
      color: rgba(255, 255, 255, 0.6);
      margin-top: 14px;
      line-height: 1.5;
    }
    .telemetry-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      padding-top: 28px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }
    .tele-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .tele-lbl {
      font-family: monospace;
      font-size: 10px;
      color: rgba(255, 255, 255, 0.4);
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    .tele-val {
      font-size: 15px;
      font-weight: 700;
      color: #ffffff;
      font-family: monospace;
    }
    .visual-side {
      position: relative;
      flex: 1;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    canvas {
      width: 540px;
      height: 540px;
    }
  </style>
</head>
<body>
  <div class="card-wrap">
    <div class="grid-lines"></div>
    <div class="content-side">
      <div>
        <div class="pill-tag">
          <span class="pill-dot"></span>
          OHO CORE SYSTEM
        </div>
        <div class="title-group">
          <div class="sub-title">${item.subtitle}</div>
          <div class="main-title">${item.title}</div>
          <div class="spec-text">${item.spec}</div>
        </div>
      </div>

      <div class="telemetry-grid">
        <div class="tele-item">
          <span class="tele-lbl">STATUS</span>
          <span class="tele-val" style="color: ${item.accentColor}">${item.telemetry.status}</span>
        </div>
        <div class="tele-item">
          <span class="tele-lbl">THROUGHPUT</span>
          <span class="tele-val">${item.telemetry.metric1}</span>
        </div>
        <div class="tele-item">
          <span class="tele-lbl">LATENCY</span>
          <span class="tele-val">${item.telemetry.metric2}</span>
        </div>
      </div>
    </div>

    <div class="visual-side">
      <canvas id="c" width="1080" height="1080"></canvas>
    </div>
  </div>

  <script>
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');
    const w = 1080;
    const h = 1080;
    const cx = w / 2;
    const cy = h / 2;

    const accent = '${item.accentColor}';
    const accentRgb = '${item.accentRgb}';
    const type = '${item.type}';

    function drawIsometricCube(x, y, size, height, colorTop, colorLeft, colorRight) {
      const hw = size;
      const hh = size * 0.58;

      // Top face
      ctx.fillStyle = colorTop;
      ctx.beginPath();
      ctx.moveTo(x, y - height);
      ctx.lineTo(x + hw, y - height + hh);
      ctx.lineTo(x, y - height + hh * 2);
      ctx.lineTo(x - hw, y - height + hh);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.stroke();

      // Left face
      ctx.fillStyle = colorLeft;
      ctx.beginPath();
      ctx.moveTo(x - hw, y - height + hh);
      ctx.lineTo(x, y - height + hh * 2);
      ctx.lineTo(x, y + hh * 2);
      ctx.lineTo(x - hw, y + hh);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.stroke();

      // Right face
      ctx.fillStyle = colorRight;
      ctx.beginPath();
      ctx.moveTo(x + hw, y - height + hh);
      ctx.lineTo(x, y - height + hh * 2);
      ctx.lineTo(x, y + hh * 2);
      ctx.lineTo(x + hw, y + hh);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.stroke();
    }

    // Glow background
    const bgGlow = ctx.createRadialGradient(cx, cy, 20, cx, cy, 400);
    bgGlow.addColorStop(0, 'rgba(' + accentRgb + ', 0.25)');
    bgGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = bgGlow;
    ctx.fillRect(0, 0, w, h);

    if (type === 'cloud') {
      // 3D Server Towers
      const offsets = [
        { dx: -180, dy: -60, h: 220, size: 70 },
        { dx: 0, dy: -120, h: 320, size: 85 },
        { dx: 180, dy: -60, h: 260, size: 70 },
        { dx: -90, dy: 80, h: 280, size: 80 },
        { dx: 90, dy: 80, h: 240, size: 75 }
      ];

      offsets.forEach((o, idx) => {
        drawIsometricCube(
          cx + o.dx, 
          cy + o.dy, 
          o.size, 
          o.h, 
          idx === 1 ? accent : '#1e2638', 
          '#121724', 
          '#0d111a'
        );
      });

      // Data beams
      ctx.strokeStyle = 'rgba(' + accentRgb + ', 0.6)';
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.moveTo(cx - 180, cy - 280);
      ctx.lineTo(cx, cy - 440);
      ctx.lineTo(cx + 180, cy - 320);
      ctx.lineTo(cx + 90, cy - 160);
      ctx.lineTo(cx - 90, cy - 200);
      ctx.closePath();
      ctx.stroke();
      ctx.setLineDash([]);
    } else if (type === 'ai') {
      // Neural network sphere & tensor matrix
      ctx.lineWidth = 2;
      for (let r = 80; r <= 360; r += 70) {
        ctx.strokeStyle = 'rgba(' + accentRgb + ', ' + (0.15 + (r/360)*0.2) + ')';
        ctx.beginPath();
        ctx.ellipse(cx, cy, r, r * 0.55, -0.2, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Nodes
      const nodeCount = 28;
      const nodes = [];
      for (let i = 0; i < nodeCount; i++) {
        const ang = (i / nodeCount) * Math.PI * 2;
        const rad = 120 + ((i * 47) % 200);
        const nx = cx + Math.cos(ang) * rad;
        const ny = cy + Math.sin(ang) * (rad * 0.55);
        nodes.push({ x: nx, y: ny });
      }

      // Connect lines
      ctx.strokeStyle = 'rgba(' + accentRgb + ', 0.35)';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dist = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          if (dist < 180) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw node dots
      nodes.forEach((n, i) => {
        ctx.fillStyle = i % 3 === 0 ? accent : '#ffffff';
        ctx.beginPath();
        ctx.arc(n.x, n.y, i % 4 === 0 ? 9 : 5, 0, Math.PI * 2);
        ctx.fill();
        if (i % 3 === 0) {
          ctx.strokeStyle = 'rgba(' + accentRgb + ', 0.5)';
          ctx.beginPath();
          ctx.arc(n.x, n.y, 16, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      // Core tensor center
      drawIsometricCube(cx, cy - 40, 60, 120, accent, '#103544', '#0a232e');
    } else if (type === 'web') {
      // Layered web platforms
      for (let layer = 0; layer < 4; layer++) {
        const yOff = cy + 160 - layer * 110;
        drawIsometricCube(cx, yOff, 220 - layer * 30, 24, layer === 3 ? accent : '#1c2438', '#101524', '#0b0f1a');
      }
    } else if (type === 'mobile') {
      // 3D Glassmorphic Device Mockup
      drawIsometricCube(cx - 30, cy + 40, 140, 260, '#1a1f2e', '#0e111a', '#080a10');
      drawIsometricCube(cx + 60, cy + 100, 110, 200, accent, '#38165e', '#230e3b');
    } else if (type === 'erp') {
      // 3D Matrix Blocks
      for (let r = -2; r <= 2; r++) {
        for (let c = -2; c <= 2; c++) {
          const x = cx + (c - r) * 75;
          const y = cy + (c + r) * 42;
          const isHighlighted = (r === 0 && c === 0) || (r === 1 && c === -1) || (r === -1 && c === 1);
          drawIsometricCube(x, y, 42, isHighlighted ? 120 : 50, isHighlighted ? accent : '#2a2418', '#1a160e', '#120f0a');
        }
      }
    } else {
      // Spatial UI Design Rings
      for (let s = 1; s <= 5; s++) {
        ctx.strokeStyle = s === 3 ? accent : 'rgba(255,255,255,' + (0.1 + s * 0.08) + ')';
        ctx.lineWidth = s === 3 ? 4 : 2;
        ctx.beginPath();
        ctx.roundRect(cx - s * 65, cy - s * 50, s * 130, s * 100, 24);
        ctx.stroke();
      }
      drawIsometricCube(cx, cy, 70, 90, accent, '#4a1532', '#2a0c1c');
    }
  </script>
</body>
</html>
    `;

    await page.setContent(htmlContent);
    await new Promise(r => setTimeout(r, 200));

    const screenshotBuffer = await page.screenshot({ type: 'png' });
    
    // Compress to WebP with Sharp
    const targetFile = path.join(OUTPUT_DIR, `${item.name}.webp`);
    await sharp(screenshotBuffer)
      .webp({ quality: 90, effort: 4 })
      .toFile(targetFile);

    console.log(`Saved: ${targetFile}`);
  }

  await browser.close();
  console.log('All 3D procedural visuals rendered successfully!');
}

generateVisuals().catch(err => {
  console.error('Failed to generate 3D visuals:', err);
  process.exit(1);
});
