// Cloudflare Pages Function: allow-listed GET proxy (CORS fallback). No credentials are used or forwarded.
const ALLOW=new Set(['kilpy-api.vercel.app','jiosvvnn.vercel.app','api.audius.co','modvault-music.vercel.app','hulkmusic.vercel.app','saaz-next.vercel.app','lrclib.net','www.jiosaavn.com','lyrics.kugou.com','mobileservice.kugou.com','lyrics-api.boidu.dev','all.api.radio-browser.info','de1.api.radio-browser.info']);
const MAX=2*1024*1024,hits=new Map(); // best-effort per-isolate rate limit
const json=(o,s=200,h={})=>new Response(JSON.stringify(o),{status:s,headers:{'content-type':'application/json','x-content-type-options':'nosniff',...h}});
export async function onRequestGet({request}){
  const ip=request.headers.get('cf-connecting-ip')||'x',now=Date.now(),h=(hits.get(ip)||[]).filter(t=>now-t<60000);
  if(h.length>=300)return json({error:'rate limited'},429);h.push(now);hits.set(ip,h);if(hits.size>5000)hits.clear();
  try{
    const raw=String(new URL(request.url).searchParams.get('u')||'');if(!raw||raw.length>2000)return json({error:'bad url'},400);
    const u=new URL(raw);
    if(u.protocol!=='https:'||u.username||u.password||u.port||!ALLOW.has(u.hostname))return json({error:'host not allowed'},403);
    const r=await fetch(u,{redirect:'manual',headers:{accept:'application/json','user-agent':'Mozilla/5.0 CODELYNX'},signal:AbortSignal.timeout(10000)});
    if(r.status>=300&&r.status<400)return json({error:'redirect blocked'},502);
    const ct=r.headers.get('content-type')||'';if(!/json|text/i.test(ct))return json({error:'unsupported type'},415);
    const t=await r.text();if(t.length>MAX)return json({error:'response too large'},502);
    return new Response(t,{status:r.status,headers:{'content-type':ct,'cache-control':'s-maxage=60','x-content-type-options':'nosniff'}});
  }catch{return json({error:'upstream failed'},502)}
}
