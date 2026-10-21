// CODΞLYNX shell: mini-player progress, full-screen Now Playing, mobile nav + "More" sheet.
const $=s=>document.querySelector(s),{au,S}=window.CL,fmt=s=>isFinite(s)&&s>0?Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0'):'0:00';
const mobile=()=>!matchMedia('(min-width:900px)').matches,np=$('#np');
const set=(id,v)=>{const e=$(id);if(e&&e.textContent!==v)e.textContent=v};
function sync(){const t=S.q[S.i];set('#nptt',t?t.title:'Nothing playing');set('#npta',t?t.artist:'');const a=$('#npart');if(t?.artwork){if(a.getAttribute('src')!==t.artwork)a.src=t.artwork}else a.removeAttribute('src');
 set('#nplk',$('#lk').textContent);$('#nplk').classList.toggle('on',$('#lk').textContent==='♥');
 set('#nppp',au.paused?'▶':'⏸');np.classList.toggle('paused',au.paused);$('#npsh').classList.toggle('on',S.shuf);const r=$('#nprp');r.textContent=S.rep==='one'?'↻1':'↻';r.classList.toggle('on',S.rep!=='off')}
function prog(){const p=au.duration>0?au.currentTime/au.duration:0;$('#bar').style.setProperty('--p',p*100+'%');set('#npcu',fmt(au.currentTime));set('#npdu',fmt(au.duration));if(document.activeElement!==$('#npseek'))$('#npseek').value=p*1000}
['timeupdate','durationchange'].forEach(e=>au.addEventListener(e,prog));['play','pause','playing','waiting','loadstart','emptied'].forEach(e=>au.addEventListener(e,sync));
new MutationObserver(sync).observe($('#lk'),{childList:true});new MutationObserver(sync).observe($('#tt'),{childList:true});
$('#npseek').oninput=e=>{if(au.duration)au.currentTime=e.target.value/1000*au.duration};
for(const[a,b]of[['#nppp','#pp'],['#npnx','#nx'],['#nppv','#pv'],['#npsh','#sh'],['#nprp','#rp'],['#nplk','#lk']])$(a).onclick=()=>{$(b).click();sync()};
const open=v=>{np.classList.toggle('open',v);document.body.style.overflow=v?'hidden':'';if(v)sync()};
$('#barmeta').addEventListener('click',e=>{if(mobile()&&S.q[S.i]&&!e.target.closest('#lk'))open(true)});$('#npclose').onclick=()=>open(false);
$('#npql').onclick=()=>{open(false);$('#ql').click()};$('#nply').onclick=()=>{open(false);$('#ly').click()};
addEventListener('keydown',e=>{if(e.key==='Escape'){open(false);$('#more').classList.remove('show')}});
addEventListener('resize',()=>{if(!mobile())open(false)});
/* bottom nav + More sheet */
const more=$('#more'),list=$('#morelist');
document.querySelectorAll('#bnav button[data-v]').forEach(b=>b.onclick=()=>{$('#panel').classList.remove('show');open(false);location.hash==='#'+b.dataset.v?CL.route():location.hash=b.dataset.v});
$('#morebtn').onclick=()=>{list.innerHTML='';for(const b of $('#navx').children){const c=document.createElement('button');c.textContent=b.textContent;c.onclick=()=>{more.classList.remove('show');b.dataset.v?(location.hash=b.dataset.v):b.click()};list.append(c)}more.classList.add('show')};
more.onclick=e=>{if(e.target===more)more.classList.remove('show')};
addEventListener('hashchange',()=>{$('#panel').classList.remove('show');more.classList.remove('show')});
sync();prog();
