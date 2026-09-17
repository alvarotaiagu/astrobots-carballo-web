/* Genera los iconos PNG y la imagen Open Graph de Astrobots a partir
   del SVG de marca, capturando con Playwright.
   Uso: NODE_PATH=/c/Users/alvar/node_modules node scripts/generate_brand.js */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..');
const MARCA = path.join(RAIZ, 'assets', 'img', 'brand');
const svg = fs.readFileSync(path.join(MARCA, 'astro-marca.svg'), 'utf8');

const paginaIcono = (lado) => `<!DOCTYPE html><meta charset="utf-8">
<style>html,body{margin:0;padding:0;background:transparent}
 svg{display:block;width:${lado}px;height:${lado}px}</style>${svg}`;

const paginaOG = `<!DOCTYPE html><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Rubik:wght@500;800;900&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
<style>
 *{box-sizing:border-box}
 html,body{margin:0;width:1200px;height:630px;overflow:hidden}
 body{background:#fff;font-family:Rubik,sans-serif;color:#0F172A;position:relative}
 .rejilla{position:absolute;inset:0;background-image:radial-gradient(circle,#C8D2DE 2px,transparent 2.2px);background-size:30px 30px}
 .caja{position:relative;display:flex;align-items:center;gap:56px;padding:0 74px;height:100%}
 .txt{flex:1 1 auto}
 .kick{font-family:'JetBrains Mono',monospace;font-size:20px;letter-spacing:.2em;text-transform:uppercase;color:#55627A;margin:0 0 18px}
 h1{font-size:82px;font-weight:900;line-height:.94;letter-spacing:-.035em;margin:0 0 22px}
 .slab{position:relative;display:inline-block;padding:0 .16em;z-index:0}
 .slab::before{content:"";position:absolute;inset:.08em -.02em .1em;background:#8FD32E;border-radius:8px;z-index:-1}
 .sub{font-size:25px;color:#55627A;margin:0 0 26px;max-width:24ch}
 .tags{display:flex;gap:12px;font-family:'JetBrains Mono',monospace;font-size:19px;font-weight:700}
 .tags span{background:#EEF1F5;border:2px solid #DDE3EA;border-radius:999px;padding:9px 20px}
 .tags .lima{background:#8FD32E;border-color:#0F172A}
 svg{width:330px;height:330px;flex:0 0 auto;filter:drop-shadow(0 22px 0 rgba(15,23,42,.14))}
</style>
<div class="rejilla"></div>
<div class="caja">
  <div class="txt">
    <p class="kick">Carballo · A Coruña</p>
    <h1>Aprende a<br><span class="slab">construir</span><br>el futuro</h1>
    <p class="sub">Robótica y nuevas tecnologías desde los 4 años.</p>
    <div class="tags"><span class="lima">ASTROBOTS</span><span>5,0 ★ · 9 reseñas</span></div>
  </div>
  ${svg}
</div>`;

(async () => {
  const browser = await chromium.launch();

  for (const lado of [96, 180, 192, 512]) {
    const page = await browser.newPage({
      viewport: { width: lado, height: lado },
      deviceScaleFactor: 1
    });
    await page.setContent(paginaIcono(lado));
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(MARCA, `icon-${lado}.png`),
      omitBackground: true
    });
    await page.close();
    console.log('icon-' + lado + '.png');
  }

  const og = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await og.setContent(paginaOG, { waitUntil: 'networkidle' });
  await og.waitForTimeout(2500);
  await og.screenshot({ path: path.join(RAIZ, 'assets', 'img', 'og-astrobots.jpg'), type: 'jpeg', quality: 88 });
  await og.close();
  console.log('og-astrobots.jpg');

  await browser.close();
})();
