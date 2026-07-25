/* Service worker de TheorieKI.

   En la instalación se precachea el build entero (todos los chunks con hash más
   los iconos), no sólo el shell. Sin eso, una sección que el usuario nunca abrió
   estando online no está en el caché y sin conexión depende del caché HTTP del
   navegador, que se desaloja cuando quiere: el modo sin conexión funcionaba de
   casualidad. El nombre del caché lleva el id del build, así que cada despliegue
   arranca con uno limpio y el viejo se borra en 'activate'.

   Estrategia por tipo de recurso:
   - Navegación (el HTML): red primero, caché sólo como respaldo sin conexión.
     Es lo que garantiza que un despliegue nuevo se tome de inmediato. Si el
     HTML se sirviera de caché, podría seguir apuntando a chunks con hash viejo
     que ya no existen en el servidor y la app fallaría al abrir una sección.
   - Assets con hash en el nombre (/assets/...): caché primero. Son inmutables:
     si el contenido cambia, cambia el nombre, así que nunca sirven algo viejo.
   - El resto (iconos, manifest, imágenes de public/): stale-while-revalidate. */
// Ambos marcadores los reemplaza el plugin precache-service-worker del build
// (ver vite.config.js). En desarrollo quedan como están: no hay archivos con
// hash que precachear y el caché se llama siempre igual.
const BUILD_ID = '__BUILD_ID__'
const BUILD_ASSETS = /* __BUILD_ASSETS__ */ []

const CACHE = `theorieki-${BUILD_ID}`
// Sin el shell la app no arranca sin conexión, así que su descarga es obligatoria.
const SHELL = ['./', './index.html']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then(async (cache) => {
        await cache.addAll(SHELL)
        // El resto (JS, CSS, iconos) se guarda entero acá, en la primera visita:
        // es lo que hace que después funcione sin conexión una sección que el
        // usuario nunca abrió. Best-effort — que falle un archivo suelto no debe
        // tumbar la instalación y dejar a la app sin service worker.
        const results = await Promise.allSettled(
          BUILD_ASSETS.map((url) => cache.add(url)),
        )
        const fallaron = results.filter((r) => r.status === 'rejected').length
        if (fallaron) console.warn(`[sw] ${fallaron}/${BUILD_ASSETS.length} archivos no se pudieron precachear`)
      })
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

function cacheable(response) {
  return response.ok && response.type === 'basic'
}

/* `ignoreVary` es imprescindible y sin él el modo sin conexión no funciona.
   Los servidores estáticos suelen responder con `Vary: Origin` (vite preview lo
   hace). El precache guarda cada archivo con `cache.add()`, cuya petición no
   lleva cabecera `Origin`; en cambio el navegador pide los módulos JS y el CSS
   en modo `cors`, que sí la lleva. Con `Vary: Origin` en la respuesta, esas dos
   peticiones se consideran distintas y `cache.match` falla aunque el archivo
   esté guardado — verificado: dentro del SW daba `hit=false` sobre una entrada
   que existía en ese mismo caché. */
function match(cache, request) {
  return cache.match(request, { ignoreVary: true })
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE)
  try {
    const response = await fetch(request)
    if (cacheable(response)) cache.put(request, response.clone())
    return response
  } catch {
    // Sin conexión: servimos el documento guardado, o el shell como último recurso.
    return (await match(cache, request)) || (await match(cache, './index.html')) || Response.error()
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE)
  const cached = await match(cache, request)
  if (cached) return cached
  const response = await fetch(request)
  if (cacheable(response)) cache.put(request, response.clone())
  return response
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE)
  const cached = await match(cache, request)
  const network = fetch(request)
    .then((response) => {
      if (cacheable(response)) cache.put(request, response.clone())
      return response
    })
    .catch(() => cached)
  return cached || network
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET' || !request.url.startsWith('http')) return

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request))
    return
  }

  if (new URL(request.url).pathname.includes('/assets/')) {
    event.respondWith(cacheFirst(request))
    return
  }

  event.respondWith(staleWhileRevalidate(request))
})
