var CACHE_NAME = 'epic-wars-game-v1';

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll([
                './game.html'
            ]);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (names) {
            return Promise.all(
                names.filter(function (n) { return n !== CACHE_NAME; })
                    .map(function (n) { return caches.delete(n); })
            );
        })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request).then(function (response) {
            if (response) return response;
            return fetch(event.request).then(function (fetchRes) {
                return caches.open(CACHE_NAME).then(function (cache) {
                    cache.put(event.request, fetchRes.clone());
                    return fetchRes;
                });
            }).catch(function () {
                return caches.match('./game.html');
            });
        })
    );
});