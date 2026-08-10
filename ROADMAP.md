# ROADMAP — TheorieKI

Rumbo del proyecto: qué está sólido, qué falta y en qué orden tendría sentido
abordarlo. Última auditoría: 2026-08-10 (ver `CHECKPOINT.md` para el detalle de esa
sesión).

## Estado actual (verificado, no solo documentado)

- 76/76 tests pasan (`npm test`), `npm run build` compila sin errores.
- 158 preguntas (146 categoría B, 158 categoría A — 146 compartidas + 12 propias de A),
  todas con traducción completa en los 6 idiomas, sin huecos. 15 bloques de tips, ídem.
- Sin TODOs/FIXMEs reales pendientes en el código.
- Funcionalidad cubierta: estudio, examen simulado, repaso de falladas, maniobras
  animadas, señales (explorar/flashcards SRS/quiz), Nothelfer, VKU, Kontrollfahrt, WAB,
  estadísticas, perfiles locales, backup/restore, PWA offline, dark mode.

## Huecos conocidos

Orden aproximado de prioridad, no estricto — reordénalo si cambia el contexto.

1. **Sin ESLint** — no hay `.eslintrc`/`eslint.config.*` ni script `lint`. Con React 19 +
   hooks + Tailwind v4 conviene al menos `eslint-plugin-react-hooks` para pescar
   dependencias de `useEffect` mal puestas antes de que lleguen a producción.
2. **Sin CI en pull requests** — `.github/workflows/deploy.yml` solo corre en push a
   `main` (antes del deploy). No hay un workflow que corra `npm test` (y build) en cada
   PR antes de mergear, así que un PR roto solo se detecta al hacer merge.
3. **Sin monitoreo de errores en producción** — decisión de privacidad consciente (sin
   analítica ni trackers de terceros), pero implica que un fallo en producción solo se
   sabe si un usuario escribe. Si esto cambia de prioridad, evaluar algo self-hosted o
   sin PII antes de añadir un SDK de terceros.
4. **Cobertura de tests por módulo desigual** — hay tests de lógica pura (`utils`,
   `storage`, `lazyWithReload`) y de componentes clave (`App`, `Home`, `Study`, `Exam`,
   `ErrorBoundary`), pero módulos como Signs, FirstAid, Vku, Kontrollfahrt, Wab, Stats,
   Maneuvers (componente, no solo datos) no tienen test de componente propio todavía.
5. **VKU y Nothelfer declaran explícitamente "no sustituye el curso oficial"** —
   limitación de diseño consciente, no bug. Si se quisiera ampliar el temario, revisar
   primero si sigue siendo fiel a esa promesa antes de sumar contenido.

## Ideas a futuro (sin comprometer, solo capturadas)

- Publicación en tiendas (Google Play vía TWA/Bubblewrap, App Store vía wrapper nativo)
  — ya documentado en el README como posibilidad, no iniciado.
- Ampliar el banco de preguntas más allá de 158 si aparece contenido nuevo verificado
  contra SVG/VRV/SSV.

## Cómo mantener este archivo

- Actualízalo cuando se cierre un hueco de la lista de arriba o aparezca uno nuevo.
- No lo uses como changelog detallado — para eso está el historial de git y
  `CHECKPOINT.md`. Este archivo es "hacia dónde vamos y qué falta", no "qué se hizo".
