import { readFileSync, writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Archivos de public/ que forman parte de la app (no de la landing) y que el
// service worker necesita guardados para que funcione sin conexión.
const SHELL_EXTRA = [
  './manifest.webmanifest',
  './favicon.svg',
  './favicon-32.png',
  './favicon-16.png',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
]

// public/sw.js se copia tal cual al build, pero los archivos que tiene que
// precachear llevan hash en el nombre y sólo se conocen al compilar. Este plugin
// los inyecta en dist/sw.js, junto con un id de build que da nombre al caché
// para que cada despliegue arranque con uno limpio.
function precacheServiceWorker() {
  let assets = []
  let outDir = 'dist'
  return {
    name: 'precache-service-worker',
    apply: 'build',
    configResolved(config) {
      outDir = config.build.outDir
    },
    generateBundle(_options, bundle) {
      assets = Object.keys(bundle)
        .filter((f) => f.endsWith('.js') || f.endsWith('.css'))
        .map((f) => './' + f)
        .sort()
    },
    closeBundle() {
      const swPath = resolve(outDir, 'sw.js')
      const source = readFileSync(swPath, 'utf8')
      const files = [...assets, ...SHELL_EXTRA]
      const buildId = createHash('sha256').update(files.join('|')).digest('hex').slice(0, 10)

      // Si los marcadores no están, el service worker quedaría sin nada que
      // precachear y el modo sin conexión fallaría en silencio: mejor romper.
      for (const token of ['__BUILD_ID__', '/* __BUILD_ASSETS__ */ []']) {
        if (!source.includes(token)) {
          throw new Error(`precache-service-worker: falta el marcador ${token} en public/sw.js`)
        }
      }

      writeFileSync(
        swPath,
        source.replace('__BUILD_ID__', buildId).replace('/* __BUILD_ASSETS__ */ []', JSON.stringify(files)),
      )
      console.log(`sw.js: ${files.length} archivos precacheados (build ${buildId})`)
    },
  }
}

// base './' para que el build funcione en cualquier subruta (p. ej. GitHub Pages)
export default defineConfig({
  plugins: [react(), tailwindcss(), precacheServiceWorker()],
  base: './',
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
  },
})
