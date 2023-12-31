const cacheName = "v" + Math.floor(Math.random() * 100000000000000);
const GHPATH = "/ClientServerTesters";
const assets = [
  GHPATH + "/",
  GHPATH + "/index.html",
  GHPATH + "/websocket_client.html",
  GHPATH + "/storage_client.html",
];

self.addEventListener("activate", (event) => {
  // Remove old caches
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      return keys.map(async (cache) => {
        if (cache !== cacheName) {
          console.log("Service Worker: Removing old cache: " + cache);
          return await caches.delete(cache);
        }
      });
    })()
  );
});

self.addEventListener("install", (installEvent) => {
  console.log("Service Worker: Using new cache: " + cacheName);
  installEvent.waitUntil(
    caches.open(cacheName).then((cache) => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener("fetch", (fetchEvent) => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then((res) => {
      return res || fetch(fetchEvent.request);
    })
  );
});
