import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'
import { t, tr } from '../i18n'
import { maneuversForCategory } from '../data/maneuvers'

const LANG = 'de'

beforeEach(() => {
  localStorage.setItem('chfahren.lang', JSON.stringify(LANG))
})

async function openManeuvers(user) {
  await user.click(screen.getByRole('button', { name: new RegExp(t('menuManeuvers', LANG), 'i') }))
  return screen.getByRole('main')
}

describe('Maniobras animadas', () => {
  it('lista las maniobras de la categoría B (coche) por defecto', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openManeuvers(user)

    const list = maneuversForCategory('B')
    expect(list.length).toBeGreaterThan(0)
    for (const m of list) {
      expect(await screen.findByText(tr(m.title, LANG))).toBeInTheDocument()
    }
  })

  it('cambia el listado al pasar a categoría A (moto)', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: new RegExp(t('moto', LANG), 'i') }))
    await openManeuvers(user)

    const listA = maneuversForCategory('A')
    const listB = maneuversForCategory('B')
    if (listA.length > 0) {
      expect(await screen.findByText(tr(listA[0].title, LANG))).toBeInTheDocument()
    }
    const onlyInB = listB.find((m) => !listA.some((a) => a.id === m.id))
    if (onlyInB) {
      expect(screen.queryByText(tr(onlyInB.title, LANG))).not.toBeInTheDocument()
    }
  })

  it('al elegir una maniobra se abre el reproductor y se puede volver a la lista', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openManeuvers(user)

    const [first] = maneuversForCategory('B')
    await user.click(screen.getByText(tr(first.title, LANG)))

    const back = await screen.findByRole('button', { name: new RegExp(t('backToList', LANG)) })
    expect(back).toBeInTheDocument()

    await user.click(back)

    expect(await screen.findByText(tr(first.title, LANG))).toBeInTheDocument()
  })
})
