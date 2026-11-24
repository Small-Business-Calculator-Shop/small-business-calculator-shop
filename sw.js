'use strict';
const CACHE='bnt-integrated-unicode-2026-11-23';
const ASSETS=['./','./index.html','./css/app.css','./js/templates.js','./js/engine.js','./js/pdf.js','./js/report-font-map.js','./js/report-font.ttf','./js/storage.js','./js/transfer.js','./js/app.js','./js/support.js','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>(k.startsWith('bnt-app-')||k.startsWith('bnt-integrated-'))&&k!==CACHE).map(k=>caches.delete(k)))),self.clients.claim()])));
self.addEventListener('fetch',event=>{const request=event.request;if(request.method!=='GET'||new URL(request.url).origin!==self.location.origin)return;event.respondWith(caches.match(request).then(cached=>cached||fetch(request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(request,copy))}return response}))) });
