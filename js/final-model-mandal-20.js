'use strict';
// Final user-approved visual model. Keep school data and state branding distinct.
(function(){
 const previousRender=render;
 function groupedSchoolNavigation(nav){
  const current=location.hash.slice(1)||'home';nav.replaceChildren();
  const groups=[['Home','home'],['Our School',[['Our school','school'],['About us','about-us'],['Faculty','faculty'],['School strength','strength'],['Campus & labs','campus'],['School directory','directory'],['Administration','admin']]],['Academics',[['Academic programmes','academics'],['Academic calendar','calendar'],['Results','results']]],['Students',[['Student portal','portal'],['Books download','books'],['Downloads','downloads']]],['Admissions','admissions'],['Updates',[['Notice board','notices'],['Photo gallery','gallery'],['Events & activities','events'],['Achievements','achievements'],['Government orders','gos'],['Feedback','feedback']]],['Activities',[['Co-curricular','cocurricular'],['Extra-curricular','extracurricular'],['Innovation','innovation']]],['Contact us','contact']];
  function closeAll(){nav.querySelectorAll('.model-nav-panel').forEach(p=>p.hidden=true);nav.querySelectorAll('.model-nav-trigger').forEach(b=>b.setAttribute('aria-expanded','false'));}
  for(const [title,target]of groups){if(typeof target==='string'){const a=link(title,'#'+target);if(target===current)a.setAttribute('aria-current','page');nav.append(a);continue;}
   const wrap=node('div',null,'school-dropdown model-nav-group');const button=node('button',title+' ▾','model-nav-trigger');button.type='button';button.setAttribute('aria-expanded','false');if(target.some(x=>x[1]===current))button.classList.add('model-nav-current');const panel=node('div',null,'model-nav-panel');panel.hidden=true;panel.id='school-nav-'+title.toLowerCase().replaceAll(' ','-');button.setAttribute('aria-controls',panel.id);
   for(const [name,id]of target){const a=link(name,'#'+id);if(id===current)a.setAttribute('aria-current','page');a.addEventListener('click',closeAll);panel.append(a);}
   function open(){closeAll();panel.hidden=false;button.setAttribute('aria-expanded','true');const rect=button.getBoundingClientRect();panel.style.left=Math.max(8,Math.min(rect.left,innerWidth-256))+'px';panel.style.top=Math.min(rect.bottom+4,innerHeight-180)+'px';panel.style.maxHeight=Math.max(160,innerHeight-rect.bottom-20)+'px';}
   button.addEventListener('click',()=>{if(panel.hidden)open();else closeAll();});button.addEventListener('keydown',e=>{if(e.key==='ArrowDown'){e.preventDefault();open();panel.querySelector('a').focus();}});wrap.append(button,panel);nav.append(wrap);
  }
 }
 document.addEventListener('click',e=>{if(!e.target.closest('.model-nav-group')){document.querySelectorAll('.model-nav-panel').forEach(p=>p.hidden=true);document.querySelectorAll('.model-nav-trigger').forEach(b=>b.setAttribute('aria-expanded','false'));}});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){const active=document.querySelector('.model-nav-trigger[aria-expanded="true"]');document.querySelectorAll('.model-nav-panel').forEach(p=>p.hidden=true);document.querySelectorAll('.model-nav-trigger').forEach(b=>b.setAttribute('aria-expanded','false'));active?.focus();}});
 function finalSchoolModel(){
  document.body.classList.add('final-school-model');
  let header=document.querySelector('.state-model-header');
  if(!header){
   header=node('section',null,'state-model-header');header.setAttribute('aria-label','Government and school identity');
   const identity=node('div',null,'state-model-identity');const emblem=node('img');emblem.src='images/telangana-emblem-trimmed.svg';emblem.alt='Government of Telangana';emblem.width=76;emblem.height=76;
   const wording=node('div');wording.append(node('small','Government of Telangana'),node('span','School Education Department'),node('strong','Telangana Model Schools'),node('span','and Junior Colleges · Saidapur Mandal'));
   const rising=node('img');rising.src='images/telangana-rising.png';rising.alt='Telangana Rising';rising.className='state-rising';identity.append(emblem,wording,rising);
   const officials=node('div',null,'state-model-officials');
   for(const item of [
    ['Sri A. Revanth Reddy',"Honourable Chief Minister & Minister for Education",'images/cm-revanth-reddy.png'],
    ['Dr. Yogita Rana, IAS','Secretary to Government, Education Department','images/yogita-rana.jpeg'],
    ['Dr. E. Naveen Nicolas, IAS','Director of School Education','images/naveen-nicolas-user-20261016.jpg'],
    ['Sri Srinivasa Chary','Additional Director, TG Model Schools','images/srinivasa-chary.jpg']
   ]){const card=node('article',null,'state-official');if(item[2]){const photo=node('img');photo.src=item[2];photo.alt=item[0];photo.width=64;photo.height=64;const frame=node('span',null,'official-photo-frame');if(item[0]==='Sri A. Revanth Reddy')frame.classList.add('chief-minister-frame');frame.append(photo);card.append(frame);}else{const badge=node('span','SC','official-initials');badge.setAttribute('aria-label','Photograph awaiting a verified clear source');badge.title='Photograph awaiting a verified clear source';card.append(badge);}card.append(node('b',item[0]),node('small',item[1]));officials.append(card);}
   header.append(identity,officials);document.querySelector('.masthead').before(header);
  }
  const masthead=document.querySelector('.masthead');
  let menuName=masthead.querySelector('.model-menu-school-name');
  if(!menuName){
    menuName=node('div',null,'model-menu-school-name');
    menuName.append(node('strong','Telangana Model School & Junior College'),node('span','Somaram (Village), Saidapur Mandal · Karimnagar District'));
    masthead.prepend(menuName);
  }
  const schoolCodes=menuName.querySelector('.model-school-codes');
  if(!schoolCodes){
    const codes=node('small',null,'model-school-codes');
    codes.append(node('span','UDISE+ code: '+(schoolData?.udiseCode||'36301200719')),node('span','College code: '+(schoolData?.collegeCode||'52015')));
    menuName.append(codes);
  }
  const sheetSchoolTitle=schoolData?.settings?.schoolTitle;
  if(sheetSchoolTitle)menuName.querySelector('strong').textContent=sheetSchoolTitle;
  const directLanguages=masthead.querySelector('.languages');
  if(directLanguages){
    directLanguages.classList.add('model-direct-languages');
    menuName.after(directLanguages);
  }
  const visibleTabs=document.querySelector('#menu');
  if(visibleTabs){
    masthead.append(visibleTabs);
    groupedSchoolNavigation(visibleTabs);
  }
  const isHome=(location.hash.slice(1)||'home')==='home';
  document.body.classList.toggle('model-home',isHome);
  const disclosure=masthead.querySelector('details');if(disclosure){disclosure.querySelectorAll('a').forEach(a=>{if(!a.dataset.closeMenu){a.dataset.closeMenu='true';a.addEventListener('click',()=>disclosure.open=false);}});}
  if(!isHome||!schoolData)return;
  const main=document.querySelector('#main');const oldHero=main.querySelector('.hero');if(oldHero){const gallery=oldHero.querySelector('.illustration');oldHero.className='model-live-gallery';oldHero.replaceChildren(node('h2',lang==='te'?'ఫొటో గ్యాలరీ':'School Photo Gallery'));if(gallery)oldHero.append(gallery);main.append(oldHero);}
  if(main.querySelector('.model-campus-hero'))return;
  const hero=node('section',null,'model-campus-hero');const campus=node('img');campus.src=schoolData.campusPhotoUrl||'images/munagala-campus-blue-sky.jpg';campus.alt='Telangana Model School and Junior College, Somaram campus';campus.width=1868;campus.height=842;campus.fetchPriority='high';
  hero.append(campus);main.prepend(hero);
  const overview=node('section',null,'model-school-overview');const intro=node('div');intro.append(node('span','OUR SCHOOL · మన పాఠశాల','eyebrow'),node('h2',lang==='te'?'విద్యతో ఎదుగుదల':'Learning today. Growing for tomorrow.'),node('p',lang==='te'?'కరీంనగర్ జిల్లాలోని సోమారం తెలంగాణ మోడల్ స్కూల్ & జూనియర్ కళాశాల విద్యార్థులకు స్వాగతం. విద్యా సమాచారం, సిబ్బంది, అభ్యాస వనరులు, పాఠశాల కార్యక్రమాలను తెలుసుకోండి.':'Welcome to our school community in Somaram, Karimnagar district. Explore academic information, meet our teaching team and discover resources that support every step of your learning journey.'),link('Explore our school →','#school','model-text-link'),link('Find a Model School →','#directory','model-text-link'));const ppSection=typeof principalPressSection==='function'?principalPressSection():null;if(ppSection){overview.append(intro);overview.classList.add('intro-only');hero.after(ppSection,overview);}else{overview.append(principalCard(),intro);hero.after(overview);}const highlights=node('section',null,'model-photo-highlights');highlights.append(node('h2',lang==='te'?'మన పాఠశాల ఫొటోలు':'Our School'));const photos=node('div',null,'gallery-grid');for(const photo of (schoolData.gallery||[]).slice(0,6))photos.append(photoCard(photo));highlights.append(photos);const media=node('div',null,'model-school-media');const live=main.querySelector('.model-live-gallery');if(live)media.append(live);media.append(highlights);overview.after(media);const flash=node('div',null,'bulletin model-home-bulletin model-flash-news');flash.dataset.newsKind='flash';hero.after(flash);renderNews(flash);const latest=node('div',null,'bulletin model-home-bulletin model-latest-news');latest.dataset.newsKind='latest';flash.after(latest);renderNews(latest);
 }
 render=function(){previousRender();finalSchoolModel();};
 finalSchoolModel();
})();