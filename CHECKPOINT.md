# CHECKPOINT — bitácora de sesiones

Registro breve de qué se hizo y qué se decidió en cada sesión de trabajo relevante.
No es un changelog exhaustivo (para eso está `git log`) — es contexto para no repetir
descubrimientos ni decisiones en la próxima sesión. Añade una entrada nueva arriba del
todo al cerrar una sesión que haya cambiado algo o descubierto algo que valga la pena
recordar.

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
