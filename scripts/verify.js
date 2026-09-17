/* Verificación de la web de Astrobots con Playwright.
   Necesita un servidor local:  python -m http.server 8977
   Uso: ASTRO_URL=http://127.0.0.1:8977/ NODE_PATH=/c/Users/alvar/node_modules node scripts/verify.js
   Escribe scripts/verify-report.json y sale con 1 si algo falla. */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = process.env.ASTRO_URL || 'http://127.0.0.1:8977/';
const RAIZ = path.join(__dirname, '..');

const resultados = [];
const ok = (nombre, valor, detalle) => {
  resultados.push({ prueba: nombre, ok: !!valor, detalle: detalle === undefined ? null : detalle });
  console.log((valor ? 'OK   ' : 'FALLA') + ' ' + nombre +
    (detalle !== undefined ? '  ' + JSON.stringify(detalle) : ''));
};

async function nuevaPagina(browser, opciones) {
  const page = await browser.newPage(Object.assign({ viewport: { width: 1440, height: 900 } }, opciones || {}));
  page.errores = [];
  page.on('console', (m) => { if (m.type() === 'error') page.errores.push(m.text()); });
  page.on('pageerror', (e) => page.errores.push('pageerror: ' + e.message));
  return page;
}

/* Lenis ignora window.scrollTo: hay que bajar con la rueda para que
   disparen los ScrollTrigger del final de la página. */
async function bajarHasta(page, sel, margen) {
  const tope = margen === undefined ? 90 : margen;
  for (let i = 0; i < 500; i++) {
    const arriba = await page.evaluate((s) => {
      const el = document.querySelector(s);
      return el ? el.getBoundingClientRect().top : 1e9;
    }, sel);
    if (arriba <= tope) return true;
    await page.mouse.wheel(0, Math.min(700, Math.max(140, arriba - tope + 10)));
    await page.waitForTimeout(80);
  }
  return false;
}

/* Los `li` de la pila son sticky: su top se congela y nunca baja del
   umbral, así que hay que ir por coordenada de documento, no por
   posición en pantalla. */
async function bajarA(page, y) {
  for (let i = 0; i < 500; i++) {
    const actual = await page.evaluate(() => window.scrollY);
    if (actual >= y - 6) return true;
    await page.mouse.wheel(0, Math.min(700, Math.max(120, y - actual)));
    await page.waitForTimeout(80);
  }
  return false;
}

(async () => {
  const browser = await chromium.launch();

  /* ============ 1 · Página principal ============ */
  const page = await nuevaPagina(browser);
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3400);

  ok('sin errores de consola', page.errores.length === 0, page.errores);

  const meta = await page.evaluate(() => ({
    title: document.title,
    desc: (document.querySelector('meta[name="description"]') || {}).content,
    canonical: (document.querySelector('link[rel=canonical]') || {}).href,
    lang: document.documentElement.lang,
    h1: document.querySelectorAll('h1').length
  }));
  ok('title, description, canonical y lang',
    meta.title.includes('Astrobots') && meta.desc && meta.desc.length > 80 &&
    meta.canonical && meta.lang === 'es' && meta.h1 === 1, meta);

  const ld = await page.evaluate(() => {
    const n = document.querySelector('script[type="application/ld+json"]');
    try { return JSON.parse(n.textContent); } catch (e) { return null; }
  });
  const tipos = ld && ld['@graph'] ? ld['@graph'].map((x) => [].concat(x['@type']).join('+')) : [];
  const cursos = tipos.filter((t) => t === 'Course').length;
  ok('JSON-LD válido con LocalBusiness y >= 8 Course',
    !!ld && tipos.some((t) => t.indexOf('LocalBusiness') >= 0) && cursos >= 8,
    { cursos: cursos, tipos: tipos.length });

  /* --- Hero: las piezas se montan y la antena queda en lima --- */
  const hero = await page.evaluate(() => {
    const piezas = Array.from(document.querySelectorAll('#robotHero .pieza'));
    const bomb = document.querySelector('#robotHero .bombilla');
    return {
      total: piezas.length,
      montadas: piezas.filter((p) => parseFloat(getComputedStyle(p).opacity) > 0.95).length,
      sinDesplazar: piezas.filter((p) => {
        const m = new DOMMatrixReadOnly(getComputedStyle(p).transform);
        return Math.abs(m.e) < 1 && Math.abs(m.f) < 1;
      }).length,
      antena: bomb ? bomb.getAttribute('fill') : null
    };
  });
  ok('el robot del hero se monta entero (9 piezas en su sitio)',
    hero.total === 9 && hero.montadas === 9 && hero.sinDesplazar === 9, hero);
  ok('la antena acaba encendida en lima',
    (hero.antena || '').toUpperCase() === '#8FD32E', hero.antena);

  /* --- La palabra encajada --- */
  const encaje = await page.evaluate(() => {
    const e = document.querySelector('.hero .encaje');
    const m = new DOMMatrixReadOnly(getComputedStyle(e, '::before').transform);
    return { clase: e.classList.contains('encajada'), escalaX: Math.round(m.a * 100) / 100 };
  });
  ok('el rectángulo lima del titular está encajado',
    encaje.clase && encaje.escalaX > 0.98, encaje);

  /* --- Regleta de progreso --- */
  const progIni = await page.evaluate(() => {
    const b = document.querySelector('#progreso');
    return {
      tramos: b.querySelectorAll('.progreso-tramo').length,
      secciones: document.querySelectorAll('main section[id]').length,
      valor: b.getAttribute('aria-valuenow'),
      num: document.querySelector('#progresoNum').textContent.trim(),
      completos: b.querySelectorAll('.progreso-tramo.completa').length,
      /* los anchos deben ser distintos: son proporcionales a cada sección */
      anchos: Array.from(b.querySelectorAll('.progreso-tramo'))
        .map((t) => Math.round(t.getBoundingClientRect().width))
    };
  });
  ok('la regleta tiene un tramo por sección y arranca vacía',
    progIni.tramos === progIni.secciones && progIni.tramos >= 12 &&
    progIni.valor === '0' && progIni.completos === 0 && progIni.num === '01/' + progIni.secciones,
    { tramos: progIni.tramos, valor: progIni.valor, num: progIni.num });
  ok('los tramos son proporcionales a cada sección (no todos iguales)',
    new Set(progIni.anchos).size > 4, { anchos: progIni.anchos });

  /* --- Sticky stack: el robot gana piezas ---
     En vez de adivinar coordenadas, se recorre la sección entera a pasos
     cortos y se anota la secuencia de estados. Así se comprueba el
     comportamiento real y, de paso, cuántos pasos aguanta pegada cada
     tarjeta (que es la medida útil de un sticky, no la distancia). */
  await bajarHasta(page, '#niveles', 400);
  const secuencia = [];
  const frente = { 1: [], 2: [], 3: [] };
  for (let i = 0; i < 320; i++) {
    const estado = await page.evaluate(() => {
      const cab = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--cab'), 10) || 74;
      const tope = cab + window.innerHeight * 0.04;
      /* la tarjeta "al frente" es la pegada de nivel más alto */
      let alFrente = null;
      document.querySelectorAll('.pila-item').forEach((li) => {
        if (Math.abs(li.getBoundingClientRect().top - tope) < 5) alFrente = li.getAttribute('data-nivel');
      });
      return {
        contador: document.querySelector('#piezasPuestas').textContent.trim(),
        montadas: document.querySelectorAll('#robotNiveles .pieza-n.montada').length,
        alFrente: alFrente,
        y: Math.round(window.scrollY),
        finSeccion: document.querySelector('#actividades').getBoundingClientRect().top < 0
      };
    });
    if (!secuencia.length || secuencia[secuencia.length - 1].c !== estado.contador) {
      secuencia.push({ c: estado.contador, m: estado.montadas });
    }
    if (estado.alFrente) frente[estado.alFrente].push(estado.y);
    if (estado.finSeccion) break;
    await page.mouse.wheel(0, 140);
    await page.waitForTimeout(55);
  }
  const orden = secuencia.map((s) => s.c).join('>');
  ok('el robot de niveles crece 4 -> 6 -> 8 piezas al recorrer la pila',
    orden === '4>6>8' && secuencia[0].m < secuencia[1].m && secuencia[1].m < secuencia[2].m,
    { secuencia: orden, piezas: secuencia.map((s) => s.m) });

  /* lo que importa de un sticky no es que llegue a pegarse, sino cuánto
     recorrido pasa cada tarjeta siendo la de delante */
  const recorridos = {};
  [1, 2, 3].forEach((k) => {
    const a = frente[k];
    recorridos[k] = a.length ? a[a.length - 1] - a[0] : 0;
  });
  ok('cada tarjeta manda al frente al menos 400 px de recorrido',
    recorridos[1] >= 400 && recorridos[2] >= 400 && recorridos[3] >= 400, recorridos);

  /* --- La regleta avanza y se completa al llegar al final --- */
  await page.evaluate(() => { document.querySelector('#contacto').scrollIntoView(); });
  for (let i = 0; i < 40; i++) { await page.mouse.wheel(0, 900); await page.waitForTimeout(60); }
  await page.waitForTimeout(1200);
  const progFin = await page.evaluate(() => {
    const b = document.querySelector('#progreso');
    return {
      valor: parseInt(b.getAttribute('aria-valuenow'), 10),
      completos: b.querySelectorAll('.progreso-tramo.completa').length,
      tramos: b.querySelectorAll('.progreso-tramo').length,
      num: document.querySelector('#progresoNum').textContent.trim()
    };
  });
  ok('al llegar al final la regleta está completa y el contador marca la última sección',
    progFin.valor >= 99 && progFin.completos === progFin.tramos &&
    progFin.num === progFin.tramos + '/' + progFin.tramos, progFin);

  /* y vuelve atrás al subir: no es un contador de un solo sentido */
  for (let i = 0; i < 200; i++) {
    const y = await page.evaluate(() => window.scrollY);
    if (y < 10) break;
    await page.mouse.wheel(0, -Math.min(2000, Math.max(400, y)));
    await page.waitForTimeout(60);
  }
  await page.waitForTimeout(900);
  const progVuelta = await page.evaluate(() => ({
    valor: parseInt(document.querySelector('#progreso').getAttribute('aria-valuenow'), 10),
    completos: document.querySelectorAll('.progreso-tramo.completa').length
  }));
  ok('la regleta se vacía al volver arriba',
    progVuelta.valor <= 2 && progVuelta.completos === 0, progVuelta);

  /* --- Acordeón de actividades --- */
  await bajarHasta(page, '#actividades');
  await page.waitForTimeout(800);
  const primera = page.locator('.act').first();
  await primera.locator('.act-cab').click();
  await page.waitForTimeout(700);
  const abierta = await primera.evaluate((el) => ({
    clase: el.classList.contains('abierta'),
    aria: el.querySelector('.act-cab').getAttribute('aria-expanded'),
    alto: el.querySelector('.act-cuerpo').getBoundingClientRect().height
  }));
  await primera.locator('.act-cab').click();
  await page.waitForTimeout(700);
  const cerrada = await primera.evaluate((el) => ({
    clase: el.classList.contains('abierta'),
    alto: el.querySelector('.act-cuerpo').getBoundingClientRect().height
  }));
  ok('el acordeón de actividades abre y cierra',
    abierta.clase && abierta.aria === 'true' && abierta.alto > 40 &&
    !cerrada.clase && cerrada.alto < 5, { abierta: abierta, cerrada: cerrada });

  ok('las 14 actividades están en la rejilla',
    (await page.locator('.act').count()) === 14, await page.locator('.act').count());

  /* --- Mapa bajo consentimiento --- */
  await bajarHasta(page, '#contacto');
  await page.waitForTimeout(800);
  const antesMapa = await page.locator('.mapa iframe').count();
  await page.locator('#mapBtn').click();
  await page.waitForTimeout(900);
  const src = await page.locator('.mapa iframe').first().getAttribute('src');
  ok('el mapa no existe hasta que se pide, y luego es un embed sin API key',
    antesMapa === 0 && src && src.indexOf('output=embed') > 0 && src.indexOf('key=') < 0,
    { antes: antesMapa, src: src });

  /* --- Formulario --- */
  await page.locator('.formulario button[type=submit]').click();
  await page.waitForTimeout(400);
  const avisoVacio = await page.locator('#formAviso').textContent();
  await page.fill('#f-nombre', 'Prueba Prueba');
  await page.fill('#f-edad', '7');
  await page.fill('#f-tel', '600000000');
  await page.selectOption('#f-act', { index: 2 });
  await page.check('#f-rgpd');
  await page.locator('.formulario button[type=submit]').click();
  await page.waitForTimeout(400);
  const avisoLleno = await page.locator('#formAviso').textContent();
  ok('el formulario valida y avisa de que aún no tiene destino',
    /[Ff]altan datos/.test(avisoVacio) && /no tiene destino/.test(avisoLleno),
    { vacio: avisoVacio, lleno: avisoLleno.slice(0, 60) });

  /* --- Imágenes y ausencia de canvas --- */
  const imgs = await page.evaluate(() => {
    const t = Array.from(document.images);
    return {
      total: t.length,
      rotas: t.filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.currentSrc || i.src),
      sinAlt: t.filter((i) => !i.getAttribute('alt')).length,
      canvas: document.querySelectorAll('canvas').length
    };
  });
  ok('todas las imágenes cargan, con alt, y no hay ningún canvas',
    imgs.rotas.length === 0 && imgs.sinAlt === 0 && imgs.canvas === 0, imgs);

  ok('hay 3 huecos marcados para fotos reales de menores',
    (await page.locator('.hueco').count()) === 3);

  /* --- Cookies --- */
  const bannerVisible = await page.locator('#cookieBanner').isVisible();
  await page.locator('#cookieAck').click();
  await page.waitForTimeout(400);
  const bannerCerrado = !(await page.locator('#cookieBanner').isVisible());
  const guardado = await page.evaluate(() => { try { return localStorage.getItem('astrobots-cookies'); } catch (e) { return null; } });
  ok('el aviso de cookies aparece, el botón lo cierra y queda recordado',
    bannerVisible && bannerCerrado && guardado === '1',
    { visible: bannerVisible, cerrado: bannerCerrado, ls: guardado });

  const reaparece = await nuevaPagina(browser, { storageState: await page.context().storageState() });
  await reaparece.goto(BASE, { waitUntil: 'domcontentloaded' });
  await reaparece.waitForTimeout(1200);
  ok('el aviso de cookies no reaparece tras aceptarlo',
    !(await reaparece.locator('#cookieBanner').isVisible()));
  await reaparece.close();

  /* --- Novedades en vivo --- */
  await bajarHasta(page, '#novedades');
  await page.waitForTimeout(1200);
  const vivo = await page.evaluate(() => ({
    estado: document.querySelector('#posts').getAttribute('data-estado'),
    n: document.querySelectorAll('#posts .post').length,
    primero: (document.querySelector('#posts .post-tit') || {}).textContent
  }));
  ok('Novedades lee el WordPress en vivo', vivo.estado === 'vivo' && vivo.n === 4, vivo);
  await page.close();

  /* ============ 2 · Novedades con el WordPress caído ============ */
  const caido = await nuevaPagina(browser);
  await caido.route('**astrobots.es/wp-json/**', (route) => route.abort());
  await caido.goto(BASE, { waitUntil: 'networkidle' });
  await caido.waitForTimeout(3000);
  await bajarHasta(caido, '#novedades');
  await caido.waitForTimeout(3000);
  const respaldo = await caido.evaluate(() => ({
    estado: document.querySelector('#posts').getAttribute('data-estado'),
    n: document.querySelectorAll('#posts .post').length,
    textos: Array.from(document.querySelectorAll('#posts .post-tit')).map((t) => t.textContent.trim())
  }));
  /* abortar la petición deja un aviso de red en la consola del navegador;
     lo que no debe haber es ninguna excepción de JavaScript ni un aviso
     de error en la propia página */
  const excepciones = caido.errores.filter((e) => e.indexOf('pageerror') === 0);
  const rastroEnPantalla = await caido.evaluate(() =>
    /error|no se pudo|fall(o|ó)/i.test(document.querySelector('#novedades').textContent));
  ok('con el WordPress caído quedan los 4 respaldos y el fallo es silencioso',
    respaldo.estado === 'respaldo' && respaldo.n === 4 &&
    respaldo.textos.every((t) => t.length > 5) &&
    excepciones.length === 0 && !rastroEnPantalla,
    { respaldo: respaldo, excepciones: excepciones, avisoEnPantalla: rastroEnPantalla });
  await caido.close();

  /* ============ 3 · Movimiento reducido ============ */
  const quieto = await nuevaPagina(browser, { reducedMotion: 'reduce' });
  await quieto.goto(BASE, { waitUntil: 'networkidle' });
  await quieto.waitForTimeout(2200);
  const rm = await quieto.evaluate(() => {
    const piezas = Array.from(document.querySelectorAll('#robotHero .pieza'));
    const e = document.querySelector('.hero .encaje');
    const m = new DOMMatrixReadOnly(getComputedStyle(e, '::before').transform);
    return {
      visibles: piezas.filter((p) => parseFloat(getComputedStyle(p).opacity) > 0.95).length,
      total: piezas.length,
      encajeX: Math.round(m.a * 100) / 100,
      tarjetas: Array.from(document.querySelectorAll('.pieza-entra'))
        .filter((c) => parseFloat(getComputedStyle(c).opacity) < 0.95).length
    };
  });
  ok('con movimiento reducido el robot ya está montado y nada queda invisible',
    rm.visibles === rm.total && rm.encajeX > 0.98 && rm.tarjetas === 0, rm);

  /* el contenido sigue cambiando aunque no haya animación */
  await quieto.evaluate(() => {
    const el = document.querySelector('#probots');
    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 300);
  });
  await quieto.waitForTimeout(1500);
  const rmNivel = await quieto.evaluate(() => document.querySelector('#piezasPuestas').textContent.trim());
  ok('con movimiento reducido el contador de niveles sigue actualizándose',
    rmNivel === '8', rmNivel);

  /* la regleta es estado, no adorno: sin animación tiene que seguir subiendo */
  await quieto.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await quieto.waitForTimeout(900);
  const rmProg = await quieto.evaluate(() => ({
    valor: parseInt(document.querySelector('#progreso').getAttribute('aria-valuenow'), 10),
    completos: document.querySelectorAll('.progreso-tramo.completa').length,
    tramos: document.querySelectorAll('.progreso-tramo').length,
    num: document.querySelector('#progresoNum').textContent.trim()
  }));
  ok('con movimiento reducido la regleta se llena igual (sin el "clac")',
    rmProg.valor >= 99 && rmProg.completos === rmProg.tramos, rmProg);
  await quieto.close();

  /* ============ 4 · Responsive 400 px ============ */
  const movil = await nuevaPagina(browser, {
    viewport: { width: 400, height: 860 }, isMobile: true, hasTouch: true
  });
  await movil.goto(BASE, { waitUntil: 'networkidle' });
  await movil.waitForTimeout(2600);
  const m400 = await movil.evaluate(() => {
    /* sólo cuenta como desbordamiento lo que NO está recortado por un
       ancestro con overflow (el marquee y la tira de meses sí lo están) */
    const recortado = (el) => {
      let n = el.parentElement;
      while (n && n !== document.documentElement) {
        const o = getComputedStyle(n);
        if (/hidden|auto|scroll|clip/.test(o.overflowX) || /hidden|auto|scroll|clip/.test(o.overflow)) return true;
        n = n.parentElement;
      }
      return false;
    };
    const desbordan = Array.from(document.querySelectorAll('body *'))
      .filter((el) => el.getBoundingClientRect().right > window.innerWidth + 1.5 &&
        getComputedStyle(el).position !== 'fixed' && !recortado(el))
      .slice(0, 6).map((el) => el.className || el.tagName);
    return {
      scrollH: document.documentElement.scrollWidth,
      ancho: window.innerWidth,
      desbordan: desbordan,
      robot: Math.round(document.querySelector('#robotHero').getBoundingClientRect().width),
      actCols: getComputedStyle(document.querySelector('.rejilla-act')).gridTemplateColumns.split(' ').length
    };
  });
  ok('a 400 px no hay scroll horizontal, el robot se reduce y las actividades van en una columna',
    m400.scrollH <= m400.ancho + 1 && m400.desbordan.length === 0 &&
    m400.robot < 290 && m400.actCols === 1, m400);

  /* el menú móvil abre y cierra */
  await movil.locator('#menuBtn').click();
  await movil.waitForTimeout(400);
  const menuAbierto = await movil.locator('#menuMovil').isVisible();
  await movil.locator('#menuBtn').click();
  await movil.waitForTimeout(400);
  const menuCerrado = !(await movil.locator('#menuMovil').isVisible());
  ok('el menú móvil abre y cierra', menuAbierto && menuCerrado);
  ok('sin errores de consola en móvil', movil.errores.length === 0, movil.errores);
  await movil.close();

  /* ============ 5 · Tareas largas al cargar ============ */
  const perf = await nuevaPagina(browser);
  await perf.addInitScript(() => {
    window.__largas = [];
    try {
      new PerformanceObserver((l) => {
        l.getEntries().forEach((e) => window.__largas.push(Math.round(e.duration)));
      }).observe({ entryTypes: ['longtask'] });
    } catch (e) { /* sin soporte */ }
  });
  await perf.goto(BASE, { waitUntil: 'networkidle' });
  await perf.waitForTimeout(4000);
  const largas = await perf.evaluate(() => window.__largas || []);
  const peor = largas.length ? Math.max.apply(null, largas) : 0;
  /* El A/B contra la misma página con js/main.js vaciado
     (scripts/longtask_ab.js) da 166-184 ms de base: esa tarea es el parseo
     de GSAP más las fuentes, no el código propio, que añade ~5 ms. El
     umbral se pone sobre esa base, no en cero. */
  ok('ninguna tarea larga se sale de la base de GSAP + fuentes (~185 ms)',
    peor < 260, { tareas: largas, peor: peor, baseSinMainJs: '166-184 ms' });
  await perf.close();

  /* ============ 6 · Página 404 ============ */
  const p404 = await nuevaPagina(browser);
  await p404.goto(BASE + '404.html', { waitUntil: 'domcontentloaded' });
  await p404.waitForTimeout(600);
  ok('la página 404 existe y enlaza al inicio',
    (await p404.locator('h1').textContent()).indexOf('pieza') > 0 &&
    (await p404.locator('a.btn').count()) === 1);
  await p404.close();

  await browser.close();

  const fallos = resultados.filter((r) => !r.ok);
  fs.writeFileSync(path.join(__dirname, 'verify-report.json'),
    JSON.stringify({ fecha: new Date().toISOString(), base: BASE, resultados: resultados }, null, 2));
  console.log('\n' + (resultados.length - fallos.length) + '/' + resultados.length + ' pruebas correctas');
  process.exit(fallos.length ? 1 : 0);
})();
