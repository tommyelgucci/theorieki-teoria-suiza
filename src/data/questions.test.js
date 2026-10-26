import { describe, expect, it } from 'vitest'
import questions from './questions.json'
import { TOPICS } from './topics'
import { MARKINGS } from './markings'
import { SIGNS } from './signs'

const LANGS = ['de', 'es', 'fr', 'it', 'en', 'pt']

describe('Banco de preguntas', () => {
  it('ids únicos y cada pregunta tiene al menos una respuesta correcta', () => {
    expect(new Set(questions.map((q) => q.id)).size).toBe(questions.length)
    for (const q of questions) {
      expect(q.options.some((o) => o.correct), q.id).toBe(true)
      expect(q.options.length, q.id).toBeGreaterThanOrEqual(2)
    }
  })

  it('enunciado, opciones y explicación están en los 6 idiomas', () => {
    for (const q of questions) {
      for (const l of LANGS) {
        expect(q.question[l]?.trim(), `${q.id} question ${l}`).toBeTruthy()
        expect(q.explanation[l]?.trim(), `${q.id} explanation ${l}`).toBeTruthy()
        for (const o of q.options) expect(o.text[l]?.trim(), `${q.id}/${o.id} ${l}`).toBeTruthy()
      }
    }
  })

  it('todo tema usado existe en TOPICS y viceversa', () => {
    const known = new Set(TOPICS.map((t) => t.id))
    const used = new Set(questions.map((q) => q.topic))
    for (const u of used) expect(known.has(u), `tema sin etiqueta: ${u}`).toBe(true)
    for (const k of known) expect(used.has(k), `tema sin preguntas: ${k}`).toBe(true)
  })

  it('las imágenes de tipo marca y señal apuntan a datos que existen', () => {
    const marks = new Set(MARKINGS.map((m) => m.id))
    const signs = new Set(SIGNS.map((s) => s.id))
    for (const q of questions) {
      if (q.image?.type === 'marking') expect(marks.has(q.image.id), q.id).toBe(true)
      if (q.image?.type === 'sign') expect(signs.has(q.image.id), q.id).toBe(true)
    }
  })
})
