import { describe, expect, it } from 'vitest'
import { MANEUVERS } from './maneuvers'

// Las animaciones son datos, no código, así que un error se ve mirando el vídeo
// y no rompe ningún test... salvo que se compruebe la geometría. Esto verifica
// que el coche no acabe circulando por el césped ni salte entre pasos.

// Mismo cuerpo que dibuja CarSprite: 36 x 72 centrado en el ancla.
const HALF_W = 18
const HALF_L = 36
const CANVAS_H = 560

function corners({ x, y, angle }) {
  const a = (angle * Math.PI) / 180
  const cos = Math.cos(a)
  const sin = Math.sin(a)
  return [
    [-HALF_W, -HALF_L],
    [HALF_W, -HALF_L],
    [HALF_W, HALF_L],
    [-HALF_W, HALF_L],
  ].map(([dx, dy]) => [x + dx * cos - dy * sin, y + dx * sin + dy * cos])
}

// Misma interpolación que ManeuverPlayer.sampleKeyframes, sin el easing: el
// easing cambia el ritmo, no el recorrido.
function sample(keyframes, p) {
  if (keyframes.length === 1) return keyframes[0]
  let i = 0
  while (i < keyframes.length - 2 && p > keyframes[i + 1].t) i++
  const a = keyframes[i]
  const b = keyframes[i + 1]
  const span = b.t - a.t || 1
  const l = (p - a.t) / span
  return {
    x: a.x + (b.x - a.x) * l,
    y: a.y + (b.y - a.y) * l,
    angle: a.angle + (b.angle - a.angle) * l,
  }
}

const inRect = ([px, py], r) => px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h

function flatten(list) {
  const out = []
  for (const m of list) {
    if (m.variants) {
      for (const v of m.variants) out.push({ id: `${m.id}/${v.id}`, scene: m.scene, steps: v.steps })
    } else {
      out.push({ id: m.id, scene: m.scene, steps: m.steps })
    }
  }
  return out
}

const TODAS = flatten(MANEUVERS)

describe('geometría de las maniobras', () => {
  it.each(TODAS.map((m) => [m.id, m]))('%s mantiene el coche sobre el asfalto', (_id, m) => {
    const roads = m.scene.elements.filter((e) => e.type === 'road')
    const fuera = []

    m.steps.forEach((s, si) => {
      for (let k = 0; k <= 240; k++) {
        const pose = sample(s.keyframes, k / 240)
        for (const c of corners(pose)) {
          // entrar o salir del encuadre por arriba/abajo no es pisar el césped
          if (c[1] < 0 || c[1] > CANVAS_H) continue
          if (roads.some((r) => inRect(c, r))) continue
          fuera.push(
            `paso ${si + 1} (t=${(k / 240).toFixed(2)}): esquina en ` +
              `${c.map((v) => v.toFixed(0)).join(',')} fuera de la calzada`,
          )
        }
      }
    })

    expect(fuera.slice(0, 3)).toEqual([])
  })

  it.each(TODAS.map((m) => [m.id, m]))('%s encadena los pasos sin saltos', (_id, m) => {
    const saltos = []

    m.steps.forEach((s, si) => {
      if (si === 0 || s.restart) return
      const fin = m.steps[si - 1].keyframes.at(-1)
      const ini = s.keyframes[0]
      // diferencia mínima entre ángulos: -270 y 90 son la misma orientación
      const dAngulo = Math.abs(((((fin.angle - ini.angle) % 360) + 540) % 360) - 180)
      if (Math.abs(fin.x - ini.x) > 0.01 || Math.abs(fin.y - ini.y) > 0.01 || dAngulo > 0.01) {
        saltos.push(
          `paso ${si + 1} arranca en (${ini.x}, ${ini.y}, ${ini.angle}) ` +
            `pero el anterior terminó en (${fin.x}, ${fin.y}, ${fin.angle})`,
        )
      }
    })

    expect(saltos).toEqual([])
  })
})
