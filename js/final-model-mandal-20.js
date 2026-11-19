'use strict';
// Final user-approved visual model. Keep school data and state branding distinct.
(function(){
 const previousRender=render;
 function groupedSchoolNavigation(nav){
  const current=location.hash.slice(1)||'home';
  nav.replaceChildren();
  const navItems=[
    ['Home','home','హోమ్','होम'],
    ['Our School','school','మా పాఠశాల','हमारा विद्यालय'],
    ['Faculty','faculty','సిబ్బంది','शिक्षक'],
    ['Campus Gallery','gallery','క్యాంపస్ గ్యాలరీ','परिसर गैलरी'],
    ['194 Schools','directory','194 పాఠశాలలు','194 विद्यालय'],
    ['Student Portal','portal','విద్యార్థుల పోర్టల్','छात्र पोर्टल'],
    ['Contact Us','contact','సంప్రదించండి','संपर्क करें'],
    ['Apply ↗','admissions','దరఖాస్తు ↗','आवेदन ↗']
  ];
  for(const item of navItems){
    const title=lang==='te'?item[2]:(lang==='hi'?item[3]:item[0]);
    const target=item[1];
    const a=link(title,'#'+target);
    const isActive=(target===current)||
      (target==='portal'&&['students','strength','portal'].includes(current))||
      (target==='admissions'&&current==='admissions')||
      (target==='directory'&&current==='directory')||
      (target==='school'&&['about-us','campus'].includes(current));
    if(isActive)a.setAttribute('aria-current','page');
    nav.append(a);
  }
 }
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
  let schoolCodes=menuName.querySelector('.model-school-codes');
  if(!schoolCodes){
    schoolCodes=node('small',null,'model-school-codes');
    menuName.append(schoolCodes);
  }
  schoolCodes.replaceChildren(
    node('span','UDISE+ code: '+(schoolData?.udiseCode||'36131100206')),
    node('span','College code: '+(schoolData?.collegeCode||'15124'))
  );
  const activeTitle=schoolData?.settings?.schoolTitle||schoolData?.name;
  const sAddr=menuName.querySelector('span:not(.model-school-codes span)');
  if(sAddr&&schoolData?.address)sAddr.textContent=schoolData.address;
  if(activeTitle){
    const sTitle=menuName.querySelector('strong');
    if(sTitle)sTitle.textContent=activeTitle;
  }
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
  function getCleanGallery(gallery, data) {
    if (!Array.isArray(gallery)) return [];
    const facultyUrls = new Set();
    if (Array.isArray(data?.facultyList)) {
      data.facultyList.forEach(f => { if (f && f.photo_url) facultyUrls.add(String(f.photo_url).trim().toLowerCase()); });
    }
    if (data?.principalPhoto) facultyUrls.add(String(data.principalPhoto).trim().toLowerCase());
    if (data?.staffPhotos) {
      Object.values(data.staffPhotos).forEach(u => { if (u) facultyUrls.add(String(u).trim().toLowerCase()); });
    }
    return gallery.filter(photo => {
      if (!photo || (!photo.src && !photo.image_url)) return false;
      const s = String(photo.src || photo.image_url).trim().toLowerCase();
      if (facultyUrls.has(s)) return false;
      if (s.includes('/school-media/faculty/') || s.includes('/faculty/')) return false;
      const meta = ((photo.category || '') + ' ' + (photo.title || '')).toLowerCase();
      if (/^(faculty|teacher|staff|principal)/i.test(meta)) return false;
      return true;
    });
  }

  const isHome=(location.hash.slice(1)||'home')==='home';
  document.body.classList.toggle('model-home',isHome);
  const disclosure=masthead.querySelector('details');if(disclosure){disclosure.querySelectorAll('a').forEach(a=>{if(!a.dataset.closeMenu){a.dataset.closeMenu='true';a.addEventListener('click',()=>disclosure.open=false);}});}
  if(!isHome||!schoolData)return;
  const cleanGallery = getCleanGallery(schoolData.gallery, schoolData);
  const main=document.querySelector('#main');const oldHero=main.querySelector('.hero');
  if(oldHero){
    if(cleanGallery.length>0){
      const gallery=oldHero.querySelector('.illustration');
      oldHero.className='model-live-gallery';
      oldHero.replaceChildren(node('h2',lang==='te'?'ఫొటో గ్యాలరీ':'School Photo Gallery'));
      if(gallery)oldHero.append(gallery);
      main.append(oldHero);
    } else {
      oldHero.remove();
    }
  }
  if(main.querySelector('.model-campus-hero')){
    const highlights=main.querySelector('.model-photo-highlights');
    if(cleanGallery.length>0){
      if(highlights){
        const photosGrid=highlights.querySelector('.gallery-grid');
        if(photosGrid){
          photosGrid.replaceChildren();
          for(const photo of cleanGallery.slice(0,6))photosGrid.append(photoCard(photo));
        }
      }
    } else {
      document.querySelectorAll('.model-school-media, .model-photo-highlights, .model-live-gallery').forEach(el => el.remove());
    }
    const overview=main.querySelector('.model-school-overview');
    if(overview&&schoolData.principal){
      const existingPrinc=overview.querySelector('.principal-card');
      if(existingPrinc)existingPrinc.replaceWith(principalCard());
    }
    document.querySelectorAll('.model-latest-news, .news-bulletin-latest, [data-news-kind="latest"]').forEach(el => el.remove());
    const flash=main.querySelector('.model-flash-news');
    const validNotices = (Array.isArray(schoolData?.notices) ? schoolData.notices : []).filter(n => n && n.title && n.title.trim() && !String(n.id).startsWith('somaram-welcome-'));
    const validFlash = (Array.isArray(schoolData?.flashNews) ? schoolData.flashNews : []).filter(n => n && n.title && n.title.trim() && !String(n.id).startsWith('somaram-welcome-'));
    const hasNotices = validNotices.length > 0 || validFlash.length > 0;
    if(flash) {
      if(hasNotices && typeof renderNews==='function') renderNews(flash);
      else flash.remove();
    }
    if (!hasNotices) {
      document.querySelectorAll('.bulletin, .model-home-bulletin, .model-flash-news, .model-latest-news').forEach(el => el.remove());
    }
    return;
  }
  const hero=node('section',null,'model-campus-hero');const campus=node('img');campus.src=schoolData.campusPhotoUrl||'images/munagala-campus-blue-sky.jpg';campus.alt='Telangana Model School and Junior College, Somaram campus';campus.width=1868;campus.height=842;campus.fetchPriority='high';const badge=node('div',null,'model-campus-badge');badge.innerHTML='<span class="badge-dot"></span><span>PM SHRI · Telangana Model School &amp; Junior College, Somaram</span>';hero.append(campus,badge);main.prepend(hero);
  const overview=node('section',null,'model-school-overview');const intro=node('div');intro.append(node('span','OUR SCHOOL · మన పాఠశాల','eyebrow'),node('h2',lang==='te'?'విద్యతో ఎదుగుదల':'Learning today. Growing for tomorrow.'),node('p',lang==='te'?'కరీంనగర్ జిల్లాలోని సోమారం తెలంగాణ మోడల్ స్కూల్ & జూనియర్ కళాశాల విద్యార్థులకు స్వాగతం. విద్యా సమాచారం, సిబ్బంది, అభ్యాస వనరులు, పాఠశాల కార్యక్రమాలను తెలుసుకోండి.':'Welcome to our school community in Somaram, Karimnagar district. Explore academic information, meet our teaching team and discover resources that support every step of your learning journey.'),link('Explore our school →','#school','model-text-link'),link('Find a Model School →','#directory','model-text-link'));const stats=node('div',null,'model-school-stats');const statItems=[[lang==='te'?'6 - 12వ తరగతి':'Classes VI – XII',lang==='te'?'కో-ఎడ్యుకేషన్ & జూనియర్ కళాశాల':'High School & Junior College'],[lang==='te'?'ఇంగ్లీష్ మీడియం':'English Medium',lang==='te'?'రాష్ట్ర ప్రభుత్వ విద్యా ప్రమాణాలు':'State Curriculum & Quality Learning'],[lang==='te'?'సైన్స్ & ఐటీ ల్యాబ్స్':'Modern Labs & Library',lang==='te'?'డిజిటల్ తరగతులు & ప్రయోగశాలలు':'Science, Computer & STEM Facilities'],[lang==='te'?'100% ఉచిత విద్య':'Free Education',lang==='te'?'పాఠ్యపుస్తకాలు, యూనిఫాం & మధ్యాహ్న భోజనం':'Textbooks, Uniforms & Nutritious Meals']];for(const [num,lbl]of statItems){const card=node('div',null,'model-stat-card');card.append(node('span',num,'model-stat-num'),node('span',lbl,'model-stat-label'));stats.append(card);}intro.append(stats);const ppSection=typeof principalPressSection==='function'?principalPressSection():null;if(ppSection){overview.append(intro);overview.classList.add('intro-only');hero.after(ppSection,overview);}else{overview.append(principalCard(),intro);hero.after(overview);}
  if(cleanGallery.length>0){
    const highlights=node('section',null,'model-photo-highlights');
    highlights.append(node('h2',lang==='te'?'మన పాఠశాల ఫొటోలు':'Our School'));
    const photos=node('div',null,'gallery-grid');
    for(const photo of cleanGallery.slice(0,6))photos.append(photoCard(photo));
    highlights.append(photos);
    const media=node('div',null,'model-school-media');
    const live=main.querySelector('.model-live-gallery');
    if(live)media.append(live);
    media.append(highlights);
    overview.after(media);
  } else {
    document.querySelectorAll('.model-school-media, .model-photo-highlights, .model-live-gallery').forEach(el => el.remove());
  }
  document.querySelectorAll('.model-latest-news, .news-bulletin-latest, [data-news-kind="latest"]').forEach(el => el.remove());
  const validNotices=(Array.isArray(schoolData?.notices)?schoolData.notices:[]).filter(n=>n&&n.title&&n.title.trim()&&!String(n.id).startsWith('somaram-welcome-'));
  const validFlash=(Array.isArray(schoolData?.flashNews)?schoolData.flashNews:[]).filter(n=>n&&n.title&&n.title.trim()&&!String(n.id).startsWith('somaram-welcome-'));
  const hasNotices=validNotices.length>0||validFlash.length>0;
  if(hasNotices){
    const flash=node('div',null,'bulletin model-home-bulletin model-flash-news');
    flash.dataset.newsKind='flash';
    hero.after(flash);
    if(typeof renderNews==='function')renderNews(flash);
  } else {
    document.querySelectorAll('.bulletin, .model-home-bulletin, .model-flash-news, .model-latest-news').forEach(el => el.remove());
  }
 }
 render=function(){previousRender();finalSchoolModel();};
 finalSchoolModel();
})();