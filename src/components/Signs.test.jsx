import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'
import { t, tr } from '../i18n'
import { storage } from '../storage'
import { SIGN_CATEGORIES, SIGNS } from '../data/signs'

const LANG = 'de'

beforeEach(() => {
  localStorage.setItem('chfahren.lang', JSON.stringify(LANG))
})

async function openSigns(user) {
  await user.click(screen.getByRole('button', { name: new RegExp(t('menuSigns', LANG), 'i') }))
  return screen.getByRole('main')
}

describe('Señales de tráfico', () => {
  it('el hub ofrece explorar, flashcards y quiz', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openSigns(user)

    expect(await screen.findByText(t('signsExplore', LANG))).toBeInTheDocument()
    expect(screen.getByText(t('faCardsTitle', LANG))).toBeInTheDocument()
    expect(screen.getByText(t('faQuizTitle', LANG))).toBeInTheDocument()
  })

  it('explorar: cambiar de categoría cambia el set de señales mostrado', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openSigns(user)
    await user.click(screen.getByText(t('signsExplore', LANG)))

    const [gefahr, vortritt] = SIGN_CATEGORIES
    const firstVortrittOnly = SIGNS.find((s) => s.category === vortritt.id)

    // por defecto se muestra la primera categoría (peligro): la primera señal
    // exclusiva de "prioridad" todavía no está en pantalla
    expect(await screen.findByText(tr(SIGNS.find((s) => s.category === gefahr.id).name, LANG))).toBeInTheDocument()
    expect(screen.queryByText(tr(firstVortrittOnly.name, LANG))).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: tr(vortritt.label, LANG) }))

    expect(await screen.findByText(tr(firstVortrittOnly.name, LANG))).toBeInTheDocument()
  })

  it('explorar: tocar una señal despliega su significado', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openSigns(user)
    await user.click(screen.getByText(t('signsExplore', LANG)))

    const first = SIGNS.find((s) => s.category === SIGN_CATEGORIES[0].id)
    await user.click(await screen.findByText(tr(first.name, LANG)))

    expect(screen.getByText(tr(first.meaning, LANG))).toBeInTheDocument()
  })

  it('flashcards: "me la sé" promueve la señal en el SRS y pasa a la siguiente', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openSigns(user)
    await user.click(screen.getByText(t('faCardsTitle', LANG)))

    await screen.findByText(t('tapToFlip', LANG))
    await user.click(screen.getByRole('button', { name: new RegExp(t('iKnowIt', LANG)) }))

    const srs = storage.srsGet('signs')
    expect(Object.keys(srs)).toHaveLength(1)
    expect(Object.values(srs)[0].level).toBe(1)
  })

  it('quiz: responder registra el acierto o el fallo con feedback accesible', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openSigns(user)
    await user.click(screen.getByText(t('faQuizTitle', LANG)))

    await screen.findByText(t('whatSign', LANG))
    const options = screen.getAllByRole('button').filter((b) => b.className.includes('rounded-xl border'))
    expect(options.length).toBeGreaterThan(1)

    await user.click(options[0])

    const status = screen.getByRole('status')
    expect(status.textContent.trim()).toMatch(new RegExp(`${t('correct', LANG)}|${t('wrong', LANG)}`))
  })
})
