/* Capturas rápidas para revisar el diseño a ojo.
   Uso: NODE_PATH=/c/Users/alvar/node_modules node scripts/shots.js */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE = process.env.ASTRO_URL || 'http://127.0.0.1:8971/';
const CAPS = path.join(__dirname, '..', 'screenshots');
fs.mkdirSync(CAPS, { recursive: true });

/* Lenis ignora window.scrollTo: hay que bajar con la rueda */
async function bajar(page, hasta) {
  let y = 0;
  while (y < hasta) {
    await page.mouse.wheel(0, 420);
    y += 420;
    await page.waitForTimeout(90);
  }
  await page.waitForTimeout(2600);
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errores = [];
  page.on('console', (m) => { if (m.type() === 'error') errores.push(m.text()); });
  page.on('pageerror', (e) => errores.push('pageerror: ' + e.message));

  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3200);
  await page.screenshot({ path: path.join(CAPS, '01-hero.png') });

  const secciones = ['#academia', '#niveles', '#actividades', '#calendario',
    '#campamentos', '#colegios', '#taller', '#novedades', '#fotos', '#resenas',
    '#empleo', '#contacto'];
  /* Lenis ignora window.scrollTo, así que se baja con la rueda hasta que
     la sección queda arriba. Así además se disparan todos los ScrollTrigger. */
  for (const sel of secciones) {
    for (let i = 0; i < 400; i++) {
      const arriba = await page.evaluate((s) => {
        const el = document.querySelector(s);
        return el ? el.getBoundingClientRect().top : 1e9;
      }, sel);
      if (arriba <= 90) break;
      await page.mouse.wheel(0, Math.min(700, Math.max(140, arriba - 80)));
      await page.waitForTimeout(80);
    }
    await page.waitForTimeout(2400);
    await page.screenshot({ path: path.join(CAPS, sel.slice(1) + '.png') });
  }

  /* móvil 400 px */
  const movil = await browser.newPage({ viewport: { width: 400, height: 860 }, isMobile: true, hasTouch: true });
  await movil.goto(BASE, { waitUntil: 'networkidle' });
  await movil.waitForTimeout(3000);
  await movil.screenshot({ path: path.join(CAPS, 'm-hero.png') });
  await movil.screenshot({ path: path.join(CAPS, 'm-full.png'), fullPage: true });
  await movil.close();

  console.log('errores de consola:', JSON.stringify(errores, null, 1));
  await browser.close();
})();
