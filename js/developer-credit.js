// Preserve school footer content and make the developer's approved identity visible.
(()=>{
 const name='Chittiprolu Srinivasu';let queued=false;
 function apply(){queued=false;for(const footer of document.querySelectorAll('footer')){
  if(footer.querySelector("[data-developer-name]")||/Chittiprolu\s+Srinivasu/i.test(footer.innerText))continue;
  const leaves=[...footer.querySelectorAll('p,small,span,b,strong,div')].filter(e=>!e.children.length);
  const label=leaves.find(e=>/Designed\s*(?:&|and)\s*developed\s*by/i.test(e.textContent));
  const brand=leaves.find(e=>/veda\s*tech\s*tools/i.test(e.textContent));
  const author=document.createElement('strong');author.dataset.developerName='true';author.textContent=name;author.translate=false;author.className='notranslate';author.style.cssText='display:block;font-size:16px;font-weight:700;line-height:1.5;margin-top:5px;overflow-wrap:anywhere';
  if(label)label.append(author);else if(brand)brand.before(author);else{const credit=document.createElement('p');credit.className='developer-credit';credit.append('Designed & developed by',author);footer.append(credit);}
 }}
 function schedule(){if(!queued){queued=true;requestAnimationFrame(apply);}}
 new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});addEventListener('hashchange',schedule);schedule();
})();
