// CODΞLYNX service worker: app-shell cache so the UI opens offline. Audio, APIs and cross-origin requests are never cached here.
const V='cl-v14',SHELL=['/','/premium.css','/premium.js','/ext.js','/lynx-ui.js','/manifest.webmanifest','/logo-96.png','/icon-192.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.allSettled(SHELL.map(u=>c.add(u)))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith('cl-v')&&x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||u.origin!==location.origin||u.pathname.startsWith('/api/')||u.searchParams.has('px')||r.headers.has('range')||r.destination==='audio'||r.destination==='video')return;
  if(r.mode==='navigate'){
    e.respondWith(fetch(r).then(res=>{if(res.ok){const c=res.clone();caches.open(V).then(x=>x.put('/',c))}return res}).catch(()=>caches.match('/')));
    return;
  }
  e.respondWith(caches.open(V).then(async c=>{
    const hit=await c.match(r),net=fetch(r).then(res=>{if(res.ok)c.put(r,res.clone());return res}).catch(()=>hit);
    return hit||net;
  }));
});
