# ROADMAP — TheorieKI

Rumbo del proyecto: qué está sólido, qué falta y en qué orden tendría sentido
abordarlo. Última actualización: 2026-08-10 (ver `CHECKPOINT.md` para el detalle de cada sesión).

## Estado actual (verificado, no solo documentado)

- 76/76 tests pasan (`npm test`), `npm run lint` en 0 errores, `npm run build` compila
  sin errores.
- CI en pull requests (`.github/workflows/ci.yml`): lint + test + build en cada PR
  contra `main`.
- 158 preguntas (146 categoría B, 158 categoría A — 146 compartidas + 12 propias de A),
  todas con traducción completa en los 6 idiomas, sin huecos. 15 bloques de tips, ídem.
- Sin TODOs/FIXMEs reales pendientes en el código.
- Funcionalidad cubierta: estudio, examen simulado, repaso de falladas, maniobras
  animadas, señales (explorar/flashcards SRS/quiz), Nothelfer, VKU, Kontrollfahrt, WAB,
  estadísticas, perfiles locales, backup/restore, PWA offline, dark mode.

## Huecos conocidos

Orden aproximado de prioridad, no estricto — reordénalo si cambia el contexto.

1. **Sin monitoreo de errores en producción** — decisión de privacidad consciente (sin
   analítica ni trackers de terceros), pero implica que un fallo en producción solo se
   sabe si un usuario escribe. Si esto cambia de prioridad, evaluar algo self-hosted o
   sin PII antes de añadir un SDK de terceros.
2. **Cobertura de tests por módulo desigual** — hay tests de lógica pura (`utils`,
   `storage`, `lazyWithReload`) y de componentes clave (`App`, `Home`, `Study`, `Exam`,
   `ErrorBoundary`), pero módulos como Signs, FirstAid, Vku, Kontrollfahrt, Wab, Stats,
   Maneuvers (componente, no solo datos) no tienen test de componente propio todavía.
3. **`react-refresh/only-export-components` en `SignSprite.jsx`** — el archivo exporta
   el componente por defecto y también constantes/helpers de dibujo. Es solo un warning
   (no rompe el lint), pero si se quiere limpiar del todo habría que separar las
   constantes de color/pictograma a un módulo propio.
4. **VKU y Nothelfer declaran explícitamente "no sustituye el curso oficial"** —
   limitación de diseño consciente, no bug. Si se quisiera ampliar el temario, revisar
   primero si sigue siendo fiel a esa promesa antes de sumar contenido.

## Cerrado

- ~~Sin ESLint~~ → `eslint.config.js` con reglas clásicas de `react-hooks`
  (`rules-of-hooks` + `exhaustive-deps`, sin las reglas experimentales de React
  Compiler que el proyecto no usa) + `no-unused-vars` + `react-refresh`. `npm run lint`.
- ~~Sin CI en pull requests~~ → `.github/workflows/ci.yml` corre lint + test + build en
  cada PR contra `main`.

## Ideas a futuro (sin comprometer, solo capturadas)

- Publicación en tiendas (Google Play vía TWA/Bubblewrap, App Store vía wrapper nativo)
  — ya documentado en el README como posibilidad, no iniciado.
- Ampliar el banco de preguntas más allá de 158 si aparece contenido nuevo verificado
  contra SVG/VRV/SSV.

## Cómo mantener este archivo

- Actualízalo cuando se cierre un hueco de la lista de arriba o aparezca uno nuevo.
- No lo uses como changelog detallado — para eso está el historial de git y
  `CHECKPOINT.md`. Este archivo es "hacia dónde vamos y qué falta", no "qué se hizo".
