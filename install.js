// Spotify: install popup (24 h snooze) + permanent install banner on Home.
const $=s=>document.querySelector(s),CL=window.CL;
const standalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
const ios=/iphone|ipad|ipod/i.test(navigator.userAgent);
const KEY='cl_ipx',DAY=24*3600*1000;
const done=()=>localStorage.cl_installed==='1';
addEventListener('appinstalled',()=>{localStorage.cl_installed='1';$('#ipop')?.remove();document.querySelectorAll('.ibn').forEach(x=>x.remove())});
const steps=()=>ios?'Safari me <b>Share</b> dabao, phir <b>Add to Home Screen</b>.':'Browser ke <b>⋮ menu</b> me <b>Install app</b> ya <b>Add to Home screen</b> chuno.';
async function install(){
 const e=window.__dip;
 if(e){try{e.prompt();const r=await e.userChoice;window.__dip=null;if(r.outcome==='accepted'){localStorage.cl_installed='1';return true}}catch{}return false}
 return 'manual';
}
function popup(){
 if($('#ipop')||standalone()||done())return;
 const d=document.createElement('div');d.id='ipop';
 d.innerHTML=`<div class="ipb"></div><div class="ips" role="dialog" aria-label="Install app"><img src="/logo-96.png" alt="" width="64" height="64"><h3>Install Spotify</h3><p>App ki tarah full-screen chalao, tez load ho aur background me gaane bajte rahein.</p><div class="ipm" hidden></div><button class="ipg" id="ipgo">⬇ Install app</button><button class="ipn" id="ipno">Not now</button><label class="ipc"><input type="checkbox" id="ipck" checked> Don't show again for 24 hours</label></div>`;
 document.body.appendChild(d);requestAnimationFrame(()=>d.classList.add('on'));
 const close=()=>{if($('#ipck')?.checked)localStorage[KEY]=Date.now();d.classList.remove('on');setTimeout(()=>d.remove(),250)};
 d.querySelector('.ipb').onclick=close;$('#ipno').onclick=close;
 $('#ipgo').onclick=async()=>{const r=await install();if(r===true){d.remove()}else if(r==='manual'){const m=d.querySelector('.ipm');m.innerHTML=steps();m.hidden=false}};
}
// permanent banner on Home
function banner(){
 if(standalone())return;const m=$('#main');if(!m||document.querySelector('.ibn'))return;
 const h=m.querySelectorAll('.chd');if(h.length<2)return;
 const b=document.createElement('button');b.className='ibn';b.type='button';
 b.innerHTML='<span class="ii"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11m0 0-5-5m5 5 5-5M5 20h14"/></svg></span><span class="it"><b>Download the app</b><small>Install Spotify on your phone</small></span><span class="ia">Install</span>';
 b.onclick=async()=>{const r=await install();if(r==='manual')popup2()};
 h[1].after(b);
}
function popup2(){localStorage.removeItem(KEY);popup();const m=document.querySelector('#ipop .ipm');if(m){m.innerHTML=steps();m.hidden=false}}
new MutationObserver(banner).observe($('#main'),{childList:true});banner();
// popup on open (once per 24 h unless snoozed)
const last=+localStorage[KEY]||0;
if(!standalone()&&!done()&&Date.now()-last>DAY)setTimeout(popup,1800);
