/* =========================================================
   Astrobots · Carballo — "Piezas"
   Todo el movimiento nace de la misma idea: una pieza llega,
   encaja con un pequeño rebote y se queda.
   ========================================================= */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var tieneGsap = typeof window.gsap !== 'undefined';
  var tieneST = tieneGsap && typeof window.ScrollTrigger !== 'undefined';
  /* movimiento = puedo animar; contenido = siempre cambia, aunque no anime */
  var movimiento = tieneGsap && !reduce;

  if (movimiento) document.documentElement.classList.add('js-motion');
  if (tieneST) window.gsap.registerPlugin(window.ScrollTrigger);

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------------------------------------------------------
     Lenis
     --------------------------------------------------------- */
  var lenis = null;
  if (movimiento && typeof window.Lenis !== 'undefined') {
    lenis = new window.Lenis({ lerp: 0.12, wheelMultiplier: 1, smoothWheel: true });
    window.__lenis = lenis;   /* asa para las pruebas automáticas */
    if (tieneST) {
      lenis.on('scroll', window.ScrollTrigger.update);
      window.gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      window.gsap.ticker.lagSmoothing(0);
    } else {
      var raf = function (t) { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }

  var irA = function (destino) {
    var el = typeof destino === 'string' ? $(destino) : destino;
    if (!el) return;
    var cab = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--cab'), 10) || 74;
    if (lenis) lenis.scrollTo(el, { offset: -cab - 12 });
    else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - cab - 12, behavior: reduce ? 'auto' : 'smooth' });
  };

  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var destino = $(id);
      if (!destino) return;
      e.preventDefault();
      cerrarMenu();
      irA(destino);
      history.replaceState(null, '', id);
    });
  });

  /* ---------------------------------------------------------
     Cabecera, menú móvil y enlace activo
     --------------------------------------------------------- */
  var cabecera = $('#cabecera');
  var menuBtn = $('#menuBtn');
  var menuMovil = $('#menuMovil');

  function cerrarMenu() {
    if (!menuMovil || menuMovil.hidden) return;
    menuMovil.hidden = true;
    menuBtn.setAttribute('aria-expanded', 'false');
  }
  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      var abierto = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!abierto));
      menuMovil.hidden = abierto;
    });
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') cerrarMenu(); });

  var alScroll = function () {
    if (cabecera) cabecera.classList.toggle('pegada', window.scrollY > 24);
  };
  alScroll();
  window.addEventListener('scroll', alScroll, { passive: true });

  var enlacesNav = $$('.nav a');
  if ('IntersectionObserver' in window && enlacesNav.length) {
    var obsNav = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (!en.isIntersecting) return;
        var id = '#' + en.target.id;
        enlacesNav.forEach(function (a) { a.classList.toggle('activo', a.getAttribute('href') === id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach(function (s) { obsNav.observe(s); });
  }

  /* ---------------------------------------------------------
     HERO: el robot se monta pieza a pieza
     --------------------------------------------------------- */
  var ORIGENES = {
    'cuerpo':    { x: 0,    y: 420,  r: 0 },
    'rueda-izq': { x: -520, y: 120,  r: -160 },
    'rueda-der': { x: 520,  y: 120,  r: 160 },
    'cuello':    { x: 0,    y: -180, r: 0 },
    'cabeza':    { x: 0,    y: -480, r: -8 },
    'brazos':    { x: 0,    y: 320,  r: 0 },
    'sensor':    { x: -360, y: -240, r: -90 },
    'pantalla':  { x: 360,  y: -200, r: 14 },
    'antena':    { x: 0,    y: -420, r: 0 }
  };
  var ORDEN = ['cuerpo', 'rueda-izq', 'rueda-der', 'cuello', 'cabeza', 'brazos', 'sensor', 'pantalla', 'antena'];

  function montarHero() {
    var svg = $('#robotHero');
    if (!svg) return;
    var piezas = ORDEN.map(function (n) { return $('.pieza[data-pieza="' + n + '"]', svg); }).filter(Boolean);
    var bombilla = $('.bombilla', svg);

    if (!movimiento) {
      piezas.forEach(function (p) { p.style.opacity = 1; });
      if (bombilla) bombilla.setAttribute('fill', '#8FD32E');
      return;
    }

    var tl = window.gsap.timeline({ delay: 0.25 });
    piezas.forEach(function (p, i) {
      var o = ORIGENES[p.getAttribute('data-pieza')] || { x: 0, y: 200, r: 0 };
      tl.fromTo(p,
        { opacity: 0, x: o.x, y: o.y, rotation: o.r, transformOrigin: '50% 50%' },
        { opacity: 1, x: 0, y: 0, rotation: 0, duration: 0.46, ease: 'back.out(1.4)' },
        i * 0.115);
    });
    /* el "asentamiento": el robot entero acusa el último encaje */
    tl.to(svg, { y: 6, duration: 0.09, ease: 'power2.out' }, '>-0.06')
      .to(svg, { y: 0, duration: 0.42, ease: 'elastic.out(1, 0.45)' });
    /* la antena parpadea una vez en lima */
    if (bombilla) {
      tl.to(bombilla, { attr: { fill: '#8FD32E' }, duration: 0.14, ease: 'none' }, '>-0.25')
        .to(bombilla, { attr: { fill: '#FFFFFF' }, duration: 0.22, ease: 'none' })
        .to(bombilla, { attr: { fill: '#8FD32E' }, duration: 0.16, ease: 'none' });
    }
  }

  /* ---------------------------------------------------------
     Palabras encajadas: el rectángulo lima entra y hace "clac"
     --------------------------------------------------------- */
  function encajes() {
    var cajas = $$('[data-encaje]');
    if (!movimiento || !tieneST) {
      cajas.forEach(function (c) { c.classList.add('encajada'); });
      return;
    }
    /* la barra lima entra por CSS (transform + transición con rebote);
       aquí sólo se dispara cuando la palabra llega a pantalla. */
    cajas.forEach(function (c, i) {
      window.ScrollTrigger.create({
        trigger: c,
        start: 'top 88%',
        once: true,
        onEnter: function () {
          setTimeout(function () { c.classList.add('encajada'); }, i === 0 ? 0 : 60);
        }
      });
    });
  }

  /* ---------------------------------------------------------
     Piezas que se acoplan al entrar en viewport
     --------------------------------------------------------- */
  function piezasEntran() {
    var items = $$('.pieza-entra');
    if (!movimiento || !tieneST) {
      items.forEach(function (i) { i.style.opacity = 1; });
      return;
    }
    items.forEach(function (el, i) {
      window.gsap.fromTo(el,
        { opacity: 0, y: 44, rotation: i % 2 ? -1.6 : 1.6 },
        {
          opacity: 1, y: 0, rotation: 0, duration: 0.55, ease: 'back.out(1.5)',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true }
        });
    });
  }

  /* ---------------------------------------------------------
     Sticky stack de niveles: el robot gana piezas
     --------------------------------------------------------- */
  var PIEZAS_POR_NIVEL = { 1: 4, 2: 6, 3: 8 };

  function pintarNivel(n) {
    var svg = $('#robotNiveles');
    if (!svg) return;
    $$('.pieza-n', svg).forEach(function (p) {
      p.classList.toggle('montada', parseInt(p.getAttribute('data-nivel'), 10) <= n);
    });
    var contador = $('#piezasPuestas');
    if (contador) contador.textContent = PIEZAS_POR_NIVEL[n] || 4;
  }

  function niveles() {
    var items = $$('.pila-item');
    if (!items.length) return;
    pintarNivel(1);
    /* El contenido cambia siempre, haya o no animación (IntersectionObserver
       es suficiente y no depende de GSAP). */
    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (en) {
          if (!en.isIntersecting) return;
          pintarNivel(parseInt(en.target.getAttribute('data-nivel'), 10));
        });
      }, { rootMargin: '-35% 0px -45% 0px', threshold: 0 });
      items.forEach(function (i) { obs.observe(i); });
    }
  }

  /* ---------------------------------------------------------
     Botones magnéticos
     --------------------------------------------------------- */
  function magneticos() {
    if (!movimiento || window.matchMedia('(hover: none)').matches) return;
    $$('.magnetico').forEach(function (btn) {
      var fuerza = 0.3;
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        window.gsap.to(btn, {
          x: (e.clientX - r.left - r.width / 2) * fuerza,
          y: (e.clientY - r.top - r.height / 2) * fuerza,
          duration: 0.35, ease: 'power3.out'
        });
      });
      btn.addEventListener('mouseleave', function () {
        window.gsap.to(btn, { x: 0, y: 0, duration: 0.55, ease: 'elastic.out(1, 0.4)' });
      });
    });
  }

  /* ---------------------------------------------------------
     Contadores
     --------------------------------------------------------- */
  function contadores() {
    var nodos = $$('[data-contador]');
    if (!nodos.length) return;
    if (!movimiento || !('IntersectionObserver' in window)) return;   /* el HTML ya trae el valor final */
    nodos.forEach(function (n) {
      var fin = parseFloat(n.getAttribute('data-contador'));
      var dec = parseInt(n.getAttribute('data-decimales') || '0', 10);
      var obs = new IntersectionObserver(function (entradas, o) {
        entradas.forEach(function (en) {
          if (!en.isIntersecting) return;
          o.disconnect();
          var estado = { v: 0 };
          window.gsap.to(estado, {
            v: fin, duration: 1.15, ease: 'power2.out',
            onUpdate: function () {
              n.textContent = dec ? estado.v.toFixed(dec).replace('.', ',') : Math.round(estado.v);
            }
          });
        });
      }, { threshold: 0.6 });
      obs.observe(n);
    });
  }

  /* ---------------------------------------------------------
     Acordeón de actividades
     --------------------------------------------------------- */
  function acordeon() {
    $$('.act-cab').forEach(function (btn) {
      var act = btn.closest('.act');
      btn.addEventListener('click', function () {
        var abierto = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!abierto));
        act.classList.toggle('abierta', !abierto);
        if (tieneST) setTimeout(function () { window.ScrollTrigger.refresh(); }, 420);
      });
    });
  }

  /* ---------------------------------------------------------
     Mapa bajo consentimiento (sin API key, solo al pulsar)
     --------------------------------------------------------- */
  function mapa() {
    var btn = $('#mapBtn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var caja = $('.mapa');
      var consulta = 'Astrobots C/ Perú 30-32 Carballo A Coruña';
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.google.com/maps?q=' + encodeURIComponent(consulta) + '&output=embed';
      iframe.title = 'Mapa de Astrobots en la C/ Perú 30-32 de Carballo';
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      iframe.setAttribute('allowfullscreen', '');
      caja.innerHTML = '';
      caja.appendChild(iframe);
    });
  }

  /* ---------------------------------------------------------
     Aviso de cookies
     --------------------------------------------------------- */
  function cookies() {
    var banner = $('#cookieBanner');
    var ack = $('#cookieAck');
    if (!banner || !ack) return;
    var visto = false;
    try { visto = localStorage.getItem('astrobots-cookies') === '1'; } catch (e) { visto = false; }
    if (!visto) banner.hidden = false;
    ack.addEventListener('click', function () {
      banner.hidden = true;
      try { localStorage.setItem('astrobots-cookies', '1'); } catch (e) { /* modo privado */ }
    });
  }

  /* ---------------------------------------------------------
     Novedades: se leen en vivo del WordPress actual.
     Las cuatro de respaldo ya están pintadas en el HTML; si la
     petición falla, se quedan y no se avisa de nada.
     --------------------------------------------------------- */
  var MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

  function limpiar(html, max) {
    var d = document.createElement('div');
    d.innerHTML = html || '';
    var t = (d.textContent || '').replace(/\s+/g, ' ').replace(/\[…\]|\[\.\.\.\]/g, '');
    /* algunas entradas empiezan con la URL pelada del vídeo incrustado */
    t = t.replace(/https?:\/\/\S+/g, ' ').replace(/\s+/g, ' ')
      .replace(/^[\s.,;:·–-]+/, '').replace(/\s+Leer más$/i, '').trim();
    if (max && t.length > max) t = t.slice(0, max).replace(/\s+\S*$/, '') + '…';
    return t;
  }

  function novedades() {
    var caja = $('#posts');
    if (!caja || !window.fetch) return;
    var ctrl = null;
    try { ctrl = new AbortController(); } catch (e) { ctrl = null; }
    var corte = ctrl ? setTimeout(function () { ctrl.abort(); }, 6000) : null;

    fetch('https://astrobots.es/wp-json/wp/v2/posts?per_page=4&_fields=title,excerpt,link,date',
      ctrl ? { signal: ctrl.signal } : undefined)
      .then(function (r) {
        if (!r.ok) throw new Error('http ' + r.status);
        return r.json();
      })
      .then(function (datos) {
        if (corte) clearTimeout(corte);
        if (!Array.isArray(datos) || !datos.length) return;
        var html = datos.slice(0, 4).map(function (p) {
          var f = new Date(p.date);
          var fecha = isNaN(f) ? '' : f.getDate() + ' ' + MESES[f.getMonth()] + ' ' + f.getFullYear();
          var titulo = limpiar(p.title && p.title.rendered);
          var texto = limpiar(p.excerpt && p.excerpt.rendered, 150);
          if (!titulo) return '';
          return '<article class="post"><p class="mono post-fecha">' + fecha + '</p>' +
            '<h3 class="post-tit"><a href="' + p.link + '" rel="nofollow">' + titulo + '</a></h3>' +
            '<p class="post-txt">' + texto + '</p></article>';
        }).filter(Boolean).join('');
        if (!html) return;
        caja.innerHTML = html;
        caja.setAttribute('data-estado', 'vivo');
        $$('.post', caja).forEach(function (p) { p.style.opacity = 1; });
      })
      .catch(function () {
        if (corte) clearTimeout(corte);
        /* fallo silencioso: se quedan las cuatro de respaldo */
      });
  }

  /* ---------------------------------------------------------
     Formulario de reserva (sin destino todavía)
     --------------------------------------------------------- */
  function formulario() {
    var form = $('#formReserva');
    if (!form) return;
    var aviso = $('#formAviso');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var falta = null;
      ['#f-nombre', '#f-edad', '#f-tel', '#f-act'].forEach(function (s) {
        var c = $(s);
        if (!falta && (!c.value || !c.value.trim())) falta = c;
      });
      if (!falta && !$('#f-rgpd').checked) falta = $('#f-rgpd');
      if (falta) {
        aviso.textContent = 'Faltan datos obligatorios.';
        aviso.className = 'form-aviso mono mal';
        falta.focus();
        return;
      }
      aviso.textContent = 'Formulario correcto, pero todavía no tiene destino configurado. Llama al 605 02 60 16 o escribe a info@astrobots.es.';
      aviso.className = 'form-aviso mono ok';
    });
  }

  /* ---------------------------------------------------------
     Arranque
     --------------------------------------------------------- */
  function iniciar() {
    montarHero();
    encajes();
    piezasEntran();
    niveles();
    magneticos();
    contadores();
    acordeon();
    mapa();
    cookies();
    novedades();
    formulario();
    if (tieneST) {
      window.addEventListener('load', function () { window.ScrollTrigger.refresh(); });
    }
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(iniciar).catch(iniciar);
  } else {
    iniciar();
  }
})();
