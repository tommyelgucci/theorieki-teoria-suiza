import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'
import { t, tr } from '../i18n'
import { storage } from '../storage'
import { MARKINGS, MARKING_CARDS } from '../data/markings'

const LANG = 'de'
const LANGS = ['de', 'es', 'fr', 'it', 'en', 'pt']

beforeEach(() => {
  localStorage.setItem('chfahren.lang', JSON.stringify(LANG))
})

async function openMarkings(user) {
  await user.click(screen.getByRole('button', { name: new RegExp(t('menuSigns', LANG), 'i') }))
  await user.click(await screen.findByRole('button', { name: new RegExp(t('markingsTitle', LANG)) }))
}

describe('Datos de marcas viales', () => {
  it('nombre y significado completos en los 6 idiomas', () => {
    for (const m of MARKINGS) {
      for (const l of LANGS) {
        expect(m.name[l], `${m.id} name ${l}`).toBeTruthy()
        expect(m.meaning[l], `${m.id} meaning ${l}`).toBeTruthy()
      }
    }
  })
})

describe('Bodenmarkierungen', () => {
  it('el hub de señales ofrece las marcas y el listado muestra cada una', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openMarkings(user)

    for (const m of MARKINGS) expect(await screen.findByText(tr(m.name, LANG))).toBeInTheDocument()
  })

  it('tarjetas: "me la sé" promueve la marca en el SRS', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openMarkings(user)
    await user.click(await screen.findByRole('tab', { name: t('faCardsTitle', LANG) }))
    await user.click(await screen.findByRole('button', { name: new RegExp(t('iKnowIt', LANG)) }))

    const { inReview } = storage.srsCounts(
      'markings',
      MARKING_CARDS.map((c) => c.id),
    )
    expect(inReview).toBe(1)
  })
})
