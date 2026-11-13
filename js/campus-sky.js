(()=>{
 const selector='.final-campus-photo,.model-campus-hero',active=new Set();let pending=false;
 const resize=new ResizeObserver(entries=>{for(const entry of entries){const layer=entry.target.querySelector('.campus-sky-motion');if(layer)layer.style.setProperty('--cloud-travel',layer.clientWidth+'px');}});
 const visibility=new IntersectionObserver(entries=>{for(const entry of entries){const layer=entry.target.querySelector('.campus-sky-motion');if(layer)layer.dataset.visible=String(entry.isIntersecting);}},{threshold:0});
 function scan(){
  pending=false;
  for(const hero of active)if(!hero.isConnected){resize.unobserve(hero);visibility.unobserve(hero);active.delete(hero);}
  for(const hero of document.querySelectorAll(selector)){
   if(active.has(hero))continue;active.add(hero);
   if(!hero.querySelector('.campus-sky-motion')){
    const layer=document.createElement('div');layer.className='campus-sky-motion';layer.setAttribute('aria-hidden','true');
    for(let i=0;i<2;i++){const cloud=document.createElement('span');cloud.className='campus-cloud';layer.append(cloud);}hero.append(layer);
   }
   resize.observe(hero);visibility.observe(hero);
  }
 }
 const schedule=()=>{if(!pending){pending=true;requestAnimationFrame(scan);}};
 const sync=()=>document.documentElement.classList.toggle('campus-clouds-hidden',document.hidden);
 document.addEventListener('visibilitychange',sync);sync();scan();
 new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
})();
