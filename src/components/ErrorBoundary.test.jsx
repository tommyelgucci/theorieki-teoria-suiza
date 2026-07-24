import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ErrorBoundary from './ErrorBoundary'
import { t } from '../i18n'

function Explota() {
  throw new Error('boom')
}

// El fallback lee el idioma de storage; sin fijarlo caería en el del navegador
// (en jsdom, inglés) y los textos esperados no coincidirían.
beforeEach(() => {
  localStorage.setItem('chfahren.lang', JSON.stringify('de'))
})

describe('ErrorBoundary', () => {
  it('no se mete en el medio mientras no haya error', () => {
    render(
      <ErrorBoundary>
        <p>contenido</p>
      </ErrorBoundary>,
    )
    expect(screen.getByText('contenido')).toBeInTheDocument()
  })

  it('atrapa un fallo de render y ofrece recargar sin borrar nada', () => {
    // React escribe el error en consola aunque el boundary lo maneje
    const silencio = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <Explota />
      </ErrorBoundary>,
    )

    expect(screen.getByRole('heading', { name: t('errorTitle', 'de') })).toBeInTheDocument()
    // La salida no destructiva tiene que estar siempre: borrar los datos es la
    // otra opción, nunca la única.
    expect(screen.getByRole('button', { name: t('errorReload', 'de') })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: t('errorReset', 'de') })).toBeInTheDocument()

    silencio.mockRestore()
  })

  it('no toca localStorage por su cuenta al mostrar el fallback', () => {
    const silencio = vi.spyOn(console, 'error').mockImplementation(() => {})
    localStorage.setItem('chfahren.lang', JSON.stringify('de'))

    render(
      <ErrorBoundary>
        <Explota />
      </ErrorBoundary>,
    )

    expect(localStorage.getItem('chfahren.lang')).toBe('"de"')
    silencio.mockRestore()
  })
})
