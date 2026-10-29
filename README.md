# Adicciones Adolescentes · web nueva

Web estática (Astro) en español, inglés y francés. No usa base de datos.

## Dónde está cada cosa
- `src/content/articulos/es|en|fr/` — un archivo `.md` por artículo y por idioma.
  Las tres versiones de un artículo comparten el mismo `key`.
- `src/lib/config.ts` — autor, email y formulario de la newsletter.
- `src/lib/i18n.ts` — textos de la web en los tres idiomas.
- `src/styles/global.css` — colores y tipografías.
- `tools/import-wp.mjs` — convierte la exportación de WordPress en artículos.

## Publicar un artículo
Crear `src/content/articulos/es/mi-articulo.md` (y sus versiones en `en/` y `fr/` con el mismo `key`):

```
---
title: "Título del artículo"
date: 2026-11-01
key: "mi-articulo"
categories: ["PADRES", "Tecnología"]
image: "/media/2026/11/foto.jpg"
audio: "/media/2026/11/audio.mp3"
---

Texto del artículo...
```

## Comandos
- `npm install` y luego `npm run dev` para verla en el ordenador.
- `npm run build` genera la carpeta `dist/`, que es la web lista para subir a cualquier hosting (Vercel o Inescop).

## Newsletter
Cada idioma tiene su canal en `/es/rss.xml`, `/en/rss.xml` y `/fr/rss.xml`.
MailerLite (campaña RSS) lee ese canal y envía el correo automáticamente cuando aparece un artículo nuevo.
