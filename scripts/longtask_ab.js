/* A/B de tareas largas al cargar: la web tal cual contra la misma web con
   js/main.js vaciado. Sirve para saber si una tarea larga es del código
   propio o de GSAP + las fuentes web. Las pasadas se alternan para que el
   calentamiento del navegador no favorezca a ninguna.
   Uso: ASTRO_URL=… NODE_PATH=/c/Users/alvar/node_modules node scripts/longtask_ab.js */
const { chromium } = require('playwright');

const URL = process.env.ASTRO_URL || 'https://alvarotaiagu.github.io/astrobots-carballo-web/';

async function medir(browser, vaciarMain) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(() => {
    window.__largas = [];
    try {
      new PerformanceObserver((l) => {
        l.getEntries().forEach((e) => window.__largas.push(Math.round(e.duration)));
      }).observe({ entryTypes: ['longtask'] });
    } catch (e) { /* sin soporte */ }
  });
  if (vaciarMain) {
    await ctx.route('**/js/main.js', (r) =>
      r.fulfill({ status: 200, contentType: 'application/javascript', body: '/* vacio */' }));
  }
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(4500);
  const largas = await page.evaluate(() => window.__largas || []);
  await ctx.close();
  return largas;
}

(async () => {
  const browser = await chromium.launch();
  const con = [];
  const sin = [];
  for (let i = 0; i < 3; i++) {
    con.push(await medir(browser, false));
    sin.push(await medir(browser, true));
  }
  const peor = (a) => a.map((x) => (x.length ? Math.max.apply(null, x) : 0));
  console.log('con main.js  :', JSON.stringify(con), '-> peores', JSON.stringify(peor(con)));
  console.log('main.js vacío:', JSON.stringify(sin), '-> peores', JSON.stringify(peor(sin)));
  await browser.close();
})();
