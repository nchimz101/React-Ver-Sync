/**
 * Enhanced Service Worker with version broadcasting capabilities
 * 
 * This Service Worker template includes:
 * - Version tracking and broadcasting
 * - Cache invalidation on new versions
 * - Notification to all open tabs about updates
 */

// Application version information - update these values when releasing a new version
const APP_VERSION = '2.1.0';
const BUILD_NUMBER = 210;
const BUILD_TIMESTAMP = new Date().getTime();

// Cache name including version to ensure proper cache invalidation
const CACHE_NAME = `versynch-cache-v${APP_VERSION}`;

// Resources to pre-cache (customize based on your app)
const PRECACHE_RESOURCES = [
  '/',
  '/index.html',
  '/static/js/main.bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/favicon.ico',
];

// Install event - cache core resources
self.addEventListener('install', (event) => {
  console.log(`[Service Worker] Installing new version ${APP_VERSION} (Build ${BUILD_NUMBER})`);
  
  // Skip waiting to activate the new service worker immediately
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Pre-caching resources');
        return cache.addAll(PRECACHE_RESOURCES);
      })
      .catch(error => {
        console.error('[Service Worker] Pre-cache error:', error);
      })
  );
});

// Activate event - clean old caches and take control
self.addEventListener('activate', (event) => {
  console.log(`[Service Worker] Activating new version ${APP_VERSION}`);
  
  // Take control of all clients immediately
  event.waitUntil(clients.claim());
  
  // Clean up old caches
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name.startsWith('versynch-cache-') && name !== CACHE_NAME)
          .map(name => {
            console.log(`[Service Worker] Deleting old cache: ${name}`);
            return caches.delete(name);
          })
      );
    })
  );
  
  // Notify all open tabs about the new version
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'SW_UPDATED',
          version: APP_VERSION,
          build: BUILD_NUMBER,
          timestamp: Date.now()
        });
      });
    })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Basic cache-first strategy
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      
      return fetch(event.request).then(response => {
        // Don't cache non-success or non-GET responses
        if (!response || response.status !== 200 || event.request.method !== 'GET') {
          return response;
        }
        
        // Clone the response to store in cache and return
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        
        return response;
      }).catch(error => {
        console.error('[Service Worker] Fetch error:', error);
        // You can return a custom offline page here
        // return caches.match('/offline.html');
      });
    })
  );
});

// Message event - handle messages from clients
self.addEventListener('message', (event) => {
  console.log('[Service Worker] Received message:', event.data);
  
  if (event.data && event.data.type === 'VERSION_CHECK') {
    // Respond with current version information
    event.ports[0].postMessage({
      type: 'VERSION_INFO',
      version: APP_VERSION,
      build: BUILD_NUMBER,
      timestamp: BUILD_TIMESTAMP
    });
  }
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    // Force activation when requested by client
    self.skipWaiting();
  }
});

// Console log to confirm service worker has loaded
console.log(`[Service Worker] Script loaded for version ${APP_VERSION} (Build ${BUILD_NUMBER})`);
