import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { t } from './i18n'

// Los textos salen de i18n en vez de estar escritos a mano: así estos tests
// siguen valiendo si mañana se reescribe una etiqueta.
const LANG = 'de'
const text = (key) => new RegExp(t(key, LANG).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')

beforeEach(() => {
  localStorage.setItem('chfahren.lang', JSON.stringify(LANG))
})

describe('App · navegación entre vistas', () => {
  it('arranca en el inicio sin robarle el foco a nadie', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: text('menuStudy') })).toBeInTheDocument()
    expect(document.body).toHaveFocus()
  })

  it('abre una vista lazy y muestra su título en el encabezado', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: text('menuSigns') }))

    expect(await screen.findByRole('heading', { level: 1, name: text('menuSigns') })).toBeInTheDocument()
  })

  it('al navegar mueve el foco al <main> de la vista nueva', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: text('menuSigns') }))
    await screen.findByRole('heading', { level: 1, name: text('menuSigns') })

    const main = screen.getByRole('main')
    expect(main).toHaveFocus()
    expect(main).toHaveAttribute('aria-label', t('menuSigns', LANG))
  })

  it('mantiene un solo landmark <main> en la página', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: text('menuStats') }))
    await screen.findByRole('heading', { level: 1, name: text('menuStats') })

    expect(screen.getAllByRole('main')).toHaveLength(1)
  })

  it('vuelve al inicio con el botón atrás y devuelve el foco al <main>', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: text('menuSigns') }))
    await screen.findByRole('heading', { level: 1, name: text('menuSigns') })

    await user.click(screen.getByRole('button', { name: text('back') }))

    expect(await screen.findByRole('button', { name: text('menuStudy') })).toBeInTheDocument()
    const main = screen.getByRole('main')
    expect(main).toHaveFocus()
    expect(main).toHaveAttribute('aria-label', t('appName', LANG))
  })
})

describe('App · idioma', () => {
  it('cambia los textos y el lang del documento al elegir otro idioma', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(document.documentElement.getAttribute('lang')).toBe('de')

    await user.selectOptions(screen.getByRole('combobox'), 'es')

    expect(document.documentElement.getAttribute('lang')).toBe('es')
    expect(screen.getByRole('button', { name: new RegExp(t('menuStudy', 'es'), 'i') })).toBeInTheDocument()
  })
})
