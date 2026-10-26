import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'
import { t, tr } from '../i18n'
import { storage } from '../storage'
import { NUMBER_GROUPS, NUMBER_ROWS, NUMBER_CARDS } from '../data/numbers'

const LANG = 'de'
const LANGS = ['de', 'es', 'fr', 'it', 'en', 'pt']

beforeEach(() => {
  localStorage.setItem('chfahren.lang', JSON.stringify(LANG))
})

async function openNumbers(user) {
  await user.click(screen.getByRole('button', { name: new RegExp(t('menuNumbers', LANG), 'i') }))
  return screen.getByRole('main')
}

describe('Datos de cifras clave', () => {
  it('todas las filas tienen etiqueta y valor en los 6 idiomas y pertenecen a un grupo', () => {
    const groups = new Set(NUMBER_GROUPS.map((g) => g.id))
    for (const r of NUMBER_ROWS) {
      expect(groups.has(r.group), r.id).toBe(true)
      for (const l of LANGS) {
        expect(r.label[l], `${r.id} label ${l}`).toBeTruthy()
        if (typeof r.value !== 'string') expect(r.value[l], `${r.id} value ${l}`).toBeTruthy()
      }
    }
    expect(new Set(NUMBER_ROWS.map((r) => r.id)).size).toBe(NUMBER_ROWS.length)
  })
})

describe('Cifras clave', () => {
  it('el resumen muestra los grupos y sus cifras', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openNumbers(user)

    for (const g of NUMBER_GROUPS) expect(await screen.findByText(tr(g.title, LANG))).toBeInTheDocument()
    expect(screen.getByText(tr(NUMBER_ROWS[0].label, LANG))).toBeInTheDocument()
  })

  it('tarjetas: "me la sé" promueve la tarjeta en el SRS', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openNumbers(user)
    await user.click(await screen.findByRole('tab', { name: t('numbersCards', LANG) }))

    expect(await screen.findByText(new RegExp(`${NUMBER_CARDS.length}/${NUMBER_CARDS.length}|${NUMBER_CARDS.length} ${t('dueToday', LANG)}`))).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: new RegExp(t('iKnowIt', LANG)) }))

    const { inReview } = storage.srsCounts(
      'numbers',
      NUMBER_CARDS.map((c) => c.id),
    )
    expect(inReview).toBe(1)
  })
})
