// Spotify: in-app downloads. Saves any song into the Downloads page (IndexedDB), playable offline.
const CL=window.CL,$=s=>document.querySelector(s),{all,put,strip,toast,au,S}=CL;
const lsj=(k,d)=>{try{return JSON.parse(localStorage[k])??d}catch{return d}};
const have=new Set(),busy=new Set();
const refresh=async()=>{try{have.clear();(await all('offline')).forEach(x=>have.add(x.id))}catch{}icon()};
const SVG=(c,p)=>`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
const DL='<path d="M12 4v11m0 0-5-5m5 5 5-5M5 20h14"/>',OKI='<circle cx="12" cy="12" r="10" fill="#1ed760" stroke="none"/><path d="M7.5 12.5l3 3L16.5 9" stroke="#000"/>';
function icon(){const b=$('#npdl');if(!b)return;const t=S.q[S.i],d=t&&have.has(t.id),w=t&&busy.has(t.id);b.innerHTML=d?SVG('currentColor',OKI):SVG('currentColor',DL);b.style.opacity=t?(w?.5:1):.4;b.setAttribute('aria-label',d?'Downloaded':'Download')}
async function grab(url,lim,used,prog){
 const r=await fetch(url);if(!r.ok||!r.body)throw 0;
 const tot=+r.headers.get('content-length')||0;if(tot&&used+tot>lim)throw 'quota';
 const rd=r.body.getReader(),ch=[];let n=0;
 for(;;){const{done,value}=await rd.read();if(done)break;ch.push(value);n+=value.length;if(used+n>lim)throw 'quota';prog(n,tot)}
 const blob=new Blob(ch,{type:(r.headers.get('content-type')||'audio/mpeg').split(';')[0]});
 if(blob.size<20000)throw 0;return blob}
CL.download=async t=>{
 if(!t)return toast('Nothing to download');
 if(t.live)return toast('Live radio can\'t be downloaded');
 if(t.local)return toast('Already on your device');
 if(have.has(t.id))return toast('Already in Downloads');
 if(busy.has(t.id))return toast('Already downloading…');
 const urls=[...new Set([t.dl,...(t.streams||[]),...((t.alts||[]).flatMap(a=>[a.dl,...(a.streams||[])]))].filter(u=>/^https?:/.test(u||'')))].slice(0,4);
 if(!urls.length)return toast('No download link for this song');
 busy.add(t.id);icon();toast('Downloading…');
 const lim=lsj('cl_quota',500)*1048576;let blob=null,why='';
 try{
  const used=(await all('offline')).reduce((a,x)=>a+x.size,0);
  const prog=(n,tot)=>toast(tot?`Downloading ${Math.round(n/tot*100)}%`:`Downloading ${(n/1048576).toFixed(1)} MB`);
  for(const u of urls){
   for(const via of [u,'/api/audio?u='+encodeURIComponent(u)]){
    try{blob=await grab(via,lim,used,prog);break}catch(e){if(e==='quota'){why='quota';break}}
   }
   if(blob||why)break;
  }
  if(blob){await put('offline',{id:t.id,track:strip(t),blob,size:blob.size,at:Date.now()});have.add(t.id);toast('Downloaded · see Downloads tab');if(location.hash==='#downloads')CL.route()}
  else if(why==='quota')toast('Over your offline storage limit (Settings)');
  else toast('Couldn\'t download this song. The provider blocked it; try another version of the song.');
 }catch{toast('Download failed')}
 busy.delete(t.id);icon();
};
// now-playing download button
const top=$('#np .top');
if(top&&!$('#npdl')){const b=document.createElement('button');b.id='npdl';b.type='button';b.innerHTML=SVG('currentColor',DL);top.insertBefore(b,$('#npmore'));b.onclick=()=>CL.download(S.q[S.i])}
['loadstart','emptied','playing'].forEach(e=>au.addEventListener(e,icon));
new MutationObserver(icon).observe($('#tt'),{childList:true});
refresh();
addEventListener('hashchange',refresh);
CL.dlRefresh=refresh;
