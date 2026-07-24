import { lazy } from 'react'

// Si se despliega una versión nueva con la app abierta, el HTML que ya está en
// memoria apunta a chunks con hash viejo que el servidor ya borró. Al navegar a
// una sección todavía no visitada, ese import() falla.
//
// Recargar toma el HTML nuevo y resuelve el problema, pero hay que hacerlo una
// sola vez: si tras recargar el import sigue fallando (p. ej. sin conexión), el
// error se propaga al ErrorBoundary en vez de entrar en un bucle de recargas.
const RELOAD_FLAG = 'theorieki.chunkReload'

function readFlag() {
  try {
    return sessionStorage.getItem(RELOAD_FLAG) === '1'
  } catch {
    return false // sessionStorage bloqueado (modo privado, cookies desactivadas)
  }
}

function writeFlag(value) {
  try {
    if (value) sessionStorage.setItem(RELOAD_FLAG, '1')
    else sessionStorage.removeItem(RELOAD_FLAG)
  } catch {
    // sin persistencia: el peor caso es no reintentar, nunca un bucle
  }
}

/**
 * Envuelve la carga de un chunk. `reload` se inyecta para poder testearlo.
 * Devuelve una promesa que nunca resuelve cuando dispara la recarga: la página
 * se está reemplazando, así que React se queda en el fallback de Suspense.
 */
export function retryChunk(importer, reload = () => window.location.reload()) {
  return importer()
    .then((mod) => {
      writeFlag(false)
      return mod
    })
    .catch((error) => {
      if (readFlag()) throw error
      writeFlag(true)
      reload()
      return new Promise(() => {})
    })
}

export function lazyWithReload(importer) {
  return lazy(() => retryChunk(importer))
}

/** true si esta carga de página viene de una recarga por un chunk que faltaba. */
export function wasReloadedForChunk() {
  return readFlag()
}
