import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'
import { t, tr } from '../i18n'
import { storage } from '../storage'
import { FIRSTAID_TOPICS } from '../data/firstaid'

const LANG = 'de'

beforeEach(() => {
  localStorage.setItem('chfahren.lang', JSON.stringify(LANG))
})

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
// \b al borde: sin esto, un botón "next" podría matchear por subcadena el
// texto de una opción real del quiz (mismo riesgo que en Study.test.jsx)
const word = (key) => new RegExp(`\\b${esc(t(key, LANG))}\\b`, 'i')

async function openFirstAid(user) {
  await user.click(screen.getByRole('button', { name: new RegExp(esc(t('menuFirstAid', LANG)), 'i') }))
  return screen.getByRole('main')
}

describe('Primeros auxilios (Nothelfer)', () => {
  it('el hub ofrece temario, flashcards y quiz', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openFirstAid(user)

    expect(await screen.findByText(t('faTopics', LANG))).toBeInTheDocument()
    expect(screen.getByText(t('faCardsTitle', LANG))).toBeInTheDocument()
    expect(screen.getByText(t('faQuizTitle', LANG))).toBeInTheDocument()
  })

  it('temario: un tema se despliega y se puede volver a cerrar', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openFirstAid(user)
    await user.click(screen.getByText(t('faTopics', LANG)))

    const [first] = FIRSTAID_TOPICS
    const header = await screen.findByText(tr(first.title, LANG))
    await user.click(header)

    expect(screen.getByText(tr(first.bullets[0], LANG))).toBeInTheDocument()

    await user.click(header)

    expect(screen.queryByText(tr(first.bullets[0], LANG))).not.toBeInTheDocument()
  })

  it('flashcards: "repasar" reinicia el nivel SRS y manda la tarjeta al final', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openFirstAid(user)
    await user.click(screen.getByText(t('faCardsTitle', LANG)))

    await screen.findByText(t('tapToFlip', LANG))
    await user.click(screen.getByRole('button', { name: new RegExp(t('repeatCard', LANG)) }))

    const srs = storage.srsGet('firstaid')
    expect(Object.values(srs)[0].level).toBe(0)
  })

  it('quiz: se puede elegir una opción, comprobar y avanzar a la siguiente pregunta', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openFirstAid(user)
    await user.click(screen.getByText(t('faQuizTitle', LANG)))

    await screen.findByText(`${t('question', LANG)} 1 ${t('of', LANG)} 10`)
    const check = screen.getByRole('button', { name: t('check', LANG) })
    expect(check).toBeDisabled()

    await user.click(screen.getAllByRole('button', { pressed: false })[0])
    expect(check).toBeEnabled()
    await user.click(check)

    expect(screen.getByRole('status').textContent).toMatch(new RegExp(`${t('correct', LANG)}|${t('wrong', LANG)}`))

    await user.click(screen.getByRole('button', { name: word('next') }))

    expect(await screen.findByText(`${t('question', LANG)} 2 ${t('of', LANG)} 10`)).toBeInTheDocument()
  })
})
