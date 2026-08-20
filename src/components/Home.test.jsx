import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'
import { t } from '../i18n'

const LANG = 'de'
const catalogo = (n) => new RegExp(`${n} ${t('categoryQuestions', LANG)}`)

beforeEach(() => {
  localStorage.setItem('chfahren.lang', JSON.stringify(LANG))
})

describe('Pantalla de inicio', () => {
  it('pinta el menú antes de tener el banco y luego rellena el contador', async () => {
    render(<App />)

    // El banco llega por import() dinámico, así que en el primer render todavía
    // no está: el inicio se muestra igual, con el contador en '·'.
    expect(screen.getByText(catalogo('·'))).toBeInTheDocument()
    expect(screen.getByRole('button', { name: new RegExp(t('menuStudy', LANG), 'i') })).toBeInTheDocument()

    expect(await screen.findByText(catalogo(330))).toBeInTheDocument()
  })

  it('recuenta al cambiar de categoría: B comparte banco, A suma sus propias', async () => {
    const user = userEvent.setup()
    render(<App />)
    await screen.findByText(catalogo(330))

    await user.click(screen.getByRole('button', { name: new RegExp(t('moto', LANG), 'i') }))

    expect(await screen.findByText(catalogo(342))).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: new RegExp(t('car', LANG), 'i') }))

    expect(await screen.findByText(catalogo(330))).toBeInTheDocument()
  })

  it('sin progreso guardado no inventa una nota de preparación', async () => {
    render(<App />)
    await screen.findByText(catalogo(330))

    expect(screen.getByText(new RegExp(t('readinessEmpty', LANG), 'i'))).toBeInTheDocument()
  })
})
