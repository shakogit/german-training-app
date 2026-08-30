const CACHE_NAME = 'visual-german-v49'; // ვერსია გავზარდეთ v2-ზე

// ყველა ფაილის სია, რომელიც უნდა დაკეშირდეს ოფლაინ მუშაობისთვის
const CACHE_URLS = [
  './',
  './index.html',
  './quiz-lib.html',
  './quiz.html',
  './guess-lib.html',
  './guess-article.html',
  './style.css',
  './data/topics.json'
];

// 1. Install Event - ფაილების ქეშში ჩაწერა
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching app shell & dynamic pages');
      return cache.addAll(CACHE_URLS);
    })
  );
  self.skipWaiting();
});

// 2. Activate Event - ძველი ქეშის წაშლა განახლებისას
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Fetch Event - ოფლაინ რეჟიმის მხარდაჭერა
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});
