var CACHE_STATIC_NAME = 'static-v3'
var CACHE_DYNAMIC_NAME = CACHE_DYNAMIC_NAME

self.addEventListener("install", function (event) {
  console.log("[service workwer] is installing... ", event);
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME).then(function (cache) {
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
  event.waitUntil(
    caches.keys().then(
      function(keyList){
        return Promise.all(keyList.map(function(key){
          if(key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME  ){
            console.log('[Service Worker] delete cache' , key)
             return caches.delete(key)
          }
        }))
      }
    )
  )
  return self.clients.claim();
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      if (response) {
        return response;
      } else {
        return fetch(event.request).then(function(res){
            return caches.open(CACHE_DYNAMIC_NAME).then(function(cache){
                cache.put(event.request.url , res.clone())
                return res
            })
        }).catch(function(err){

        })
      }
    })
  );
});
