/* Service worker de TheorieKI.
   Estrategia por tipo de recurso:
   - Navegación (el HTML): red primero, caché sólo como respaldo sin conexión.
     Es lo que garantiza que un despliegue nuevo se tome de inmediato. Si el
     HTML se sirviera de caché, podría seguir apuntando a chunks con hash viejo
     que ya no existen en el servidor y la app fallaría al abrir una sección.
   - Assets con hash en el nombre (/assets/...): caché primero. Son inmutables:
     si el contenido cambia, cambia el nombre, así que nunca sirven algo viejo.
   - El resto (iconos, manifest, imágenes de public/): stale-while-revalidate. */
const CACHE = 'theorieki-v2'
const SHELL = ['./', './index.html', './manifest.webmanifest']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(SHELL))
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

async function networkFirst(request) {
  const cache = await caches.open(CACHE)
  try {
    const response = await fetch(request)
    if (cacheable(response)) cache.put(request, response.clone())
    return response
  } catch {
    // Sin conexión: servimos el documento guardado, o el shell como último recurso.
    return (await cache.match(request)) || (await cache.match('./index.html')) || Response.error()
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE)
  const cached = await cache.match(request)
  if (cached) return cached
  const response = await fetch(request)
  if (cacheable(response)) cache.put(request, response.clone())
  return response
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE)
  const cached = await cache.match(request)
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
