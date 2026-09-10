const CACHE = 'app-appart-v2'
const ASSETS = ['./', './index.html', './style.css', './app.js', './manifest.json']

self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)))
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  )
})

// réseau en premier : les mises à jour du site s'affichent tout de suite au prochain chargement,
// le cache sert juste de secours si jamais il n'y a pas de connexion
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then(reponse => {
        const copie = reponse.clone()
        caches.open(CACHE).then(cache => cache.put(event.request, copie))
        return reponse
      })
      .catch(() => caches.match(event.request))
  )
})
