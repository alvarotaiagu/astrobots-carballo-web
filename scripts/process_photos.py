# -*- coding: utf-8 -*-
"""Descarga las fotos elegidas en las hojas de contacto de Pexels y las
grada al color de Astrobots: blancos limpios, sombras hacia el azul
noche #0F172A y un empuje del verde hacia el lima de marca #8FD32E.

Ninguna de estas imagenes es de la academia ni muestra caras de menores.
Uso:  python scripts/process_photos.py
"""
import io
import os
import sys
import urllib.request

from PIL import Image, ImageEnhance

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SALIDA = os.path.join(RAIZ, 'assets', 'img', 'photos')
os.makedirs(SALIDA, exist_ok=True)

UA = ('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
      '(KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36')

# id de Pexels, nombre de salida, relacion de aspecto, anchos
FOTOS = [
    ('35673074', 'piezas-kit',    (8, 3),  [1600, 900]),
    ('9242911',  'manos-montaje', (4, 3),  [1200, 800]),
    ('35673084', 'cables',        (4, 3),  [1200, 800]),
    ('15470542', 'placa',         (4, 3),  [1200, 800]),
    ('34803966', 'pantalla',      (4, 3),  [1200, 800]),
    ('23533982', 'impresora-3d',  (4, 3),  [1200, 800]),
    ('13007765', 'pieza-3d',      (4, 3),  [1200, 800]),
    ('7254419',  'laser',         (4, 3),  [1200, 800]),
    ('39295511', 'engranajes',    (4, 3),  [1200, 800]),
    ('8423439',  'aula',          (8, 3),  [1600, 900]),
]

NOCHE = (15, 23, 42)


def descargar(idf):
    url = ('https://images.pexels.com/photos/%s/pexels-photo-%s.jpeg'
           '?auto=compress&cs=tinysrgb&w=1800' % (idf, idf))
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        return Image.open(io.BytesIO(r.read())).convert('RGB')


def recortar(im, rel):
    w, h = im.size
    objetivo = rel[0] / rel[1]
    actual = w / h
    if actual > objetivo:
        nw = int(h * objetivo)
        izq = (w - nw) // 2
        im = im.crop((izq, 0, izq + nw, h))
    else:
        nh = int(w / objetivo)
        arr = int((h - nh) * 0.42)          # encuadre ligeramente alto
        im = im.crop((0, arr, w, arr + nh))
    return im


def gradar(im):
    """Sombras al azul noche, verdes hacia el lima, blancos limpios."""
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y]
            lum = (r * 299 + g * 587 + b * 114) // 1000
            # sombras -> azul noche (mezcla proporcional a lo oscuro)
            if lum < 130:
                k = (130 - lum) / 130.0 * 0.30
                r = int(r + (NOCHE[0] - r) * k)
                g = int(g + (NOCHE[1] - g) * k)
                b = int(b + (NOCHE[2] - b) * k)
            # verdes -> lima de marca
            if g > r and g > b:
                fuerza = min(1.0, (g - max(r, b)) / 70.0) * 0.45
                r = int(r + (143 - r) * fuerza * 0.6)
                g = int(g + (211 - g) * fuerza)
                b = int(b + (46 - b) * fuerza * 0.8)
            # altas luces limpias, sin tinte
            if lum > 205:
                k = (lum - 205) / 50.0 * 0.35
                r = int(r + (255 - r) * k)
                g = int(g + (255 - g) * k)
                b = int(b + (255 - b) * k)
            px[x, y] = (max(0, min(255, r)), max(0, min(255, g)), max(0, min(255, b)))
    im = ImageEnhance.Contrast(im).enhance(1.07)
    im = ImageEnhance.Color(im).enhance(0.94)
    return im


def main():
    registro = []
    for idf, nombre, rel, anchos in FOTOS:
        try:
            im = descargar(idf)
        except Exception as e:                      # noqa: BLE001
            print('FALLO %s (%s): %s' % (nombre, idf, e))
            continue
        im = recortar(im, rel)
        grande = max(anchos)
        im = im.resize((grande, int(grande * rel[1] / rel[0])), Image.LANCZOS)
        im = gradar(im)
        for ancho in anchos:
            copia = im if ancho == grande else im.resize(
                (ancho, int(ancho * rel[1] / rel[0])), Image.LANCZOS)
            ruta = os.path.join(SALIDA, '%s-%d.jpg' % (nombre, ancho))
            copia.save(ruta, 'JPEG', quality=82, optimize=True, progressive=True)
            print('OK %-24s %5d px  %6.1f KB' % (
                os.path.basename(ruta), ancho, os.path.getsize(ruta) / 1024))
        registro.append('%s -> pexels.com/photo/%s (%s)' % (nombre, idf, rel))
    with io.open(os.path.join(os.path.dirname(os.path.abspath(__file__)),
                              'photos_log.txt'), 'w', encoding='utf-8') as f:
        f.write('Fotografia de archivo de Pexels, gradada al color de marca.\n'
                'Ninguna es de la academia. Ninguna muestra caras de menores.\n\n')
        f.write('\n'.join(registro) + '\n')


if __name__ == '__main__':
    sys.exit(main())
