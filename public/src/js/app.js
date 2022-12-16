var eventPrompt;
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").then(function () {
    console.log("service worker is registerd");
  });
}

window.addEventListener("beforeinstallprompt", function (event) {
  console.log("before prompt fired");
  event.preventDefault();
  eventPrompt = event;
});
