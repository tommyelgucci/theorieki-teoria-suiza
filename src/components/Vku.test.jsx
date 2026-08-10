import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'
import { t, tr } from '../i18n'
import { storage } from '../storage'
import { VKU_BLOCKS, VKU_LINKS } from '../data/vku'

const LANG = 'de'
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

beforeEach(() => {
  localStorage.setItem('chfahren.lang', JSON.stringify(LANG))
})

async function openVku(user) {
  await user.click(screen.getByRole('button', { name: new RegExp(esc(t('menuVku', LANG)), 'i') }))
  return screen.getByRole('main')
}

describe('VKU (curso de sensibilización)', () => {
  it('el hub ofrece bloques, flashcards, quiz y enlaces oficiales', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openVku(user)

    expect(await screen.findByText(t('vkuBlocksTitle', LANG))).toBeInTheDocument()
    expect(screen.getByText(t('faCardsTitle', LANG))).toBeInTheDocument()
    expect(screen.getByText(t('faQuizTitle', LANG))).toBeInTheDocument()
    for (const link of VKU_LINKS) {
      expect(screen.getByRole('link', { name: new RegExp(esc(tr(link.label, LANG))) })).toHaveAttribute('href', link.url)
    }
  })

  it('bloques: abrir uno muestra sus puntos, sin mezclarse con otro bloque', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openVku(user)
    await user.click(screen.getByText(t('vkuBlocksTitle', LANG)))

    const [first, second] = VKU_BLOCKS
    await user.click(screen.getByText(tr(first.title, LANG)))
    expect(screen.getByText(tr(first.bullets[0], LANG))).toBeInTheDocument()
    expect(screen.queryByText(tr(second.bullets[0], LANG))).not.toBeInTheDocument()
  })

  it('flashcards: "me la sé" registra la tarjeta en el SRS del módulo vku', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openVku(user)
    await user.click(screen.getByText(t('faCardsTitle', LANG)))

    await screen.findByText(t('tapToFlip', LANG))
    await user.click(screen.getByRole('button', { name: new RegExp(t('iKnowIt', LANG)) }))

    expect(Object.keys(storage.srsGet('vku'))).toHaveLength(1)
  })

  it('quiz: permite marcar varias opciones (checkbox) antes de comprobar', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openVku(user)
    await user.click(screen.getByText(t('faQuizTitle', LANG)))

    await screen.findByText(new RegExp(`${t('question', LANG)} 1 ${t('of', LANG)}`))
    const options = screen.getAllByRole('button', { pressed: false })
    await user.click(options[0])
    await user.click(options[1])

    expect(options[0]).toHaveAttribute('aria-pressed', 'true')
    expect(options[1]).toHaveAttribute('aria-pressed', 'true')

    await user.click(screen.getByRole('button', { name: t('check', LANG) }))
    expect(screen.getByRole('status').textContent).toMatch(new RegExp(`${t('correct', LANG)}|${t('wrong', LANG)}`))
  })
})
