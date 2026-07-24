import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'
import { t } from '../i18n'
import { storage } from '../storage'

const LANG = 'de'
const text = (key) => new RegExp(t(key, LANG).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')

beforeEach(() => {
  localStorage.setItem('chfahren.lang', JSON.stringify(LANG))
})

async function openStudy(user) {
  await user.click(screen.getByRole('button', { name: text('menuStudy') }))
  await screen.findByText(new RegExp(`${t('question', LANG)} 1 ${t('of', LANG)} \\d+`))
  return screen.getByRole('main')
}

describe('Modo estudio', () => {
  it('muestra la primera pregunta del banco de la categoría', async () => {
    const user = userEvent.setup()
    render(<App />)

    await openStudy(user)

    // 146 preguntas para B: si el banco no cargara, no habría contador ni opciones
    expect(screen.getByText(`${t('question', LANG)} 1 ${t('of', LANG)} 146`)).toBeInTheDocument()
    expect(screen.getAllByRole('button', { pressed: false }).length).toBeGreaterThan(1)
  })

  it('no deja comprobar hasta que hay una opción marcada', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openStudy(user)

    const check = screen.getByRole('button', { name: text('check') })
    expect(check).toBeDisabled()

    await user.click(screen.getAllByRole('button', { pressed: false })[0])

    expect(check).toBeEnabled()
  })

  it('marca la opción elegida de forma perceptible sin depender del color', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openStudy(user)

    const [primera] = screen.getAllByRole('button', { pressed: false })
    await user.click(primera)

    expect(primera).toHaveAttribute('aria-pressed', 'true')
  })

  it('anuncia el resultado en una región aria-live y lo guarda en el progreso', async () => {
    const user = userEvent.setup()
    render(<App />)
    const main = await openStudy(user)

    await user.click(screen.getAllByRole('button', { pressed: false })[0])
    await user.click(screen.getByRole('button', { name: text('check') }))

    // el veredicto depende de qué opción salga primero: vale cualquiera de los dos,
    // lo que se comprueba es que se anuncie y que quede registrado
    const live = within(main).getByRole('status')
    expect(live).toHaveAttribute('aria-live', 'polite')
    expect(live.textContent.trim()).toMatch(
      new RegExp(`${t('correct', LANG)}|${t('wrong', LANG)}`),
    )

    expect(Object.keys(storage.getStats())).toHaveLength(1)
    expect(screen.getByRole('button', { name: text('next') })).toBeInTheDocument()
  })

  it('una respuesta incorrecta va a la lista de repaso', async () => {
    const user = userEvent.setup()
    render(<App />)
    const main = await openStudy(user)

    await user.click(screen.getAllByRole('button', { pressed: false })[0])
    await user.click(screen.getByRole('button', { name: text('check') }))

    const acerto = within(main).getByRole('status').textContent.includes(t('correct', LANG))
    expect(storage.getFailed()).toHaveLength(acerto ? 0 : 1)
  })
})
