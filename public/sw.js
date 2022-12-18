self.addEventListener("install", function (event) {
  console.log("[service workwer] is installing... ", event);
  event.waitUntil(
    caches.open("static").then(function (cache) {
      console.log("start static chaches");
      cache.addAll([
        "/",
        "/help",
        "/help/index.html",
        "/index.html",
        "/src/js/app.js",
        "/src/js/feed.js",
        "/src/js/material.min.js",
        "/src/css/app.css",
        "/src/css/feed",
        "https://fonts.googleapis.com/css?family=Roboto:400,700",
        "https://fonts.googleapis.com/icon?family=Material+Icons"
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
        return fetch(event.request).then(function(res){
            return caches.open('dynamic').then(function(cache){
                cache.put(event.request.url , res.clone())
                return res
            })
        }).catch(function(err){

        })
      }
    })
  );
});
