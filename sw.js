const CACHE_NAME = 'deutsch-app-v8';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './quiz.html',
  './manifest.json'
];

// ინსტალაციისას ფაილების ქეშირებას აკეთებს
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// ინტერნეტის გარეშე (Offline) ფაილების ქეშიდან ჩატვირთვა
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
