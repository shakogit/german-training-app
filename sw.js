const CACHE_NAME = 'visual-german-v52'; // ვერსია გავზარდეთ v2-ზე

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

// sw.js-ის ბოლო ნაწილი ჩაანაცვლე ამით:
self.addEventListener('fetch', (event) => {
  // იგნორირება გავუკეთოთ Google Analytics-ის მოთხოვნებს, თუ ჩაბლოკილია
  if (event.request.url.includes('google-analytics') || event.request.url.includes('googletagmanager')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    }).catch(err => {
      console.log('[SW] Fetch bypassed/failed for:', event.request.url);
    })
  );
});
