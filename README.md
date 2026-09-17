# Astrobots · Robótica y Nuevas Tecnologías en Carballo

Web nueva para **Astrobots** (C/ Perú, 30-32, 1º Oficina 2b Izq., Carballo,
A Coruña), en sustitución del WordPress + Elementor de
[astrobots.es](https://astrobots.es/).

Estática, sin dependencias de build: `index.html`, `css/style.css`,
`js/main.js`. GSAP + ScrollTrigger y Lenis por CDN. **Modo claro siempre.**

---

## El concepto: «Piezas»

La robótica educativa es montar. La web se ensambla delante de quien la lee y
el robot crece con el niño:

- El **hero** monta un robot de kit en SVG pieza a pieza (9 grupos, `back.out(1.4)`,
  0,46 s escalonados), el conjunto se asienta con un rebote elástico y la antena
  parpadea una vez en lima.
- Las palabras clave de cada titular llevan detrás un **rectángulo lima que entra
  deslizando y hace «clac»**.
- Las tarjetas entran como piezas que se acoplan (desplazamiento + giro mínimo → 0).
- Los separadores entre secciones son **pestañas de encaje**.
- En el **sticky-stack de niveles el mismo robot gana piezas**: BabyBots
  (cuerpo + ruedas, 4) → iBots (+ brazos + sensor, 6) → ProBots (+ antena +
  pantalla, 8).

## Marca

| | |
|---|---|
| Lima | `#8FD32E` — muestreado del rótulo real (`cropped-800x600l-3.jpg`) |
| Azul noche | `#0F172A` |
| Gris de placa | `#EEF1F5` · blanco `#FFFFFF` |
| Naranja | `#FF8A3D` — **solo** para las etiquetas de edad |
| Tipografías | Rubik 800/900 para titulares · JetBrains Mono para etiquetas técnicas |

El logo real es un render 3D del robot mascota. Aquí se ha **recreado una versión
plana y geométrica** (`assets/img/brand/astro-marca.svg`) coherente con el
lenguaje de piezas; el render original no se ha reutilizado.

## Secciones

Hero · marquee · La academia (+ WRO) · Niveles (sticky-stack) · 14 actividades
con «+ info» desplegable · Calendario del curso 26-27 y condiciones · Campamentos
· Colegios, ANPAs, concellos y profesorado · Taller maker · Novedades ·
Fotos · Reseñas · Trabaja con nosotros · Contacto y reserva de plaza.

## Datos

Todo lo publicado sale del rastreo de `astrobots.es` (sitemap + 8 sub-sitemaps +
70 URLs), de la ficha de Google o del encargo. Cada bloque cita su URL de origen.
El detalle está en **[INVENTARIO.md](INVENTARIO.md)**, con el mapa completo de
redirecciones 301 y lo que se descartó.

**No hay ningún precio en la web actual**: no se ha inventado ninguno.
Lo que falta va marcado como `[PENDIENTE]` o `[CONFIRMAR]`.

### Menores

La web actual publica fotos de niños y niñas. **Aquí no se ha reutilizado
ninguna.** La galería combina fotografía de archivo (Pexels, gradada al color de
marca, sin caras) con tres huecos marcados
`[FOTO REAL — REQUIERE CONSENTIMIENTO]`. Antes de publicar cualquier foto de
menores hace falta confirmación por escrito de que existen los consentimientos.

## Técnica

- **Mapa**: embed de `google.com/maps?q=…&output=embed`, sin API key, construido
  **solo al pulsar** (patrón `.map-consent`), coherente con el aviso de cookies.
- **Cookies**: `[hidden]` + `:not([hidden]){display:flex}` — el botón cierra de
  verdad y se recuerda en `localStorage`.
- **Novedades**: lee `astrobots.es/wp-json/wp/v2/posts?per_page=4` en vivo; las
  cuatro de respaldo van pintadas en el HTML y el fallo es silencioso.
- **Movimiento reducido**: el robot aparece ya montado y nada queda invisible,
  pero el contenido (nivel activo, contador de piezas) sigue cambiando.
- Sin canvas, sin partículas, sin 3D.
- Responsive hasta 400 px: el robot se reduce y las actividades pasan a acordeón
  en una columna.
- SEO: `title` y `description` propios (sobre la description de AIOSEO actual),
  JSON-LD `LocalBusiness` + `EducationalOrganization` + 9 `Course`, `sitemap.xml`
  y `robots.txt`.

## Scripts

```bash
# servidor local
python -m http.server 8977

# verificación completa (25 pruebas, incluye el fallback con route.abort)
ASTRO_URL=http://127.0.0.1:8977/ NODE_PATH=/c/Users/alvar/node_modules node scripts/verify.js

# capturas de revisión
ASTRO_URL=http://127.0.0.1:8977/ NODE_PATH=/c/Users/alvar/node_modules node scripts/shots.js

# regenerar iconos y la imagen Open Graph
NODE_PATH=/c/Users/alvar/node_modules node scripts/generate_brand.js

# volver a descargar y gradar la fotografía
python scripts/process_photos.py
```

`scripts/contact_sheets.js` monta hojas de contacto de Pexels para elegir
fotografía a mano; `scripts/photos_log.txt` deja el registro de qué foto es cuál.

## Pendiente del cliente

Ver el apartado final del informe de entrega: precios, horarios por grupo,
plazas libres, tramos de edad vigentes, textos de las reseñas, consentimientos de
las fotos, destino del formulario y textos legales.
