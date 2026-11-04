# Portfolio de Roberto Gallego Barbarán

Web personal con estética de póker, hecha con Vite y React y publicada en https://rgallegocode.github.io/roberto-gallego-portfolio/

## Lo importante

- **El contenido no se edita aquí.** `src/data/*.json`, `public/projects/` y `public/cv-*.pdf` los genera `career-os` y se sobrescriben en cada render. Aquí solo se cambian el diseño y el código.
- **Un push a `main` publica la web**, pero solo si pasan las pruebas. Si fallan, la web sigue como estaba. En las demás ramas solo se ejecutan las pruebas.

## Comandos

```bash
npm ci                              # instala las dependencias
npx playwright install chromium     # instala el navegador de las pruebas (solo la primera vez)
npm run dev                         # abre la web en local
npm test                            # compila y ejecuta las pruebas
npx playwright show-report          # abre el informe de la última ejecución
```

## Pruebas

Están en `tests/` y abren la web compilada en Chromium:

- `layout.spec.ts`: que nada se descuadre, en 5 anchos de pantalla y 3 idiomas.
- `behaviour.spec.ts`: que funcionen la navegación, el menú móvil, los idiomas, la galería y la animación.
- `content.spec.ts`: que se vea todo el contenido, que carguen las imágenes y los PDF, y que no haya problemas graves de accesibilidad.

Leen los datos de `src/data/`, así que añadir un proyecto no obliga a cambiarlas. No comparan capturas, de modo que no detectan fallos puramente estéticos.
