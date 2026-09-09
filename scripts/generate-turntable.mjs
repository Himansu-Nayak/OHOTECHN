import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOTAL_FRAMES = 72; // 360 degrees / 72 frames = 5 degrees per frame
const OUTPUT_DIR = path.resolve(__dirname, '../public/sequence/hero');
const WIDTH = 1600;
const HEIGHT = 1000;

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log(`Starting turntable generation for ${TOTAL_FRAMES} frames...`);
console.log(`Output directory: ${OUTPUT_DIR}`);

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      margin: 0;
      padding: 0;
      overflow: hidden;
      background-color: #0c0d0e;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100vw;
      height: 100vh;
    }
    #canvas-container {
      width: ${WIDTH}px;
      height: ${HEIGHT}px;
    }
  </style>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
</head>
<body>
  <div id="canvas-container"></div>
  <script>
    const width = ${WIDTH};
    const height = ${HEIGHT};
    const totalFrames = ${TOTAL_FRAMES};

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0b0d);
    scene.fog = new THREE.FogExp2(0x0a0b0d, 0.04);

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(5, 10, 7);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 30;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.9);
    fillLight.position.set(-6, 4, -4);
    scene.add(fillLight);

    const emeraldRimLight = new THREE.DirectionalLight(0x10b981, 2.2);
    emeraldRimLight.position.set(0, -2, -6);
    scene.add(emeraldRimLight);

    // Studio Floor with Subtle Grid Reflection
    const floorGeo = new THREE.PlaneGeometry(30, 30);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x07080a,
      roughness: 0.25,
      metalness: 0.85
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.5;
    floor.receiveShadow = true;
    scene.add(floor);

    // Grid helper on floor
    const grid = new THREE.GridHelper(24, 24, 0x10b981, 0x1e293b);
    grid.position.y = -1.49;
    scene.add(grid);

    // Master Group for the Hero Tech Subject (Assembled Device & Floating Holographic Data Nodes)
    const heroGroup = new THREE.Group();
    scene.add(heroGroup);

    // 1. Create Dashboard UI Dynamic Canvas Texture
    const uiCanvas = document.createElement('canvas');
    uiCanvas.width = 1024;
    uiCanvas.height = 640;
    const ctx = uiCanvas.getContext('2d');

    function drawDashboard(progress) {
      // Dark luxurious studio background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 1024, 640);

      // Header Bar
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, 1024, 70);

      // OHO TECH Logo Badge
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.roundRect(30, 18, 34, 34, 8);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
      ctx.fillText('OHO TECH', 78, 42);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px monospace';
      ctx.fillText('ENTERPRISE PLATFORM v3.4', 210, 42);

      // Status Pill
      ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(830, 18, 160, 34, 17);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(852, 35, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px monospace';
      ctx.fillText('ALL SYSTEMS GO', 866, 40);

      // Left Sidebar Navigation
      ctx.fillStyle = '#141e33';
      ctx.fillRect(0, 70, 200, 570);

      const navItems = ['Overview', 'Custom Software', 'Healthcare EMR', 'Campus ERP', 'Retail POS', 'Analytics', 'Settings'];
      navItems.forEach((item, idx) => {
        const y = 110 + idx * 48;
        if (idx === 0) {
          ctx.fillStyle = '#10b981';
          ctx.fillRect(0, y - 24, 4, 38);
          ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
          ctx.fillRect(4, y - 24, 196, 38);
          ctx.fillStyle = '#34d399';
        } else {
          ctx.fillStyle = '#64748b';
        }
        ctx.font = idx === 0 ? 'bold 14px system-ui' : '13px system-ui';
        ctx.fillText(item, 30, y);
      });

      // Main Content Area - 3 Metric Cards
      const metrics = [
        { label: 'ACTIVE TRANSACTIONS', val: '2.4M/sec', change: '+18.4%', col: '#10b981' },
        { label: 'GLOBAL LATENCY', val: '14.2ms', change: 'Optimal', col: '#38bdf8' },
        { label: 'ENTERPRISE UPTIME', val: '99.998%', change: 'SLA Met', col: '#f59e0b' },
      ];

      metrics.forEach((m, i) => {
        const x = 230 + i * 255;
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.roundRect(x, 90, 235, 100, 12);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.stroke();

        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px monospace';
        ctx.fillText(m.label, x + 16, 116);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px system-ui';
        ctx.fillText(m.val, x + 16, 152);

        ctx.fillStyle = m.col;
        ctx.font = 'bold 12px monospace';
        ctx.fillText(m.change, x + 16, 174);
      });

      // Big Real-Time Activity Wave Chart
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(230, 210, 750, 240, 14);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px system-ui';
      ctx.fillText('Real-Time Workload & Microservices Throughput', 250, 244);

      // Draw Glowing Wave Graph
      ctx.beginPath();
      const chartStartX = 250;
      const chartStartY = 390;
      const chartWidth = 710;
      const points = 40;
      
      ctx.moveTo(chartStartX, chartStartY);
      for (let p = 0; p <= points; p++) {
        const px = chartStartX + (p / points) * chartWidth;
        const wave = Math.sin((p * 0.4) + (progress * Math.PI * 4)) * 35 +
                     Math.cos((p * 0.2) - (progress * Math.PI * 2)) * 25;
        const py = chartStartY - 70 + wave;
        ctx.lineTo(px, py);
      }
      ctx.lineTo(chartStartX + chartWidth, chartStartY + 30);
      ctx.lineTo(chartStartX, chartStartY + 30);
      ctx.closePath();

      const grad = ctx.createLinearGradient(0, 260, 0, 420);
      grad.addColorStop(0, 'rgba(16, 185, 129, 0.35)');
      grad.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
      ctx.fillStyle = grad;
      ctx.fill();

      // Top line
      ctx.beginPath();
      for (let p = 0; p <= points; p++) {
        const px = chartStartX + (p / points) * chartWidth;
        const wave = Math.sin((p * 0.4) + (progress * Math.PI * 4)) * 35 +
                     Math.cos((p * 0.2) - (progress * Math.PI * 2)) * 25;
        const py = chartStartY - 70 + wave;
        if (p === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Lower Panel - 2 Cards (Services Distribution + Live Logs)
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(230, 470, 360, 140, 12);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px system-ui';
      ctx.fillText('Infrastructure Deployment', 250, 500);

      // Progress bars
      const bars = [
        { name: 'Kubernetes Pods', pct: 0.88, col: '#10b981' },
        { name: 'Database Replication', pct: 0.96, col: '#38bdf8' },
        { name: 'Edge CDN Cache', pct: 0.75, col: '#a855f7' }
      ];
      bars.forEach((b, bi) => {
        const by = 525 + bi * 32;
        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px monospace';
        ctx.fillText(b.name, 250, by);

        ctx.fillStyle = '#0f172a';
        ctx.fillRect(380, by - 10, 190, 8);
        ctx.fillStyle = b.col;
        ctx.fillRect(380, by - 10, 190 * b.pct, 8);
      });

      // Right Log Panel
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(610, 470, 370, 140, 12);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px system-ui';
      ctx.fillText('Live Event Stream', 630, 500);

      const logs = [
        '[12:28:04] IVF Cycle Engine sync complete: +244 records',
        '[12:28:05] Campus ERP fee gateway ping: 200 OK (8ms)',
        '[12:28:06] Retail Counter #04 barcode inventory matched',
        '[12:28:07] Cloud microservices autoscaling node +1'
      ];
      logs.forEach((log, li) => {
        ctx.fillStyle = li === 0 ? '#34d399' : '#64748b';
        ctx.font = '10.5px monospace';
        ctx.fillText(log, 630, 526 + li * 22);
      });
    }

    drawDashboard(0);
    const screenTexture = new THREE.CanvasTexture(uiCanvas);
    screenTexture.generateMipmaps = true;
    screenTexture.minFilter = THREE.LinearMipmapLinearFilter;

    // 2. Build 3D Ultra-Modern High-Precision Laptop / Workstation Model
    // 2A. Bottom Base Chassis
    const baseChassisGeo = new THREE.BoxGeometry(4.4, 0.12, 3.0);
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0x181a20,
      metalness: 0.88,
      roughness: 0.28,
      envMapIntensity: 1.5
    });
    const baseChassis = new THREE.Mesh(baseChassisGeo, metalMat);
    baseChassis.position.set(0, -0.6, 0);
    baseChassis.castShadow = true;
    baseChassis.receiveShadow = true;
    heroGroup.add(baseChassis);

    // Keyboard well
    const keyboardGeo = new THREE.BoxGeometry(3.8, 0.02, 1.6);
    const keyboardMat = new THREE.MeshStandardMaterial({
      color: 0x0d0e12,
      roughness: 0.6,
      metalness: 0.3
    });
    const keyboard = new THREE.Mesh(keyboardGeo, keyboardMat);
    keyboard.position.set(0, -0.53, -0.3);
    heroGroup.add(keyboard);

    // Trackpad
    const trackpadGeo = new THREE.BoxGeometry(1.6, 0.01, 0.9);
    const trackpadMat = new THREE.MeshStandardMaterial({
      color: 0x222630,
      roughness: 0.2,
      metalness: 0.9
    });
    const trackpad = new THREE.Mesh(trackpadGeo, trackpadMat);
    trackpad.position.set(0, -0.535, 0.9);
    heroGroup.add(trackpad);

    // Emerald LED Accent Light Strip around base perimeter
    const ledStripGeo = new THREE.BoxGeometry(4.42, 0.02, 3.02);
    const ledStripMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.8
    });
    const ledStrip = new THREE.Mesh(ledStripGeo, ledStripMat);
    ledStrip.position.set(0, -0.66, 0);
    heroGroup.add(ledStrip);

    // 2B. Screen Lid (Rotated up at ~108 degrees)
    const lidGroup = new THREE.Group();
    lidGroup.position.set(0, -0.54, -1.48); // Hinge pivot point
    heroGroup.add(lidGroup);

    // Screen Bezel / Lid Shell
    const lidShellGeo = new THREE.BoxGeometry(4.4, 2.9, 0.08);
    const lidShell = new THREE.Mesh(lidShellGeo, metalMat);
    lidShell.position.set(0, 1.45, 0);
    lidShell.castShadow = true;
    lidGroup.add(lidShell);

    // OHO TECH Backlit Logo on Lid Exterior (Facing backwards)
    const logoExteriorGeo = new THREE.PlaneGeometry(0.8, 0.25);
    const logoExteriorMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      side: THREE.BackSide
    });
    const logoExt = new THREE.Mesh(logoExteriorGeo, logoExteriorMat);
    logoExt.position.set(0, 1.45, -0.045);
    lidGroup.add(logoExt);

    // Glass Display Screen (Facing forwards)
    const displayGeo = new THREE.PlaneGeometry(4.15, 2.65);
    const displayMat = new THREE.MeshBasicMaterial({
      map: screenTexture,
      side: THREE.FrontSide
    });
    const display = new THREE.Mesh(displayGeo, displayMat);
    display.position.set(0, 1.45, 0.045);
    lidGroup.add(display);

    // Tilt lid backwards realistically
    lidGroup.rotation.x = THREE.MathUtils.degToRad(18);

    // 3. Floating Architectural Holographic Orbit Rings & Particle Nodes
    const ringsGroup = new THREE.Group();
    heroGroup.add(ringsGroup);

    // Halo 1
    const ring1Geo = new THREE.TorusGeometry(3.6, 0.015, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.65
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 2.4;
    ringsGroup.add(ring1);

    // Halo 2
    const ring2Geo = new THREE.TorusGeometry(4.2, 0.012, 16, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.45
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI / 3;
    ring2.rotation.y = Math.PI / 6;
    ringsGroup.add(ring2);

    // Floating Data Node Spheres
    const nodeGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const nodeMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x10b981,
      emissiveIntensity: 0.9,
      roughness: 0.1
    });

    const nodes = [];
    const nodeCount = 8;
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2;
      const radius = 3.6;
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.set(Math.cos(angle) * radius, Math.sin(angle) * 0.8 + 0.3, Math.sin(angle) * radius);
      ringsGroup.add(node);
      nodes.push({ mesh: node, baseAngle: angle, radius });
    }

    // Camera setup
    camera.position.set(0, 1.8, 6.2);
    camera.lookAt(0, 0.2, 0);

    window.renderFrame = function(frameIndex) {
      const progress = frameIndex / totalFrames;
      const angle = progress * Math.PI * 2;

      // Turntable smooth 360 degree rotation
      heroGroup.rotation.y = angle;

      // Dynamic floating levitation
      heroGroup.position.y = Math.sin(progress * Math.PI * 4) * 0.08;

      // Orbit holographic halos counter-rotating
      ringsGroup.rotation.y = -angle * 0.5;
      ringsGroup.rotation.z = Math.sin(progress * Math.PI * 2) * 0.1;

      // Update dashboard dynamic animated wave
      drawDashboard(progress);
      screenTexture.needsUpdate = true;

      renderer.render(scene, camera);
      return renderer.domElement.toDataURL('image/png');
    };
  </script>
</body>
</html>
`;

async function generateFrames() {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--use-gl=angle',
      '--enable-webgl',
      '--ignore-gpu-blocklist',
      '--window-size=1600,1000'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: WIDTH, height: HEIGHT });
  await page.setContent(htmlContent);

  // Wait for Three.js and scene initialization
  await page.waitForFunction('typeof window.renderFrame === "function"');
  await new Promise((r) => setTimeout(r, 1000));

  console.log(`Rendering ${TOTAL_FRAMES} frames...`);
  let totalBytes = 0;

  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const frameIndexStr = String(i).padStart(3, '0');
    const dataUrl = await page.evaluate((idx) => window.renderFrame(idx), i);
    const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
    const pngBuffer = Buffer.from(base64Data, 'base64');

    const outputPath = path.join(OUTPUT_DIR, `frame_${frameIndexStr}.webp`);

    // Compress to sharp WebP at 1600px width with quality 84
    const webpBuffer = await sharp(pngBuffer)
      .webp({ quality: 84, effort: 4 })
      .toBuffer();

    fs.writeFileSync(outputPath, webpBuffer);
    totalBytes += webpBuffer.length;

    if (i % 12 === 0 || i === TOTAL_FRAMES - 1) {
      console.log(`Rendered & compressed frame ${i + 1}/${TOTAL_FRAMES} -> ${(webpBuffer.length / 1024).toFixed(1)} KB`);
    }
  }

  await browser.close();

  const totalMb = (totalBytes / (1024 * 1024)).toFixed(2);
  console.log(`\nSuccessfully rendered and saved ${TOTAL_FRAMES} frames!`);
  console.log(`Total sequence file size: ${totalMb} MB (Target was < 6MB)`);
}

generateFrames().catch((err) => {
  console.error('Frame generation failed:', err);
  process.exit(1);
});
