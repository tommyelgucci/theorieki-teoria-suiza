import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'
import { t, tr } from '../i18n'
import { storage } from '../storage'
import { KF_CHECKLIST, KF_MISTAKES } from '../data/kontrollfahrt'

const LANG = 'de'

beforeEach(() => {
  localStorage.setItem('chfahren.lang', JSON.stringify(LANG))
})

async function openKontrollfahrt(user) {
  await user.click(screen.getByRole('button', { name: new RegExp(t('menuKontrollfahrt', LANG), 'i') }))
  await screen.findByText(`0/${KF_CHECKLIST.length}`)
  return screen.getByRole('main')
}

describe('Kontrollfahrt', () => {
  it('marcar un ítem de la checklist lo persiste y actualiza el contador', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openKontrollfahrt(user)

    expect(screen.getByText(`0/${KF_CHECKLIST.length}`)).toBeInTheDocument()

    await user.click(screen.getByText(tr(KF_CHECKLIST[0].text, LANG)))

    expect(screen.getByText(`1/${KF_CHECKLIST.length}`)).toBeInTheDocument()
    expect(storage.getChecked('kontrollfahrt')).toEqual([KF_CHECKLIST[0].id])
  })

  it('desmarcar un ítem ya marcado lo saca de la checklist guardada', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openKontrollfahrt(user)

    const item = screen.getByText(tr(KF_CHECKLIST[0].text, LANG))
    await user.click(item)
    await user.click(item)

    expect(screen.getByText(`0/${KF_CHECKLIST.length}`)).toBeInTheDocument()
    expect(storage.getChecked('kontrollfahrt')).toEqual([])
  })

  it('el cross-link de un error fallado lleva al modo estudio filtrado por tema', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openKontrollfahrt(user)

    // 'einspuren' tiene topic Y maneuver: sirve para probar ambos cross-links
    const mistake = KF_MISTAKES.find((m) => m.id === 'einspuren')
    await user.click(screen.getByText(tr(mistake.title, LANG)))
    await user.click(screen.getByRole('button', { name: new RegExp(t('practiceTopic', LANG)) }))

    expect(await screen.findByText(new RegExp(`${t('question', LANG)} 1 ${t('of', LANG)} \\d+`))).toBeInTheDocument()
  })

  it('el cross-link de una maniobra lleva a la lista de maniobras', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openKontrollfahrt(user)

    const mistake = KF_MISTAKES.find((m) => m.id === 'einspuren')
    await user.click(screen.getByText(tr(mistake.title, LANG)))
    await user.click(screen.getByRole('button', { name: new RegExp(t('viewManeuvers', LANG)) }))

    expect(await screen.findByRole('heading', { name: new RegExp(t('menuManeuvers', LANG)) })).toBeInTheDocument()
  })
})
