# roberto-gallego-portfolio — instrucciones para Claude Code

Portfolio público en https://rgallegocode.github.io/roberto-gallego-portfolio/ (Vite + React, GitHub Pages).
Idioma de trabajo con el usuario: español.

## De dónde sale el contenido
El contenido **no se edita aquí**. Lo genera `career-os` (`~/Documents/GitHub/career-os`), cuya fuente de verdad es
`career-os/biblioteca/` y `career-os/data/*.yaml`, y que tiene sus propias reglas de veracidad (`career-os/CLAUDE.md`).
- `src/data/*.json`, `public/projects/` y `public/cv-{en,es}.pdf` son **generados**: nunca los edites a mano, el
  siguiente render los sobrescribe. Cambia la fuente en `career-os` y ejecuta allí `/sync`.
- Orden de proyectos y credenciales: campo `importance` de cada `ficha.yaml` en `career-os/biblioteca/`.
- Imágenes de un proyecto: en su carpeta `capturas/` de `career-os/biblioteca/proyectos/<id>/`, declaradas en `images:`
  de su `ficha.yaml`.

## Qué sí se cambia aquí
Diseño y código de la web: `src/components/`, `src/styles/`, `src/App.tsx`, `src/lib.ts`, `index.html`, `public/`
(salvo lo generado). No hay CV en alemán: la web en alemán ofrece el inglés. Si añades un campo nuevo al JSON, añádelo también en `career-os` (`careeros/schema.py` y
`careeros/render/portfolio.py`).

## Comprobar y desplegar
- `npm test` (Playwright, en `tests/`: compila y comprueba maquetación, funcionamiento y contenido); vista previa con `npm run dev`.
- Desplegar = commit + `git push` a `main`: `.github/workflows/deploy.yml` ejecuta las pruebas y, si pasan, publica GitHub Pages.
  Comprueba después que el run termina en `success` (`gh run list`).
