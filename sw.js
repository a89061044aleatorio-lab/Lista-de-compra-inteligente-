const CACHE_NAME = 'smart-shopping-list-v1';
const URLS_TO_CACHE = [
  '/',
  './index.html',
  './index.tsx',
  './icon.svg'
];

// Instala o service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Cache aberto');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

// Responde com os dados do cache ou busca na rede
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Encontrado no cache - retorna a resposta
        if (response) {
          return response;
        }

        var fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          function(response) {
            // Verifica se recebemos uma resposta válida
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                if (event.request.method === 'GET') {
                    cache.put(event.request, responseToCache);
                }
              });

            return response;
          }
        );
      })
    );
});

// Atualiza o service worker e remove caches antigos
self.addEventListener('activate', event => {
  var cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
