// Allow-listed audio proxy so the app can save songs for offline play when a provider has no CORS headers.
import { Readable } from 'node:stream';
const OK=[/(^|\.)saavncdn\.com$/,/(^|\.)jiosaavn\.com$/,/^kilpy-api\.vercel\.app$/,/^jiosvvnn\.vercel\.app$/,/^hulkmusic\.vercel\.app$/,/^saaz-next\.vercel\.app$/,/^modvault-music\.vercel\.app$/];
const MAX=40*1024*1024,hits=new Map();
const allowed=u=>u.protocol==='https:'&&!u.username&&!u.password&&!u.port&&OK.some(r=>r.test(u.hostname));
export default async function handler(req,res){
  res.setHeader('x-content-type-options','nosniff');
  const ip=String(req.headers['x-forwarded-for']||'').split(',')[0].trim()||'x',now=Date.now(),h=(hits.get(ip)||[]).filter(t=>now-t<60000);
  if(h.length>=60)return res.status(429).json({error:'rate limited'});h.push(now);hits.set(ip,h);if(hits.size>5000)hits.clear();
  try{
    const raw=String(req.query.u||'');if(!raw||raw.length>2000)return res.status(400).json({error:'bad url'});
    let u=new URL(raw),r;
    for(let i=0;i<4;i++){
      if(!allowed(u))return res.status(403).json({error:'host not allowed'});
      r=await fetch(u,{redirect:'manual',headers:{'user-agent':'Mozilla/5.0 CODELYNX'},signal:AbortSignal.timeout(25000)});
      if(r.status>=300&&r.status<400&&r.headers.get('location')){u=new URL(r.headers.get('location'),u);continue}
      break;
    }
    if(!r.ok||!r.body)return res.status(502).json({error:'upstream failed'});
    const ct=r.headers.get('content-type')||'';if(!/^(audio|video)\/|octet-stream|mpegurl/i.test(ct))return res.status(415).json({error:'not audio'});
    const len=+r.headers.get('content-length')||0;if(len>MAX)return res.status(413).json({error:'too large'});
    res.setHeader('content-type',ct);if(len)res.setHeader('content-length',len);res.setHeader('cache-control','private, max-age=0');
    let n=0;const src=Readable.fromWeb(r.body);src.on('data',c=>{n+=c.length;if(n>MAX)src.destroy()});src.on('error',()=>res.end());src.pipe(res);
  }catch{res.status(502).json({error:'upstream failed'})}
}
