var CACHE_NAME = "beverly-boutik-v1";
var APP_SHELL = ["./index.html", "./manifest.json", "./logo.png", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", function(event){
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return cache.addAll(APP_SHELL);
    })
  );
});

self.addEventListener("activate", function(event){
  event.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){ return k !== CACHE_NAME; }).map(function(k){ return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

/* Réseau en priorité (pour toujours avoir les données Firebase à jour),
   avec repli sur le cache si hors-ligne (utile pour l'app shell). */
self.addEventListener("fetch", function(event){
  if(event.request.method !== "GET"){ return; }
  event.respondWith(
    fetch(event.request).catch(function(){
      return caches.match(event.request);
    })
  );
});
