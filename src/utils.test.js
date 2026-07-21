import { describe, expect, it } from 'vitest'
import questions from './data/questions.json'
import {
  examConfig,
  hasMultipleCorrect,
  isAnswerCorrect,
  questionsForCategory,
  readinessScore,
  shuffle,
} from './utils'

describe('shuffle', () => {
  it('preserves every element (same multiset, possibly reordered)', () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8]
    const result = shuffle(input)
    expect(result).toHaveLength(input.length)
    expect([...result].sort()).toEqual([...input].sort())
  })

  it('does not mutate the original array', () => {
    const input = [1, 2, 3]
    shuffle(input)
    expect(input).toEqual([1, 2, 3])
  })
})

describe('questionsForCategory', () => {
  it('includes every question flagged "both" or the requested category, and nothing else', () => {
    for (const category of ['A', 'B']) {
      const result = questionsForCategory(category)
      const expected = questions.filter((q) => q.category === 'both' || q.category === category)
      expect(result.map((q) => q.id).sort()).toEqual(expected.map((q) => q.id).sort())
      expect(result.every((q) => q.category === 'both' || q.category === category)).toBe(true)
    }
  })
})

describe('isAnswerCorrect', () => {
  const single = {
    options: [
      { id: 'a', correct: true },
      { id: 'b', correct: false },
      { id: 'c', correct: false },
    ],
  }
  const multi = {
    options: [
      { id: 'a', correct: true },
      { id: 'b', correct: true },
      { id: 'c', correct: false },
    ],
  }

  it('accepts the exact correct single answer', () => {
    expect(isAnswerCorrect(single, ['a'])).toBe(true)
  })

  it('rejects a wrong single answer', () => {
    expect(isAnswerCorrect(single, ['b'])).toBe(false)
  })

  it('rejects a partial multi-answer selection', () => {
    expect(isAnswerCorrect(multi, ['a'])).toBe(false)
  })

  it('accepts the exact full multi-answer selection regardless of order', () => {
    expect(isAnswerCorrect(multi, ['b', 'a'])).toBe(true)
  })

  it('rejects an over-selection that includes a wrong option', () => {
    expect(isAnswerCorrect(multi, ['a', 'b', 'c'])).toBe(false)
  })

  it('rejects an empty selection', () => {
    expect(isAnswerCorrect(single, [])).toBe(false)
  })
})

describe('hasMultipleCorrect', () => {
  it('is false when only one option is correct', () => {
    expect(
      hasMultipleCorrect({
        options: [
          { correct: true },
          { correct: false },
        ],
      }),
    ).toBe(false)
  })

  it('is true when more than one option is correct', () => {
    expect(
      hasMultipleCorrect({
        options: [
          { correct: true },
          { correct: true },
          { correct: false },
        ],
      }),
    ).toBe(true)
  })
})

describe('examConfig', () => {
  it('scales penalty and time proportionally to the pool size, capped at the real-exam size', () => {
    for (const category of ['A', 'B']) {
      const pool = questionsForCategory(category)
      const { size, maxPenalty, timeLimitSec } = examConfig(category)
      expect(size).toBe(Math.min(50, pool.length))
      expect(maxPenalty).toBe(Math.round((15 * size) / 50))
      expect(timeLimitSec).toBe(Math.round((45 * 60 * size) / 50))
    }
  })
})

describe('readinessScore', () => {
  const pool = Array.from({ length: 20 }, (_, i) => ({ id: `q${i}`, topic: i < 10 ? 'vortritt' : 'signale' }))

  it('returns no score before at least 10 questions have been seen', () => {
    const stats = Object.fromEntries(pool.slice(0, 9).map((q) => [q.id, { seen: 1, correct: 1, wrong: 0 }]))
    const result = readinessScore(stats, [], pool)
    expect(result.score).toBeNull()
    expect(result.level).toBe('start')
  })

  it('reports a high score and "ready" level for strong, broad performance', () => {
    const stats = Object.fromEntries(pool.map((q) => [q.id, { seen: 5, correct: 5, wrong: 0 }]))
    const history = [{ passed: true }, { passed: true }, { passed: true }]
    const result = readinessScore(stats, history, pool)
    expect(result.score).toBeGreaterThanOrEqual(75)
    expect(result.level).toBe('ready')
    expect(result.weakTopics).toEqual([])
  })

  it('flags a weak topic when its accuracy is below 60% with enough attempts', () => {
    const stats = {
      ...Object.fromEntries(pool.slice(0, 10).map((q) => [q.id, { seen: 3, correct: 3, wrong: 0 }])),
      ...Object.fromEntries(pool.slice(10).map((q) => [q.id, { seen: 3, correct: 1, wrong: 2 }])),
    }
    const result = readinessScore(stats, [], pool)
    expect(result.weakTopics).toContain('signale')
    expect(result.weakTopics).not.toContain('vortritt')
  })
})
