import { beforeEach, describe, expect, it, vi } from 'vitest'
import { retryChunk } from './lazyWithReload'

describe('retryChunk', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('passes the module through when the import succeeds', async () => {
    const reload = vi.fn()
    const mod = { default: 'Componente' }
    await expect(retryChunk(() => Promise.resolve(mod), reload)).resolves.toBe(mod)
    expect(reload).not.toHaveBeenCalled()
  })

  it('reloads once when the chunk is missing, instead of surfacing the error', async () => {
    const reload = vi.fn()
    let settled = false
    retryChunk(() => Promise.reject(new Error('Failed to fetch dynamically imported module')), reload)
      .then(() => { settled = true })
      .catch(() => { settled = true })

    await vi.waitFor(() => expect(reload).toHaveBeenCalledTimes(1))
    // La promesa queda pendiente a propósito: la página se está recargando.
    expect(settled).toBe(false)
  })

  it('gives up and rethrows if the import still fails right after a reload', async () => {
    const reload = vi.fn()
    const error = new Error('Failed to fetch dynamically imported module')

    retryChunk(() => Promise.reject(error), reload)
    await vi.waitFor(() => expect(reload).toHaveBeenCalledTimes(1))

    // Segundo intento en la misma sesión (el flag sobrevive a la recarga).
    await expect(retryChunk(() => Promise.reject(error), reload)).rejects.toThrow(error)
    expect(reload).toHaveBeenCalledTimes(1)
  })

  it('clears the flag after a success, so a later deploy can reload again', async () => {
    const reload = vi.fn()
    const error = new Error('Failed to fetch dynamically imported module')

    retryChunk(() => Promise.reject(error), reload)
    await vi.waitFor(() => expect(reload).toHaveBeenCalledTimes(1))

    await retryChunk(() => Promise.resolve({ default: 'ok' }), reload)

    retryChunk(() => Promise.reject(error), reload)
    await vi.waitFor(() => expect(reload).toHaveBeenCalledTimes(2))
  })
})
