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

const thingsToSay =[
    "Not a great start, drink water MEOW! 🐈",
    "So... thirsty...🐱",
    "So... thirsty...🐱",
    "So... thirsty... 🐈",
    "So... thirsty...🐈",
    "So... thirsty...🐱",
    "So... thirsty...🐈",
    "Almost there, one more glass! 🐈",
    ];


self.addEventListener('push', async event => {
    const data = event.data ? event.data.text() : 'No payload';
    //data.title = "changed "+count;
    event.waitUntil((async () =>{
        let count = await loadFromDb("myDb","myStore","toggledCount");
        if (count < 8)
        {
          let messageToShow =thingsToSay[count];
          self.registration.showNotification('HydroCat alert!', {
            body: thingsToSay[count]
        });
        }

        
      }
    )());
  }
);



    function loadFromDb(dbName, storeName, key) {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 1);

        request.onupgradeneeded = (event) => {
          // If the DB was never created before, make sure the store exists
          const db = event.target.result;
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName);
          }
        };

        request.onsuccess = (event) => {
          const db = event.target.result;
          const tx = db.transaction(storeName, "readonly");
          const store = tx.objectStore(storeName);

          const getReq = store.get(key);

          getReq.onsuccess = () => resolve(getReq.result); // may be undefined if key not found
          getReq.onerror = (e) => reject(e.target.error);
        };

        request.onerror = (event) => reject(event.target.error);
      });
    }




self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
});
