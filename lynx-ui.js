// CODΞLYNX shell: mini-player progress, full-screen Now Playing, mobile nav + "More" sheet.
const $=s=>document.querySelector(s),{au,S}=window.CL,fmt=s=>isFinite(s)&&s>0?Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0'):'0:00';
const mobile=()=>!matchMedia('(min-width:900px)').matches,np=$('#np');
document.body.insertAdjacentHTML('beforeend','<div id="npsheet"><div class="shbd" data-sh="x"></div><div class="shp" role="dialog" aria-label="Track options"></div></div>');
const PL='<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',PA='<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>';let ppState=null;const ppIcon=()=>{const k=au.paused?1:0;if(ppState===k)return;ppState=k;$('#nppp').innerHTML=au.paused?PL:PA};
const set=(id,v)=>{const e=$(id);if(e&&e.textContent!==v)e.textContent=v};
function sync(){const t=S.q[S.i];set('#nptt',t?t.title:'Nothing playing');set('#npta',t?t.artist:'');const a=$('#npart');if(t?.artwork){if(a.getAttribute('src')!==t.artwork)a.src=t.artwork}else a.removeAttribute('src');
 set('#nplk',$('#lk').textContent);$('#nplk').classList.toggle('on',$('#lk').textContent==='♥');
 ppIcon();np.classList.toggle('paused',au.paused);$('#npsh').classList.toggle('on',S.shuf);npx(t)}
function prog(){const p=au.duration>0?au.currentTime/au.duration:0;$('#bar').style.setProperty('--p',p*100+'%');set('#npcu',fmt(au.currentTime));set('#npdu',fmt(au.duration));if(document.activeElement!==$('#npseek'))$('#npseek').value=p*1000;$('#npseek').style.setProperty('--sp',p*100+'%');lyTick()}
['timeupdate','durationchange'].forEach(e=>au.addEventListener(e,prog));['play','pause','playing','waiting','loadstart','emptied'].forEach(e=>au.addEventListener(e,sync));
new MutationObserver(sync).observe($('#lk'),{childList:true});new MutationObserver(sync).observe($('#tt'),{childList:true});
$('#npseek').oninput=e=>{if(au.duration)au.currentTime=e.target.value/1000*au.duration};
for(const[a,b]of[['#nppp','#pp'],['#npnx','#nx'],['#nppv','#pv'],['#npsh','#sh'],['#nplk','#lk']])$(a).onclick=()=>{$(b).click();sync()};
const open=v=>{np.classList.toggle('open',v);document.body.style.overflow=v?'hidden':'';if(v)sync()};
$('#barmeta').addEventListener('click',e=>{if(mobile()&&S.q[S.i]&&!e.target.closest('#lk'))open(true)});$('#npclose').onclick=()=>open(false);
$('#npql').onclick=()=>{open(false);$('#ql').click()};$('#nply').onclick=()=>{open(false);$('#ly').click()};
addEventListener('keydown',e=>{if(e.key==='Escape'){open(false);$('#more').classList.remove('show')}});
addEventListener('resize',()=>{if(!mobile())open(false)});
/* bottom nav + More sheet */
const more=$('#more'),list=$('#morelist');
document.querySelectorAll('#bnav button[data-v]').forEach(b=>b.onclick=()=>{$('#panel').classList.remove('show');open(false);location.hash==='#'+b.dataset.v?CL.route():location.hash=b.dataset.v});
($('#morebtn')||{}).onclick=()=>{list.innerHTML='';for(const b of $('#navx').children){const c=document.createElement('button');c.textContent=b.textContent;c.onclick=()=>{more.classList.remove('show');b.dataset.v?(location.hash=b.dataset.v):b.click()};list.append(c)}more.classList.add('show')};
more.onclick=e=>{if(e.target===more)more.classList.remove('show')};
addEventListener('hashchange',()=>{$('#panel').classList.remove('show');more.classList.remove('show')});
sync();prog();

/* home: navigation tiles, artist search, keyboard activation */
document.addEventListener('click',e=>{const g=e.target.closest('[data-go]');if(g){location.hash=g.dataset.go;return}const s=e.target.closest('[data-sq]');if(s){sessionStorage.cl_q=s.dataset.sq;location.hash==='#search'?CL.route():location.hash='search';return}const f=e.target.closest('[data-f]');if(f)$('#main').dataset.f=f.dataset.f});
$('#main').addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('[role=button]')){e.preventDefault();e.target.click()}});

/* hide broken artwork instead of showing the broken-image icon */
for(const i of['#art','#npart'])$(i).addEventListener('error',e=>e.target.removeAttribute('src'));

/* mini player: close (✕) button - stops playback and hides the bar until something plays again */
(()=>{const nx=$('#nx');if(!nx||$('#bx'))return;const b=document.createElement('button');b.id='bx';b.title='Close player';b.setAttribute('aria-label','Close player');b.textContent='✕';nx.after(b);
b.onclick=e=>{e.stopPropagation();try{au.pause();S.q=[];S.i=-1;au.removeAttribute('src');au.load()}catch{}try{localStorage.removeItem('cl_resume')}catch{}open(false);document.body.classList.add('nobar');set('#tt','Nothing playing');set('#ta','')};
['play','loadstart'].forEach(ev=>au.addEventListener(ev,()=>{if(S.q.length)document.body.classList.remove('nobar')}))})();

/* phone/browser Back button closes the topmost layer: Now Playing, dialog, queue/lyrics panel, More sheet */
(()=>{const panel=$('#panel'),dlg=$('#dlg');let npPushed=false;const pushed=new WeakSet();
const push=()=>history.pushState({lyr:1},'');
new MutationObserver(()=>{const o=np.classList.contains('open');if(o&&!npPushed){npPushed=true;push()}else if(!o)npPushed=false}).observe(np,{attributes:true,attributeFilter:['class']});
for(const el of[panel,more,$('#npsheet')])new MutationObserver(()=>{const o=el.classList.contains('show');if(o&&!pushed.has(el)){pushed.add(el);push()}else if(!o)pushed.delete(el)}).observe(el,{attributes:true,attributeFilter:['class']});
if(dlg)new MutationObserver(()=>{if(dlg.open&&!pushed.has(dlg)){pushed.add(dlg);push()}else if(!dlg.open)pushed.delete(dlg)}).observe(dlg,{attributes:true,attributeFilter:['open']});
addEventListener('popstate',()=>{
 const sh=$('#npsheet');if(sh&&sh.classList.contains('show')){pushed.delete(sh);sh.classList.remove('show');return}
 if(np.classList.contains('open')){npPushed=false;open(false);return}
 if(dlg&&dlg.open){pushed.delete(dlg);dlg.close();return}
 if(panel.classList.contains('show')){pushed.delete(panel);panel.classList.remove('show');return}
 if(more.classList.contains('show')){pushed.delete(more);more.classList.remove('show')}});
/* after a layer closed, never stop on a leftover dummy entry: step back once more */
addEventListener('popstate',e=>{if(e.state?.lyr&&!np.classList.contains('open')&&!(dlg&&dlg.open)&&!panel.classList.contains('show')&&!more.classList.contains('show')&&!$('#npsheet')?.classList.contains('show'))history.back()});
/* the on-screen close arrow goes through history too, so the entry is not left behind */
$('#npclose').onclick=()=>{if(npPushed&&history.state?.lyr)history.back();else open(false)};
})();

/* back arrow on every secondary page + remember scroll position so Back returns to where you were */
(()=>{const main=$('#main'),SEC=new Set(['explore','artists','albums','radio','local','downloads','liked']);
const ys={};let key=location.hash||'#home',lock=false,popped=false,navs=0,tm;
const sy=()=>window.scrollY||document.documentElement.scrollTop||0;
let raf=0;addEventListener('scroll',()=>{if(lock||raf)return;raf=requestAnimationFrame(()=>{raf=0;if(!lock)ys[key]=sy()})},{passive:true});
addEventListener('popstate',()=>{popped=true});
addEventListener('hashchange',()=>{const nk=location.hash||'#home';if(nk===key)return;lock=true;key=nk;navs++;const y=popped?(ys[nk]||0):0;popped=false;clearInterval(tm);let n=0;
 const go=()=>{n++;const ok=document.documentElement.scrollHeight>=y+innerHeight-2||y===0;if(ok||n>25){scrollTo(0,y);if(ok||n>25){clearInterval(tm);setTimeout(()=>{lock=false;ys[key]=sy()},150)}}};
 go();if(lock)tm=setInterval(go,120)});
const bar=()=>{const v=(location.hash||'#home').slice(1).split('/')[0];if(!SEC.has(v)||main.querySelector(':scope>.xbar'))return;
 main.insertAdjacentHTML('afterbegin','<div class="xbar"><button class="sbtn2 xback" data-back aria-label="Back"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 12H4M11 5l-7 7 7 7"/></svg></button></div>')};
new MutationObserver(bar).observe(main,{childList:true});bar();
document.addEventListener('click',e=>{if(!e.target.closest('[data-back]'))return;e.preventDefault();if(navs>0)history.back();else location.hash='home'},true);
})();

/* ============ Spotify-style Now Playing: tint, lyric line, cards, options sheet ============ */
const esc=window.CL.esc;const IC={"share": "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"18\" cy=\"5\" r=\"2.6\"/><circle cx=\"6\" cy=\"12\" r=\"2.6\"/><circle cx=\"18\" cy=\"19\" r=\"2.6\"/><path d=\"M8.3 10.8l7.4-4.4M8.3 13.2l7.4 4.4\"/></svg>", "lyr": "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"2.5\"/><path d=\"M7 15h2M12 15h5M7 11h6\"/></svg>", "plus": "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 8v8M8 12h8\"/></svg>", "queue": "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"4\" y=\"4\" width=\"16\" height=\"5\" rx=\"2.5\"/><path d=\"M4 14h16M4 19h16\"/></svg>", "album": "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"9\"/><circle cx=\"12\" cy=\"12\" r=\"2.6\"/></svg>", "artist": "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"10\" cy=\"8\" r=\"4\"/><path d=\"M3 20c.8-4 3.6-6 7-6s6.2 2 7 6\"/></svg>", "dl": "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M12 4v11M7 11l5 5 5-5M5 20h14\"/></svg>", "rep": "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M17 2l4 4-4 4M3 11V9a3 3 0 013-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 01-3 3H3\"/></svg>", "timer": "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"13.5\" r=\"7.5\"/><path d=\"M12 13.5V9M9.5 2.5h5M12 2.5v3\"/></svg>"};
var NXS;const DEFC=[100,62,135];
const split=a=>String(a||'').split(/,|&| feat\.? | ft\.? /i).map(x=>x.trim()).filter(Boolean);
function setTint([r,g,b]){np.style.setProperty('--npc',`rgb(${r*.5|0},${g*.5|0},${b*.5|0})`);np.style.setProperty('--npa',`rgb(${r*.78|0},${g*.78|0},${b*.78|0})`)}
function tint(url){if(!url)return setTint(DEFC);if(NXS.col[url])return setTint(NXS.col[url]);const im=new Image();im.crossOrigin='anonymous';
 im.onload=()=>{try{const c=document.createElement('canvas');c.width=c.height=12;const x=c.getContext('2d');x.drawImage(im,0,0,12,12);const d=x.getImageData(0,0,12,12).data;let r=0,g=0,b=0,w=0;for(let i=0;i<d.length;i+=4){const R=d[i],G=d[i+1],B=d[i+2],k=Math.max(R,G,B)-Math.min(R,G,B)+20;r+=R*k;g+=G*k;b+=B*k;w+=k}NXS.col[url]=[r/w,g/w,b/w];if(NXS.art===url)setTint(NXS.col[url])}catch{setTint(DEFC)}};
 im.onerror=()=>setTint(DEFC);im.src=url}
async function getLy(t){if(!t)return null;if(NXS.ly.has(t.id))return NXS.ly.get(t.id);const p=(async()=>{try{const r=await CL.jget('https://lrclib.net/api/search?q='+encodeURIComponent(t.artist+' '+t.title));const h=r.find(x=>x.syncedLyrics)||r.find(x=>x.plainLyrics);if(h)return{sync:CL.parseLrc(h.syncedLyrics),plain:h.plainLyrics||''};if(CL.altLyrics)return await CL.altLyrics(t)}catch{}return null})();NXS.ly.set(t.id,p);return p}
function npx(t){if(!NXS)return;const id=t?t.id:'';if(id===NXS.id)return;NXS.id=id;NXS.cur=null;NXS.k=-2;
 set('#npsrc1',t?.album?'Playing from album':'Playing from');set('#npsrc',t?(t.album||'Queue'):'Queue');
 NXS.art=t?.artwork||'';tint(NXS.art);$('#nplyr').textContent='';$('#nplp').hidden=true;
 const ex=$('#npex');if(t){const as=split(t.artist),a0=as[0]||t.artist;ex.hidden=false;ex.innerHTML=`<h3>Explore ${esc(a0)}</h3><div class="npt">${[['More by '+a0,a0+' songs','#7a3b5e','#2a1520'],['Similar to '+a0,a0+' similar songs','#2f5d7a','#14212b'],['Songs like '+t.title,'songs like '+t.title+' '+a0,'#7a6a2f','#2a2512']].map(([l,q,c1,c2])=>`<div class="npt1" tabindex="0" role="button" data-sq="${esc(q)}" style="background:linear-gradient(160deg,${c1},${c2})"><b>${esc(l)}</b></div>`).join('')}</div>`}else ex.hidden=true;
 if(t)getLy(t).then(l=>{if(NXS.id!==id)return;NXS.cur=l&&((l.sync&&l.sync.length)||l.plain)?l:null;NXS.k=-2;lyTick(true)})}
function lyTick(force){if(!NXS||!NXS.cur)return;const l=NXS.cur,card=$('#nplp');let k=-1;
 if(l.sync?.length){for(let i=0;i<l.sync.length;i++){if(l.sync[i].t<=au.currentTime)k=i;else break}}
 if(k===NXS.k&&!force)return;NXS.k=k;
 if(l.sync?.length){const line=l.sync[Math.max(k,0)];$('#nplyr').textContent=k>=0?line.x:'';
  const from=Math.max(k,0),rows=l.sync.slice(from,from+8);card.innerHTML=`<h3>Lyrics preview</h3><div class="lp">${rows.map((r,i)=>`<p class="${i===0&&k>=0?'cur':''}">${esc(r.x)}</p>`).join('')}</div><button class="npb" data-np="lyr">Show lyrics</button>`}
 else{const rows=l.plain.split('\n').filter(x=>x.trim()).slice(0,8);$('#nplyr').textContent='';card.innerHTML=`<h3>Lyrics preview</h3><div class="lp">${rows.map(r=>`<p class="cur">${esc(r)}</p>`).join('')}</div><button class="npb" data-np="lyr">Show lyrics</button>`}
 card.hidden=false}
NXS={id:null,col:{},ly:new Map(),art:'',cur:null,k:-2};ppState=null;sync();prog();

/* options sheet (three dots) */
const sheet=$('#npsheet'),shp=sheet.querySelector('.shp');
const sOpen=()=>{const t=S.q[S.i];if(!t)return;const as=split(t.artist);
 const it=(k,ic,l,extra='')=>`<button class="shi" data-sh="${k}">${ic}<span>${l}</span>${extra}</button>`;
 shp.innerHTML=`<div class="shg"></div><div class="sht">${t.artwork?`<img src="${esc(t.artwork)}" alt="">`:'<i></i>'}<div><b>${esc(t.title)}</b><span>${esc(t.artist)}${t.album?' • '+esc(t.album):''}</span></div></div>`
 +it('share',IC.share,'Share')+it('lyr',IC.lyr,'Lyrics')+it('pl',IC.plus,'Add to playlist')+it('q',IC.queue,'Go to Queue')
 +(t.album?it('al',IC.album,'Go to album'):'')+as.map((a,i)=>it('ar'+i,IC.artist,as.length>1?'Go to '+esc(a):'Go to artist')).join('')
 +(t.dl||t.streams?.[0]?it('dl',IC.dl,'Download'):'')+it('rep',IC.rep,'Repeat • '+(S.rep==='one'?'One':S.rep==='all'?'All':'Off'))+it('tm',IC.timer,'Sleep timer');
 sheet.classList.add('show')};
const sClose=()=>sheet.classList.remove('show');
$('#npmore').onclick=sOpen;
sheet.addEventListener('click',e=>{const b=e.target.closest('[data-sh]');if(!b)return;const k=b.dataset.sh,t=S.q[S.i];sClose();if(k==='x'||!t)return;
 if(k==='share'){const d={title:t.title,text:t.title+' - '+t.artist,url:location.origin};navigator.share?navigator.share(d).catch(()=>{}):(navigator.clipboard?.writeText(d.text+' '+d.url),CL.toast('Link copied'))}
 else if(k==='lyr'){open(false);$('#ly').click()}
 else if(k==='pl')CL.pick(t);
 else if(k==='q'){open(false);$('#ql').click()}
 else if(k==='al'||k.startsWith('ar')){const q=k==='al'?t.album:split(t.artist)[+k.slice(2)];open(false);sessionStorage.cl_q=q;location.hash==='#search'?CL.route():location.hash='search'}
 else if(k==='dl'){if(t.dl&&CL.download)CL.download(t);else{const a=document.createElement('a');a.href=t.dl||t.streams[0];a.download=(t.artist+' - '+t.title)+'.mp3';a.target='_blank';a.rel='noopener';a.click()}}
 else if(k==='rep'){$('#rp').click();CL.toast('Repeat: '+(S.rep==='one'?'One':S.rep==='all'?'All':'Off'))}
 else if(k==='tm')slp()});
function slp(){const b=document.createElement('button');b.dataset.a='slp';b.hidden=true;$('#main').append(b);b.click();b.remove()}
$('#npsl').onclick=slp;
$('#npshare').onclick=()=>{const t=S.q[S.i];if(!t)return;const d={title:t.title,text:t.title+' - '+t.artist,url:location.origin};navigator.share?navigator.share(d).catch(()=>{}):(navigator.clipboard?.writeText(d.text+' '+d.url),CL.toast('Link copied'))};
np.addEventListener('click',e=>{if(e.target.closest('[data-np=lyr]')){open(false);$('#ly').click();return}if(e.target.closest('[data-sq]'))open(false)});
/* queue panel buttons */
$('#panel').addEventListener('click',e=>{const b=e.target.closest('[data-qx]');if(!b)return;if(b.dataset.qx==='sh'){$('#sh').click();b.classList.toggle('on',S.shuf)}else slp()});
