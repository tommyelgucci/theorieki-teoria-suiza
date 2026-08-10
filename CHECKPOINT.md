# CHECKPOINT — bitácora de sesiones

Registro breve de qué se hizo y qué se decidió en cada sesión de trabajo relevante.
No es un changelog exhaustivo (para eso está `git log`) — es contexto para no repetir
descubrimientos ni decisiones en la próxima sesión. Añade una entrada nueva arriba del
todo al cerrar una sesión que haya cambiado algo o descubierto algo que valga la pena
recordar.

---

## 2026-08-10 (2) — ESLint + CI en pull requests

**Contexto:** primeros dos huecos del `ROADMAP.md` de la sesión anterior.

**Qué se hizo:**
- Instalado ESLint 10 (flat config) con `eslint-plugin-react-hooks` 7 y
  `eslint-plugin-react-refresh`. Deliberadamente **no** se usó el config
  `recommended` completo de `react-hooks` v7: incluye las reglas nuevas orientadas a
  React Compiler (`purity`, `set-state-in-effect`, etc.), que marcaban como error
  patrones deliberados y correctos en este proyecto (p. ej. `Math.random()` dentro de
  `useMemo` en `Confetti.jsx` para generar las partículas una sola vez). Se dejaron solo
  las dos reglas clásicas: `rules-of-hooks` (error) y `exhaustive-deps` (warning).
- Añadido script `npm run lint` (`eslint .`).
- Corregidos los 2 errores reales que encontró el lint (no relacionados con hooks):
  - `src/components/Review.jsx`: import de `useMemo` sin usar.
  - `src/components/SignSprite.jsx`: `let body = null` seguido de un `default: body =
    null` en el switch hacía el `null` inicial un dead store (`no-useless-assignment`).
  - De paso, `src/components/ErrorBoundary.jsx`: sobraba un
    `// eslint-disable-next-line no-console` para una regla que no está activada.
  - Queda 1 warning conocido y no bloqueante en `SignSprite.jsx`
    (`react-refresh/only-export-components`), documentado en `ROADMAP.md`.
- Creado `.github/workflows/ci.yml`: corre `npm run lint` + `npm test` + `npm run
  build` en cada pull request contra `main` (el workflow de deploy existente sigue
  igual, solo corre en push a `main`).
- `npm install` de las nuevas devDependencies dejó a la vista 3 vulnerabilidades de
  `npm audit` (nanoid, postcss, undici) — se verificó que **ya existían antes** de este
  cambio (dependencias transitivas de build/tooling, no introducidas ahora). No se
  tocaron; quedan fuera del alcance de esta sesión.
- Actualizados `CLAUDE.md` (menciona `npm run lint` en el checklist) y `ROADMAP.md`
  (los dos huecos se movieron a "Cerrado", se sumó el warning de `SignSprite.jsx` como
  hueco menor nuevo).

**Verificación:** `npm run lint` (0 errores, 1 warning), `npm test` (76/76),
`npm run build` (sin errores) — los tres antes de cerrar la sesión.

**Próximos pasos sugeridos** (ver `ROADMAP.md`): monitoreo de errores en producción
(pendiente de decisión de privacidad), cobertura de tests por módulo.

---

## 2026-08-10 — Auditoría inicial + CLAUDE.md / ROADMAP.md / CHECKPOINT.md

**Contexto:** primera vez que se piden estos tres documentos; no existían en el repo ni
en su historial.

**Qué se hizo:**
- Auditoría del estado real del proyecto (no solo lectura del README):
  - `npm test` → 76/76 tests verdes.
  - `npm run build` → compila sin errores, SW precachea correctamente.
  - Verificación programática de que las 158 preguntas y los 15 bloques de tips tienen
    los 6 idiomas completos, sin huecos.
  - Conteo de preguntas por categoría confirmado: 146 B, 158 A (146 compartidas + 12
    propias de A) — coincide con lo que dice el README.
  - Búsqueda de TODO/FIXME reales en `src/` → ninguno (los matches de grep eran la
    palabra "todo" en español/portugués, falsos positivos).
  - Confirmado que no hay `.eslintrc`/`eslint.config.*` ni script `lint`.
  - Confirmado que CI solo corre en push a `main` (dentro de `deploy.yml`), no hay
    workflow de PR.
- Creados `CLAUDE.md` (instrucciones de proyecto) y `ROADMAP.md` (huecos conocidos,
  detalle completo ahí) a partir de esa auditoría.

**Decisiones:**
- `CLAUDE.md` no duplica el detalle funcional del README — remite a él y se centra en
  reglas de oro + dónde está cada cosa + checklist de cierre de tarea.
- `ROADMAP.md` es "hacia dónde vamos", no un changelog — el detalle de qué se hizo en
  cada sesión vive aquí, en `CHECKPOINT.md`.

**Próximos pasos sugeridos** (no iniciados, ver `ROADMAP.md` para el detalle):
1. ESLint básico (`eslint-plugin-react-hooks` como mínimo).
2. Workflow de CI en pull requests (correr `npm test` antes de permitir merge).
