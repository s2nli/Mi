// Spotify service worker: app-shell cache so the UI opens offline + persistent artwork cache.
// Audio, APIs and other cross-origin requests are never cached here; only <img> artwork is.
const V='cl-v22',IMG='cl-img-v1',MAXIMG=500,SHELL=['/','/premium.css','/premium.js','/ext.js','/spsearch.js','/dl.js','/install.js','/lynx-ui.js','/manifest.webmanifest','/logo-96.png','/icon-192.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.allSettled(SHELL.map(u=>c.add(new Request(u,{cache:'reload'}))))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V&&x!==IMG).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
const net=(r,ms)=>Promise.race([fetch(r),new Promise((_,j)=>setTimeout(()=>j(new Error('slow')),ms))]);
let trimming=false;
async function trim(c){if(trimming)return;trimming=true;try{const k=await c.keys();if(k.length>MAXIMG)await Promise.all(k.slice(0,k.length-MAXIMG+60).map(x=>c.delete(x)))}finally{trimming=false}}
/* artwork: cache-first. Tried as CORS so the stored copy is a normal (non-opaque) response; if the host blocks CORS we just pass the image through uncached. */
async function image(r){
  const c=await caches.open(IMG),hit=await c.match(r.url);if(hit)return hit;
  try{const res=await fetch(r.url,{mode:'cors',credentials:'omit',referrerPolicy:'no-referrer'});
    if(res.ok){c.put(r.url,res.clone()).then(()=>trim(c)).catch(()=>{});return res}}catch{}
  return fetch(r);
}
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||r.headers.has('range'))return;
  if(r.destination==='image'&&u.origin!==location.origin&&/^https?:$/.test(u.protocol)){e.respondWith(image(r));return}
  if(u.origin!==location.origin||u.pathname.startsWith('/api/')||u.searchParams.has('px')||r.destination==='audio'||r.destination==='video')return;
  if(r.mode==='navigate'){
    e.respondWith(net(r,6000).then(res=>{if(res.ok){const c=res.clone();caches.open(V).then(x=>x.put('/',c))}return res}).catch(()=>caches.match('/')));
    return;
  }
  /* app files: network first (always the newest build when online), cache only when offline / very slow */
  e.respondWith(net(r,5000).then(res=>{if(res.ok){const c=res.clone();caches.open(V).then(x=>x.put(r,c))}return res}).catch(()=>caches.match(r)));
});
