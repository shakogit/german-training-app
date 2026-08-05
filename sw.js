const CACHE_NAME = 'deutsch-app-v23';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './quiz.html',
  './app.js',
  './style.css',
  './manifest.json'
];

// 1. ინსტალაციისა და ძველი SW-ის მყისიერი ჩანაცვლების ეტაპი
self.addEventListener('install', (event) => {
  self.skipWaiting(); // აიძულებს ახალ SW-ს, არ დაელოდოს აპლიკაციის დახურვას
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. აქტივაცია და ძველი ქეშების სრული განადგურება (მორიარტის კვალის წაშლა)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim()) // მყისიერად იღებს კონტროლს ყველა გახსნილ გვერდზე
  );
});

// 3. Network First (ან Stale-While-Revalidate) სტრატეგია HTML/JS/CSS-ისთვის
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // თუ ინტერნეტი არის, იწერს ახალს და ანახლებს ქეშსაც
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // თუ ინტერნეტი არ არის (Offline), მხოლოდ მაშინ კითხულობს ქეშიდან
        return caches.match(event.request);
      })
  );
});
