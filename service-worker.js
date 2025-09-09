const CACHE_NAME = 'hello-pwa-static-v1';
const OFFLINE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.png',
  './empty.png',
  './full.png',
  './header.png',
  './dancing.gif'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(OFFLINE_ASSETS))
  );
});

self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);

  // For external API requests (e.g., stock price), don't use cache
  if (requestUrl.origin !== location.origin) {
    return; // Let the browser handle it (will go to network)
  }

  // Serve static assets from cache
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || new Response('Offline content not available', {
        status: 503,
        statusText: 'Service Unavailable'
      });
    })
  );
});

/*self.addEventListener("message", (event) => {
  console.log("SW got message:", event.data);

  if (event.data.type === "SET_USER_DATA") {
    // store in memory, IndexedDB, Cache API, etc.
    self.userData = event.data.payload;
    alert("user data set");
  }
});*/ 


self.addEventListener('push', event => {
    const data = event.data ? event.data.text() : 'No payload';
    var count = localStorage.getItem("count");
    event.waitUntil(
        self.registration.showNotification('Push Received '+count, {
            body: data
        })
    );
});

self.addEventListener('pushaaa', event => {
    const data = event.data ? event.data.text() : 'No payload';
   
    var count = localStorage.getItem("count");

    event.waitUntil(
        self.registration.showNotification('Push with count ' + count, {
            body: data
        })
    );

    /*
    event.waitUntil(
        self.registration.showNotification('Push Received', {
            body: data
        })
    );
*/
    /*self.clients.matchAll({ includeUncontrolled: true, type: 'window' }).then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'push-event',
          payload: data
        });
      });
    });*/
});


self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
});
