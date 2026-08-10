import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'
import { t } from '../i18n'
import { storage } from '../storage'
import questions from '../data/questions.json'

const LANG = 'de'

beforeEach(() => {
  localStorage.setItem('chfahren.lang', JSON.stringify(LANG))
})

async function openStats(user) {
  await user.click(screen.getByRole('button', { name: new RegExp(t('menuStats', LANG), 'i') }))
  return screen.getByRole('main')
}

describe('Estadísticas', () => {
  it('sin progreso guardado, muestra los contadores en cero y sin historial', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openStats(user)

    expect(await screen.findByText(t('daysStudied', LANG))).toBeInTheDocument()
    expect(screen.getAllByText(t('noStatsYet', LANG)).length).toBeGreaterThan(0)
  })

  it('respuestas guardadas alimentan el desglose por tema', async () => {
    const q = questions[0]
    storage.recordAnswer(q.id, true)

    const user = userEvent.setup()
    render(<App />)
    const main = await openStats(user)

    // 1 respuesta registrada: aparece en el contador de "respuestas" y ya no
    // está vacío el desglose por tema (que usa un mensaje distinto al general)
    expect(main.textContent).toContain('1')
    expect(screen.queryAllByText(t('noStatsYet', LANG)).length).toBeLessThan(2)
  })

  it('un examen guardado aparece en el historial con su resultado', async () => {
    storage.addExamResult({ date: new Date().toISOString(), category: 'B', size: 50, penalty: 6, maxPenalty: 15, passed: true })

    const user = userEvent.setup()
    render(<App />)
    await openStats(user)

    expect(await screen.findByText(new RegExp(`6/15 ${t('points', LANG)}`))).toBeInTheDocument()
  })

  it('exportar vuelca el progreso del perfil activo como JSON en el textarea', async () => {
    storage.recordAnswer(questions[0].id, true)

    const user = userEvent.setup()
    render(<App />)
    await openStats(user)

    await user.click(screen.getByRole('button', { name: new RegExp(t('exportBtn', LANG)) }))

    const textarea = await screen.findByPlaceholderText(t('pasteHere', LANG))
    const parsed = JSON.parse(textarea.value)
    expect(parsed.app).toBe('chfahren')
    expect(parsed.data['chfahren.stats']).toBeDefined()
  })

  it('importar un backup válido restaura el progreso', async () => {
    // window.location.reload() se dispara tras importar (con delay): jsdom no
    // implementa la navegación real y lo avisa por consola, pero no falla el test.
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)
    const backup = JSON.stringify({
      app: 'chfahren',
      version: 2,
      data: { 'chfahren.stats': JSON.stringify({ [questions[1].id]: { seen: 2, correct: 1, wrong: 1 } }) },
    })

    const user = userEvent.setup()
    render(<App />)
    await openStats(user)

    const textarea = await screen.findByPlaceholderText(t('pasteHere', LANG))
    await user.click(textarea)
    await user.paste(backup)

    await user.click(screen.getByRole('button', { name: new RegExp(t('importBtn', LANG)) }))

    expect(await screen.findByText(t('importDone', LANG))).toBeInTheDocument()
    confirmSpy.mockRestore()
  })
})
