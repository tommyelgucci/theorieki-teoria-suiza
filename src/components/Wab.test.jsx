import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'
import { t, tr } from '../i18n'
import { WAB_SECTIONS, WAB_LINKS } from '../data/wab'

const LANG = 'de'

beforeEach(() => {
  localStorage.setItem('chfahren.lang', JSON.stringify(LANG))
})

async function openWab(user) {
  await user.click(screen.getByRole('button', { name: new RegExp(t('menuWab', LANG), 'i') }))
  await screen.findByText(tr(WAB_SECTIONS[0].bullets[0], LANG))
  return screen.getByRole('main')
}

describe('WAB / licencia de prueba', () => {
  it('abre con la primera sección (licencia de prueba) ya desplegada', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openWab(user)

    const [probe] = WAB_SECTIONS
    expect(screen.getByText(tr(probe.bullets[0], LANG))).toBeInTheDocument()
  })

  it('al abrir otra sección, la anterior se colapsa', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openWab(user)

    const [probe, kurs] = WAB_SECTIONS
    await user.click(screen.getByText(tr(kurs.title, LANG)))

    expect(screen.getByText(tr(kurs.bullets[0], LANG))).toBeInTheDocument()
    expect(screen.queryByText(tr(probe.bullets[0], LANG))).not.toBeInTheDocument()
  })

  it('lista los enlaces oficiales', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openWab(user)

    for (const link of WAB_LINKS) {
      expect(screen.getByRole('link', { name: new RegExp(tr(link.label, LANG)) })).toHaveAttribute('href', link.url)
    }
  })
})
