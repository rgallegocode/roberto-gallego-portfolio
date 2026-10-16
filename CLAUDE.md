# roberto-gallego-portfolio — instrucciones para Claude Code

Portfolio público en https://rgallegocode.github.io/roberto-gallego-portfolio/ (Vite + React, GitHub Pages).
Idioma de trabajo con el usuario: español.

## De dónde sale el contenido
El contenido **no se edita aquí**. Lo genera `career-os` (`~/Documents/GitHub/career-os`), cuya fuente de verdad es
`career-os/data/*.yaml` y que tiene sus propias reglas de veracidad (`career-os/CLAUDE.md`).
- `src/data/*.json` y `public/cv-{en,es,de}.pdf` son **generados**: nunca los edites a mano, el siguiente render los
  sobrescribe. Cambia `career-os/data/` y ejecuta, desde `career-os`:
  `.venv/bin/career validate && .venv/bin/career render all --publish` (genera siempre los 3 CVs).
- Imágenes de un proyecto: `public/projects/<id>/` (`.jpg` + `.webp` con el mismo nombre), declaradas en
  `images:` del proyecto en `career-os/data/projects.yaml`.

## Qué sí se cambia aquí
Diseño y código de la web: `src/components/`, `src/styles/`, `src/App.tsx`, `src/lib.ts`, `index.html`, `public/`
(salvo lo generado). Si añades un campo nuevo al JSON, añádelo también en `career-os` (`careeros/schema.py` y
`careeros/render/portfolio.py`).

## Comprobar y desplegar
- `npx tsc -b && npm run build`; vista previa con `npm run dev`. Revisa escritorio y móvil (sin scroll horizontal).
- Desplegar = commit + `git push` a `main`: `.github/workflows/deploy.yml` publica GitHub Pages.
  Comprueba después que el run termina en `success` (`gh run list`).
