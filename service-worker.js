const CACHE_NAME = 'jundu-manyan-v1';
const urlsToCache = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', function(e) {
    e.respondWith(
        caches.match(e.request).then(function(response) {
            return response || fetch(e.request).then(function(r) {
                if (e.request.method === 'GET' && r.status === 200) {
                    var clone = r.clone();
                    caches.open(CACHE_NAME).then(function(cache) {
                        cache.put(e.request, clone);
                    });
                }
                return r;
            }).catch(function() {
                return caches.match('/index.html');
            });
        })
    );
});

self.addEventListener('activate', function(e) {
    e.waitUntil(
        caches.keys().then(function(keys) {
            return Promise.all(keys.filter(function(k) {
                return k !== CACHE_NAME;
            }).map(function(k) {
                return caches.delete(k);
            }));
        })
    );
});
