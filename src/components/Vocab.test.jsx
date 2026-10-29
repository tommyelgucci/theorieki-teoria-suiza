import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'
import { t } from '../i18n'
import { storage } from '../storage'
import { VOCAB, VOCAB_CARDS } from '../data/vocab'

const LANGS = ['de', 'es', 'fr', 'it', 'en', 'pt']

beforeEach(() => {
  localStorage.setItem('chfahren.lang', JSON.stringify('es'))
})

async function openVocab(user) {
  await user.click(screen.getByRole('button', { name: new RegExp(t('menuVocab', 'es'), 'i') }))
}

describe('Datos de vocabulario', () => {
  it('cada término tiene definición en los 6 idiomas y los ids son únicos', () => {
    expect(new Set(VOCAB.map((w) => w.id)).size).toBe(VOCAB.length)
    for (const w of VOCAB) {
      expect(w.term.trim(), w.id).toBeTruthy()
      for (const l of LANGS) expect(w.def[l]?.trim(), `${w.id} ${l}`).toBeTruthy()
    }
  })
})

describe('Vocabulario del examen', () => {
  it('lista los términos en alemán con su traducción y el buscador filtra', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openVocab(user)

    expect(await screen.findByText('der Vortritt')).toBeInTheDocument()
    await user.type(screen.getByRole('searchbox'), 'rotonda')
    expect(screen.getByText('der Kreisverkehr / der Kreisel')).toBeInTheDocument()
    expect(screen.queryByText('der Vortritt')).not.toBeInTheDocument()

    await user.clear(screen.getByRole('searchbox'))
    await user.type(screen.getByRole('searchbox'), 'zzzz')
    expect(screen.getByText(t('vocabNoResults', 'es'))).toBeInTheDocument()
  })

  it('tarjetas: "me la sé" promueve la tarjeta en el SRS', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openVocab(user)
    await user.click(await screen.findByRole('tab', { name: t('numbersCards', 'es') }))
    await user.click(await screen.findByRole('button', { name: new RegExp(t('iKnowIt', 'es')) }))

    const { inReview } = storage.srsCounts('vocab', VOCAB_CARDS.map((c) => c.id))
    expect(inReview).toBe(1)
  })
})
