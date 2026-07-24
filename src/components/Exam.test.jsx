import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'
import { t } from '../i18n'
import { examConfig } from '../utils'
import questionBank from '../data/questions.json'

const LANG = 'de'
const text = (key) => new RegExp(t(key, LANG).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')

beforeEach(() => {
  localStorage.setItem('chfahren.lang', JSON.stringify(LANG))
})

describe('Simulación de examen', () => {
  it('anuncia el formato real del examen antes de empezar', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: text('menuExam') }))
    await screen.findByRole('button', { name: text('startExam') })

    const { size, maxPenalty, timeLimitSec } = examConfig('B', questionBank)
    expect(size).toBe(50)
    // los ítems se pintan con un "• " delante, así que se busca por subcadena
    expect(
      screen.getByText(t('examIntro2', LANG, { n: size, p: maxPenalty }), { exact: false }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(t('examIntro3', LANG, { t: Math.round(timeLimitSec / 60) }), { exact: false }),
    ).toBeInTheDocument()
  })

  it('reparte tantas preguntas como dice el formato al arrancar', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: text('menuExam') }))
    await user.click(await screen.findByRole('button', { name: text('startExam') }))

    expect(
      screen.getByText(`${t('question', LANG)} 1 ${t('of', LANG)} 50`),
    ).toBeInTheDocument()
  })
})
