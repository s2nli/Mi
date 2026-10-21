// Allow-listed GET proxy used only as a CORS fallback. Hosts come from the audited archives.
const ALLOW=new Set(['kilpy-api.vercel.app','jiosvvnn.vercel.app','api.audius.co','modvault-music.vercel.app','hulkmusic.vercel.app','saaz-next.vercel.app','lrclib.net','www.jiosaavn.com','lyrics.kugou.com','mobileservice.kugou.com','lyrics-api.boidu.dev']);
export default async function handler(req,res){
  try{
    const u=new URL(req.query.u);
    if(u.protocol!=='https:'||!ALLOW.has(u.hostname))return res.status(403).json({error:'host not allowed'});
    const r=await fetch(u,{headers:{accept:'application/json','user-agent':'Mozilla/5.0 CODELYNX'},signal:AbortSignal.timeout(10000)});
    res.setHeader('content-type',r.headers.get('content-type')||'application/json');res.setHeader('cache-control','s-maxage=60');
    res.status(r.status).send(await r.text());
  }catch{res.status(502).json({error:'upstream failed'})}
}
