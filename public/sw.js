importScripts("/src/js/idb.js");
importScripts("/src/js/utility.js");
var CACHE_STATIC_NAME = "static-v20";
var CACHE_DYNAMIC_NAME = "dynamic";
var CACHE_USER_ENTERED_NAME = "entered-user";
var STATIC_FILES = [
  "/",
  "/index.html",
  "/offline.html",
  "/src/js/app.js",
  "/src/js/idb.js",
  "/src/js/utility.js",
  "/src/js/feed.js",
  "/src/js/material.min.js",
  "/src/css/app.css",
  "/src/css/feed.css",
  "https://fonts.googleapis.com/css?family=Roboto:400,700",
  "https://fonts.googleapis.com/icon?family=Material+Icons",
];

self.addEventListener('install', function (event) {
  console.log("[service workwer] is installing... ", event);
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME)
    .then(function (cache) {
      console.log("start static chaches...");
      cache.addAll([
        "/",
        "/index.html",
        "/offline.html",
        "/src/js/app.js",
        "/src/js/idb.js",
        "/src/js/utility.js",
        "/src/js/feed.js",
        "/src/js/material.min.js",
        "/src/css/app.css",
        "/src/css/feed.css",
        "https://fonts.googleapis.com/css?family=Roboto:400,700",
        "https://fonts.googleapis.com/icon?family=Material+Icons",
      ]);
    })
  );
});
function isInArray(string, array) {
  for (i = 0; i > array.length; i++) {
    if (string === array[i]) {
      return true;
    }
  }
  return false;
}
self.addEventListener("activate", function (event) {
  console.log("[service workwer] is activating... ", event);
  event.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(
        keyList.map(function (key) {
          if (
            key !== CACHE_STATIC_NAME &&
            key !== CACHE_USER_ENTERED_NAME &&
            key !== CACHE_DYNAMIC_NAME
          ) {
            console.log("[Service Worker] delete cache", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});
// fetch cashe
self.addEventListener("fetch", function (event) {
  var url = "http://localhost:5000/api/v1/alljobs";
  if (event.request.url.indexOf(url) > -1) {
    event.respondWith(
      fetch(event.request).then(function (response) {
        var cloneResponse = response.clone();
        clearAllData("posts")
          .then(function () {
            return cloneResponse.json();
          })
          .then(function (data) {
            for (var key in data.data) {
              writeData("posts", data.data[key]);
            }
          });
        return response;
      })
    );
  } else if (isInArray(event.request.url, STATIC_FILES)) {
    event.respondWith(caches.match(event.request));
  } else {
    event.respondWith(
      caches.match(event.request)
      .then(function (response) {
        if (response) {
          return response;
        } else {
          return fetch(event.request)
            .then(function (res) {
              return caches.open(CACHE_DYNAMIC_NAME)
              .then(function (cache) {
                cache.put(event.request.url, res.clone());
                return res;
              });
            })
            .catch(function (err) {
              return caches.open(CACHE_STATIC_NAME).then(function (cache) {
                return cache.match("/offline.html");
              });
            });
        }
      })
    );
  }
});

// fetch cashe
// self.addEventListener("fetch", function (event) {
//   console.log("fetch");
//   event.respondWith(
//     caches.match(event.request).then(function (response) {
//       if (response) {
//         return response;
//       } else {
//         return fetch(event.request)
//           .then(function (res) {
//             return caches.open(CACHE_DYNAMIC_NAME).then(function (cache) {
//               cache.put(event.request.url, res.clone());
//               return res;
//             });
//           })
//           .catch(function (err) {
//             return caches.open(CACHE_STATIC_NAME).then(function (cache) {
//               return cache.match("/offline.html");
//             });
//           });
//       }
//     })
//   );
// });

self.addEventListener("sync", function (event) {
  console.log("[service worker] Background syncing", event);
  if (event.tag === "sync-new-post") {
    console.log("[service worker] syncing new post");
    event.waitUntil(
      readAllData("sync-posts").then(function (data) {
        for (var dt of data) {
          fetch("http://localhost:5000/api/v1/job/new", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              id: new Date().toISOString,
              title: dt.title,
              address: dt.location,
              image: "http://localhost:3000/images/sf-boat.jpg",
              email: "rezaee123@gmail.com",
              industry: "Programing",
              salary: 8000,
              description: "hi this is a test",
            }),
          })
            .then(function (res) {
              console.log("sent Data!", res);
              if (res.ok) {
                deleteSingleItem("sync-posts", dt.id);
              }
            })
            .then(function (err) {
              console.log(err);
            });
        }
      })
    );
  }
});
