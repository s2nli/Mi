// Spotify: Spotify-style search (recents, suggestions, filter chips, song menu).
const CL=window.CL,$=s=>document.querySelector(s),esc=CL.esc,enc=encodeURIComponent;
const J='https://jiosvvnn.vercel.app/api';
const POP=['sad songs','sidhu moose wala','song','songs','soniyo','arijit singh','atif aslam','romantic songs','punjabi songs','party songs','90s bollywood','lofi songs','love songs','sufi songs','new hindi songs','old hindi songs','shreya ghoshal','jubin nautiyal','b praak','sonu nigam','kk songs','honey singh','badshah','diljit dosanjh','coke studio','rahat fateh ali khan','ghazal','bhajan','workout songs','dj remix'];
const I={
 back:'<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12H4m6-6-6 6 6 6"/></svg>',
 srch:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>',
 x:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
 fill:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 17 7 7M7 16V7h9"/></svg>',
 add:'<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 7v10M7 12h10"/></svg>',
 ok:'<svg width="26" height="26" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#1ed760"/><path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="#000" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
 dots:'<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="12" cy="19" r="1.8"/></svg>'
};
const MI={
 share:'<path d="M18 8a3 3 0 1 0-2.8-4M6 15a3 3 0 1 0 0-.01M18 21a3 3 0 1 0 0-.01M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/>',
 like:'<path d="M12 20s-7-4.6-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.400-7 10-7 10z"/>',
 pl:'<circle cx="12" cy="12" r="10"/><path d="M12 7v10M7 12h10"/>',
 q:'<path d="M4 6h12M4 11h8M4 16h8M16 14v6M13 17h6"/>',
 gq:'<path d="M4 7h16M4 12h16M4 17h16"/>',
 al:'<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>',
 ar:'<circle cx="10" cy="8" r="4"/><path d="M3 21v-1a6 6 0 0 1 6-6h2"/><path d="M18 14v6M15 17h6" />',
 dl:'<path d="M12 4v11m0 0-5-5m5 5 5-5M5 20h14"/>',
 rad:'<circle cx="12" cy="12" r="2"/><path d="M8 8a6 6 0 0 0 0 8M16 8a6 6 0 0 1 0 8M5 5a10 10 0 0 0 0 14M19 5a10 10 0 0 1 0 14"/>'
};
const mi=k=>`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${MI[k]}</svg>`;

document.head.insertAdjacentHTML('beforeend',`<style>
#spo{position:fixed;inset:0;z-index:18;background:var(--bg);color:var(--t);display:none;flex-direction:column}#spo.on{display:flex}
@media(min-width:900px){#spo{left:232px;bottom:90px}}
.sp-h{display:flex;align-items:center;gap:6px;padding:max(8px,env(safe-area-inset-top)) 12px 8px 8px}
.sp-h>button{width:44px;height:44px;min-width:44px;border-radius:99px;display:grid;place-items:center;flex:none}
.sp-in{flex:1;display:flex;align-items:center;height:46px;border-radius:99px;background:var(--s2);padding:0 6px 0 16px;min-width:0}
.sp-in input{flex:1;min-width:0;border:0;outline:0;background:transparent;color:var(--t);font:500 18px Inter,system-ui,sans-serif;height:100%}
.sp-in button{width:36px;height:36px;min-width:36px;border-radius:99px;display:grid;place-items:center;background:var(--m);color:var(--bg);opacity:.85}.sp-in button[hidden]{display:none}
.sp-ch{display:flex;gap:8px;padding:2px 12px 10px;overflow-x:auto;scrollbar-width:none;flex:none}.sp-ch[hidden]{display:none}
.sp-ch button{flex:none;height:36px;padding:0 16px;border-radius:99px;background:var(--s2);color:var(--t);font:500 15px Inter,system-ui,sans-serif}.sp-ch button.act{background:var(--a);color:#04130c;font-weight:600}
.sp-b{flex:1;overflow-y:auto;padding:0 0 220px;-webkit-overflow-scrolling:touch}
.sp-b h3{margin:8px 16px 6px;font-size:22px}
.sp-r{display:flex;align-items:center;gap:12px;padding:7px 8px 7px 16px;cursor:pointer;min-height:64px}.sp-r:active{background:var(--s)}
.sp-a{width:52px;height:52px;flex:none;border-radius:4px;overflow:hidden;background:var(--s2);display:grid;place-items:center;color:var(--m);font-size:22px}.sp-a.rd{border-radius:99px}.sp-a img{width:100%;height:100%;object-fit:cover}
.sp-t{flex:1;min-width:0}.sp-t b{display:block;font:500 17px Inter,system-ui,sans-serif;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.sp-t span{display:block;color:var(--m);font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-top:2px}
.sp-r>button{width:44px;height:44px;min-width:44px;border-radius:99px;display:grid;place-items:center;color:var(--m);flex:none;padding:0}
.sp-s{display:flex;align-items:center;gap:18px;padding:0 8px 0 20px;min-height:58px;cursor:pointer;font-size:19px}.sp-s:active{background:var(--s)}.sp-s>span{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.sp-s>button{width:44px;height:44px;border-radius:99px;display:grid;place-items:center;color:var(--m)}
.sp-clr{display:block;margin:22px auto 0;height:44px;padding:0 22px;border:1px solid var(--m);border-radius:99px;font-weight:700;font-size:15px;color:var(--t)}
.sp-em{padding:40px 24px;text-align:center;color:var(--m)}
#spsh{position:fixed;inset:0;z-index:45;display:none}#spsh.on{display:block}#spsh .bd{position:absolute;inset:0;background:rgba(0,0,0,.6)}
#spsh .pn{position:absolute;left:0;right:0;bottom:0;max-height:86vh;overflow-y:auto;background:var(--s2);border-radius:16px 16px 0 0;padding:8px 0 max(16px,env(safe-area-inset-bottom))}
@media(min-width:700px){#spsh .pn{left:50%;right:auto;width:420px;transform:translateX(-50%)}}
#spsh .gr{width:40px;height:4px;border-radius:4px;background:var(--m);opacity:.6;margin:4px auto 10px}
#spsh .hd{display:flex;align-items:center;gap:12px;padding:6px 16px 14px;border-bottom:1px solid var(--bd);margin-bottom:4px}
#spsh .it{display:flex;align-items:center;gap:18px;width:100%;height:56px;padding:0 20px;text-align:left;font:500 17px Inter,system-ui,sans-serif;color:var(--t);border-radius:0;justify-content:flex-start}#spsh .it:active{background:var(--s)}
#spsh .it.lk svg{color:#1ed760}
</style>`);
document.body.insertAdjacentHTML('beforeend',`<div id="spo" role="dialog" aria-label="Search"><div class="sp-h"><button id="spb" aria-label="Back">${I.back}</button><label class="sp-in"><input id="spi" type="search" enterkeyhint="search" placeholder="What do you want to listen to?" autocomplete="off" autocapitalize="off" spellcheck="false"><button id="spc" hidden aria-label="Clear">${I.x}</button></label></div><div class="sp-ch" id="spch" hidden></div><div class="sp-b" id="spbd"></div></div><div id="spsh"><div class="bd"></div><div class="pn"></div></div>`);

const o=$('#spo'),inp=$('#spi'),bd=$('#spbd'),chs=$('#spch'),clr=$('#spc'),sh=$('#spsh');
let likedIds=new Set(),mode='recent',filt='',cache=null,tmS=0,tmL=0,songs=[],menuT=null,ver=0;
const refLiked=async()=>{try{likedIds=new Set((await CL.all('liked')).map(x=>x.id))}catch{}};
const rec=()=>{try{return JSON.parse(localStorage.cl_rec||'[]')}catch{return[]}};
const saveRec=a=>{try{localStorage.cl_rec=JSON.stringify(a.slice(0,30))}catch{}};
const addRec=it=>{const k=x=>x.k+'|'+(x.k==='s'?x.t.id:x.k==='q'?x.q.toLowerCase():x.name);saveRec([it,...rec().filter(x=>k(x)!==k(it))])};
const art=(u,rd,ic)=>`<div class="sp-a${rd?' rd':''}">${u?`<img src="${esc(u)}" alt="" loading="lazy" onerror="this.remove()">`:(ic||'♪')}</div>`;
const lkBtn=t=>`<button data-sp="lk" data-id="${esc(t.id)}" aria-label="Like">${likedIds.has(t.id)?I.ok:I.add}</button>`;
const songRow=(t,i,src)=>`<div class="sp-r" data-sp="play" data-src="${src}" data-i="${i}">${art(t.artwork)}<div class="sp-t"><b>${esc(t.title)}</b><span>Song • ${esc(t.artist)}</span></div><button data-sp="more" data-src="${src}" data-i="${i}" aria-label="More">${I.dots}</button>${lkBtn(t)}</div>`;
const recSong=(t,i)=>`<div class="sp-r" data-sp="rplay" data-i="${i}">${art(t.artwork)}<div class="sp-t"><b>${esc(t.title)}</b><span>Song • ${esc(t.artist)}</span></div>${lkBtn(t)}<button data-sp="rx" data-i="${i}" aria-label="Remove">${I.x}</button></div>`;
const entRow=(x,i,src)=>`<div class="sp-r" data-sp="ent" data-src="${src}" data-i="${i}">${art(x.art,x.k==='ar','♫')}<div class="sp-t"><b>${esc(x.name)}</b><span>${esc(x.sub)}</span></div></div>`;
const kindLbl={pl:'Playlist',al:'Album',ar:'Artist'};

function renderRecents(){
 const r=rec();mode='recent';chs.hidden=true;
 if(!r.length){bd.innerHTML='<div class="sp-em">Play what you love<br><small>Search for artists, songs, albums and playlists.</small></div>';return}
 bd.innerHTML='<h3>Recents</h3>'+r.map((x,i)=>x.k==='s'?recSong(x.t,i):x.k==='q'?`<div class="sp-s" data-sp="rq" data-i="${i}"><span>${esc(x.q)}</span><button data-sp="rx" data-i="${i}" aria-label="Remove">${I.x}</button></div>`:`<div class="sp-r" data-sp="rent" data-i="${i}">${art(x.art,x.k==='ar','♫')}<div class="sp-t"><b>${esc(x.name)}</b><span>${kindLbl[x.k]}${x.sub&&x.k!=='pl'?' • '+esc(x.sub):''}</span></div><button data-sp="rx" data-i="${i}" aria-label="Remove">${I.x}</button></div>`).join('')+'<button class="sp-clr" data-sp="clr">Clear recent searches</button>';
}
const sugg=v=>{const l=v.toLowerCase(),out=[];const add=s=>{if(!out.some(x=>x.toLowerCase()===s.toLowerCase())&&s.toLowerCase()!==l)out.push(s)};
 rec().filter(x=>x.k==='q').forEach(x=>x.q.toLowerCase().startsWith(l)&&add(x.q));POP.filter(p=>p.startsWith(l)).forEach(add);POP.filter(p=>p.includes(l)).forEach(add);add(v);return out.slice(0,5)};
function renderTyping(v){
 mode='type';chs.hidden=true;
 const s=sugg(v);songs=songs.length?songs:[];
 bd.innerHTML=s.map(x=>`<div class="sp-s" data-sp="sg" data-q="${esc(x)}">${I.srch}<span>${esc(x)}</span><button data-sp="fillq" data-q="${esc(x)}" aria-label="Use suggestion">${I.fill}</button></div>`).join('')+'<div id="spl"></div>';
 drawLive();
}
function drawLive(){const e=$('#spl');if(!e)return;e.innerHTML=songs.length?songs.slice(0,8).map((t,i)=>songRow(t,i,'live')).join(''):'<div class="sk" style="height:56px;margin:8px 16px"></div>'.repeat(3)}
async function live(v){const my=++ver;songs=[];drawLive();try{const r=await CL.searchAll(v);if(my!==ver||mode!=='type')return;songs=r.list;drawLive()}catch{if(my===ver){songs=[];const e=$('#spl');if(e)e.innerHTML=''}}}

const jl=async(k,q)=>{const d=await CL.jget(`${J}/search/${k}?query=${enc(q)}&page=1&limit=${k==='playlists'?8:10}`);return d?.data?.results||d?.results||[]};
const img=a=>Array.isArray(a)?(a.at(-1)?.url||a.at(-1)?.link||''):(typeof a==='string'?a:'');
async function submit(v){
 v=v.trim();if(!v)return;inp.value=v;clr.hidden=false;inp.blur();mode='res';filt='';const my=++ver;
 addRec({k:'q',q:v});
 chs.hidden=false;drawChips();bd.innerHTML='<div class="sk" style="height:64px;margin:8px 16px"></div>'.repeat(6);
 const [sr,pl,al,ar]=await Promise.all([CL.searchAll(v).catch(()=>({list:[]})),jl('playlists',v).catch(()=>[]),jl('albums',v).catch(()=>[]),jl('artists',v).catch(()=>[])]);
 if(my!==ver)return;
 const nm=x=>String(x.name||x.title||'').trim();
 cache={q:v,songs:sr.list,bad:sr.bad||[],
  pl:pl.map(x=>({k:'pl',id:x.id,name:nm(x),art:img(x.image),sub:+x.songCount?x.songCount+' songs':'Playlist'})).filter(x=>x.id&&x.name),
  al:al.map(x=>({k:'al',name:nm(x),art:img(x.image),sub:'Album • '+(x.artists?.primary?.map(a=>a.name).join(', ')||x.year||'')})).filter(x=>x.name),
  ar:ar.map(x=>({k:'ar',name:nm(x),art:img(x.image),sub:'Artist'})).filter(x=>x.name)};
 drawRes();
}
function drawChips(){chs.innerHTML=[['pl','Playlists'],['s','Songs'],['al','Albums'],['ar','Artists']].map(([k,t])=>`<button data-sp="chip" data-k="${k}" class="${filt===k?'act':''}">${t}</button>`).join('')}
function drawRes(){
 if(!cache)return;drawChips();const c=cache;songs=c.songs;let h='';
 const sl=(a,from=0)=>a.map((t,i)=>songRow(t,i+from,'res')).join('');
 const ents=(a,k,from=0)=>a.map((x,i)=>entRow(x,i+from,k)).join('');
 if(filt==='s')h=sl(songs);else if(filt==='pl')h=ents(c.pl,'pl');else if(filt==='al')h=ents(c.al,'al');else if(filt==='ar')h=ents(c.ar,'ar');
 else h=ents(c.pl.slice(0,2),'pl')+sl(songs.slice(0,4))+ents(c.pl.slice(2,3),'pl',2)+sl(songs.slice(4,12),4)+(c.al.length?'<h3>Albums</h3>'+ents(c.al.slice(0,3),'al'):'')+(c.ar.length?'<h3>Artists</h3>'+ents(c.ar.slice(0,3),'ar'):'')+sl(songs.slice(12),12);

 bd.innerHTML=(c.bad.length?`<p class="sub" style="margin:4px 16px">No response from: ${esc(c.bad.join(', '))}</p>`:'')+(h||'<div class="sp-em">No results found for “'+esc(c.q)+'”</div>');
 bd.scrollTop=0;
}
const entOf=(src,i)=>{const c=cache;if(!c)return null;const a=c[src];if(!a)return null;return a[i]};

function open(q){o.classList.add('on');refLiked().then(()=>{if(mode==='recent')renderRecents()});if(q){inp.value=q;clr.hidden=false;submit(q)}else{inp.value='';clr.hidden=true;renderRecents();setTimeout(()=>inp.focus(),60)}}
function close(){o.classList.remove('on');inp.blur();closeMenu();ver++}
// entity helpers
async function openEnt(x){
 addRec({k:x.k,name:x.name,art:x.art,sub:x.sub,id:x.id});
 if(x.k==='pl'){const b=document.createElement('button');b.dataset.a='pls';b.dataset.pid=x.id;b.dataset.pn=x.name;b.hidden=true;$('#main').appendChild(b);close();b.click();b.remove();setTimeout(()=>{const q=sessionStorage.cl_q;if(q){sessionStorage.removeItem('cl_q');open(q)}},3500)}
 else{inp.value=x.name;clr.hidden=false;submit(x.name)}
}
function playSong(arr,i){const t=arr[i];if(!t)return;addRec({k:'s',t:CL.strip(t)});CL.play(arr,i)}
async function like(id,btn){
 let t=[...songs,...rec().filter(x=>x.k==='s').map(x=>x.t),menuT].filter(Boolean).find(x=>x.id===id);if(!t)return;
 await CL.toggleLike(t);await refLiked();
 document.querySelectorAll(`#spo [data-sp="lk"][data-id="${CSS.escape(id)}"]`).forEach(b=>b.innerHTML=likedIds.has(id)?I.ok:I.add);
 CL.toast(likedIds.has(id)?'Added to Liked Songs':'Removed from Liked Songs');
}
// --- menu ---
function openMenu(t){
 menuT=t;const lk=likedIds.has(t.id),ars=(t.artist||'').split(/\s*,\s*/).filter(Boolean);
 sh.querySelector('.pn').innerHTML=`<div class="gr"></div><div class="hd">${art(t.artwork)}<div class="sp-t"><b style="font-size:19px">${esc(t.title)}</b><span>${esc(t.artist)}${t.album?' • '+esc(t.album):''}</span></div></div>`+
 [['share','Share','share'],['like',lk?'Remove from Liked Songs':'Add to Liked Songs','like',lk?'lk':''],['pl','Add to playlist','pl'],['q','Add to Queue','q'],['dl','Download','dl'],['gq','Go to Queue','gq'],['al','Go to album','al'],['ar',ars.length>1?'Go to artists':'Go to artist','ar'],['rad','Go to song radio','rad']].map(([k,l,ic,c])=>`<button class="it ${c||''}" data-m="${k}">${mi(ic).replace('currentColor',lk&&k==='like'?'#1ed760':'currentColor')}${l}</button>`).join('');
 sh.classList.add('on');
}
function closeMenu(){sh.classList.remove('on')}
sh.addEventListener('click',async e=>{
 if(e.target.classList.contains('bd')){closeMenu();return}
 const b=e.target.closest('[data-m]');if(!b)return;const k=b.dataset.m,t=menuT;
 if(k==='ar2'){closeMenu();open(b.dataset.q);return}
 if(!t)return;
 if(k==='share'){closeMenu();const d={title:t.title,text:t.title+' - '+t.artist,url:location.origin};navigator.share?navigator.share(d).catch(()=>{}):(navigator.clipboard?.writeText(d.text+' '+d.url),CL.toast('Link copied'))}
 else if(k==='like'){closeMenu();like(t.id)}
 else if(k==='pl'){closeMenu();CL.pick(t)}
 else if(k==='q'){closeMenu();if(!CL.S.q.length)CL.play([t],0);else{CL.S.q.push(t);CL.toast('Added to queue')}}
 else if(k==='dl'){closeMenu();CL.download(t)}
 else if(k==='gq'){closeMenu();close();const p=$('#panel');if(!p.classList.contains('show')||!p.querySelector('.qrow'))$('#ql').click()}
 else if(k==='al'){if(!t.album){closeMenu();CL.toast('No album info for this song');return}closeMenu();open(t.album)}
 else if(k==='ar'){const ars=(t.artist||'').split(/\s*,\s*/).filter(Boolean);if(ars.length>1){sh.querySelector('.pn').innerHTML='<div class="gr"></div>'+ars.map(a=>`<button class="it" data-m="ar2" data-q="${esc(a)}">${mi('ar')}${esc(a)}</button>`).join('')}else if(ars[0]){closeMenu();open(ars[0])}else{closeMenu();CL.toast('No artist info')}}
 else if(k==='rad'){closeMenu();CL.toast('Starting radio…');try{const a=(t.artist||'').split(/\s*,\s*/)[0]||t.title,r=await CL.searchAll(a),l=r.list.filter(x=>x.id!==t.id).sort(()=>Math.random()-.5);if(!l.length)throw 0;CL.play([t,...l],0)}catch{CL.toast('Couldn\'t start radio')}}
});
// --- events ---
o.addEventListener('click',async e=>{
 const b=e.target.closest('[data-sp]');if(!b)return;const a=b.dataset.sp,i=+b.dataset.i,src=b.dataset.src;
 const arr=src==='live'||src==='res'?songs:null;
 if(a==='play')playSong(arr,i);
 else if(a==='rplay'){const t=rec()[i]?.t;if(t)playSong([t],0)}
 else if(a==='lk'){e.stopPropagation();like(b.dataset.id)}
 else if(a==='more'){e.stopPropagation();openMenu(arr[i])}
 else if(a==='rx'){e.stopPropagation();const r=rec();r.splice(i,1);saveRec(r);renderRecents()}
 else if(a==='clr'){saveRec([]);renderRecents()}
 else if(a==='rq'){submit(rec()[i].q)}
 else if(a==='rent'){const x=rec()[i];if(x)openEnt(x)}
 else if(a==='sg'){submit(b.dataset.q)}
 else if(a==='fillq'){e.stopPropagation();inp.value=b.dataset.q+' ';inp.focus();onType()}
 else if(a==='chip'){filt=filt===b.dataset.k?'':b.dataset.k;drawRes()}
 else if(a==='ent'){const x=entOf(src,i);if(x)openEnt(x)}
});
function onType(){const v=inp.value.trim();clr.hidden=!inp.value;clearTimeout(tmS);clearTimeout(tmL);ver++;
 if(!v){renderRecents();return}
 renderTyping(v);tmL=setTimeout(()=>live(v),350)}
inp.addEventListener('input',onType);
inp.addEventListener('keydown',e=>{if(e.key==='Enter')submit(inp.value)});
clr.onclick=()=>{inp.value='';clr.hidden=true;cache=null;ver++;renderRecents();inp.focus()};
$('#spb').onclick=close;
addEventListener('hashchange',()=>{if(location.hash.slice(1).split('/')[0]!=='search')close()});
addEventListener('popstate',()=>closeMenu());

window.CL.spOpen=open;
