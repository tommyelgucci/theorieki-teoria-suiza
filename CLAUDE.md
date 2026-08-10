# CLAUDE.md

Contexto de proyecto para Claude Code. Léelo antes de tocar código en este repo.

## Qué es

**TheorieKI** — app web (React + Vite + Tailwind v4) para estudiar la teoría del examen
de conducir suizo, categorías B (coche) y A/A1 (moto). Multilingüe en 6 idiomas
(DE/ES/FR/IT/EN/PT), sin backend, todo el progreso en `localStorage`. Se despliega como
PWA en GitHub Pages vía `.github/workflows/deploy.yml` (push a `main`).

Detalle funcional completo → `README.md`. No lo dupliques aquí; si cambia una
funcionalidad, actualiza el README, no este archivo.

## Comandos

```bash
npm install
npm run dev         # servidor de desarrollo
npm run build       # build de producción en dist/ (falla si algo no compila)
npm test            # vitest run — una sola pasada, así se corre en CI/scripts
npm run test:watch  # vitest en modo watch, para desarrollo interactivo
```

No hay `npm run lint` (no hay ESLint configurado — ver ROADMAP.md). Antes de dar por
terminado un cambio: `npm test` y, si tocaste algo que afecta el bundle o el SW,
`npm run build`.

## Reglas de oro de este repo

- **Todo el contenido de usuario (preguntas, tips, textos de UI, captions de maniobras)
  va en los 6 idiomas.** Si añades una clave nueva, complétala en `de/es/fr/it/en/pt`
  a la vez. Nunca dejes un idioma con el string en otro idioma "de relleno" — el
  fallback automático a alemán (`tr()` en `src/i18n.js`) ya cubre lagunas involuntarias,
  pero el contenido nuevo debe nacer completo.
- **No copies ni parafrasees el banco oficial de preguntas de la asa.** Todo el
  contenido de `src/data/questions.json` y `tips.json` debe ser redactado desde cero a
  partir de la legislación suiza (SVG/VRV/SSV, textos de dominio público). Es una
  restricción legal real del proyecto, no una preferencia de estilo — ver "Aviso legal"
  en el README.
- **Las vistas secundarias se cargan con lazy loading** (`lazyWithReload` en
  `src/App.jsx`) para no meter el banco de preguntas, maniobras, señales, etc. en el
  bundle inicial. Si añades una vista nueva, síguele el patrón: `lazyWithReload(() =>
  import('./components/X'))` + entrada en el switch de `App.jsx` + Suspense ya está puesto
  a nivel global.
- **El progreso vive por perfil** en `localStorage` bajo `chfahren.p.<id>.<clave>`
  (`src/storage.js`). Si añades una clave de progreso nueva, pasa por `read`/`write` de
  ese módulo, no accedas a `localStorage` directo desde componentes.
- **Los tests usan los textos reales de `i18n.js`**, no strings hardcodeados, para que
  renombrar una etiqueta no rompa los tests. Sigue ese patrón al escribir tests nuevos.
- **`prefers-reduced-motion` se respeta en las maniobras animadas** (`ManeuverPlayer.jsx`):
  sin autoplay, navegación por pasos. No lo rompas al tocar el motor de animación.
- Sin backend, sin analítica, sin trackers de terceros — es una decisión de privacidad
  explícita del proyecto (ver "Seguridad y privacidad" en el README), no algo que falte.

## Dónde está cada cosa

| Qué | Dónde |
|---|---|
| Preguntas del examen | `src/data/questions.json` (modelo documentado en README) |
| Tips prácticos | `src/data/tips.json` |
| Maniobras animadas (datos, no motor) | `src/data/maneuvers.js` |
| Motor de animación de maniobras | `src/components/ManeuverPlayer.jsx`, `CarSprite.jsx`, `SceneElements.jsx` |
| Señales de tráfico (SVG paramétricos) | `src/data/signs.js` + `src/components/SignSprite.jsx` |
| Primeros auxilios (Nothelfer) | `src/data/firstaid.js` + `src/components/FirstAid.jsx` |
| VKU | `src/data/vku.js` + `src/components/Vku.jsx` |
| Kontrollfahrt | `src/data/kontrollfahrt.js` + `src/components/Kontrollfahrt.jsx` |
| WAB / licencia de prueba | `src/data/wab.js` + `src/components/Wab.jsx` |
| Textos de interfaz (6 idiomas) | `src/i18n.js` |
| Persistencia / perfiles / SRS | `src/storage.js` |
| Service worker (PWA offline) | `public/sw.js` |
| Routing de vistas (sin router, switch manual) | `src/App.jsx` |

## Antes de terminar cualquier tarea

1. `npm test` — debe seguir en 76+/76 verde (el número crece si añades tests).
2. Si tocaste `src/data/*.json` o `*.js` con contenido multilingüe: verifica que los 6
   idiomas estén presentes (no hay lint automático para esto todavía, revísalo a mano o
   con un script puntual).
3. Si tocaste algo que afecta el bundle, el SW o el build: `npm run build` sin errores.
4. No crees documentación nueva (`*.md`) salvo que se pida explícitamente.

## Estado del proyecto / qué falta

Ver `ROADMAP.md` para la lista de huecos conocidos (lint, CI en PRs, etc.) y
`CHECKPOINT.md` para la bitácora de sesiones y decisiones recientes — actualiza este
último al final de cada sesión de trabajo relevante.
