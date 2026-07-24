import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach } from 'vitest'

// jsdom no implementa ninguna de las dos, y los componentes las usan: matchMedia
// para el tema y prefers-reduced-motion, scrollTo al cambiar de vista.
beforeEach(() => {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })
  window.scrollTo = () => {}
})

afterEach(() => {
  cleanup()
  // Cada test arranca con el dispositivo en blanco: progreso, perfiles e idioma
  // viven en localStorage y si no se limpia se filtran de un test al siguiente.
  localStorage.clear()
  sessionStorage.clear()
})
