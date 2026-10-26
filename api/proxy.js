// Allow-listed GET proxy (CORS fallback). Hosts come from the audited archives; no credentials are used or forwarded.
const ALLOW=new Set(['kilpy-api.vercel.app','jiosvvnn.vercel.app','api.audius.co','modvault-music.vercel.app','hulkmusic.vercel.app','saaz-next.vercel.app','lrclib.net','www.jiosaavn.com','lyrics.kugou.com','mobileservice.kugou.com','lyrics-api.boidu.dev','all.api.radio-browser.info','de1.api.radio-browser.info']);
const MAX=2*1024*1024,hits=new Map(); // best-effort per-instance rate limit
export default async function handler(req,res){
  res.setHeader('x-content-type-options','nosniff');
  const ip=String(req.headers['x-forwarded-for']||'').split(',')[0].trim()||'x',now=Date.now(),h=(hits.get(ip)||[]).filter(t=>now-t<60000);
  if(h.length>=300)return res.status(429).json({error:'rate limited'});h.push(now);hits.set(ip,h);if(hits.size>5000)hits.clear();
  try{
    const raw=String(req.query.u||'');if(!raw||raw.length>2000)return res.status(400).json({error:'bad url'});
    const u=new URL(raw);
    if(u.protocol!=='https:'||u.username||u.password||u.port||!ALLOW.has(u.hostname))return res.status(403).json({error:'host not allowed'});
    const r=await fetch(u,{redirect:'manual',headers:{accept:'application/json','user-agent':'Mozilla/5.0 CODELYNX'},signal:AbortSignal.timeout(10000)});
    if(r.status>=300&&r.status<400)return res.status(502).json({error:'redirect blocked'});
    const ct=r.headers.get('content-type')||'';if(!/json|text/i.test(ct))return res.status(415).json({error:'unsupported type'});
    const t=await r.text();if(t.length>MAX)return res.status(502).json({error:'response too large'});
    res.setHeader('content-type',ct);res.setHeader('cache-control','s-maxage=60');res.status(r.status).send(t);
  }catch{res.status(502).json({error:'upstream failed'})}
}
