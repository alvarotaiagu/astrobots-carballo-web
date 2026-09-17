# Inventario de migración · astrobots.es → web nueva

Rastreo completo del 17 de septiembre de 2026. Se descargaron el `sitemap.xml`
y sus **8 sub-sitemaps** (`post`, `page`, `mp-event`, `mp-column`, `ppt_viewer`,
`post-archive`, `category`, `ppv_file_type`), se visitaron las **70 URLs** que
listan (todas respondieron 200) y se siguieron además los enlaces internos de
cada página: no apareció ninguna URL fuera del sitemap salvo variantes sin barra
final (`/gaming`, `/ibots`, `/informatica`, `/probots`, `/sci-bots`) y
`xmlrpc.php`.

**Ninguna URL antigua acaba en 404.** Las marcadas como *descartada* no se
replican como contenido, pero sí se redirigen.

---

## 1. Páginas (`page-sitemap.xml` · 48 URLs)

| URL antigua | Contenido usado | Sección nueva | 301 propuesta |
|---|---|---|---|
| `/` | Titular, tarjetas de actividades con edades, «actividades para entidades locales», vídeo de YouTube, teléfonos | Todo el documento | `/` |
| `/extraescolares/` | Las 8 tarjetas de actividad con sus edades y textos + «las actividades se rigen por el calendario escolar» | Actividades · intro | `/#actividades` |
| `/babybots/` | Texto íntegro del nivel + los 4 puntos + «también disponible en inglés» | Niveles · BabyBots | `/#babybots` |
| `/ibots/` | Texto íntegro del nivel + los 4 puntos | Niveles · iBots | `/#ibots` |
| `/probots/` | Texto íntegro del nivel + los 5 puntos | Niveles · ProBots | `/#probots` |
| `/clases-robotica/` | Párrafo general de robótica (Arduino, piezas 3D, mBlock) | Niveles · intro | `/#niveles` |
| `/informatica/` | Texto completo de la actividad + los 3 puntos de clase | Actividades · Informática | `/#actividades` |
| `/clases-de-informatica/` | «Clases de informática para todas las edades» + dirección | Actividades · Informática | `/#actividades` |
| `/gaming/` | Texto completo + «Minecraft educación… juego en equipo» | Actividades · Gaming | `/#actividades` |
| `/minecraft-education/` | «Programación, matemáticas, química y ciencia…» | Actividades · Minecraft Education | `/#actividades` |
| `/diseno-e-impresion-3d/` | «Diseña e imprime todo lo que te puedas imaginar…» | Actividades · Impresión 3D | `/#actividades` |
| `/curso-de-impresion-3d/` | Taller para adultos + **profesor Amador Canedo** + lugar | Actividades · Impresión 3D | `/#actividades` |
| `/curso-de-impresion-3d-2/` | Lista de documentación (Cura, Creality, Bambu, Tinkercad, Thingiverse, Cults3D, Lion 2, CR Studio) | Taller maker · Impresión 3D | `/#taller` |
| `/realidad-virtual/` | Título de la disciplina | Actividades · Realidad virtual | `/#actividades` |
| `/simulacion/` | «Aprende de una forma segura en todo tipo de escenarios virtuales» | Actividades · Realidad virtual y simulación | `/#actividades` |
| `/astronomia-robotica/` | Texto íntegro de astrofotografía y telescopios remotos | Actividades · Astronomía robótica | `/#actividades` |
| `/sci-bots/` | Texto íntegro | Actividades · Sci-Bots | `/#actividades` |
| `/music-bots/` | Texto íntegro | Actividades · Music-Bots | `/#actividades` |
| `/edicion-musical-2/` | Mismo texto que Music-Bots (duplicado) | Actividades · Music-Bots | `/#actividades` |
| `/burbuja-creativa/` | Texto íntegro + los 4 puntos | Actividades · Burbuja Creativa | `/#actividades` |
| `/refuerzo-escolar/` | Texto íntegro (profesora con formación psicopedagógica, grupos reducidos) | Actividades · Refuerzo escolar | `/#actividades` |
| `/formacion-para-adultos/` | Texto íntegro | Actividades · Formación para adultos | `/#actividades` |
| `/talleres/` | Texto de contacto para talleres | Actividades · Formación para adultos | `/#actividades` |
| `/artesanias-con-materiales-reciclados/` | Las tres erres + cartón, plástico, vidrio, latas y periódico | Actividades · Artesanías recicladas | `/#actividades` |
| `/campamentos/` | «Campamentos de robótica» + cartel «Campamento Astrobots» (junio, julio y agosto, 9:30-13:30) | Campamentos | `/#campamentos` |
| `/campamentos-de-verano/` | Temática STEAM, horario, días, actividades complementarias y las 11 semanas del verano 2026 | Campamentos | `/#campamentos` |
| `/eventos-para-colegios/` | Lego Spike Prime, Lego WeDo 2.0, mBot, Minecraft Education, App Inventor y «otros talleres» | Colegios · Eventos para colegios | `/#colegios` |
| `/formacion-para-profesores/` | Introducción + los 7 bloques (Scratch, Spike, WeDo, Micro:bit, mBot, 3D, Minecraft) + niveles | Colegios · Formación para profesorado | `/#colegios` |
| `/taller-de-robotica/` | Enlaces de documentación (Scratch jr, Spike, MakeCode, mBlock 5, Elecfreaks, MatataStudio, Photon, KIE) | Taller maker | `/#taller` |
| `/taller-de-corte-laser/` | Cortadora **MR Beam** + manuales + 3axis / Vectorsfile | Taller maker · Corte láser | `/#taller` |
| `/plotter-de-corte/` | Plotter **Rotutex** + SignMaster + calibración de cámara | Taller maker · Plotter | `/#taller` |
| `/silhouette-cameo-5/` | **Silhouette CAMEO 5** + Silhouette Studio + manual | Taller maker · CAMEO 5 | `/#taller` |
| `/condiciones-generales/` | Las 8 condiciones íntegras **+ la imagen del calendario lectivo 26/27** (fuente de toda la sección de calendario) | Calendario · condiciones | `/#calendario` |
| `/contacto/` | **Dirección exacta** C/ Perú, 30-32, 1º Oficina 2b Izq. + teléfono + formulario | Contacto | `/#contacto` |
| `/trabaja-con-nosotros/` | **«Astrobots inició su andadura en marzo del 2019»**, STEAM, 4 a 17 años, oferta de empleo | La academia + Trabaja con nosotros | `/#empleo` |
| `/fotos/` | Feed de Instagram: dirección «enfrente del C.C. Bergantiños», WRO, Gaming en inglés, tramos de edad del curso 26-27 | Fotos + La academia + Actividades | `/#fotos` |
| `/blog/` | Los 8 tutoriales listados con su entradilla | Novedades | `/#novedades` |
| `/curso-de-programacion-con-mblock/` | Índice del curso de mBlock (5 cursos) | Actividades · Tutoriales | `/#actividades` |
| `/curso-de-roberta-open-lab/` | Índice del curso de Open Roberta Lab (3 cursos) | Actividades · Tutoriales | `/#actividades` |
| `/open-roberta-lab/` | Tutorial de iniciación | Novedades (enlace vivo) | `/#novedades` |
| `/crea-un-laberinto-con-open-roberta-lab/` | Tutorial del laberinto | Novedades (enlace vivo) | `/#novedades` |
| `/aprende-a-crear-una-animacion-con-mblock/` | Tutorial de animación | Novedades (enlace vivo) | `/#novedades` |
| `/aprende-a-crear-un-juego-con-mblock/` | Tutorial de juego | Novedades (enlace vivo) | `/#novedades` |
| `/extensiones-de-mblock-servicios-cognitivos/` | Tutorial de servicios cognitivos | Novedades (enlace vivo) | `/#novedades` |
| `/usa-la-camara-como-mando-en-tus-juegos-de-mblock/` | Tutorial de webcam como mando | Novedades (enlace vivo) | `/#novedades` |
| `/astrobots-2/` | **Descartada** como página (duplicado de portada). Su párrafo «proyecto educativo… personas de todas las edades» sí se usó como base de la intro | La academia | `/#academia` |
| `/astrobots-3/` | **Descartada** (duplicado literal de `/astronomia-robotica/`) | — | `/#actividades` |
| `/pagina-en-construccion/` | **Descartada** (página vacía de relleno) | — | `/` |

## 2. Entradas del blog (`post-sitemap.xml` · 4 URLs)

Las cuatro son de **abril de 2020**; son las mismas que sirve la API y las que
pinta la sección de Novedades como respaldo.

| URL antigua | Contenido usado | Sección nueva | 301 propuesta |
|---|---|---|---|
| `/roberta-lab/` | Título y entradilla | Novedades (tarjeta 1) | `/#novedades` |
| `/aprende-a-crear-un-juego-mblock/` | Título y entradilla | Novedades (tarjeta 2) | `/#novedades` |
| `/aprende-a-crear-un-animacion-mblock/` | Título y entradilla | Novedades (tarjeta 3) | `/#novedades` |
| `/cursos/` | Lista BabyBots / iBots / ProBots | Novedades (tarjeta 4) | `/#novedades` |

## 3. Horarios del plugin de timetable (`mp-event` + `mp-column` + `post-archive` · 14 URLs)

**No se ha publicado ninguno de estos horarios.** Todos se publicaron en
septiembre-octubre de **2019** y nunca se actualizaron: dar por buenos hoy unos
horarios de hace siete cursos sería inventar. Lo que sí figuraba (para que el
cliente lo confirme o lo descarte) era: iBots martes 16:00 y 18:00, miércoles y
viernes 16:00 · ProBots miércoles 18:30, jueves 16:00 y 17:00, viernes 17:00 ·
Informática martes 17:00, miércoles 17:30, jueves y viernes 18:00 · Gaming
viernes 16:00 y 17:00 · BabyBots jueves 18:00 · Sci-Bots miércoles 17:00.

| URL antigua | Contenido usado | Sección nueva | 301 propuesta |
|---|---|---|---|
| `/timetable/event/babybots/` | Ninguno (horario de 2019) | Niveles | `/#babybots` |
| `/timetable/event/ibots/` | Ninguno (horario de 2019) | Niveles | `/#ibots` |
| `/timetable/event/probots/` | Ninguno (horario de 2019) | Niveles | `/#probots` |
| `/timetable/event/informatica/` | Ninguno (horario de 2019) | Actividades | `/#actividades` |
| `/timetable/event/gaming/` | Ninguno (horario de 2019) | Actividades | `/#actividades` |
| `/timetable/event/sci-bots/` | Ninguno (horario de 2019) | Actividades | `/#actividades` |
| `/timetable/event/music-bots/` | Ninguno (sin horario) | Actividades | `/#actividades` |
| `/timetable/event/` | Archivo del plugin | Niveles | `/#niveles` |
| `/timetable/column/lunes/` … `/viernes/` (5) | Ninguno | Calendario | `/#calendario` |
| `/timetable/column/` | Archivo del plugin | Calendario | `/#calendario` |

## 4. Archivos y taxonomías (`category` + `ppt_viewer` + `ppv_file_type` · 4 URLs)

| URL antigua | Contenido usado | Sección nueva | 301 propuesta |
|---|---|---|---|
| `/category/blog/` | Listado de entradas (ya recogido) | Novedades | `/#novedades` |
| `/category/uncategorized/` | Solo contiene «Cursos» | Novedades | `/#novedades` |
| `/ppt_viewer/curso-de-impresion-3d/` | Visor de la presentación `TALLER-IMPRESION-3D.pptx` | Taller maker | `/#taller` |
| `/ppv_document_tags/pdf/` | Vacía («Nada encontrado») — **descartada** | — | `/#taller` |

## 5. Rutas técnicas de WordPress

| URL antigua | Qué hacer |
|---|---|
| `/wp-json/wp/v2/posts` | **Mantener viva mientras se pueda**: la sección de Novedades la lee en directo. Si el WordPress se apaga, la web no rompe (caen los 4 respaldos pintados en el HTML) pero conviene sustituirla por una hoja de cálculo. |
| `/wp-content/uploads/…` | Mantener accesible o redirigir a `/` con 301. El logo (`2020/04/cropped-png-3-1-*.png`), el rótulo (`2019/05/cropped-800x600l-3.jpg`), el calendario (`2026/08/CALENDARIO-26-27-.png`) y el cartel del campamento (`2026/06/verano-2026-*.png`) se usaron como fuente. |
| `/feed/`, `/comments/feed/` | 410 o 301 a `/` |
| `/xmlrpc.php`, `/wp-admin/`, `/wp-login.php` | 410 |
| `/sitemap.xml` y sus 8 sub-sitemaps | 301 al `sitemap.xml` nuevo |

---

## 6. Reglas listas para pegar

### Apache · `.htaccess`

```apache
RewriteEngine On

# --- Niveles de robótica
Redirect 301 /babybots/ /#babybots
Redirect 301 /ibots/ /#ibots
Redirect 301 /probots/ /#probots
Redirect 301 /clases-robotica/ /#niveles
Redirect 301 /cursos/ /#niveles
Redirect 301 /timetable/event/ /#niveles
Redirect 301 /timetable/event/babybots/ /#babybots
Redirect 301 /timetable/event/ibots/ /#ibots
Redirect 301 /timetable/event/probots/ /#probots

# --- Actividades
Redirect 301 /extraescolares/ /#actividades
Redirect 301 /informatica/ /#actividades
Redirect 301 /clases-de-informatica/ /#actividades
Redirect 301 /gaming/ /#actividades
Redirect 301 /minecraft-education/ /#actividades
Redirect 301 /diseno-e-impresion-3d/ /#actividades
Redirect 301 /curso-de-impresion-3d/ /#actividades
Redirect 301 /realidad-virtual/ /#actividades
Redirect 301 /simulacion/ /#actividades
Redirect 301 /astronomia-robotica/ /#actividades
Redirect 301 /astrobots-3/ /#actividades
Redirect 301 /sci-bots/ /#actividades
Redirect 301 /music-bots/ /#actividades
Redirect 301 /edicion-musical-2/ /#actividades
Redirect 301 /burbuja-creativa/ /#actividades
Redirect 301 /refuerzo-escolar/ /#actividades
Redirect 301 /formacion-para-adultos/ /#actividades
Redirect 301 /talleres/ /#actividades
Redirect 301 /artesanias-con-materiales-reciclados/ /#actividades
Redirect 301 /curso-de-programacion-con-mblock/ /#actividades
Redirect 301 /curso-de-roberta-open-lab/ /#actividades
Redirect 301 /timetable/event/informatica/ /#actividades
Redirect 301 /timetable/event/gaming/ /#actividades
Redirect 301 /timetable/event/sci-bots/ /#actividades
Redirect 301 /timetable/event/music-bots/ /#actividades

# --- Calendario y condiciones
Redirect 301 /condiciones-generales/ /#calendario
Redirect 301 /timetable/column/ /#calendario
Redirect 301 /timetable/column/lunes/ /#calendario
Redirect 301 /timetable/column/martes/ /#calendario
Redirect 301 /timetable/column/miercoles/ /#calendario
Redirect 301 /timetable/column/jueves/ /#calendario
Redirect 301 /timetable/column/viernes/ /#calendario

# --- Campamentos
Redirect 301 /campamentos/ /#campamentos
Redirect 301 /campamentos-de-verano/ /#campamentos

# --- Colegios y profesorado
Redirect 301 /eventos-para-colegios/ /#colegios
Redirect 301 /formacion-para-profesores/ /#colegios

# --- Taller maker
Redirect 301 /curso-de-impresion-3d-2/ /#taller
Redirect 301 /taller-de-robotica/ /#taller
Redirect 301 /taller-de-corte-laser/ /#taller
Redirect 301 /plotter-de-corte/ /#taller
Redirect 301 /silhouette-cameo-5/ /#taller
Redirect 301 /ppt_viewer/curso-de-impresion-3d/ /#taller
Redirect 301 /ppv_document_tags/pdf/ /#taller

# --- Novedades (blog y tutoriales)
Redirect 301 /blog/ /#novedades
Redirect 301 /category/blog/ /#novedades
Redirect 301 /category/uncategorized/ /#novedades
Redirect 301 /roberta-lab/ /#novedades
Redirect 301 /open-roberta-lab/ /#novedades
Redirect 301 /crea-un-laberinto-con-open-roberta-lab/ /#novedades
Redirect 301 /aprende-a-crear-un-juego-mblock/ /#novedades
Redirect 301 /aprende-a-crear-un-juego-con-mblock/ /#novedades
Redirect 301 /aprende-a-crear-un-animacion-mblock/ /#novedades
Redirect 301 /aprende-a-crear-una-animacion-con-mblock/ /#novedades
Redirect 301 /extensiones-de-mblock-servicios-cognitivos/ /#novedades
Redirect 301 /usa-la-camara-como-mando-en-tus-juegos-de-mblock/ /#novedades

# --- Resto
Redirect 301 /fotos/ /#fotos
Redirect 301 /contacto/ /#contacto
Redirect 301 /trabaja-con-nosotros/ /#empleo
Redirect 301 /astrobots-2/ /#academia
Redirect 301 /pagina-en-construccion/ /
Redirect 301 /sitemap.xml /sitemap.xml

# --- Restos de WordPress
Redirect 410 /xmlrpc.php
Redirect 410 /wp-login.php
Redirect 301 /feed/ /
Redirect 301 /comments/feed/ /

# Cualquier otra ruta antigua que quede suelta
ErrorDocument 404 /404.html
```

### Netlify / Cloudflare Pages · `_redirects`

```
/babybots/                     /#babybots      301
/ibots/                        /#ibots         301
/probots/                      /#probots       301
/extraescolares/               /#actividades   301
/condiciones-generales/        /#calendario    301
/campamentos/                  /#campamentos   301
/campamentos-de-verano/        /#campamentos   301
/eventos-para-colegios/        /#colegios      301
/formacion-para-profesores/    /#colegios      301
/contacto/                     /#contacto      301
/fotos/                        /#fotos         301
/blog/                         /#novedades     301
/trabaja-con-nosotros/         /#empleo        301
/timetable/*                   /#calendario    301
/category/*                    /#novedades     301
/ppt_viewer/*                  /#taller        301
/ppv_document_tags/*           /#taller        301
/*                             /404.html       404
```

*(el resto de líneas, igual que en el bloque de Apache)*

---

## 7. SEO

**Title y meta description actuales** (AIOSEO, portada):

- Title: `Astrobots | Robótica y Nuevas Tecnologías en Carballo`
- Description: `Academia de nuevas tecnologías en Carballo. Cursos extraescolares de robótica, informática, Minecraft Education, impresión 3D y dibujo. ¡Inscríbete ya!`

**Los nuevos** conservan esa descripción como base y le añaden los niveles y el
curso vigente:

- Title: `Astrobots · Robótica y Nuevas Tecnologías en Carballo`
- Description: `Academia de nuevas tecnologías en Carballo. Extraescolares de robótica por niveles, informática, Minecraft Education, impresión 3D, gaming y dibujo desde los 4 años. Curso 2026-2027 en marcha.`

**JSON-LD** incluido: `LocalBusiness` + `EducationalOrganization` (dirección,
teléfonos, horario de Google, `aggregateRating` 5,0 sobre 9, `foundingDate`
2019-03, `sameAs` de las redes activas) y **8 `Course`** —BabyBots, iBots,
ProBots, Informática, Impresión 3D, Gaming/Minecraft, Burbuja Creativa, Refuerzo
escolar y formación de profesorado— con `startDate` 2026-09-14 y `endDate`
2027-06-30 tomados del calendario real.

**Sitemap nuevo**: `sitemap.xml` en la raíz, declarado en `robots.txt`.
