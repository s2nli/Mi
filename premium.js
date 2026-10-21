// CODΞLYNX premium layer: theme + accent, motion, network status, XP / level / rank, clock + listening stats, mood picks.
const CL=window.CL,{au,toast,esc,all}=CL,$=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const root=document.documentElement,LS=localStorage;
const jget=(k,d)=>{try{const v=LS.getItem(k);return v==null?d:JSON.parse(v)}catch{return d}};
const jset=(k,v)=>{try{LS.setItem(k,JSON.stringify(v))}catch{}};
const raw=(k,d)=>LS.getItem(k)||d;
const day=(d=new Date())=>new Date(d-d.getTimezoneOffset()*6e4).toISOString().slice(0,10);
const first=n=>String(n||'').split(/[,&]/)[0].trim();
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
const fmtD=s=>{s=Math.round(s);if(s<60)return s+'s';const m=Math.floor(s/60);if(m<60)return m+'m';return Math.floor(m/60)+'h '+String(m%60).padStart(2,'0')+'m'};
const ic=d=>`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;

/* ---------- theme, accent, motion ---------- */
const ACC={emerald:'Emerald',violet:'Violet',rose:'Rose',amber:'Amber',sky:'Sky',fuchsia:'Fuchsia'};
const ACCDOT={emerald:'#34d399',violet:'#a78bfa',rose:'#fb7185',amber:'#fbbf24',sky:'#38bdf8',fuchsia:'#e879f9'};
const theme=()=>raw('cl_theme','dark'),accent=()=>raw('cl_accent','emerald'),motion=()=>raw('cl_anim',matchMedia('(prefers-reduced-motion: reduce)').matches?'off':'full');
function syncMeta(){const m=$('meta[name=theme-color]');if(m)m.content=getComputedStyle(root).getPropertyValue('--bg').trim()||'#09090b'}
function applyTheme(){const t=theme();root.dataset.theme=t==='system'?(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'):t;root.dataset.accent=accent();root.dataset.anim=motion();syncMeta()}
const setTheme=v=>{LS.cl_theme=v;applyTheme();openTheme()};
const setAccent=v=>{if(ACC[v]){LS.cl_accent=v;applyTheme();openTheme()}};
const setMotion=v=>{LS.cl_anim=v;applyTheme();openAnim()};
matchMedia('(prefers-color-scheme: light)').addEventListener?.('change',()=>{if(theme()==='system')applyTheme()});
new MutationObserver(syncMeta).observe(root,{attributes:true,attributeFilter:['data-theme','data-accent']});
document.body.insertAdjacentHTML('afterbegin','<div class="aurora" aria-hidden="true"><i></i><i></i><i></i></div>');
applyTheme();

function dlg(html){const d=$('#dlg');d.onclick=null;d.innerHTML=html;if(!d.open)d.showModal()}
function openTheme(){const t=theme(),a=accent();dlg(`<h3>Appearance</h3><p class="px-lab">Theme</p><div class="px-seg">${[['dark','Dark'],['light','Light'],['system','System']].map(([v,l])=>`<button data-px="mode" data-v="${v}" class="${t===v?'act':''}">${l}</button>`).join('')}</div><p class="px-lab">Accent colour</p><div class="px-sws">${Object.keys(ACC).map(k=>`<button data-px="acc" data-v="${k}" class="${a===k?'act':''}" style="--c:${ACCDOT[k]}" aria-label="${ACC[k]}" title="${ACC[k]}"></button>`).join('')}</div><div><button data-px="close" class="px-done">Done</button></div>`)}
function openAnim(){const m=motion();dlg(`<h3>Animation</h3><div class="px-opts">${[['full','','Full','Animated aurora background, smooth entrances and transitions'],['lite','','Lite','Static background, only quick transitions. Easier on battery'],['off','','Off','No motion at all']].map(([v,e,t,x])=>`<button data-px="mot" data-v="${v}" class="${m===v?'act':''}"><div><b>${t}</b><small>${x}</small></div></button>`).join('')}</div><p class="sub" style="margin:8px 4px 0">${matchMedia('(prefers-reduced-motion: reduce)').matches?'Your device asks for reduced motion, so Off is the default here.':'Saved on this device.'}</p><div><button data-px="close" class="px-done">Done</button></div>`)}

/* ---------- network status ---------- */
const conn=()=>navigator.connection||navigator.mozConnection||navigator.webkitConnection;
const net={ms:null,failed:false,at:0,okAt:0,prev:null};
function netState(){if(net.failed||(!navigator.onLine&&Date.now()-net.okAt>6000))return'off';const c=conn();const slow=(net.ms&&net.ms>700)||(c&&(/(^|-)2g$/.test(c.effectiveType||'')||(c.downlink&&c.downlink<.4)));return slow?'slow':'ok'}
function renderNet(){const s=netState(),L={ok:'Online',slow:'Slow',off:navigator.onLine?'No internet':'Offline'}[s];
 $$('.netpill').forEach(p=>{p.dataset.s=s;const l=$('[data-net]',p),m=$('[data-ms]',p);if(l&&l.textContent!==L)l.textContent=L;if(m)m.textContent=s!=='off'&&net.ms?net.ms+'ms':''});
 if(net.prev&&net.prev!==s){if(s==='off')toast('You are offline. Downloaded songs still play.');else if(net.prev==='off')toast('Back online');}
 net.prev=s}
let seq=0,ctl=null;
async function ping(manual){ctl?.abort();const my=++seq,c=ctl=new AbortController(),t=performance.now(),id=setTimeout(()=>c.abort(),7000);let ms=null,failed=false;
 try{const r=await fetch('/logo-96.png?px=ping&t='+Date.now(),{cache:'no-store',signal:c.signal});if(!r.ok)throw 0;await r.arrayBuffer();ms=Math.round(performance.now()-t)}catch{failed=true}finally{clearTimeout(id)}
 if(my!==seq)return;ctl=null;net.ms=ms;net.failed=failed;if(!failed)net.okAt=Date.now();net.at=Date.now();renderNet();if(manual&&$('#dlg').open&&$('#dlg [data-netdlg]'))openNet()}
function openNet(){const c=conn(),s=netState(),L={ok:'Online',slow:'Slow connection',off:net.failed&&navigator.onLine?'Connected, but no internet':'Offline'}[s];
 const kv=(k,v)=>`<div class="px-kv"><span>${k}</span><b>${esc(v)}</b></div>`,na='Not reported by this browser';
 dlg(`<h3 data-netdlg>Network</h3><div class="px-net" data-s="${s}"><i class="nd"></i><b>${L}</b></div>${kv('Latency',net.ms?net.ms+' ms':'–')}${kv('Connection type',c?.effectiveType?c.effectiveType.toUpperCase()+(c.type?' · '+c.type:''):na)}${kv('Download speed',c?.downlink?c.downlink+' Mbps':na)}${kv('Browser RTT',c?.rtt!=null?c.rtt+' ms':na)}${kv('Data saver',c?(c.saveData?'On':'Off'):na)}${kv('Last checked',net.at?new Date(net.at).toLocaleTimeString():'–')}<div><button data-px="nettest" class="px-done alt">Test again</button></div><div><button data-px="close" class="px-done">Done</button></div>`)}
addEventListener('online',()=>ping());addEventListener('offline',()=>{net.okAt=0;renderNet();ping()});
conn()?.addEventListener?.('change',()=>ping());
document.addEventListener('visibilitychange',()=>{if(!document.hidden)ping()});
setInterval(()=>{if(document.hidden)return;if(netState()==='off'||Date.now()-net.at>20000)ping();else renderNet()},4000);

/* ---------- XP, level, rank, listening stats (all local) ---------- */
const def=()=>({xp:0,secs:0,plays:0,days:{},hours:Array(24).fill(0),artists:{},first:Date.now(),bonus:'',moods:{}});
let ST=Object.assign(def(),jget('cl_stats',{}));if(!Array.isArray(ST.hours)||ST.hours.length!==24)ST.hours=Array(24).fill(0);
const levelOf=xp=>Math.floor(Math.sqrt(xp/40))+1,xpAt=l=>40*(l-1)**2;
const RANKS=[[1,'','Bronze'],[5,'','Silver'],[10,'','Gold'],[18,'','Platinum'],[28,'','Diamond'],[40,'','Legend']];
const TITLES=[[1,'Listener'],[3,'Groover'],[6,'Vibe Seeker'],[10,'Melody Maker'],[15,'Beat Master'],[25,'Maestro'],[40,'Music Legend']];
const at=(t,l)=>t.filter(x=>x[0]<=l).pop();
function info(){const xp=Math.floor(ST.xp),l=levelOf(xp),lo=xpAt(l),hi=xpAt(l+1),rk=at(RANKS,l),nr=RANKS.find(r=>r[0]>l);return{xp,l,lo,hi,pct:Math.min(100,Math.max(0,(ST.xp-lo)/(hi-lo)*100)),rk,nr,title:at(TITLES,l)[1],toNext:hi-xp}}
function streak(){const ds=Object.keys(ST.days).filter(k=>ST.days[k]>=60).sort();let best=0,run=0,prev=null;for(const k of ds){const d=Date.parse(k);run=prev&&Math.round((d-prev)/864e5)===1?run+1:1;best=Math.max(best,run);prev=d}let cur=0;const d=new Date();if(!(ST.days[day(d)]>=60))d.setDate(d.getDate()-1);while(ST.days[day(d)]>=60){cur++;d.setDate(d.getDate()-1)}return{cur,best}}
const topArtist=()=>Object.entries(ST.artists).filter(x=>x[1]>=60).sort((a,b)=>b[1]-a[1])[0]?.[0]||'';
const track=()=>CL.S.q[CL.S.i];
let last=performance.now(),curId=null,acc=0,counted=false,dirty=false;
function gain(n){const l0=levelOf(ST.xp);ST.xp+=n;dirty=true;const i=info();if(i.l>l0)toast(`Level up! Lv ${i.l} · ${i.title} `)}
au.addEventListener('timeupdate',()=>{const n=performance.now(),dt=(n-last)/1000;last=n;if(au.paused||dt<=0||dt>3)return;
 const d=new Date(),k=day(d);ST.secs+=dt;ST.days[k]=(ST.days[k]||0)+dt;ST.hours[d.getHours()]+=dt;
 const t=track();if(t){const a=first(t.artist);if(a)ST.artists[a]=(ST.artists[a]||0)+dt;if(t.id!==curId){curId=t.id;acc=0;counted=false}acc+=dt;if(!counted&&acc>=20){counted=true;ST.plays++}}
 gain(dt/10);
 if(ST.bonus!==k&&ST.days[k]>=30){ST.bonus=k;const b=10*Math.min(Math.max(streak().cur,1),7);gain(b);toast(`+${b} XP daily streak bonus `)}});
au.addEventListener('ended',()=>{if(acc>=30)gain(5)});
const save=()=>{if(dirty){jset('cl_stats',ST);dirty=false}};
setInterval(save,5000);addEventListener('pagehide',save);document.addEventListener('visibilitychange',()=>{if(document.hidden)save()});

const LIVE={xp:i=>i.xp.toLocaleString()+' XP',lvl:i=>i.l,title:i=>i.title,rank:i=>i.rk[2],lvtxt:i=>`Lv ${i.l} · ${i.title}`,chip:i=>`${i.rk[2]} · Lv ${i.l} · ${i.xp.toLocaleString()} XP`,
 next:i=>`${i.toNext.toLocaleString()} XP to Lv ${i.l+1}`+(i.nr?` · ${i.nr[1]} ${i.nr[2]} at Lv ${i.nr[0]}`:' · top rank reached'),today:()=>fmtD(ST.days[day()]||0),total:()=>fmtD(ST.secs),plays:()=>ST.plays};
function live(){const i=info();$$('[data-live]').forEach(e=>{const v=LIVE[e.dataset.live]?.(i);if(v!=null&&e.textContent!==String(v))e.textContent=v});
 $$('.px-ring').forEach(r=>r.style.setProperty('--p',i.pct.toFixed(1)));$$('.px-bar i').forEach(b=>b.style.width=i.pct.toFixed(1)+'%')}

/* ---------- clock ---------- */
const t0=Date.now();
function tickClock(){const c=$('#pxClock');if(!c)return;const n=new Date(),h12=jget('cl_clk12',false);
 c.textContent=n.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:h12});
 const d=$('#pxDate');if(d)d.textContent=n.toLocaleDateString([],{weekday:'long',day:'numeric',month:'long',year:'numeric'});
 const s=$('#pxSess');if(s)s.textContent=fmtD((Date.now()-t0)/1000);
 const g=$('#pxGreet');if(g){const h=n.getHours();g.textContent=h<5?'Late night vibes ':h<12?'Good morning ':h<17?'Good afternoon ':h<21?'Good evening ':'Good night '}}
setInterval(()=>{if(document.hidden)return;tickClock();live()},1000);

/* ---------- moods ---------- */
const MOODS=[
 ['happy','','Happy',['hindi happy songs','feel good bollywood songs','upbeat hindi hits'],1],
 ['sad','','Sad',['hindi sad songs','emotional bollywood songs','sad love songs hindi'],1],
 ['romantic','','Romantic',['hindi romantic songs','bollywood love songs','romantic hindi hits'],1],
 ['energetic','','Energetic',['high energy bollywood songs','hindi workout songs','punjabi energetic songs'],1],
 ['chill','','Chill',['lofi hindi songs','chill bollywood songs','acoustic hindi songs'],1],
 ['focus','','Focus',['focus music','study lofi beats','instrumental focus music'],0],
 ['party','','Party',['hindi party songs','punjabi party hits','bollywood dance hits'],1],
 ['heartbreak','','Heartbreak',['hindi heartbreak songs','breakup songs hindi','bewafa songs'],1],
 ['devotional','','Devotional',['devotional bhajan','krishna bhajan','aarti songs'],0],
 ['nostalgic','','Nostalgic',['90s hindi hits','retro bollywood classics','old hindi songs'],1],
 ['sleepy','','Sleepy',['sleep music','soft hindi lullaby songs','calm instrumental music'],0],
 ['workout','','Workout',['workout songs','gym motivation songs','hindi gym songs'],1]];
const moodCache={};
async function recommend(id,fresh){const M=MOODS.find(x=>x[0]===id);if(!M)return[];if(!fresh&&moodCache[id])return moodCache[id];
 const qs=shuffle(M[3]).slice(0,2),ta=M[4]?topArtist():'';if(ta)qs.push(`${ta} ${M[2].toLowerCase()} songs`);
 const res=await Promise.all(qs.map(q=>CL.searchAll(q).then(r=>shuffle(r.list.slice(0,16))).catch(()=>[])));
 const seen=new Set(),out=[];for(let i=0;out.length<24;i++){let any=false;for(const l of res)if(i<l.length){any=true;const t=l[i];if(!seen.has(t.id)){seen.add(t.id);out.push(t)}}if(!any)break}
 out.ta=ta;moodCache[id]=out;return out}
async function showMood(id,fresh){const box=$('#pxMoodRes'),M=MOODS.find(x=>x[0]===id);if(!box||!M)return;
 $$('.px-md button').forEach(b=>b.classList.toggle('act',b.dataset.v===id));
 box.innerHTML='<div class="sk" style="height:56px;margin:8px 0"></div>'.repeat(4);
 const l=await recommend(id,fresh);if(!$('#pxMoodRes')||$('.px-md button.act')?.dataset.v!==id)return;
 if(!l.length){box.innerHTML='<p class="sub">Could not load songs for this mood. Check your connection and try again.</p><button class="px-pill" data-px="mood" data-v="'+id+'" data-fresh="1">Retry</button>';return}
 box.innerHTML=`<div class="px-mh"><div><b>${M[1]} ${M[2]} picks</b><div class="sub">${l.length} songs${l.ta?' · includes '+esc(l.ta)+' (your top artist)':''}</div></div></div><div class="px-act"><button class="px-pill pri" data-px="mplay">▶ Play all</button><button class="px-pill" data-px="mshuf">⇄ Shuffle</button><button class="px-pill" data-px="mnew">↻ New picks</button></div>`+CL.rows(l)}
async function pickMood(id,fresh){const k=day();jset('cl_mood',{m:id,d:k});if(!ST.moods[k]){ST.moods[k]=id;gain(5);toast('+5 XP for your mood check-in')}else ST.moods[k]=id;const M=MOODS.find(x=>x[0]===id);$$('[data-live="mood"]').forEach(e=>e.textContent=M?M[1]+' '+M[2]:'–');await showMood(id,fresh)}

/* ---------- profile ---------- */
function lastDays(n){const out=[];for(let i=n-1;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);out.push([d,ST.days[day(d)]||0])}return out}
async function profile(m){const hd=$('.pbg',m);if(!hd||$('.px-prof',m))return;const box=document.createElement('div');box.className='px-prof';hd.after(box);
 const[lk,pl]=await Promise.all([all('liked').catch(()=>[]),all('playlists').catch(()=>[])]);if(!box.isConnected)return;
 const i=info(),s=streak(),wk=lastDays(7),mx=Math.max(60,...wk.map(x=>x[1])),wsum=wk.reduce((a,x)=>a+x[1],0),ph=ST.hours.indexOf(Math.max(...ST.hours)),md=jget('cl_mood',null),mm=md&&md.d===day()?MOODS.find(x=>x[0]===md.m):null,ta=Object.entries(ST.artists).sort((a,b)=>b[1]-a[1])[0]?.[0];
 const st=(k,v,id)=>`<div class="px-st"><small>${k}</small><b${id?` data-live="${id}"`:''}>${esc(v)}</b></div>`;
 box.innerHTML=`<section class="px-card px-xp"><div class="px-ring" style="--p:${i.pct.toFixed(1)}"><b data-live="lvl">${i.l}</b><small>LEVEL</small></div><div class="px-xi"><div class="px-rk" data-live="rank">${i.rk[2]}</div><div class="px-tt" data-live="title">${esc(i.title)}</div><div class="px-xv"><b data-live="xp">${i.xp.toLocaleString()} XP</b></div><div class="px-bar"><i style="width:${i.pct.toFixed(1)}%"></i></div><div class="sub" data-live="next">${LIVE.next(i)}</div></div></section>`
 +`<section class="px-card px-clk"><div class="px-ct"><span id="pxGreet"></span><button class="px-pill" data-px="clk" aria-label="Switch 12 or 24 hour clock">12/24h</button></div><div class="px-big" id="pxClock">--:--:--</div><div class="sub" id="pxDate"></div><div class="px-cs"><div><small>Listened today</small><b data-live="today">${fmtD(ST.days[day()]||0)}</b></div><div><small>In app now</small><b id="pxSess">0s</b></div><div><small>Mood today</small><b data-live="mood">${mm?mm[1]+' '+mm[2]:'–'}</b></div></div></section>`
 +`<section class="px-card"><h3>How are you feeling?</h3><p class="sub" style="margin:0 0 12px">Pick a mood and we will line up songs for it.</p><div class="px-md">${MOODS.map(x=>`<button data-px="mood" data-v="${x[0]}">${x[2]}</button>`).join('')}</div><div id="pxMoodRes"></div></section>`
 +`<section class="px-card"><h3>Listening stats</h3><div class="px-sg">${st('Today',fmtD(ST.days[day()]||0),'today')}${st('This week',fmtD(wsum))}${st('All time',fmtD(ST.secs),'total')}${st('Songs played',String(ST.plays),'plays')}${st('Streak',`${s.cur}d · best ${s.best}d`)}${st('Peak hour',ST.secs>60?new Date(2000,0,1,ph).toLocaleTimeString([],{hour:'numeric'}):'–')}${st('Top artist',ta||'–')}${st('Liked songs',String(lk.length))}${st('Playlists',String(pl.length))}${st('Member since',new Date(ST.first).toLocaleDateString([],{day:'numeric',month:'short',year:'numeric'}))}</div><h4>Last 7 days</h4><div class="px-ch">${wk.map(([d,v],n)=>`<div class="${n===6?'tod':''}" title="${fmtD(v)}"><i style="height:${Math.max(4,v/mx*100)}%"></i><span>${d.toLocaleDateString([],{weekday:'narrow'})}</span></div>`).join('')}</div></section>`
 +`<details class="px-card px-how"><summary>How XP works</summary><ul><li>Listening: 1 XP for every 10 seconds</li><li>Finishing a song: +5 XP</li><li>First listen of the day: streak bonus up to +70 XP</li><li>Mood check-in: +5 XP once a day</li></ul><p class="sub">Levels need more XP as you climb. Rank goes Bronze, Silver, Gold, Platinum, Diamond, Legend. Everything is stored on this device only.</p><button class="px-pill" data-px="reset">Reset stats</button></details>`;
 $('.prow h1',m)?.insertAdjacentHTML('afterend','<div class="px-chip" data-live="chip">'+LIVE.chip(i)+'</div>');
 tickClock();if(md&&md.d===day())showMood(md.m)}
function syncHome(){renderNet();live()}
const main=$('#main');
new MutationObserver(()=>{syncHome();if(location.hash==='#profile')profile(main)}).observe(main,{childList:true});
if(location.hash==='#profile')profile(main);

/* ---------- clicks ---------- */
document.addEventListener('click',e=>{const t=e.target.closest('[data-px]');if(!t)return;const a=t.dataset.px,v=t.dataset.v;
 if(a==='net')openNet();else if(a==='nettest')ping(true);else if(a==='theme')openTheme();else if(a==='anim')openAnim();else if(a==='close')$('#dlg').close();
 else if(a==='mode')setTheme(v);else if(a==='acc')setAccent(v);else if(a==='mot')setMotion(v);
 else if(a==='mood')pickMood(v,!!t.dataset.fresh);
 else if(a==='mplay'||a==='mshuf'){const id=$('.px-md button.act')?.dataset.v,l=moodCache[id];if(l?.length)CL.play(a==='mshuf'?shuffle(l):l,0)}
 else if(a==='mnew'){const id=$('.px-md button.act')?.dataset.v;if(id)showMood(id,true)}
 else if(a==='clk'){jset('cl_clk12',!jget('cl_clk12',false));tickClock()}
 else if(a==='reset'){if(confirm('Reset XP, level and listening stats on this device?')){ST=def();dirty=true;save();const m=$('#main');$('.px-prof',m)?.remove();profile(m)}}});

const noSet=()=>{if(location.hash==='#settings')location.hash='home'};noSet();addEventListener('hashchange',noSet);
ping();renderNet();live();
