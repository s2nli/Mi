// Artwork / logo reliability: a failed image is retried a few times (slow network, cold CDN) before it is hidden,
// and images that failed while offline are retried automatically when the connection comes back.
const DELAYS=[700,2200,6000];
function retry(img){
  const n=img._rt||0;
  if(n>=DELAYS.length||!img.isConnected)return false;
  const src=img.currentSrc||img.getAttribute('src');
  if(!src||src.startsWith('data:')||src.startsWith('blob:'))return false;
  img._rt=n+1;
  /* the browser remembers a failed image per URL and would not even ask the network again, so retries carry a harmless ?_r=N */
  let next=src;try{const u=new URL(src,location.href);u.searchParams.set('_r',n+1);next=u.href}catch{}
  img._o=img._o||src;
  setTimeout(()=>{if(img.isConnected&&!(img.complete&&img.naturalWidth)){img.setAttribute('src',next)}},DELAYS[n]);
  return true;
}
// capture phase runs before the page's own onerror (which used to remove the image on the first failure)
addEventListener('error',e=>{
  const i=e.target;
  if(i&&i.tagName==='IMG'&&navigator.onLine!==false&&retry(i)){e.stopImmediatePropagation()}
},true);
addEventListener('load',e=>{if(e.target&&e.target.tagName==='IMG')e.target._rt=0},true);
function recover(){
  for(const i of document.images){
    if(i.getAttribute('src')&&i.complete&&!i.naturalWidth&&!i.src.startsWith('data:')&&!i.src.startsWith('blob:')){
      i._rt=0;try{const u=new URL(i._o||i.src,location.href);u.searchParams.set('_r','o'+Date.now()%1e6);i.setAttribute('src',u.href)}catch{}}
  }
}
addEventListener('online',()=>setTimeout(recover,500));
document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(recover,300)});
// artwork placeholders that were emptied by the old handler come back when the song changes
const art=document.querySelector('#art');
if(art)new MutationObserver(()=>{art._rt=0}).observe(art,{attributes:true,attributeFilter:['src']});
