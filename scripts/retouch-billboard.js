const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function retouchBillboard() {
  console.log('Retouching billboard in ohotechbg.1.jpg...');
  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  // Start from pristine root image ohotechbg.1.jpg
  const srcPath = path.resolve('ohotechbg.1.jpg');
  const imgData = fs.readFileSync(srcPath).toString('base64');
  const dataUri = 'data:image/jpeg;base64,' + imgData;

  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@700;800&family=Plus+Jakarta+Sans:wght@800;900&display=swap" rel="stylesheet">
      </head>
      <body style="margin:0; background:#000;">
        <canvas id="cvs"></canvas>
      </body>
    </html>
  `);

  await page.evaluateHandle('document.fonts.ready');

  const resultBase64 = await page.evaluate(async (uri) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const cvs = document.getElementById('cvs');
        const ctx = cvs.getContext('2d');
        const w = img.width; // 4568
        const h = img.height; // 3050
        cvs.width = w;
        cvs.height = h;

        // 1. Draw base authentic photo
        ctx.drawImage(img, 0, 0);

        // 2. Billboard Retouch Coordinates:
        // Precise inner billboard area (leaving the outer metal border intact)
        const bbX = 1156;
        const bbY = 1018;
        const bbW = 2032;
        const bbH = 752;

        // Fill inner billboard with clean, authentic matte dark background
        ctx.fillStyle = '#06070a';
        ctx.fillRect(bbX, bbY, bbW, bbH);

        // Subtle gradient on billboard to match photographic ambient light (slightly lighter at top right)
        const bbGrad = ctx.createLinearGradient(bbX, bbY, bbX + bbW, bbY + bbH);
        bbGrad.addColorStop(0, 'rgba(10, 16, 26, 0.85)');
        bbGrad.addColorStop(1, 'rgba(4, 6, 10, 0.95)');
        ctx.fillStyle = bbGrad;
        ctx.fillRect(bbX, bbY, bbW, bbH);

        // Subtle high-tech inner border
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
        ctx.lineWidth = 4;
        ctx.strokeRect(bbX + 20, bbY + 20, bbW - 40, bbH - 40);

        // Render Crisp OHO TECH In-Picture Typography directly onto billboard
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        const centerX = bbX + bbW / 2;

        // Line 1: No more SOFTWARE issues.
        const line1Y = bbY + 290;
        ctx.font = '900 162px "Plus Jakarta Sans", sans-serif';
        const t1 = 'No more ';
        const t2 = 'SOFTWARE';
        const t3 = ' issues.';
        const w1 = ctx.measureText(t1).width;
        const w2 = ctx.measureText(t2).width;
        const w3 = ctx.measureText(t3).width;
        const totalW = w1 + w2 + w3;
        const startX = centerX - totalW / 2;

        ctx.fillStyle = '#ffffff';
        ctx.fillText(t1, startX, line1Y);

        // Software highlight box
        const sX = startX + w1;
        ctx.fillStyle = 'rgba(16, 185, 129, 0.22)';
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.85)';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.roundRect(sX - 16, line1Y - 95, w2 + 32, 175, 20);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#34d399'; // Emerald-400
        ctx.shadowColor = 'rgba(52, 211, 153, 0.5)';
        ctx.shadowBlur = 20;
        ctx.fillText(t2, sX, line1Y);
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#ffffff';
        ctx.fillText(t3, sX + w2, line1Y);

        // Line 2: ▲ /~ npx oho-tech deploy █
        const line2Y = bbY + 535;
        ctx.font = '800 100px "JetBrains Mono", monospace';
        const l2Cmd = 'npx oho-tech deploy';
        const cmdW = ctx.measureText(l2Cmd).width;
        const totalL2W = 100 + 130 + cmdW + 50;
        const l2StartX = centerX - totalL2W / 2;

        ctx.fillStyle = '#38bdf8'; // Sky-400
        ctx.fillText('▲', l2StartX, line2Y);

        ctx.fillStyle = '#94a3b8'; // Slate-400
        ctx.fillText(' /~ ', l2StartX + 90, line2Y);

        ctx.fillStyle = '#34d399'; // Emerald-400
        ctx.fillText(l2Cmd, l2StartX + 270, line2Y);

        // Terminal cursor
        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 15;
        ctx.fillRect(l2StartX + 295 + cmdW, line2Y - 60, 40, 96);
        ctx.shadowBlur = 0;

        // 3. Ambient Vignetting & Night/Dusk Tone Curve
        // Seamlessly feather edges into deep midnight #08090b
        // Bottom fade
        const bottomFade = ctx.createLinearGradient(0, h * 0.75, 0, h);
        bottomFade.addColorStop(0, 'rgba(8, 9, 11, 0)');
        bottomFade.addColorStop(0.55, 'rgba(8, 9, 11, 0.65)');
        bottomFade.addColorStop(1, '#08090b');
        ctx.fillStyle = bottomFade;
        ctx.fillRect(0, h * 0.75, w, h * 0.25);

        // Sides fade
        const leftFade = ctx.createLinearGradient(0, 0, w * 0.08, 0);
        leftFade.addColorStop(0, '#08090b');
        leftFade.addColorStop(1, 'rgba(8, 9, 11, 0)');
        ctx.fillStyle = leftFade;
        ctx.fillRect(0, 0, w * 0.08, h);

        const rightFade = ctx.createLinearGradient(w * 0.92, 0, w, 0);
        rightFade.addColorStop(0, 'rgba(8, 9, 11, 0)');
        rightFade.addColorStop(1, '#08090b');
        ctx.fillStyle = rightFade;
        ctx.fillRect(w * 0.92, 0, w * 0.08, h);

        resolve(cvs.toDataURL('image/jpeg', 0.94));
      };
      img.src = uri;
    });
  }, dataUri);

  await browser.close();

  const outBuffer = Buffer.from(resultBase64.replace(/^data:image\/jpeg;base64,/, ''), 'base64');
  const destPath = path.resolve('public/images/ohotechbg.1.jpg');
  fs.writeFileSync(destPath, outBuffer);
  console.log('Successfully updated public/images/ohotechbg.1.jpg, size:', outBuffer.length);
}

retouchBillboard().catch(console.error);
