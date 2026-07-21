import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { storage } from './storage'

function stubLanguages(languages) {
  vi.stubGlobal('navigator', { ...navigator, language: languages[0], languages })
}

describe('storage.getLang / setLang', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('falls back to German when the browser language is not supported', () => {
    stubLanguages(['ja-JP'])
    expect(storage.getLang()).toBe('de')
  })

  it('picks up a supported browser language when nothing is saved yet', () => {
    stubLanguages(['pt-PT'])
    expect(storage.getLang()).toBe('pt')

    stubLanguages(['es-ES'])
    expect(storage.getLang()).toBe('es')
  })

  it('prefers the first supported language among several candidates', () => {
    stubLanguages(['ja-JP', 'fr-CH', 'de-CH'])
    expect(storage.getLang()).toBe('fr')
  })

  it('an explicitly saved preference always wins over browser detection', () => {
    storage.setLang('it')
    stubLanguages(['pt-PT'])
    expect(storage.getLang()).toBe('it')
  })
})
