// PWA Service Worker
const CACHE_NAME = 'north-kyushu-trip-v1';

// 需要快取的靜態資源列表
const urlsToCache = [
  './', // 根目錄 (index.html)
  './index.html',
  './manifest.json',
  // 核心 JS/CSS 檔案 (從 CDN 載入的資源)
  'https://unpkg.com/react@18/umd/react.development.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.development.js',
  'https://unpkg.com/@babel/standalone/babel.min.js',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;700&display=swap',
  // 確保也包含您的圖標檔案 (如果已準備)
  // './android-chrome-192x192.png',
  // './android-chrome-512x512.png',
];

// 1. 安裝事件：快取所有靜態資源
self.addEventListener('install', event => {
  // 確保 Service Worker 即使在快取失敗時也等待所有資源被快取
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: 開啟快取並預先快取資源');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. 獲取事件：攔截所有網路請求並返回快取的資源
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果快取中有資源，則直接返回
        if (response) {
          return response;
        }
        // 否則，執行網路請求
        return fetch(event.request);
      }
    )
  );
});

// 3. 啟動事件：清理舊的快取版本
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: 刪除舊快取 ', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});