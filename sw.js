// Minimal service worker — its only job is to make JotList installable
// as a PWA (Chrome/Android need a registered SW with a fetch handler).
// Pure network passthrough: nothing is cached, so a deploy is never stale.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => { e.respondWith(fetch(e.request)); });
