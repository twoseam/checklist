// Minimal service worker — its only job is to make JotList installable
// as a PWA (Chrome/Android need a registered SW with a fetch handler).
// Pure network passthrough: nothing is cached, so a deploy is never stale.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
// Do NOT call respondWith — just having a fetch listener is enough for PWA
// installability. Intercepting every request (respondWith(fetch(...))) makes
// a single network hiccup reject the page load: Safari then shows
// "FetchEvent.respondWith received an error: TypeError: Load failed".
self.addEventListener('fetch', () => {});
