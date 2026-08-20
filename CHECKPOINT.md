# CHECKPOINT — bitácora de sesiones

Registro breve de qué se hizo y qué se decidió en cada sesión de trabajo relevante.
No es un changelog exhaustivo (para eso está `git log`) — es contexto para no repetir
descubrimientos ni decisiones en la próxima sesión. Añade una entrada nueva arriba del
todo al cerrar una sesión que haya cambiado algo o descubierto algo que valga la pena
recordar.

---

## 2026-08-19 (3) — Tercera ronda: 5 temas más (personas en remolque, tram en rotonda, luces de remolque, descensos, marcha atrás)

**Contexto:** segunda continuación directa ("Si sigue") sobre la lista de candidatos que
quedó anotada al cierre de la ronda anterior. Mismo protocolo de las dos rondas previas:
investigar cada tema por separado antes de escribir, y comprobar contra el banco
existente que no hubiera duplicados.

**Investigación previa:** transporte de personas en la caja/remolque (VRV: solo en el
marco de la explotación agrícola, o viajes gratuitos de utilidad pública equiparados a
ella, con "protección adecuada" — laterales o plazas habilitadas; los paseos puramente
recreativos no están cubiertos), tranvía en rotonda (prioridad del tranvía tanto al
entrar como al salir del kreisel, por ir sujeto a vía y no poder esquivar ni frenar
rápido; distinto si el tranvía gira de una calle secundaria a una principal fuera de
rotonda, donde no hay prioridad automática), iluminación de remolques (luz trasera roja
propia si tapa la del vehículo tractor, catadióptricos traseros naranjas no triangulares,
iluminación de matrícula), conducción en descensos largos (freno motor con marcha corta,
riesgo de "fading" por frenado continuo, frenadas cortas y enérgicas en vez de frenado
sostenido), y marcha atrás (art. 17 VRV: solo si no es posible seguir adelante o dar la
vuelta, prohibido en pasos a nivel y bifurcaciones con poca visibilidad, solo al paso,
persona guía si la visibilidad trasera es limitada).

Se verificó contra el banco existente (topics `kreisverkehr`, `fahrzeug`, `pannen`,
`abstand`, `ladung`) que ninguno de estos 5 temas duplicara preguntas ya presentes —
todas son complementarias.

**Qué se hizo:**
- `questions.json`: +20 preguntas nuevas (q215–q234), 5 topics nuevos (`ladeflaeche`,
  `tram_kreisel`, `anhaenger_licht`, `gefaelle`, `rueckwaerts`), 4 preguntas cada uno, los
  6 idiomas completos. Banco: 214 → 234 (222 categoría B, 234 categoría A).
- Actualizados de nuevo los conteos hardcodeados en `Home.test.jsx` (202→222, 214→234) y
  `Study.test.jsx` (202→222), y el comentario de tamaño de bundle en `questionBank.js`
  (214→234 preguntas, ~530→~590 KB minificado).
- `README.md`/`ROADMAP.md`: conteos actualizados; se amplió la nota sobre el warning de
  tamaño de chunk de Rollup (ya presente, no nuevo) indicando que cada ronda de ~20
  preguntas añade ~60-70 KB al chunk lazy de `questions.json`.

**Verificación:** script Python de idiomas (0 errores en las 234 preguntas), `npm run
lint` (0/0), `npm test` × 5 corridas seguidas (104/104 cada vez), `npm run build` sin
errores (con el mismo warning de tamaño de chunk ya documentado, no bloqueante).

**Pendiente / candidatos para seguir ampliando** (sin investigar todavía): normas de
adelantamiento en curva o cresta, obligaciones tras un accidente con animales salvajes,
zona de encuentro vs. zona peatonal, transporte de cargas peligrosas para particulares,
prioridad de vehículos de servicio de invierno (quitanieves). Repetir siempre el mismo
protocolo: buscar en internet la base legal real antes de redactar, y comprobar contra el
banco existente para no duplicar.

---

## 2026-08-19 (2) — Segunda ronda: 5 temas más (vignette, animales, peatones, semáforo intermitente, tempo mínimo)

**Contexto:** continuación directa de la sesión anterior (mismo día). El usuario pidió
"continúa" sobre la lista de temas candidatos que quedó anotada al cierre de la ronda
anterior. Mismo protocolo: investigar cada tema por separado antes de escribir una sola
pregunta, y comprobar que no duplicara nada ya existente en el banco.

**Investigación previa:** viñeta de autopista (Nationalstrassenabgabegesetz, no es VRV/SVG
sino una ley de peaje aparte — CHF 40, obligatoria para todo motor ≤3,5 t, válida ~14
meses, busca CHF 200 sin ella; sobre 3,5 t rige la LSVA en su lugar), transporte de
animales (art. 30 párr. 2 VRV para la sujeción de la carga + Ordenanza de protección
animal para espacio/clima/pausas), peatones fuera de paso marcado (art. 47 párr. 2 VRV,
deben usar un paso a menos de 50 m, sin prioridad automática fuera de él), semáforo con
luz amarilla intermitente (art. 70 párr. 1 SSV: no regula la prioridad, remite a la
señalización existente o a la prioridad de derecha), y velocidad mínima en autopista
(art. 35 párr. 1 VRV: 80 km/h para poder circular; desde 2016, 100 km/h en el carril más
a la izquierda de autopistas de 3+ carriles por sentido).

Antes de escribir, se verificó contra el banco existente que ninguno de estos temas
duplicara preguntas ya presentes (p. ej. "beleuchtung"/"q056"/"q147" ya cubren la
obligación general de luz diurna — por eso se descartó un sexto tema de "Tagfahrlicht"
que se había planificado inicialmente, para no ser redundante, y se sustituyó por el de
velocidad mínima en autopista).

**Qué se hizo:**
- `questions.json`: +20 preguntas nuevas (q195–q214), 5 topics nuevos (`vignette`,
  `tiertransport`, `fussgaenger_ausserhalb`, `blinklicht`, `mindesttempo`), 4 preguntas
  cada uno, los 6 idiomas completos. Banco: 194 → 214 (202 categoría B, 214 categoría A).
- Actualizados de nuevo los conteos hardcodeados en `Home.test.jsx` (182→202, 194→214) y
  `Study.test.jsx` (182→202), y el comentario de tamaño de bundle en `questionBank.js`
  (194→214 preguntas, ~470→~530 KB minificado, medido con `JSON.stringify` real).
- `README.md`/`ROADMAP.md`: conteos actualizados. Se anotó en `ROADMAP.md` un nuevo aviso
  (no bloqueante): el chunk `questions-*.js` del build ya pasa el umbral de 500 kB de
  Rollup y aparece como warning informativo — el build sigue compilando sin errores y el
  chunk ya es lazy, pero si el banco sigue creciendo en próximas sesiones vale la pena
  partirlo en varios chunks.

**Verificación:** script Python de idiomas (0 errores en las 214 preguntas), `npm run
lint` (0/0), `npm test` × 5 corridas seguidas (104/104 cada vez), `npm run build` sin
errores (con el warning de tamaño de chunk mencionado arriba, no bloqueante).

**Pendiente / candidatos para seguir ampliando** (sin iniciar): transporte de personas en
la caja de una camioneta, prioridad en rotondas con tranvía integrado, luces de
circulación en caravana/remolque, distancia de seguimiento en descenso con freno motor,
maniobra de marcha atrás en vía pública larga distancia. A diferencia de la lista anterior,
estos aún no se han investigado contra fuentes legales — antes de redactar preguntas,
repetir el mismo protocolo de búsqueda en internet + comprobación de duplicados.

---

## 2026-08-19 — Ampliación grande del banco de preguntas + VKU + Nothelfer

**Contexto:** pedido explícito del usuario de ampliar mucho el banco de preguntas y el
contenido de VKU/Nothelfer, "buscando información en internet". Restricción legal del
proyecto: nada de copiar/parafrasear el banco de la asa, todo debe redactarse desde cero
a partir de legislación suiza de dominio público (SVG/VRV/SSV) u otras fuentes públicas
(BFU, ASTRA, guías de primeros auxilios estándar SRC/ERC).

**Investigación previa** (vía `WebSearch`, antes de escribir nada): se identificaron 9
huecos temáticos reales en `questions.json` con base legal concreta — cinturón/silla
infantil (art. 3a VRV), móvil al volante (art. 3 VRV), carril de emergencia/Rettungsgasse
(art. 27 SVG, obligatorio desde 2021), paso a nivel, sujeción de carga (art. 57/58/73
VRV), distancia al adelantar ciclistas (sin valor fijo en la ley, art. 34 SVG exige
"distancia suficiente" — se verificó que esto no contradecía la pregunta ya existente
q078 sobre el margen práctico de ~1,5 m), neumáticos de invierno (sin obligación legal
explícita, pero deber general de diligencia del art. 31 SVG), túneles y remolcado (art.
23 VRV). Se verificó primero que ninguno de estos temas duplicara contenido ya cubierto
bajo otro topic (p. ej. ya existían preguntas de paso a nivel bajo el topic "umwelt"
sobre apagar el motor, y de distancia con ciclistas bajo "ueberholen" — los temas nuevos
son complementarios, no repetidos).

**Qué se hizo:**
- `questions.json`: +36 preguntas nuevas (q159–q194), 9 topics nuevos (`gurte`,
  `ablenkung`, `rettungsgasse`, `bahnuebergang`, `ladung`, `velo`, `reifen`, `tunnel`,
  `abschleppen`), 4 preguntas cada uno, las 6 idiomas completos, generadas con un script
  Python (`json.dump`) para evitar errores de sintaxis en un archivo tan grande. Banco:
  158 → 194 (182 categoría B, 194 categoría A).
- `vku.js`: +6 preguntas de quiz (vk13–vk18: fatiga+alcohol combinados, distancia tras
  camiones, niebla, fauna silvestre/Wildwechsel, puentes que hielan antes, zona escolar)
  y +4 flashcards (v15–v18). No se tocó `VKU_BLOCKS` (los 4 bloques oficiales del curso
  no deben alterarse).
- `firstaid.js`: +2 temas nuevos completos (`ersticken` = atragantamiento/Heimlich,
  `brueche` = fracturas y esguinces — huecos reales del temario estándar de primeros
  auxilios, ausentes del módulo), +8 flashcards (c27–c34), +6 preguntas de quiz
  (fa19–fa24). Nothelfer pasa de 8 a 10 temas, de 26 a 34 tarjetas, de 18 a 24 preguntas
  en el pool (el quiz sigue sacando 10 al azar, `QUIZ_SIZE` sin cambios).
- `Icons.jsx`: los dos temas nuevos de Nothelfer necesitaban iconos (`lungs`, `bandage`)
  que no existían en `ICON_MAP` — sin ellos, `Icon()` devuelve `null` silenciosamente (no
  rompe nada, pero deja el icono en blanco). Se añadieron `IconLungs` e `IconBandage`
  siguiendo el estilo de línea ya establecido (viewBox 24×24, `currentColor`, sin fill).
- Verificación de idiomas: script Node que importa los `.js` como módulos ES reales
  (el proyecto es `"type": "module"`) y revisa que cada `question`/`option`/`explanation`/
  `title`/`bullet`/`front`/`back` tenga los 6 idiomas no vacíos — 0 errores en los tres
  archivos. Aparte, verificación de que cada pregunta nueva tenga exactamente 1 opción
  correcta (todas de una sola respuesta, a diferencia de algunas preguntas antiguas tipo
  checkbox con "Mehrere Antworten möglich").
- Tests: `Home.test.jsx` y `Study.test.jsx` tenían los conteos 146/158 hardcodeados en el
  texto esperado (`catalogo(146)`, etc.) — se actualizaron a 182/194. Corregido también
  el comentario de tamaño del bundle en `questionBank.js` (158→194 preguntas, ~350→~470
  KB minificado, verificado con `JSON.stringify` real, no estimado).
- `README.md`: actualizados los conteos de preguntas (146/158 → 182/194) y el detalle del
  módulo Nothelfer (8→10 temas, 26→34 tarjetas).

**Verificación:** `npm run lint` (0/0), `npm test` × 6 corridas seguidas (104/104 cada
vez, incluida la corrida que ya incorporaba los fixes de conteo), `npm run build` sin
errores.

**Decisión de alcance:** se priorizaron 9 temas de circulación con base legal verificable
y 2 temas de primeros auxilios con hueco real de temario, en vez de intentar cubrir "todo
lo posible" sin criterio — cada tema nuevo se investigó primero (fuentes: fedlex.admin.ch,
BFU, ACS, TCS, Pro Velo Schweiz) antes de redactar una sola pregunta, para cumplir la
restricción legal del proyecto de no derivar contenido de ningún banco de preguntas
existente. Si el usuario quiere seguir ampliando, quedan temas candidatos sin cubrir:
Autobahnvignette/etiqueta ambiental, transporte de animales, luces de circulación diurna,
cruce de peatones fuera de paso marcado, prioridad en cruces con semáforo intermitente.

---

## 2026-08-10 (4) — PR mergeado, deploy verde, y último hueco menor cerrado

**Contexto:** el usuario mergeó el PR (#4) de la sesión anterior mientras seguía
trabajando; el deploy en `main` volvió a estar verde (confirmado con
`mcp__github__actions_list`, run `31411035461`, commit `2b0f625`). Solo quedaba en el
roadmap el warning de `SignSprite.jsx` (los otros dos huecos son decisiones de producto,
no tareas de código).

**Qué se hizo:**
- `SignSprite.jsx`: `PICTOGRAMS` estaba exportado pero ningún otro archivo lo importaba
  — el `export` sobraba. Quitarlo resolvió el warning de `react-refresh/only-export-components`
  sin necesidad de separar constantes a un módulo nuevo. `npm run lint` queda en **0
  errores y 0 warnings**.
- Como el PR ya estaba mergeado, se repitió el protocolo de rama ya mergeada: `git fetch
  origin main && git checkout -B claude/theorieki-project-16nnbf origin/main` (diff
  vacío antes de resetear) y se commiteó el fix encima.

**Verificación:** `npm run lint` (0/0), `npm test` (104/104), `npm run build` sin
errores.

**Estado del roadmap:** de los huecos originales solo quedan dos, y ambos son
decisiones de producto que no tiene sentido tomar sin el usuario: monitoreo de errores
en producción (choca con la postura de privacidad) y si ampliar VKU/Nothelfer más allá
de "no sustituye el curso oficial". El resto de la lista son notas de mantenimiento
(patrón de test frágil), no tareas pendientes.

---

## 2026-08-10 (3) — Cobertura de tests + fix de un bug que rompió el deploy en `main`

**Contexto:** siguiente hueco del `ROADMAP.md`: cobertura de tests desigual (7 módulos
sin test de componente propio). A mitad de sesión, el usuario mandó una captura del
workflow "Deploy TheorieKI a GitHub Pages" fallando en `main` — el PR de la sesión
anterior (#3) ya se había mergeado, y ese merge rompió el deploy real.

**Qué se hizo:**
- Tests de componente nuevos para los 7 módulos que no los tenían: `Wab.test.jsx`,
  `Kontrollfahrt.test.jsx`, `Maneuvers.test.jsx`, `Stats.test.jsx`, `Signs.test.jsx`,
  `FirstAid.test.jsx`, `Vku.test.jsx`. Siguen el patrón ya establecido (render de `<App
  />` completo, navegación por texto real de `i18n.js`, storage limpiado entre tests).
- **Investigación del fallo de deploy** (vía `mcp__github__actions_list` /
  `get_job_logs`, herramientas del MCP de GitHub): el run que falló (`31409399956`, en
  `main`, commit `1578ebf` = merge del PR #3) no tenía nada que ver con el trabajo nuevo
  de esta sesión (todavía sin commitear en ese momento) — era un bug preexistente en
  `Study.test.jsx`, ya en el repo desde antes: `text('next')` construía una regex de
  subcadena sin límite de palabra a partir de `t('next', 'de')` = `'Weiter'`. El banco de
  preguntas se baraja al azar en cada montaje de `Study`, y la pregunta sobre cadenas de
  nieve tiene una opción real `"Weiterfahrt nur mit montierten Schneeketten"` que también
  matchea `/Weiter/i`. Cuando el shuffle pone esa pregunta primera, `getByRole('button',
  {name: /Weiter/i})` encuentra DOS botones (el de "Weiter →" y la opción) y revienta.
  Es decir: bug de fiabilidad del test, no de la app — pero bloqueaba el deploy real.
- **Fix**: no se puede poner un límite de palabra (`\b`) en el helper genérico `text()`
  porque se usa también para encontrar botones de menú del inicio, donde la etiqueta va
  pegada sin espacio al subtítulo (p. ej. accessible name `"LernmodusFragen mit
  sofortigem Feedback"` — sin espacio entre "Lernmodus" y "Fragen"), así que un `\b` al
  final ahí nunca encontraría borde de palabra y rompería esa búsqueda. Se añadió un
  helper aparte, `actionWord()`, con `^texto\b` (ancla al inicio + borde al final), usado
  solo en el único sitio que lo necesita: el botón "Weiter" de `Study.test.jsx` tras
  revelar una respuesta. Se revirtió por el mismo motivo un cambio equivalente que se
  había aplicado de más en `Exam.test.jsx` (ese archivo no tiene el bug: no busca el
  botón "next" por regex ahí). Se aplicó el mismo patrón (`word()`, con `\b` a ambos
  lados) al único punto de riesgo real en el test nuevo de `FirstAid.test.jsx` (botón
  "Weiter" del quiz, mismo tipo de colisión potencial aunque hoy no se dé con el banco
  actual de Nothelfer).
- **Verificación de la reproducibilidad**: como el bug depende del orden aleatorio del
  banco, una sola corrida verde no prueba nada. Se corrió `Study.test.jsx` +
  `Exam.test.jsx` 10 veces seguidas (10/10 verde) y la suite completa 8 veces seguidas
  (8/8 verde, 104/104 tests cada vez) antes de dar el fix por bueno.
- Corregido un error real de lint que aparecía en el nuevo `Stats.test.jsx` (`afterEach`
  importado sin usar).
- Como el PR #3 ya estaba mergeado a `main`, se siguió el protocolo de la sesión para
  ramas ya mergeadas: `git fetch origin main && git checkout -B
  claude/theorieki-project-16nnbf origin/main` (contenido idéntico, sin pérdida —
  verificado con `git diff HEAD origin/main` vacío antes de resetear) y se commiteó el
  trabajo nuevo encima de esa base.

**Verificación final:** `npm run lint` (0 errores, 1 warning conocido), `npm test` ×8
(104/104 cada vez), `npm run build` sin errores.

**Pendiente / a comunicar al usuario:** `main` sigue roto hasta que este commit se
mergee — el deploy no se volverá a intentar hasta el próximo push a `main`. No se abrió
PR en esta sesión (no se pidió explícitamente); avisar al usuario de la urgencia.

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
