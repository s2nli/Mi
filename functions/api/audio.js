// Cloudflare Pages Function: allow-listed audio proxy so the app can save songs for offline play when a provider has no CORS headers.
const OK=[/(^|\.)saavncdn\.com$/,/(^|\.)jiosaavn\.com$/,/^kilpy-api\.vercel\.app$/,/^jiosvvnn\.vercel\.app$/,/^hulkmusic\.vercel\.app$/,/^saaz-next\.vercel\.app$/,/^modvault-music\.vercel\.app$/];
const MAX=40*1024*1024,hits=new Map();
const allowed=u=>u.protocol==='https:'&&!u.username&&!u.password&&!u.port&&OK.some(r=>r.test(u.hostname));
const json=(o,s=200)=>new Response(JSON.stringify(o),{status:s,headers:{'content-type':'application/json','x-content-type-options':'nosniff'}});
export async function onRequestGet({request}){
  const ip=request.headers.get('cf-connecting-ip')||'x',now=Date.now(),h=(hits.get(ip)||[]).filter(t=>now-t<60000);
  if(h.length>=60)return json({error:'rate limited'},429);h.push(now);hits.set(ip,h);if(hits.size>5000)hits.clear();
  try{
    const raw=String(new URL(request.url).searchParams.get('u')||'');if(!raw||raw.length>2000)return json({error:'bad url'},400);
    let u=new URL(raw),r;
    for(let i=0;i<4;i++){
      if(!allowed(u))return json({error:'host not allowed'},403);
      r=await fetch(u,{redirect:'manual',headers:{'user-agent':'Mozilla/5.0 CODELYNX'},signal:AbortSignal.timeout(25000)});
      if(r.status>=300&&r.status<400&&r.headers.get('location')){u=new URL(r.headers.get('location'),u);continue}
      break;
    }
    if(!r.ok||!r.body)return json({error:'upstream failed'},502);
    const ct=r.headers.get('content-type')||'';if(!/^(audio|video)\/|octet-stream|mpegurl/i.test(ct))return json({error:'not audio'},415);
    const len=+r.headers.get('content-length')||0;if(len>MAX)return json({error:'too large'},413);
    const hd={'content-type':ct,'cache-control':'private, max-age=0','x-content-type-options':'nosniff'};if(len)hd['content-length']=String(len);
    let n=0;
    const cap=new TransformStream({transform(c,ctl){n+=c.byteLength;if(n>MAX){ctl.terminate();return}ctl.enqueue(c)}});
    return new Response(r.body.pipeThrough(cap),{headers:hd});
  }catch{return json({error:'upstream failed'},502)}
}
