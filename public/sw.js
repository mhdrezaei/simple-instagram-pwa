self.addEventListener("install", function (event) {
  console.log("[service workwer] is installing... ", event);
  event.waitUntil(
    caches.open("static").then(function (cache) {
      console.log("start static chaches");
      cache.addAll([
        "/",
        "/index.html",
        "/src/js/app.js",
        "/src/js/feed.js",
        "/src/js/material.min.js",
      ]);
    })
  );
});
self.addEventListener("activate", function (event) {
  console.log("[service workwer] is activating... ", event);
  return self.clients.claim();
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      if (response) {
        return response;
      } else {
        return fetch(event.request);
      }
    })
  );
});
