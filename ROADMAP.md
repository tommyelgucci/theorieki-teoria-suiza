# ROADMAP — TheorieKI

Rumbo del proyecto: qué está sólido, qué falta y en qué orden tendría sentido
abordarlo. Última actualización: 2026-08-19 (ver `CHECKPOINT.md` para el detalle de cada sesión).

## Estado actual (verificado, no solo documentado)

- 104/104 tests pasan (`npm test`, 16 archivos), `npm run lint` en **0 errores y 0
  warnings**, `npm run build` compila sin errores. Verificado con varias corridas
  completas seguidas (los tests usan bancos de preguntas barajados al azar, así que una
  sola corrida verde no basta).
- Deploy en `main` (`.github/workflows/deploy.yml`) verde de nuevo tras el fix del test
  flaky (ver "Cerrado").
- CI en pull requests (`.github/workflows/ci.yml`): lint + test + build en cada PR
  contra `main`.
- 234 preguntas (222 categoría B, 234 categoría A — 222 compartidas + 12 propias de A),
  todas con traducción completa en los 6 idiomas, sin huecos. 15 bloques de tips, ídem.
  Ampliado en tres rondas de la sesión de 2026-08-19 con 19 temas nuevos (76 preguntas)
  redactados desde cero a partir de VRV/SVG/SSV, ver `CHECKPOINT.md`.
- El chunk `questions-*.js` del build supera el umbral de aviso de Rollup (500 kB
  minificado; ~590 KB reales a fecha de hoy) — `npm run build` sigue compilando sin
  errores, es solo un warning informativo, y el chunk ya es lazy (no entra en el bundle
  inicial, ver "Modelo de datos" en el README). Si el banco sigue creciendo en próximas
  sesiones, valorar `build.chunkSizeWarningLimit` o partir el JSON en varios chunks por
  categoría/tema — todavía no urgente, pero cada ronda de +20 preguntas suma ~60-70 KB.
- Sin TODOs/FIXMEs reales pendientes en el código.
- Funcionalidad cubierta: estudio, examen simulado, repaso de falladas, maniobras
  animadas, señales (explorar/flashcards SRS/quiz), Nothelfer, VKU, Kontrollfahrt, WAB,
  estadísticas, perfiles locales, backup/restore, PWA offline, dark mode.
- Todos los componentes de vista tienen test propio: `Signs`, `FirstAid`, `Vku`,
  `Kontrollfahrt`, `Wab`, `Stats`, `Maneuvers` se sumaron a los que ya tenían (`App`,
  `Home`, `Study`, `Exam`, `ErrorBoundary`).

## Huecos conocidos

Orden aproximado de prioridad, no estricto — reordénalo si cambia el contexto.

1. **Sin monitoreo de errores en producción** — decisión de privacidad consciente (sin
   analítica ni trackers de terceros), pero implica que un fallo en producción solo se
   sabe si un usuario escribe. Si esto cambia de prioridad, evaluar algo self-hosted o
   sin PII antes de añadir un SDK de terceros.
2. **VKU y Nothelfer declaran explícitamente "no sustituye el curso oficial"** —
   limitación de diseño consciente, no bug. Si se quisiera ampliar el temario, revisar
   primero si sigue siendo fiel a esa promesa antes de sumar contenido.
3. **Patrón de test frágil con banco barajado**: cualquier test que busque un botón por
   texto parcial (regex) en una pantalla donde también se renderizan opciones de
   pregunta tomadas al azar del banco corre el riesgo de que una opción real contenga esa
   misma subcadena (pasó de verdad: ver "Cerrado" más abajo). Si se añade contenido
   nuevo a `questions.json`/`firstaid.js`/`vku.js`, vale la pena correr `npm test` varias
   veces seguidas antes de confiar en un solo run verde.

## Cerrado

- ~~Sin ESLint~~ → `eslint.config.js` con reglas clásicas de `react-hooks`
  (`rules-of-hooks` + `exhaustive-deps`, sin las reglas experimentales de React
  Compiler que el proyecto no usa) + `no-unused-vars` + `react-refresh`. `npm run lint`.
- ~~Sin CI en pull requests~~ → `.github/workflows/ci.yml` corre lint + test + build en
  cada PR contra `main`.
- ~~Cobertura de tests por módulo desigual~~ → tests de componente nuevos para los 7
  módulos que no los tenían.
- ~~Bug de test flaky que rompió el deploy en `main`~~ → `Study.test.jsx` buscaba el
  botón "Weiter" (siguiente) con una regex de subcadena sin límite de palabra; cuando el
  banco barajado ponía primera la pregunta de cadenas de nieve, su opción real
  "Weiterfahrt nur mit montierten Schneeketten" también matcheaba y `getByRole` fallaba
  por encontrar dos botones. Corregido con un matcher `^Weiter\b` dedicado sólo para ese
  botón (el helper genérico de la etiqueta de menú no puede llevar límite de palabra: en
  el inicio, la etiqueta va pegada sin espacio al subtítulo, p. ej. "LernmodusFragen mit
  sofortigem Feedback").
- ~~`react-refresh/only-export-components` en `SignSprite.jsx`~~ → `PICTOGRAMS` no se
  importaba desde ningún otro archivo, así que le sobraba el `export`: quitarlo bastó
  para que el lint quedara en 0 warnings, sin tener que mover nada a un módulo nuevo.

## Ideas a futuro (sin comprometer, solo capturadas)

- Publicación en tiendas (Google Play vía TWA/Bubblewrap, App Store vía wrapper nativo)
  — ya documentado en el README como posibilidad, no iniciado.
- Ampliar el banco de preguntas más allá de 158 si aparece contenido nuevo verificado
  contra SVG/VRV/SSV.

## Cómo mantener este archivo

- Actualízalo cuando se cierre un hueco de la lista de arriba o aparezca uno nuevo.
- No lo uses como changelog detallado — para eso está el historial de git y
  `CHECKPOINT.md`. Este archivo es "hacia dónde vamos y qué falta", no "qué se hizo".
