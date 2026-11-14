// School-independent staff presentation: double each element's original size once.
(()=>{
 const notes=new Set(['Based on the staff list supplied by the school.','పాఠశాల అందించిన సిబ్బంది జాబితా ఆధారంగా.','विद्यालय द्वारा दी गई कर्मचारी सूची के आधार पर।']);
 let queued=false;
 function apply(){queued=false;
  for(const p of document.querySelectorAll('p'))if(notes.has(p.textContent.trim()))p.remove();
  const main=document.querySelector('#main'),staticRoot=(location.hash.slice(1)==='faculty'&&main)?main:null;
  const heading=[...document.querySelectorAll('main h1,main h2')].find(h=>/^(?:Faculty(?: & Support Staff)?|Our Team|సిబ్బంది వివరాలు)$/i.test(h.textContent.trim()));
  const react=staticRoot?null:(document.querySelector('section#faculty')||heading?.closest('section')||heading?.closest('.content-page'));
  const root=staticRoot||react;if(!root)return;
  if(root.querySelector('.faculty-page-container,.faculty-grid'))return;
  root.dataset.teamReadable='true';
  const tables=[...root.querySelectorAll('table')];
  if(staticRoot&&typeof schoolData==='object'&&schoolData?.staffPhotos){const photos=schoolData.staffPhotos;for(const table of tables){if(table.querySelector('.staff-photo-cell'))continue;const rows=[...table.querySelectorAll('tbody tr')];if(!rows.some(r=>photos[r.cells[0]?.textContent.trim()]))continue;table.querySelector('thead tr')?.prepend(Object.assign(document.createElement('th'),{textContent:'Photo'}));for(const row of rows){const src=photos[row.cells[0]?.textContent.trim()],cell=document.createElement('td');cell.className='staff-photo-cell';if(src){const img=document.createElement('img');img.src=src;img.alt=row.cells[0].textContent;img.style.width='56px';img.style.height='70px';cell.append(img);}row.prepend(cell);}}}const targets=react?[...root.querySelectorAll('h3,h4,p,span,td,th')].filter(e=>!e.children.length&&e.textContent.trim()):tables.flatMap(t=>[...t.querySelectorAll('td,th,.staff-initials')]);
  const text=targets.filter(e=>!e.dataset.teamFont).map(e=>({e,size:parseFloat(getComputedStyle(e).fontSize)}));
  const photos=[...root.querySelectorAll(react?'img,.anaji-staff-grid article > span':'.staff-photo-cell img,.staff-initials')].filter(e=>!e.dataset.teamPhoto).map(e=>{const s=getComputedStyle(e),p=getComputedStyle(e.parentElement);return{e,width:parseFloat(s.width),height:parseFloat(s.height),parentWidth:parseFloat(p.width),parentHeight:parseFloat(p.height)};});
  for(const{e,size}of text)if(Number.isFinite(size)&&size>0){e.dataset.teamFont=String(size);e.style.setProperty('font-size',size*2+'px','important');e.style.setProperty('line-height','1.45','important');}
  for(const{e,width,height,parentWidth,parentHeight}of photos)if(width>0&&height>0){e.dataset.teamPhoto=width+'x'+height;e.style.setProperty('width',width*2+'px','important');e.style.setProperty('height',height*2+'px','important');e.style.setProperty('max-width','none','important');e.style.setProperty('flex-shrink','0','important');if(e.tagName==='IMG'&&!e.closest('td')){const parent=e.parentElement;if(parent.children.length===1&&Math.abs(parentWidth-width)<2&&Math.abs(parentHeight-height)<2){parent.style.width=width*2+'px';parent.style.height=height*2+'px';}parent.classList.add('team-photo-frame');}}
  for(const table of tables){const wrap=table.closest('.table-scroll')||table.parentElement;wrap.dataset.teamScroll='true';if(!wrap.hasAttribute('tabindex'))wrap.tabIndex=0;}
 }
 function schedule(){if(!queued){queued=true;requestAnimationFrame(apply);}}
 new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
 addEventListener('hashchange',schedule);addEventListener('tgms-content',schedule);document.addEventListener('load',event=>{if(event.target?.tagName==='IMG')schedule();},true);schedule();
})();
