var SOMARAM_DEFAULT_DATA = window.SOMARAM_DEFAULT_DATA || {"principal":{"name":"Dr.Bandari Sampath Kumar","email":"tgmssomaram.knr@gmail.com","phone":"08727-285222","designation":"Principal FAC","qualification":"Phd in chemistry, B.Ed."},"address":"Somaram (Village), Saidapur Mandal, Karimnagar District, Telangana – 505490","faculty":[["Dr.Bandari Sampath Kumar","Principal FAC / Chemistry","Phd in chemistry, B.Ed."],["B.Kumar","Vice principal / Botany","M.Sc., B.Ed."],["Bandi Saidulu","PGT Botany / Botany","M.Sc., B.Ed., SET"],["Kondeti Saidulu","PGT English / English","M.A., B.Ed."]],"guest":[],"vocational":[],"support":[],"gallery":[],"mapUrl":"https://maps.google.com/maps?q=18.240000,79.300000","coordinates":{"lat":18.24,"lng":79.3},"notices":[],"downloads":[],"calendarFeedUrl":"https://calendar.google.com/calendar/ical/9b6bd89b931449c6dab271ec3d5ec995dbb2a8235139220258a8161a39805386%40group.calendar.google.com/public/basic.ics","udiseCode":"36131100206","collegeCode":"15124","showAdmissionSeats":false,"settings":{"schoolTitle":"Telangana Model School & Junior College, Somaram","teluguTitle":"తెలంగాణ మోడల్ స్కూల్ & జూనియర్ కళాశాల, సోమారం","authority":"School Education Department, Govt. of Telangana","welcomeTitle":"Welcome to TGMS Somaram","welcomeDescription":"A place to learn, explore and grow. Discover school information, educational resources and opportunities to connect with our learning community.","gradientStart":"#fff0df","gradientEnd":"#ff983f","youtubeUrl":""},"flashNews":[],"facultyList":[{"id":"9a47356c-ef35-4df0-b472-d12bdc574277","name":"Dr.Bandari Sampath Kumar","designation":"Principal FAC","subject":"Chemistry","qualification":"Phd in chemistry, B.Ed.","photo_url":"https://xnhwikekashrkjivimdb.supabase.co/storage/v1/object/public/school-media/faculty/1794656715779-1.dr-b-sampath-kumar.jpeg","order_index":0,"is_active":true},{"id":"60b5d262-af6e-4961-b65b-5b2d40d146d7","name":"B.Kumar","designation":"Vice principal","subject":"Botany","qualification":"M.Sc., B.Ed.","photo_url":"https://xnhwikekashrkjivimdb.supabase.co/storage/v1/object/public/school-media/faculty/1794656968120-7.-ch-mahender.jpeg","order_index":1,"is_active":true},{"id":"0d58d520-8f19-457e-94dd-09b7ccfa9598","name":"Bandi Saidulu","designation":"PGT Botany","subject":"Botany","qualification":"M.Sc., B.Ed., SET","photo_url":null,"order_index":4,"is_active":true},{"id":"a8140954-2c86-4f05-9563-196001e2dcd1","name":"Kondeti Saidulu","designation":"PGT English","subject":"English","qualification":"M.A., B.Ed.","photo_url":null,"order_index":12,"is_active":true}],"staffPhotos":{"Dr.Bandari Sampath Kumar":"https://xnhwikekashrkjivimdb.supabase.co/storage/v1/object/public/school-media/faculty/1794656715779-1.dr-b-sampath-kumar.jpeg","B.Kumar":"https://xnhwikekashrkjivimdb.supabase.co/storage/v1/object/public/school-media/faculty/1794656968120-7.-ch-mahender.jpeg"},"principalPhoto":"https://xnhwikekashrkjivimdb.supabase.co/storage/v1/object/public/school-media/faculty/1794656715779-1.dr-b-sampath-kumar.jpeg","strength":{"year":"2026–27","groups":[{"title":"School · Classes VI–X","rows":[["VI",48,33],["VII",55,21],["VIII",63,34],["IX",51,46],["X",55,39]]},{"title":"Junior College · First Year (Intermediate)","rows":[["MPC",18,28],["BiPC",4,37],["CEC",15,16],["ACE",7,10]]},{"title":"Junior College · Second Year (Intermediate)","rows":[["MPC",16,33],["BiPC",0,39],["CEC",15,11]]}],"sections":[["IX A",49],["IX B",50],["X A",46],["X B",48],["I CEC",31],["II CEC",25]]},"alumni":[],"principalPress":{"title":"Principal’s Message","teluguTitle":"ప్రిన్సిపాల్ సందేశం","text":"Welcome to Telangana Model School & Junior College, Somaram. Our institution is dedicated to nurturing young minds with high-quality English medium education, modern scientific inquiry, and strong ethical values. With modern laboratories, digital classrooms, and 100% free education provided by the Government of Telangana, we empower every student to achieve excellence.","teluguText":"","importantTitle":"Principal FAC · Dr. Bandari Sampath Kumar","importantText":"100% Free Education & admissions active.","image":"","imageAlt":"","imageCaption":"","links":[]}};
const navMenu=[['home','Home','హోమ్','होम'],['school','Our School','మా పాఠశాల','हमारा विद्यालय'],['faculty','Faculty','సిబ్బంది','शिक्षक'],['directory','194 Schools','194 పాఠశాలలు','194 विद्यालय'],['portal','Student Portal','విద్యార్థుల పోర్టల్','छात्र पोर्टल'],['admissions','Apply ↗','దరఖాస్తు ↗','आवेदन ↗'],['gallery','Campus Gallery','క్యాంపస్ గ్యాలరీ','परिसर गैलरी'],['contact','Contact Us','సంప్రదించండి','संपर्क करें']];
const menu=[['home','Home','హోమ్','होम'],['school','Our School','మా పాఠశాల','हमारा विद्यालय'],['faculty','Faculty','సిబ్బంది','शिक्षक'],['portal','Students','విద్యార్థులు','छात्र'],['gallery','Campus Gallery','క్యాంపస్ గ్యాలరీ','परिसर गैलरी'],['contact','Contact Us','సంప్రదించండి','संपर्क करें'],['students','Students','విద్యార్థులు','छात्र'],['achievements','Achievements','విజయాలు','उपलब्धियाँ'],['results','Results','ఫలితాలు','परिणाम'],['academics','Academics','విద్య','शिक्षा'],['calendar','Academic calendar','విద్యా క్యాలెండర్','शैक्षणिक कैलेंडर'],['admissions','Admissions','ప్రవేశాలు','ప్రవేశ'],['notices','Notice board','ప్రకటనలు','सूचना पट्ट'],['about-us','About us','మా గురించి','हमारे बारे में'],['strength','School strength','విద్యార్థుల సంఖ్య','छात्र संख्या'],['campus','Campus & labs','ప్రాంగణం & ల్యాబ్‌లు','परिसर एवं प्रयोगशालाएँ'],['events','Events & activities','కార్యక్రమాలు','कार्यक्रम'],['books','Books download','పుస్తకాలు','पुस्तकें'],['downloads','Downloads','డౌన్‌లోడ్స్','डाउनलोड'],['admin','Administration','అడ్మినిస్ట్రేషన్','प्रशासन'],['directory','School directory','పాఠశాలల వివరాలు','विद्यालय सूची']];
const text={en:{preview:'WEBSITE PREVIEW · School details awaiting confirmation',school:'Telangana Model School & Junior College, Somaram',location:'Somaram · Telangana',tag:'LEARN · EXPLORE · GROW',latest:'LATEST',news:'School-approved announcements and important dates will appear here.',footer:'Telangana Model School & Junior College, Somaram',about:'About us',contact:'Contact us',privacy:'Privacy policy',close:'Close',draft:'School photos, contact details, enrolment and staff information will be added after confirmation.',privacyBody:'This preview does not collect student information. External educational websites follow their own privacy policies. Do not send identity documents, student records, passwords or payment information through this preview.',pending:'School-approved details will be added here once the school confirms them.',welcome:'Welcome to',intro:'A place to learn, explore and grow. Discover school information, educational resources and opportunities to connect with our learning community.',explore:'Explore academics',more:'About our school',illustration:'CAMPUS ILLUSTRATION · SCHOOL PHOTOGRAPH TO BE ADDED',learning:'Learning. Opportunity. Community.',learningBody:'This website is being prepared for Telangana Model School & Junior College, Somaram. The final school profile, photographs and updates will be added after review by the school.',vision:'Our vision',visionBody:'To encourage curious, confident and responsible learners who are prepared for continued education and lifelong learning.',mission:'Our mission',missionBody:'To support understanding, creativity, communication, teamwork and respect through purposeful learning.',review:'This introduction is a draft for school review.',admin:'Administrator accounts and publishing will be configured after school ownership and handover details are confirmed.'},te:{preview:'వెబ్‌సైట్ ప్రివ్యూ · పాఠశాల వివరాల ధృవీకరణ పెండింగ్',school:'తెలంగాణ మోడల్ స్కూల్ & జూనియర్ కళాశాల, సోమారం',location:'సోమారం · తెలంగాణ',tag:'నేర్చుకోండి · అన్వేషించండి · ఎదగండి',latest:'తాజా సమాచారం',news:'పాఠశాల ఆమోదించిన ప్రకటనలు, ముఖ్యమైన తేదీలు ఇక్కడ చూపిస్తాము.',footer:'తెలంగాణ మోడల్ స్కూల్ & జూనియర్ కళాశాల, సోమారం',about:'మా గురించి',contact:'సంప్రదించండి',privacy:'గోప్యతా విధానం',close:'మూసివేయండి',draft:'లోగో, ఫొటోలు, సిబ్బంది, విద్యార్థుల వివరాలు పాఠశాల ధృవీకరణ తర్వాత జోడిస్తాము.',privacyBody:'ఈ ప్రివ్యూలో విద్యార్థుల సమాచారం సేకరించము. వ్యక్తిగత పత్రాలు, పాస్‌వర్డ్‌లు, చెల్లింపు వివరాలు పంపవద్దు.',pending:'పాఠశాల ధృవీకరించిన వివరాలు త్వరలో జోడిస్తాము.',welcome:'స్వాగతం',intro:'నేర్చుకోవడానికి, అన్వేషించడానికి, ఎదగడానికి ఒక వేదిక. పాఠశాల సమాచారం, విద్యా వనరులు, కార్యక్రమాలు తెలుసుకోండి.',explore:'విద్యా వివరాలు',more:'మా పాఠశాల గురించి',illustration:'నమూనా భవనం · అసలు పాఠశాల ఫొటో జోడించాలి',learning:'విద్య. అవకాశాలు. సమాజం.',learningBody:'సోమారం తెలంగాణ మోడల్ స్కూల్ & జూనియర్ కళాశాల కోసం ఈ వెబ్‌సైట్ సిద్ధం చేస్తున్నాము. పాఠశాల సమీక్ష తర్వాత సమాచారం, ఫొటోలు జోడిస్తాము.',vision:'మా దృక్పథం',visionBody:'ఆసక్తి, ఆత్మవిశ్వాసం, బాధ్యత కలిగిన విద్యార్థులను ప్రోత్సహించడం; ఉన్నత విద్య, నిరంతర అభ్యాసానికి సిద్ధం చేయడం.',mission:'మా లక్ష్యం',missionBody:'అవగాహన, సృజనాత్మకత, సంభాషణా నైపుణ్యాలు, సహకారం, పరస్పర గౌరవాన్ని పెంపొందించడం.',review:'ఈ పరిచయం పాఠశాల సమీక్ష కోసం సిద్ధం చేసిన ముసాయిదా.',admin:'స్కూల్ యాజమాన్యం, హ్యాండోవర్ వివరాలు ధృవీకరించిన తర్వాత అడ్మిన్ ఖాతా, పబ్లిషింగ్ అమర్చుతాము.'},hi:{preview:'वेबसाइट पूर्वावलोकन · विद्यालय विवरण की पुष्टि बाकी',school:'तेलंगाना मॉडल स्कूल एवं जूनियर कॉलेज, सोमाराम',location:'सोमाराम · तेलंगाना',tag:'सीखें · खोजें · आगे बढ़ें',latest:'नवीनतम',news:'विद्यालय द्वारा स्वीकृत सूचनाएँ और महत्वपूर्ण तिथियाँ यहाँ दिखाई जाएँगी।',footer:'तेलंगाना मॉडल स्कूल एवं जूनियर कॉलेज, सोमाराम',about:'हमारे बारे में',contact:'संपर्क करें',privacy:'गोपनीयता नीति',close:'बंद करें',draft:'विद्यालय की पुष्टि के बाद तस्वीरें, संपर्क और छात्र विवरण जोड़े जाएँगे।',privacyBody:'यह पूर्वावलोकन छात्र जानकारी एकत्र नहीं करता। पहचान दस्तावेज, पासवर्ड या भुगतान विवरण साझा न करें।',pending:'विद्यालय द्वारा पुष्टि किए गए विवरण जल्द जोड़े जाएँगे।',welcome:'स्वागत है',intro:'सीखने, खोजने और आगे बढ़ने का स्थान। विद्यालय की जानकारी और शैक्षिक संसाधनों का अन्वेषण करें।',explore:'शैक्षणिक जानकारी',more:'हमारे विद्यालय के बारे में',illustration:'परिसर का चित्रण · विद्यालय की तस्वीर जोड़ी जानी है',learning:'शिक्षा. अवसर. समुदाय.',learningBody:'यह वेबसाइट तेलंगाना मॉडल स्कूल एवं जूनियर कॉलेज, सोमाराम के लिए तैयार की जा रही है। समीक्षा के बाद विद्यालय के विवरण जोड़े जाएँगे।',vision:'हमारी दृष्टि',visionBody:'जिज्ञासु, आत्मविश्वासी और जिम्मेदार शिक्षार्थियों को आगे की शिक्षा और आजीवन सीखने के लिए प्रोत्साहित करना।',mission:'हमारा उद्देश्य',missionBody:'समझ, रचनात्मकता, संवाद, सहयोग और सम्मान को बढ़ावा देना।',review:'यह परिचय विद्यालय की समीक्षा के लिए प्रारूप है।',admin:'विद्यालय स्वामित्व और हस्तांतरण विवरण की पुष्टि के बाद व्यवस्थापक खाते और प्रकाशन स्थापित किए जाएँगे।'}};
let lang='en';try{const saved=localStorage.getItem('somaram-language');if(text[saved])lang=saved;}catch{}
const t=k=>text[lang][k]||text.en[k];const label=item=>item[lang==='te'?2:lang==='hi'?3:1];
function node(tag,content,cls){const n=document.createElement(tag);if(content)n.textContent=content;if(cls)n.className=cls;return n;}
function link(title,href,cls){const a=node('a',title,cls);a.href=href;if(href.startsWith('https:')){a.target='_blank';a.rel='noopener noreferrer';}return a;}
function render(){document.documentElement.lang=lang;document.querySelectorAll('[data-text]').forEach(el=>el.textContent=t(el.dataset.text));document.querySelectorAll('[data-lang]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.lang===lang)));const id=location.hash.slice(1)||'home',selected=menu.find(m=>m[0]===id)||menu[0];const nav=document.querySelector('#menu');nav.replaceChildren(...navMenu.map(item=>{const a=link(label(item),'#'+item[0]);if(item[0]===id||(item[0]==='portal'&&['students','portal','strength'].includes(id))||(item[0]==='admissions'&&id==='admissions')||(item[0]==='directory'&&id==='directory')||(item[0]==='school'&&['about-us','campus'].includes(id)))a.setAttribute('aria-current','page');return a;}));const main=document.querySelector('#main');main.replaceChildren();if(selected[0]==='home'){const hero=node('section',null,'hero');const content=node('div');content.append(node('span','TGMS SOMARAM','eyebrow'));const h=node('h2');h.append(document.createTextNode(t('welcome')+' '),node('span','TGMS Somaram'));content.append(h,node('p',t('intro')));const actions=node('div',null,'actions');actions.append(link(t('explore'),'#academics','action'),link(t('more'),'#about-us','action secondary'));content.append(actions);const art=node('div',null,'illustration');art.innerHTML='<svg viewBox="0 0 460 320" role="img" aria-label="School building illustration"><circle cx="235" cy="145" r="140" fill="#dceafa"/><circle cx="380" cy="57" r="28" fill="#ffdf7f"/><path d="M20 285h420" stroke="#c1d6df" stroke-width="4"/><path d="M56 122h348v160H56z" fill="#fff9e7" stroke="#254e7f" stroke-width="3"/><path d="M42 122l188-78 188 78" fill="#d6e5f7" stroke="#254e7f" stroke-width="3"/><path d="M199 205h62v77h-62z" fill="#194b7f"/><g fill="#82add7" stroke="#254e7f" stroke-width="2"><path d="M80 150h42v40H80zm72 0h42v40h-42zm115 0h42v40h-42zm72 0h42v40h-42zM80 213h42v40H80zm72 0h42v40h-42zm115 0h42v40h-42zm72 0h42v40h-42z"/></g><path d="M230 47V15m0 0h50v23h-50" fill="#febd0d" stroke="#254e7f" stroke-width="3"/><text x="230" y="110" text-anchor="middle" font-size="18" fill="#173e78" font-family="sans-serif" font-weight="bold">TGMS SOMARAM</text></svg>';art.append(node('small',t('illustration')));hero.append(content,art);main.append(hero);const cards=node('div',null,'cards');for(const [id,symbol]of [['academics','✦'],['admissions','↗'],['gallery','▧'],['calendar','▦']]){const item=menu.find(m=>m[0]===id),a=link('','#'+id,'card');a.append(node('span',symbol,'symbol'),node('h3',label(item)),node('p',t('pending')));cards.append(a);}main.append(cards);const sheet=node('section',null,'sheet');sheet.append(node('h2',t('learning')),node('p',t('learningBody')));main.append(sheet);return;}
main.append(node('div','TGMS SOMARAM / '+label(selected).toUpperCase(),'breadcrumb'));const sheet=node('section',null,'sheet');sheet.append(node('h2',label(selected)));if(['about-us','school'].includes(selected[0])){sheet.append(node('p',t('learningBody')),node('h3',t('vision')),node('p',t('visionBody')),node('h3',t('mission')),node('p',t('missionBody')),node('p',t('review'),'pending'));}else if(['books','downloads','directory'].includes(selected[0])){sheet.append(node('p',t('pending')),link('SCERT Telangana — Educational Resources ↗','https://scert.telangana.gov.in/','resource'),link('Telangana Model Schools — CGG Portal ↗','https://telanganams.cgg.gov.in/TGMSWEB20/#/','resource'));}else if(selected[0]==='faculty'&&typeof renderModernFacultyPage==='function'){renderModernFacultyPage(sheet,typeof schoolData==='object'&&schoolData?schoolData:SOMARAM_DEFAULT_DATA);}else{sheet.append(node('p',selected[0]==='admin'?t('admin'):t('pending'),'pending'));if(selected[0]==='contact')sheet.append(node('p',t('location')));}main.append(sheet);}
document.querySelectorAll('[data-lang]').forEach(b=>b.addEventListener('click',()=>{lang=b.dataset.lang;try{localStorage.setItem('somaram-language',lang);}catch{}render();}));window.addEventListener('hashchange',()=>{render();document.querySelector('#main').focus({preventScroll:true});});document.querySelector('#privacy').addEventListener('click',()=>document.querySelector('#policy').showModal());document.querySelector('#close-policy').addEventListener('click',()=>document.querySelector('#policy').close());render();

let schoolData=(typeof SOMARAM_DEFAULT_DATA!=='undefined'?JSON.parse(JSON.stringify(SOMARAM_DEFAULT_DATA)):null);
const originalRender=render;
function openLightbox(activePhoto, list) {
  const photos = Array.isArray(list) && list.length > 0 ? list : [activePhoto];
  let currentIndex = photos.findIndex(p => p.src === activePhoto.src);
  if (currentIndex < 0) currentIndex = 0;

  let dialog = document.querySelector('#photo-view');
  if (!dialog) {
    dialog = document.createElement('dialog');
    dialog.id = 'photo-view';
    dialog.className = 'ag-lightbox';
    document.body.append(dialog);
  }

  function renderSlide(index) {
    currentIndex = (index + photos.length) % photos.length;
    const photo = photos[currentIndex];

    dialog.replaceChildren();

    const shell = document.createElement('div');
    shell.className = 'ag-lightbox-shell';

    const header = document.createElement('div');
    header.className = 'ag-lightbox-header';

    const meta = document.createElement('div');
    meta.className = 'ag-lightbox-meta';

    if (photo.category) {
      const cat = document.createElement('span');
      cat.className = 'ag-lightbox-category';
      cat.textContent = photo.category;
      meta.append(cat);
    }

    const counter = document.createElement('span');
    counter.className = 'ag-lightbox-counter';
    counter.textContent = (currentIndex + 1) + ' / ' + photos.length;
    meta.append(counter);

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'ag-lightbox-close';
    closeBtn.setAttribute('aria-label', 'Close photo view');
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', () => dialog.close());

    header.append(meta, closeBtn);

    const mediaWrap = document.createElement('div');
    mediaWrap.className = 'ag-lightbox-media-wrap';

    const stage = document.createElement('div');
    stage.className = 'ag-lightbox-stage';

    const img = document.createElement('img');
    img.className = 'ag-lightbox-img';
    img.src = photo.src;
    img.alt = photo.title || 'School photo';
    stage.append(img);

    if (photos.length > 1) {
      const prevBtn = document.createElement('button');
      prevBtn.type = 'button';
      prevBtn.className = 'ag-lightbox-nav ag-lightbox-prev';
      prevBtn.setAttribute('aria-label', 'Previous photo');
      prevBtn.innerHTML = '&#8249;';
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        renderSlide(currentIndex - 1);
      });

      const nextBtn = document.createElement('button');
      nextBtn.type = 'button';
      nextBtn.className = 'ag-lightbox-nav ag-lightbox-next';
      nextBtn.setAttribute('aria-label', 'Next photo');
      nextBtn.innerHTML = '&#8250;';
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        renderSlide(currentIndex + 1);
      });

      mediaWrap.append(prevBtn, stage, nextBtn);
    } else {
      mediaWrap.append(stage);
    }

    const footer = document.createElement('div');
    footer.className = 'ag-lightbox-footer';

    const titleEl = document.createElement('h3');
    titleEl.className = 'ag-lightbox-title';
    titleEl.textContent = photo.title || 'TGMS Somaram';
    footer.append(titleEl);

    if (photo.te && photo.te !== photo.title) {
      const teEl = document.createElement('p');
      teEl.className = 'ag-lightbox-telugu';
      teEl.textContent = photo.te;
      footer.append(teEl);
    }

    shell.append(header, mediaWrap, footer);
    dialog.append(shell);
  }

  dialog.onclick = (e) => {
    if (e.target === dialog) dialog.close();
  };

  dialog.onkeydown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      renderSlide(currentIndex - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      renderSlide(currentIndex + 1);
    }
  };

  renderSlide(currentIndex);
  dialog.showModal();
}
window.openLightbox = openLightbox;

function photoCard(photo){
  const article = node('article', null, 'photo-card');
  const b = node('button');
  b.type = 'button';
  b.className = 'photo-open';
  b.setAttribute('aria-label', 'View ' + (photo.title || 'photo'));
  const image = node('img');
  image.src = photo.src;
  image.alt = photo.title || 'School photo';
  image.loading = 'lazy';
  const overlay = node('span', null, 'photo-hover-overlay');
  overlay.innerHTML = '<span class="photo-zoom-icon">🔍</span><span>' + (lang === 'te' ? 'వీక్షించండి' : 'Enlarge') + '</span>';
  b.append(image, overlay);
  b.addEventListener('click', () => {
    const all = (schoolData && schoolData.gallery) || [];
    openLightbox(photo, all);
  });
  article.append(b, node('h3', lang === 'te' ? (photo.te || photo.title) : (photo.title || '')), node('p', photo.category || 'School Activities'));
  return article;
}
function principalCard(){
  const card=node('div',null,'principal-card');
  const image=node('img');
  const princ = (typeof schoolData?.principal === 'object' && schoolData?.principal) || {};
  const pName = princ.name || (typeof schoolData?.principal === 'string' ? schoolData.principal : 'Dr.Bandari Sampath Kumar');
  const pPhoto = schoolData?.principalPhoto || (schoolData?.staffPhotos && schoolData.staffPhotos[pName]) || 'images/principal-veerababu.jpg';
  image.src = pPhoto;
  image.alt = pName + ', Principal FAC';
  const pDesig = princ.designation || 'Principal FAC';
  const pQual = princ.qualification || 'Phd in chemistry, B.Ed.';
  const pPhone = princ.phone || '08727-285222';
  card.append(image,node('span',pDesig),node('h3',pName),node('p',pQual),link('☎ ' + pPhone,'tel:+91'+pPhone));
  return card;
}
function createFacultyCard(member) {
  const card = document.createElement('article');
  card.className = 'faculty-card';

  const des = String(member.designation || '').toUpperCase();
  let badgeClass = 'role-staff';
  let badgeText = member.designation || 'Staff';
  if (des.includes('PRINCIPAL')) {
    badgeClass = 'role-principal';
    badgeText = '👑 Principal FAC';
  } else if (des.includes('PGT')) {
    badgeClass = 'role-pgt';
    badgeText = 'PGT';
  } else if (des.includes('TGT')) {
    badgeClass = 'role-tgt';
    badgeText = 'TGT';
  } else if (des.includes('VOCATIONAL') || des.includes('TRAINER') || des.includes('MEDIA') || des.includes('HEALTH')) {
    badgeClass = 'role-vocational';
    badgeText = 'Vocational';
  }

  let subj = member.subject || '';
  if (!subj && member.designation) {
    const match = member.designation.match(/PGT\s+([A-Za-z]+)|TGT\s+([A-Za-z\s]+)/i);
    if (match) subj = match[1] || match[2];
  }

  card.dataset.name = (member.name || '').toLowerCase();
  card.dataset.des = (member.designation || '').toLowerCase();
  card.dataset.subj = (subj || '').toLowerCase();
  card.dataset.role = badgeClass;
  card.tabIndex = 0;

  const frame = document.createElement('div');
  frame.className = 'faculty-photo-frame';

  const roleBadge = document.createElement('span');
  roleBadge.className = 'faculty-role-badge ' + badgeClass;
  roleBadge.textContent = badgeText;

  if (member.photo_url) {
    const img = document.createElement('img');
    img.className = 'faculty-photo-img';
    img.src = member.photo_url;
    img.alt = member.name;
    img.loading = 'lazy';
    img.onerror = () => {
      img.remove();
      frame.prepend(createFacultyPlaceholder(member.name));
    };
    frame.append(img);
  } else {
    frame.append(createFacultyPlaceholder(member.name));
  }
  frame.append(roleBadge);

  const body = document.createElement('div');
  body.className = 'faculty-card-body';

  const nameEl = document.createElement('h3');
  nameEl.className = 'faculty-card-name';
  nameEl.textContent = member.name;

  const desEl = document.createElement('div');
  desEl.className = 'faculty-card-designation';
  desEl.textContent = member.designation || 'Teaching Faculty';

  body.append(nameEl, desEl);

  const meta = document.createElement('div');
  meta.className = 'faculty-meta-list';

  if (subj && subj.toLowerCase() !== (member.designation || '').toLowerCase()) {
    const sItem = document.createElement('div');
    sItem.className = 'faculty-meta-item faculty-subject-highlight';
    sItem.innerHTML = '<span class="faculty-meta-icon">📚</span><span><span class="faculty-meta-label">Subject:</span><strong class="faculty-meta-value">' + subj + '</strong></span>';
    meta.append(sItem);
  }

  if (member.qualification && member.qualification !== '—') {
    const qItem = document.createElement('div');
    qItem.className = 'faculty-meta-item';
    qItem.innerHTML = '<span class="faculty-meta-icon">🎓</span><span><span class="faculty-meta-label">Qualification:</span><span class="faculty-meta-value">' + member.qualification + '</span></span>';
    meta.append(qItem);
  }

  body.append(meta);
  card.append(frame, body);
  return card;
}

function createFacultyPlaceholder(name) {
  const box = document.createElement('div');
  box.className = 'faculty-photo-placeholder';

  const circle = document.createElement('div');
  circle.className = 'faculty-placeholder-circle';
  circle.innerHTML = '<svg viewBox="0 0 24 24" width="40" height="40" fill="currentColor" opacity="0.85"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>';

  const initials = document.createElement('div');
  initials.className = 'faculty-placeholder-initials';
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  const ini = parts.length > 1 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : (parts[0]?.[0] || 'T').toUpperCase();
  initials.textContent = ini;

  box.append(circle, initials);
  return box;
}

function renderModernFacultyPage(sheet, d) {
  const container = document.createElement('div');
  container.className = 'faculty-page-container';

  const header = document.createElement('div');
  header.className = 'faculty-page-header';

  const title = document.createElement('h2');
  title.textContent = lang === 'te' ? 'పాఠశాల ఉపాధ్యాయులు & సిబ్బంది' : 'Our Faculty & Teaching Staff';

  const subtitle = document.createElement('p');
  subtitle.textContent = lang === 'te'
    ? 'తెలంగాణ మోడల్ స్కూల్ & జూనియర్ కళాశాల, సోమారంలో విద్యార్థులను తీర్చిదిద్దుతున్న నిపుణులైన అధ్యాపక బృందం.'
    : 'Meet our dedicated teaching faculty, subject specialists, and educators guiding the students of TGMS Somaram.';

  let list = [];
  if (Array.isArray(d.facultyList) && d.facultyList.length > 0) {
    list = d.facultyList.filter(f => f && f.is_active !== false);
  } else if (Array.isArray(d.faculty)) {
    list = d.faculty.map((row, idx) => ({
      name: row[0],
      designation: row[1] || 'Teacher',
      qualification: row[2] || '',
      subject: '',
      photo_url: (d.staffPhotos && d.staffPhotos[row[0]]) || null,
      order_index: idx
    }));
  }

  if (d.staffPhotos) {
    list.forEach(item => {
      if (!item.photo_url && d.staffPhotos[item.name]) {
        item.photo_url = d.staffPhotos[item.name];
      }
    });
  }

  const badge = document.createElement('div');
  badge.className = 'faculty-stats-badge';
  badge.innerHTML = '<span>👥</span> <span>' + list.length + ' ' + (lang === 'te' ? 'అధ్యాపకులు' : 'Faculty Members') + '</span>';

  header.append(title, subtitle, badge);
  container.append(header);

  // Live Search & Category Filter Toolbar
  const toolbar = document.createElement('div');
  toolbar.className = 'faculty-filter-toolbar';

  const searchBox = document.createElement('div');
  searchBox.className = 'faculty-search-box';
  const searchInput = document.createElement('input');
  searchInput.type = 'search';
  searchInput.className = 'faculty-search-input';
  searchInput.placeholder = lang === 'te' ? 'పేరు లేదా సబ్జెక్ట్ ద్వారా శోధించండి...' : 'Search by name, subject, or role...';
  searchBox.append(searchInput);

  const pills = document.createElement('div');
  pills.className = 'faculty-filter-pills';
  const filterOptions = [
    ['all', lang === 'te' ? 'అందరూ' : 'All'],
    ['role-principal', lang === 'te' ? 'ప్రిన్సిపాల్' : 'Principal'],
    ['role-pgt', lang === 'te' ? 'పి.జి.టి (ఇంటర్)' : 'PGT (Junior College)'],
    ['role-tgt', lang === 'te' ? 'టి.జి.టి (హైస్కూల్)' : 'TGT (High School)'],
    ['role-vocational', lang === 'te' ? 'వృత్తి విద్య' : 'Vocational'],
    ['role-staff', lang === 'te' ? 'సిబ్బంది' : 'Support Staff']
  ];
  let currentFilter = 'all';

  filterOptions.forEach(([key, lbl]) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'faculty-filter-btn' + (key === 'all' ? ' active' : '');
    btn.textContent = lbl;
    btn.dataset.filter = key;
    btn.addEventListener('click', () => {
      pills.querySelectorAll('.faculty-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = key;
      applyFilter();
    });
    pills.append(btn);
  });

  toolbar.append(searchBox, pills);
  container.append(toolbar);

  const grid = document.createElement('div');
  grid.className = 'faculty-grid';

  list.forEach(member => {
    grid.append(createFacultyCard(member));
  });
  container.append(grid);

  const subgroups = [];
  if (Array.isArray(d.guest) && d.guest.length > 0) {
    const subWrap = document.createElement('div');
    subWrap.className = 'faculty-subgroup-block';
    const subH = document.createElement('h3');
    subH.className = 'faculty-subgroup-title';
    subH.innerHTML = '<span>🎓</span> <span>' + (lang === 'te' ? 'గెస్ట్ అధ్యాపకులు' : 'HBT / Guest Faculty') + ' · ' + d.guest.length + '</span>';
    const guestGrid = document.createElement('div');
    guestGrid.className = 'faculty-grid';
    d.guest.forEach(row => {
      guestGrid.append(createFacultyCard({
        name: row[0],
        designation: row[1] || 'Guest Teacher',
        qualification: row[2] || '',
        subject: '',
        photo_url: (d.staffPhotos && d.staffPhotos[row[0]]) || null
      }));
    });
    subWrap.append(subH, guestGrid);
    container.append(subWrap);
    subgroups.push(subWrap);
  }

  if (Array.isArray(d.vocational) && d.vocational.length > 0) {
    const subWrap = document.createElement('div');
    subWrap.className = 'faculty-subgroup-block';
    const subH = document.createElement('h3');
    subH.className = 'faculty-subgroup-title';
    subH.innerHTML = '<span>🛠️</span> <span>' + (lang === 'te' ? 'వృత్తి విద్యా శిక్షకులు' : 'Vocational Trainers') + ' · ' + d.vocational.length + '</span>';
    const vocGrid = document.createElement('div');
    vocGrid.className = 'faculty-grid';
    d.vocational.forEach(row => {
      vocGrid.append(createFacultyCard({
        name: row[0],
        designation: row[1] || 'Vocational Trainer',
        qualification: row[2] || '',
        subject: '',
        photo_url: (d.staffPhotos && d.staffPhotos[row[0]]) || null
      }));
    });
    subWrap.append(subH, vocGrid);
    container.append(subWrap);
    subgroups.push(subWrap);
  }

  if (Array.isArray(d.support) && d.support.length > 0) {
    const subWrap = document.createElement('div');
    subWrap.className = 'faculty-subgroup-block';
    const subH = document.createElement('h3');
    subH.className = 'faculty-subgroup-title';
    subH.innerHTML = '<span>🏛️</span> <span>' + (lang === 'te' ? 'సహాయక సిబ్బంది' : 'Support Staff') + ' · ' + d.support.length + '</span>';
    const supGrid = document.createElement('div');
    supGrid.className = 'faculty-grid';
    d.support.forEach(row => {
      supGrid.append(createFacultyCard({
        name: row[0],
        designation: row[1] || 'Support Staff',
        qualification: row[2] || '',
        subject: '',
        photo_url: (d.staffPhotos && d.staffPhotos[row[0]]) || null
      }));
    });
    subWrap.append(subH, supGrid);
    container.append(subWrap);
    subgroups.push(subWrap);
  }

  function applyFilter() {
    const q = searchInput.value.trim().toLowerCase();
    const allCards = container.querySelectorAll('.faculty-card');
    let visibleCount = 0;
    allCards.forEach(card => {
      const name = (card.dataset.name || '').toLowerCase();
      const des = (card.dataset.des || '').toLowerCase();
      const subj = (card.dataset.subj || '').toLowerCase();
      const role = card.dataset.role || '';

      const matchesSearch = !q || name.includes(q) || des.includes(q) || subj.includes(q);
      const matchesFilter = currentFilter === 'all' || role === currentFilter;

      if (matchesSearch && matchesFilter) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    let noResult = container.querySelector('.faculty-no-results');
    if (visibleCount === 0) {
      if (!noResult) {
        noResult = document.createElement('div');
        noResult.className = 'faculty-no-results';
        noResult.innerHTML = '<span style="font-size:36px;display:block;margin-bottom:8px">🔍</span><strong>' + 
          (lang === 'te' ? 'ఏ ఉపాధ్యాయులు కనుగొనబడలేదు' : 'No matching faculty members found') + 
          '</strong><p style="font-size:13px;color:#6b7280;margin-top:4px">' + 
          (lang === 'te' ? 'దయచేసి వేరే పేరు లేదా సబ్జెక్ట్ టైప్ చేయండి' : 'Try searching with a different name or subject keyword') + 
          '</p>';
        grid.after(noResult);
      }
      noResult.hidden = false;
    } else if (noResult) {
      noResult.hidden = true;
    }

    subgroups.forEach(sub => {
      const visibleInSub = sub.querySelectorAll('.faculty-card:not([style*="display: none"])').length;
      sub.style.display = visibleInSub > 0 ? '' : 'none';
    });
  }

  searchInput.addEventListener('input', applyFilter);

  sheet.replaceChildren(container);
}
window.renderModernFacultyPage = renderModernFacultyPage;

function renderModernStrengthPage(sheet, d) {
  const isTe = lang === 'te';
  const rawData = (d && d.strength) || (typeof INITIAL_STRENGTH !== 'undefined' ? INITIAL_STRENGTH : {
    year: '2026–27',
    groups: [
      { title: 'School · Classes VI–X', rows: [['VI',48,33],['VII',55,21],['VIII',63,34],['IX',51,46],['X',55,39]] },
      { title: 'Junior College · First Year (Intermediate)', rows: [['MPC',18,28],['BiPC',4,37],['CEC',15,16],['ACE',7,10]] },
      { title: 'Junior College · Second Year (Intermediate)', rows: [['MPC',16,33],['BiPC',0,39],['CEC',15,11]] }
    ],
    sections: [['IX A',49],['IX B',50],['X A',46],['X B',48],['I CEC',31],['II CEC',25]]
  });

  const container = document.createElement('div');
  container.className = 'strength-page-container';

  const header = document.createElement('div');
  header.className = 'strength-page-header';

  const title = document.createElement('h2');
  title.textContent = isTe ? 'పాఠశాల విద్యార్థుల సంఖ్య & నమోదు వివరాలు' : 'School Strength & Enrolment Statistics';

  const subtitle = document.createElement('p');
  subtitle.textContent = isTe
    ? 'తెలంగాణ మోడల్ స్కూల్ & జూనియర్ కళాశాల, సోమారంలో 6వ తరగతి నుండి 12వ తరగతి వరకు విద్యార్థుల సంఖ్య గణాంకాలు · విద్యా సంవత్సరం ' + rawData.year
    : 'Comprehensive student enrolment breakdown across High School (Classes VI–X) and Junior College (Intermediate I & II Year) · Academic Year ' + rawData.year + ' · UDISE+ 36131100206';

  const verifiedBadge = document.createElement('div');
  verifiedBadge.className = 'strength-verified-badge';
  verifiedBadge.innerHTML = '<span>🏛️</span> <span>' + (isTe ? 'ప్రభుత్వ ఆమోదిత నమోదు గణాంకాలు · ఉచిత విద్య' : 'Official Enrolment Record · 100% Free Education') + '</span>';

  header.append(title, subtitle, verifiedBadge);
  container.append(header);

  // Totals
  let totalBoys = 0;
  let totalGirls = 0;
  (rawData.groups || []).forEach(group => {
    (group.rows || []).forEach(row => {
      totalBoys += Number(row[1]) || 0;
      totalGirls += Number(row[2]) || 0;
    });
  });
  const grandTotal = totalBoys + totalGirls;
  const boysPct = grandTotal > 0 ? Math.round((totalBoys / grandTotal) * 100) : 50;
  const girlsPct = 100 - boysPct;

  // Stat summary bar
  const statsGrid = document.createElement('div');
  statsGrid.className = 'ag-strength-summary';

  const statItems = [
    {
      icon: '👥',
      label: isTe ? 'మొత్తం విద్యార్థులు' : 'Total Enrolment',
      val: grandTotal,
      sub: isTe ? 'తరగతులు VI – XII' : 'Classes VI through XII',
      accent: 'emerald'
    },
    {
      icon: '👦',
      label: isTe ? 'బాలుర సంఖ్య' : 'Boys Enrolled',
      val: totalBoys,
      sub: boysPct + '% ' + (isTe ? 'మొత్తం నమోదులో' : 'of student strength'),
      accent: 'teal'
    },
    {
      icon: '👧',
      label: isTe ? 'బాలికల సంఖ్య' : 'Girls Enrolled',
      val: totalGirls,
      sub: girlsPct + '% ' + (isTe ? 'మొత్తం నమోదులో' : 'of student strength'),
      accent: 'rose'
    },
    {
      icon: '⚖️',
      label: isTe ? 'లింగ నిష్పత్తి' : 'Gender Parity Ratio',
      val: '1 : 1',
      sub: isTe ? 'సమాన నిష్పత్తి' : 'Equal Opportunity Parity',
      accent: 'amber'
    }
  ];

  statItems.forEach(item => {
    const card = document.createElement('article');
    card.className = 'ag-strength-stat-card accent-' + item.accent;
    card.innerHTML = '<div class="stat-card-top"><span class="stat-card-icon">' + item.icon + '</span><span class="stat-card-label">' + item.label + '</span></div><strong class="stat-card-value">' + item.val + '</strong><span class="stat-card-sub">' + item.sub + '</span>';
    statsGrid.append(card);
  });
  container.append(statsGrid);

  // Filter Toolbar
  const filterToolbar = document.createElement('div');
  filterToolbar.className = 'strength-filter-bar';

  const filterOptions = [
    ['all', isTe ? 'అన్నీ చూడండి' : 'All Sections'],
    ['school', isTe ? 'హైస్కూల్ (VI–X)' : 'High School (VI–X)'],
    ['inter', isTe ? 'జూనియర్ కళాశాల (XI–XII)' : 'Junior College (XI–XII)'],
    ['sections', isTe ? 'సెక్షన్ల వివరాలు' : 'Section Statement']
  ];

  filterOptions.forEach(([key, lbl], idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'strength-filter-btn' + (idx === 0 ? ' active' : '');
    btn.textContent = lbl;
    btn.dataset.target = key;
    btn.addEventListener('click', () => {
      filterToolbar.querySelectorAll('.strength-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const blocks = tablesContainer.querySelectorAll('.strength-block');
      blocks.forEach(b => {
        const bKey = b.dataset.blockKey;
        if (key === 'all') {
          b.style.display = '';
        } else if (key === 'school' && bKey === 'school') {
          b.style.display = '';
        } else if (key === 'inter' && (bKey === 'inter-first' || bKey === 'inter-second')) {
          b.style.display = '';
        } else if (key === 'sections' && bKey === 'sections') {
          b.style.display = '';
        } else {
          b.style.display = 'none';
        }
      });
    });
    filterToolbar.append(btn);
  });
  container.append(filterToolbar);

  // Tables
  const tablesContainer = document.createElement('div');
  tablesContainer.className = 'strength-tables-container';

  function createTableBlock(blockKey, titleText, titleTe, badgeText, rows, isGroupTable) {
    const card = document.createElement('section');
    card.className = 'strength-block ag-strength-card block-' + blockKey;
    card.dataset.blockKey = blockKey;

    const blockHeader = document.createElement('div');
    blockHeader.className = 'strength-block-header';

    const h3 = document.createElement('h3');
    h3.textContent = isTe ? titleTe : titleText;

    const badge = document.createElement('span');
    badge.className = 'strength-block-badge';
    badge.textContent = badgeText;

    blockHeader.append(h3, badge);
    card.append(blockHeader);

    const scrollWrap = document.createElement('div');
    scrollWrap.className = 'ag-table-scroll';
    scrollWrap.tabIndex = 0;
    scrollWrap.setAttribute('role', 'region');
    scrollWrap.setAttribute('aria-label', titleText + ' table');

    const table = document.createElement('table');
    table.className = 'ag-modern-table';

    if (isGroupTable) {
      const thead = document.createElement('thead');
      const trH = document.createElement('tr');
      const headers = isTe
        ? ['తరగతి / విభాగం', 'బాలురు', 'బాలికలు', 'మొత్తం', 'శాతం']
        : ['Class / Stream', 'Boys', 'Girls', 'Total', 'Share'];

      headers.forEach((h, hIdx) => {
        const th = document.createElement('th');
        th.textContent = h;
        if (hIdx >= 1) th.style.textAlign = 'right';
        trH.append(th);
      });
      thead.append(trH);
      table.append(thead);

      const tbody = document.createElement('tbody');
      let bSum = 0;
      let gSum = 0;

      rows.forEach(r => {
        bSum += Number(r[1]) || 0;
        gSum += Number(r[2]) || 0;
      });
      const groupTotal = bSum + gSum;

      rows.forEach(r => {
        const tr = document.createElement('tr');
        const bVal = Number(r[1]) || 0;
        const gVal = Number(r[2]) || 0;
        const tVal = bVal + gVal;
        const pct = groupTotal > 0 ? Math.round((tVal / groupTotal) * 100) + '%' : '—';

        const tdName = document.createElement('td');
        tdName.className = 'td-class-name';
        tdName.innerHTML = '<span class="class-pill">' + r[0] + '</span>';

        const tdB = document.createElement('td');
        tdB.className = 'td-num td-boys';
        tdB.textContent = bVal;

        const tdG = document.createElement('td');
        tdG.className = 'td-num td-girls';
        tdG.textContent = gVal;

        const tdT = document.createElement('td');
        tdT.className = 'td-num td-total';
        tdT.innerHTML = '<strong>' + tVal + '</strong>';

        const tdP = document.createElement('td');
        tdP.className = 'td-num td-share';
        tdP.innerHTML = '<span class="share-badge">' + pct + '</span>';

        tr.append(tdName, tdB, tdG, tdT, tdP);
        tbody.append(tr);
      });
      table.append(tbody);

      const tfoot = document.createElement('tfoot');
      const trF = document.createElement('tr');

      const thFootLabel = document.createElement('th');
      thFootLabel.textContent = isTe ? 'విభాగం మొత్తం' : 'Subtotal';

      const thFootB = document.createElement('th');
      thFootB.className = 'td-num';
      thFootB.textContent = bSum;

      const thFootG = document.createElement('th');
      thFootG.className = 'td-num';
      thFootG.textContent = gSum;

      const thFootT = document.createElement('th');
      thFootT.className = 'td-num';
      thFootT.innerHTML = '<strong>' + groupTotal + '</strong>';

      const thFootP = document.createElement('th');
      thFootP.className = 'td-num';
      thFootP.textContent = '100%';

      trF.append(thFootLabel, thFootB, thFootG, thFootT, thFootP);
      tfoot.append(trF);
      table.append(tfoot);
    } else {
      const thead = document.createElement('thead');
      const trH = document.createElement('tr');
      const headers = isTe ? ['సెక్షన్ / తరగతి', 'విద్యార్థుల సంఖ్య'] : ['Section / Class', 'Enrolled Strength'];
      headers.forEach((h, hIdx) => {
        const th = document.createElement('th');
        th.textContent = h;
        if (hIdx === 1) th.style.textAlign = 'right';
        trH.append(th);
      });
      thead.append(trH);
      table.append(thead);

      const tbody = document.createElement('tbody');
      let secTotal = 0;
      rows.forEach(r => {
        const count = Number(r[1]) || 0;
        secTotal += count;
        const tr = document.createElement('tr');
        const tdName = document.createElement('td');
        tdName.className = 'td-class-name';
        tdName.innerHTML = '<span class="class-pill section-pill">' + r[0] + '</span>';

        const tdCount = document.createElement('td');
        tdCount.className = 'td-num';
        tdCount.innerHTML = '<strong>' + count + '</strong>';

        tr.append(tdName, tdCount);
        tbody.append(tr);
      });
      table.append(tbody);

      const tfoot = document.createElement('tfoot');
      const trF = document.createElement('tr');
      const thLabel = document.createElement('th');
      thLabel.textContent = isTe ? 'మొత్తం' : 'Total Statement';
      const thTot = document.createElement('th');
      thTot.className = 'td-num';
      thTot.innerHTML = '<strong>' + secTotal + '</strong>';
      trF.append(thLabel, thTot);
      tfoot.append(trF);
      table.append(tfoot);
    }

    scrollWrap.append(table);
    card.append(scrollWrap);
    return card;
  }

  if (rawData.groups && rawData.groups[0]) {
    tablesContainer.append(createTableBlock(
      'school',
      'High School Section · Classes VI to X',
      'ఉన్నత పాఠశాల విభాగం · 6వ – 10వ తరగతులు',
      '🏫 Classes VI – X',
      rawData.groups[0].rows,
      true
    ));
  }

  if (rawData.groups && rawData.groups[1]) {
    tablesContainer.append(createTableBlock(
      'inter-first',
      'Junior College · First Year Intermediate',
      'జూనియర్ కళాశాల · ప్రథమ సంవత్సరం (ఇంటర్మీడియట్)',
      '🎓 Intermediate 1st Year',
      rawData.groups[1].rows,
      true
    ));
  }

  if (rawData.groups && rawData.groups[2]) {
    tablesContainer.append(createTableBlock(
      'inter-second',
      'Junior College · Second Year Intermediate',
      'జూనియర్ కళాశాల · ద్వితీయ సంవత్సరం (ఇంటర్మీడియట్)',
      '🎓 Intermediate 2nd Year',
      rawData.groups[2].rows,
      true
    ));
  }

  if (Array.isArray(rawData.sections) && rawData.sections.length > 0) {
    tablesContainer.append(createTableBlock(
      'sections',
      'Section-Wise Distribution Statement',
      'విభాగాల వారీగా నమోదు ప్రకటన',
      '📑 Section Statement',
      rawData.sections,
      false
    ));
  }

  container.append(tablesContainer);

  const noticeBox = document.createElement('div');
  noticeBox.className = 'ag-strength-notice';
  noticeBox.innerHTML = '<div class="notice-icon">📋</div><div class="notice-content"><strong>' +
    (isTe ? 'తెలంగాణ ప్రభుత్వ మోడల్ స్కూల్ సమాచారం' : 'Government of Telangana Model School Scheme') +
    '</strong><p>' +
    (isTe
      ? 'ఉచిత ఆంగ్ల మాధ్యమ నాణ్యమైన విద్య, పాఠ్యపుస్తకాలు, యూనిఫారాలు, మధ్యాహ్న భోజన సదుపాయం ప్రభుత్వ నిబంధనల ప్రకారం అందించబడును. ప్రవేశాలు ప్రతి సంవత్సరం TGMSCET ప్రవేశ పరీక్ష మెరిట్ ఆధారంగా జరుగుతాయి.'
      : 'High-quality English-medium education, free SCERT textbooks, uniforms, and mid-day meal facilities are provided under Telangana Model School guidelines. Admissions are conducted through TGMSCET entrance examination.') +
    '</p></div>';
  container.append(noticeBox);

  sheet.replaceChildren(container);
}
window.renderModernStrengthPage = renderModernStrengthPage;

function renderModernAcademicsPage(sheet) {
  const isTe = lang === 'te';
  const container = document.createElement('div');
  container.className = 'academics-page-container';

  const header = document.createElement('div');
  header.className = 'academics-page-header';

  const title = document.createElement('h2');
  title.textContent = isTe ? 'విద్యా విభాగాలు & పాఠ్య ప్రణాళిక' : 'Academic Programmes & Curriculum';

  const subtitle = document.createElement('p');
  subtitle.textContent = isTe
    ? 'తరగతి 6 నుండి 12 వరకు సమగ్ర ఆంగ్ల మాధ్యమ విద్య, అత్యాధునిక సైన్స్ ప్రయోగశాలలు, కంప్యూటర్ విద్య మరియు వృత్తి విద్యా శిక్షణ.'
    : 'Comprehensive English medium secondary and higher secondary education under Telangana State Board curriculum with advanced labs and vocational certification.';

  const badge = document.createElement('div');
  badge.className = 'academics-hero-badge';
  badge.innerHTML = '<span>🎓</span> <span>' + (isTe ? 'ఆంగ్ల మాధ్యమం · స్టేట్ సిలబస్' : 'English Medium · Classes VI to XII · Free Education') + '</span>';

  header.append(title, subtitle, badge);
  container.append(header);

  const grid = document.createElement('div');
  grid.className = 'academics-cards-grid';

  const highSchoolCard = document.createElement('article');
  highSchoolCard.className = 'academics-program-card accent-emerald';
  highSchoolCard.innerHTML = '<div class="program-card-header"><span class="program-icon">🏫</span><div><span class="program-tag">' +
    (isTe ? 'సెకండరీ విద్య' : 'Secondary Education') +
    '</span><h3 class="program-title">' +
    (isTe ? 'ఉన్నత పాఠశాల విభాగం (6–10 తరగతులు)' : 'High School Section (Classes VI – X)') +
    '</h3></div></div><p class="program-desc">' +
    (isTe
      ? 'తెలంగాణ ఎస్‌సిఇఆర్‌టి (SCERT) ఆమోదిత పాఠ్య ప్రణాళిక ప్రకారం 100% ఆంగ్ల మాధ్యమంలో తరగతులు నిర్వహించబడును. సి.సి.ఇ (CCE) పద్ధతిలో నిరంతర సమగ్ర మూల్యాంకనం.'
      : 'State SCERT curriculum leading to the Secondary School Certificate (SSC) Board Examination, taught fully in English medium with continuous conceptual assessment.') +
    '</p><div class="program-subjects"><strong>' +
    (isTe ? 'సబ్జెక్టులు & భాషలు:' : 'Curriculum & Subjects:') +
    '</strong><div class="subject-tags"><span class="subject-tag">Mathematics / గణితం</span><span class="subject-tag">Physical Science / భౌతిక శాస్త్రం</span><span class="subject-tag">Biological Science / జీవ శాస్త్రం</span><span class="subject-tag">Social Studies / సాంఘిక శాస్త్రం</span><span class="subject-tag">English (3rd Lang / Medium)</span><span class="subject-tag">Telugu (1st Lang)</span><span class="subject-tag">Hindi (2nd Lang)</span></div></div><ul class="program-features"><li>✓ ' +
    (isTe ? 'డిజిటల్ స్మార్ట్ క్లాస్‌రూమ్‌లు & ప్రొజెక్టర్ బోధన' : 'Digital smart classrooms with audiovisual teaching aids') +
    '</li><li>✓ ' +
    (isTe ? 'సైన్స్ & గణిత ప్రయోగశాలలలో ప్రత్యక్ష సాధన' : 'Well-equipped physical science & biological science practical labs') +
    '</li><li>✓ ' +
    (isTe ? '10వ తరగతి పబ్లిక్ పరీక్షలకు ప్రత్యేక స్టడీ అవర్స్ & రివిజన్' : 'Dedicated evening study hours & intensive mock tests for SSC candidates') +
    '</li></ul>';

  const collegeCard = document.createElement('article');
  collegeCard.className = 'academics-program-card accent-teal';
  collegeCard.innerHTML = '<div class="program-card-header"><span class="program-icon">🎓</span><div><span class="program-tag">' +
    (isTe ? 'హయ్యర్ సెకండరీ' : 'Higher Secondary (BIE TG)') +
    '</span><h3 class="program-title">' +
    (isTe ? 'జూనియర్ కళాశాల (ఇంటర్మీడియట్ I & II సంవత్సరం)' : 'Junior College Section (Intermediate I & II)') +
    '</h3></div></div><p class="program-desc">' +
    (isTe
      ? 'తెలంగాణ ఇంటర్మీడియట్ విద్యా మండలి (BIE TG) గుర్తింపుతో రెండేళ్ల కోర్సులు. ఉన్నత విద్య మరియు జాతీయ/రాష్ట్ర స్థాయి ప్రవేశ పరీక్షలకు పునాది.'
      : 'Affiliated with the Board of Intermediate Education, Telangana (BIE TG). Designed for academic excellence and seamless transition to prestigious university degrees.') +
    '</p><div class="inter-streams"><div class="stream-item"><span class="stream-badge mpc">MPC</span><div class="stream-info"><strong>Mathematics · Physics · Chemistry</strong><small>' +
    (isTe ? 'లక్ష్యం: ఇంజనీరింగ్ (JEE / EAPCET), NDA, ఆర్కిటెక్చర్' : 'Focus: Engineering (JEE Main, EAPCET), Defence (NDA), Physical Sciences') +
    '</small></div></div><div class="stream-item"><span class="stream-badge bipc">BiPC</span><div class="stream-info"><strong>Botany · Zoology · Physics · Chemistry</strong><small>' +
    (isTe ? 'లక్ష్యం: వైద్యం (NEET), నర్సింగ్, అగ్రికల్చర్, ఫార్మసీ' : 'Focus: Medicine (NEET-UG), Agriculture (B.Sc Agri), Pharmacy, Paramedical') +
    '</small></div></div><div class="stream-item"><span class="stream-badge cec">CEC</span><div class="stream-info"><strong>Commerce · Economics · Civics</strong><small>' +
    (isTe ? 'లక్ష్యం: చార్టర్డ్ అకౌంటెన్సీ (CA), సివిల్ సర్వీసెస్, లా (CLAT), బ్యాంకింగ్' : 'Focus: Chartered Accountancy (CA/CS/CMA), Civil Services, Law (CLAT), Banking') +
    '</small></div></div></div>';

  const vocCard = document.createElement('article');
  vocCard.className = 'academics-program-card accent-amber';
  vocCard.innerHTML = '<div class="program-card-header"><span class="program-icon">🛠️</span><div><span class="program-tag">' +
    (isTe ? 'వృత్తి విద్య (NSQF)' : 'Vocational & Skill Education (NSQF)') +
    '</span><h3 class="program-title">' +
    (isTe ? 'వృత్తి విద్యా శిక్షణ & నైపుణ్యాభివృద్ధి' : 'Industry-Ready Skill Development') +
    '</h3></div></div><p class="program-desc">' +
    (isTe
      ? 'సమగ్ర శిక్ష మరియు జాతీయ నైపుణ్య అర్హత ఫ్రేమ్‌వర్క్ (NSQF) కింద విద్యార్థులకు ఉపాధి అవకాశాలు కల్పించే ప్రత్యక్ష నైపుణ్యాల శిక్షణ.'
      : 'Vocational courses empowering students with practical, industry-aligned career competencies alongside academic studies under Samagra Shiksha.') +
    '</p><div class="voc-grid"><div class="voc-box"><span class="voc-icon">🖥️</span><strong>Media & Entertainment</strong><p>' +
    (isTe ? 'గ్రాఫిక్ డిజైనింగ్, డిటిపి, ఫోటో ఎడిటింగ్, డిజిటల్ మీడియా మరియు కంప్యూటర్ అప్లికేషన్లు.' : 'Graphic design, desktop publishing (DTP), digital imaging, multimedia presentations and animation fundamentals.') +
    '</p></div><div class="voc-box"><span class="voc-icon">🏥</span><strong>Healthcare & Patient Care</strong><p>' +
    (isTe ? 'ప్రాథమిక ప్రథమ చికిత్స, రోగి సంరక్షణ, ఆరోగ్య సూత్రాలు మరియు ప్రాథమిక వైద్య సేవలు.' : 'Patient care assistance, vital signs monitoring, first responder emergency techniques, hygiene and hospital administration support.') +
    '</p></div></div>';

  const facilityCard = document.createElement('article');
  facilityCard.className = 'academics-program-card accent-sky';
  facilityCard.innerHTML = '<div class="program-card-header"><span class="program-icon">🔬</span><div><span class="program-tag">' +
    (isTe ? 'విద్యా సదుపాయాలు' : 'Academic Infrastructure') +
    '</span><h3 class="program-title">' +
    (isTe ? 'ప్రయోగశాలలు, గ్రంథాలయం & సాంకేతికత' : 'Laboratories, Library & Digital Classrooms') +
    '</h3></div></div><ul class="facility-list"><li><span class="fac-icon">🧪</span><div><strong>' +
    (isTe ? 'సైన్స్ ప్రయోగశాలలు' : 'Advanced Science Labs') +
    '</strong><small>' +
    (isTe ? 'ఫిజిక్స్, కెమిస్ట్రీ మరియు బయాలజీ ప్రయోగాలకు ప్రత్యేక ల్యాబ్‌లు.' : 'Fully equipped physics, chemistry, botany and zoology experiment stations.') +
    '</small></div></li><li><span class="fac-icon">💻</span><div><strong>' +
    (isTe ? 'కంప్యూటర్ ల్యాబ్ & ఇంటర్నెట్' : 'High-Speed Computer Lab') +
    '</strong><small>' +
    (isTe ? 'విద్యార్థులకు ప్రత్యక్ష ఐటి శిక్షణ, డిజిటల్ లెర్నింగ్ సాఫ్ట్‌వేర్.' : 'Networked computer terminals with digital curriculum software and typing skills.') +
    '</small></div></li><li><span class="fac-icon">📚</span><div><strong>' +
    (isTe ? 'విస్తృత గ్రంథాలయం' : 'Institutional Library') +
    '</strong><small>' +
    (isTe ? '2,000+ పాఠ్యపుస్తకాలు, పోటీ పరీక్షల గైడ్‌లు మరియు దినపత్రికలు.' : 'Rich catalog of 2,000+ reference volumes, encyclopedias, and competitive journals.') +
    '</small></div></li><li><span class="fac-icon">🏃‍♂️</span><div><strong>' +
    (isTe ? 'క్రీడలు & శారీరక విద్య' : 'Sports & Physical Health') +
    '</strong><small>' +
    (isTe ? 'నిపుణుడైన ఫిజికల్ డైరెక్టర్ (PD) ఆధ్వర్యంలో రోజువారీ యోగా, క్రీడలు.' : 'Regular yoga sessions, athletics, volleyball, and physical training under PD supervision.') +
    '</small></div></li></ul>';

  grid.append(highSchoolCard, collegeCard, vocCard, facilityCard);
  container.append(grid);

  const actionsWrap = document.createElement('div');
  actionsWrap.className = 'academics-actions-bar';
  actionsWrap.append(
    link(isTe ? '📅 అకడమిక్ క్యాలెండర్ ↗' : '📅 Academic Calendar 2026–27 ↗', '#calendar', 'resource-btn'),
    link(isTe ? '📊 విద్యార్థుల సంఖ్య & నమోదు ↗' : '📊 School Enrolment Strength ↗', '#strength', 'resource-btn'),
    link(isTe ? '📖 పాఠ్యపుస్తకాలు డౌన్‌లోడ్ ↗' : '📖 Textbook Downloads ↗', '#books', 'resource-btn'),
    link(isTe ? '📝 ప్రవేశాల వివరాలు ↗' : '📝 Admissions Information ↗', '#admissions', 'resource-btn highlight')
  );
  container.append(actionsWrap);

  sheet.replaceChildren(container);
}
window.renderModernAcademicsPage = renderModernAcademicsPage;

function renderModernResultsPage(sheet) {
  const isTe = lang === 'te';
  const container = document.createElement('div');
  container.className = 'results-page-container';

  const header = document.createElement('div');
  header.className = 'results-page-header';

  const title = document.createElement('h2');
  title.textContent = isTe ? 'పరీక్షా ఫలితాలు & అకడమిక్ ప్రతిభ' : 'Board Examination Results & Academic Milestones';

  const subtitle = document.createElement('p');
  subtitle.textContent = isTe
    ? '10వ తరగతి (SSC) మరియు ఇంటర్మీడియట్ (IPE) పరీక్షలలో సోమారం తెలంగాణ మోడల్ స్కూల్ విద్యార్థుల అద్భుత ప్రతిభ మరియు ఉన్నత విద్యా పురోగతి.'
    : 'Celebrating consistent academic excellence, high pass percentages, and premier higher-education admissions achieved by students of TGMS Somaram.';

  header.append(title, subtitle);
  container.append(header);

  const metricsGrid = document.createElement('div');
  metricsGrid.className = 'results-metrics-grid';

  const stats = [
    { icon: '🏆', title: '100%', subtitle: isTe ? '10వ తరగతి (SSC) ఉత్తీర్ణత' : 'SSC Board Pass Rate', desc: isTe ? 'వరుస సంవత్సరాలలో శతశాతం ఉత్తీర్ణత' : 'Consistent 100% pass track record' },
    { icon: '⭐', title: '95%+', subtitle: isTe ? 'ఇంటర్మీడియట్ (IPE) ఉత్తీర్ణత' : 'Intermediate Pass Rate', desc: isTe ? 'MPC, BiPC, CEC విభాగాలలో ప్రథమ శ్రేణి' : 'Top first-division grades in IPE' },
    { icon: '🎯', title: '9.8 GPA', subtitle: isTe ? 'టాప్ జి.పి.ఎ సాధన' : 'Highest SSC GPA Achieved', desc: isTe ? 'మండల స్థాయిలో అత్యుత్తమ మార్కులు' : 'Excellence in Karimnagar district' },
    { icon: '🚀', title: '100% Free', subtitle: isTe ? 'పోటీ పరీక్షల ఉచిత కోచింగ్' : 'Competitive Exam Mentorship', desc: isTe ? 'EAPCET, NEET & పాలిటెక్నిక్ మార్గదర్శనం' : 'Special coaching for higher education' }
  ];

  stats.forEach(st => {
    const card = document.createElement('div');
    card.className = 'result-metric-card';
    card.innerHTML = '<div class="result-metric-icon">' + st.icon + '</div><strong class="result-metric-num">' + st.title + '</strong><span class="result-metric-sub">' + st.subtitle + '</span><p class="result-metric-desc">' + st.desc + '</p>';
    metricsGrid.append(card);
  });
  container.append(metricsGrid);

  const details = document.createElement('section');
  details.className = 'results-detail-card';
  details.innerHTML = '<h3>' +
    (isTe ? 'అకడమిక్ విజయాల వెనుక నిబద్ధత' : 'Our Approach to Academic Excellence') +
    '</h3><p>' +
    (isTe
      ? 'సోమారం తెలంగాణ మోడల్ స్కూల్‌లో అనుభవజ్ఞులైన ఉపాధ్యాయులు ప్రతి విద్యార్థిపై ప్రత్యేక శ్రద్ధ వహిస్తారు. రోజువారీ హోమ్‌వర్క్ పర్యవేక్షణ, శనివారపు రివిజన్ పరీక్షలు, వెనుకబడిన విద్యార్థులకు రెమిడియల్ టీచింగ్ మరియు బోర్డు పరీక్షలకు ప్రత్యేక ప్రాక్టీస్ పేపర్లు నిర్వహించడం ద్వారా ఉత్తమ ఫలితాలు సాధిస్తున్నాము.'
      : 'At TGMS Somaram, personalized faculty mentorship, continuous slip tests, evening study supervision, and remedial classes for slow learners ensure every student achieves their fullest academic potential in Board examinations.') +
    '</p><div class="results-links"><a href="#strength" class="resource-btn">' +
    (isTe ? 'విద్యార్థుల సంఖ్య వివరాలు' : 'View School Strength') +
    ' ↗</a><a href="#academics" class="resource-btn">' +
    (isTe ? 'విద్యా కోర్సుల వివరాలు' : 'Explore Academic Programmes') +
    ' ↗</a><a href="#faculty" class="resource-btn">' +
    (isTe ? 'అధ్యాపక బృందం' : 'Meet Our Teaching Faculty') +
    ' ↗</a></div>';
  container.append(details);

  sheet.replaceChildren(container);
}
window.renderModernResultsPage = renderModernResultsPage;

function renderModernGalleryPage(sheet, d) {
  const isTe = lang === 'te';
  const allPhotos = (d && Array.isArray(d.gallery)) ? d.gallery : [];

  const container = document.createElement('div');
  container.className = 'modern-gallery-container';

  const title = document.createElement('h2');
  title.textContent = isTe ? 'క్యాంపస్ & పాఠశాల ఫొటో గ్యాలరీ' : 'Campus & School Photo Gallery';

  const subtitle = document.createElement('p');
  subtitle.textContent = isTe
    ? 'తెలంగాణ మోడల్ స్కూల్ & జూనియర్ కళాశాల ప్రాంగణం, ల్యాబ్‌లు, విద్యార్థుల కార్యక్రమాలు మరియు వేడుకల చిత్రాలు.'
    : 'Explore official photographs of TGMS Somaram campus facilities, science laboratories, student celebrations, and academic milestones.';

  container.append(title, subtitle);

  const filterBar = document.createElement('div');
  filterBar.className = 'gallery-filter-tabs';

  const filters = [
    { id: 'all', en: 'All Photos', te: 'అన్ని చిత్రాలు' },
    { id: 'campus', en: '🏫 Campus Gallery', te: '🏫 క్యాంపస్ & ల్యాబ్స్' },
    { id: 'school', en: '📸 School Photo Gallery', te: '📸 పాఠశాల కార్యక్రమాలు' },
    { id: 'achieve', en: '🏆 Achievements', te: '🏆 విద్యార్థుల విజయాలు' }
  ];

  let currentFilter = 'all';
  const grid = document.createElement('div');
  grid.className = 'gallery-grid';

  function renderGrid() {
    grid.replaceChildren();
    const filtered = allPhotos.filter(photo => {
      if (currentFilter === 'all') return true;
      const cat = ((photo.category || '') + ' ' + (photo.title || '')).toLowerCase();
      const type = photo.gallery_type || '';
      if (currentFilter === 'campus') {
        return type === 'campus' || /campus|building|gate|ground|lab|infrastructure/i.test(cat);
      }
      if (currentFilter === 'school') {
        return type === 'school' || /school|photo|activit|meeting|yoga|parent|celebrat|event/i.test(cat);
      }
      if (currentFilter === 'achieve') {
        return /achieve|award|prize|felicit/i.test(cat);
      }
      return true;
    });

    if (filtered.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'gallery-empty-notice';
      empty.textContent = isTe
        ? 'ఈ విభాగంలో ఫొటోలు త్వరలో జోడిస్తాము.'
        : 'Photographs in this category will appear here after school confirmation.';
      grid.append(empty);
    } else {
      filtered.forEach(photo => grid.append(photoCard(photo)));
    }
  }

  filters.forEach(f => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'gallery-filter-btn' + (f.id === currentFilter ? ' active' : '');
    btn.textContent = isTe ? f.te : f.en;
    btn.onclick = () => {
      currentFilter = f.id;
      filterBar.querySelectorAll('.gallery-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderGrid();
    };
    filterBar.append(btn);
  });

  container.append(filterBar, grid);
  sheet.replaceChildren(container);
  renderGrid();
}
window.renderModernGalleryPage = renderModernGalleryPage;

function staffTable(title,rows){const section=node('section');section.append(node('h3',title));const wrap=node('div',null,'table-scroll');wrap.tabIndex=0;const table=node('table');const head=node('thead');const tr=node('tr');for(const h of ['Name','Designation / Subject','Qualification'])tr.append(node('th',h));head.append(tr);const body=node('tbody');rows.forEach(row=>{const r=node('tr');for(const value of row)r.append(node('td',value));body.append(r);});table.append(head,body);wrap.append(table);section.append(wrap);return section;}
render=function(){originalRender();if(!schoolData)return;
const d=schoolData;
try{
  const prev=document.querySelector('.preview');
  if(prev)prev.textContent=lang==='te'?'సోమారం స్కూల్ వెబ్‌సైట్ ప్రివ్యూ · డొమైన్ కనెక్షన్ పెండింగ్':'TGMS SOMARAM WEBSITE PREVIEW · Domain connection pending';
  const loc=document.querySelector('[data-text="location"]');
  if(loc)loc.textContent=lang==='te'?'సోమారం (గ్రామం), సైదాపూర్ మండలం · కరీంనగర్ జిల్లా · తెలంగాణ':(d.address||'');
  const brand=document.querySelector('.brand');
  const oldSeal=brand?.querySelector('.seal,.principal-masthead');
  if(oldSeal&&brand){
    const p=node('div',null,'principal-masthead');
    const img=node('img');
    img.src=d.principalPhoto||'images/principal-veerababu.jpg';
    img.alt=(d.principal?.name||'Principal')+', Principal FAC';
    p.append(img,node('b',d.principal?.name||'Principal FAC'),node('small','Principal FAC · M.Sc., B.Ed.'));
    brand.replaceChild(p,oldSeal);
  }
  const footer=document.querySelector('footer');
  if(footer){
    let contacts=footer.querySelector('.school-contact');
    if(!contacts){contacts=node('div',null,'school-contact');footer.append(contacts);}
    const email=d.principal?.email||'tgmssomaram.knr@gmail.com';
    contacts.replaceChildren(link(email,'mailto:'+email));
    const sm=footer.querySelector('small');
    if(sm)sm.textContent=lang==='te'?'ప్రిన్సిపాల్, ఫొటోలు, సిబ్బంది వివరాలు స్కూల్ అందించిన సమాచారం ఆధారంగా.':'Principal, photographs and staff details are based on information supplied by the school.';
  }
}catch(e){console.warn('Masthead/footer sync notice:',e);}
const id=location.hash.slice(1)||'home';const main=document.querySelector('main');
if(id==='home'){
 const art=main.querySelector('.illustration');if(art&&d.gallery&&d.gallery[0]){art.replaceChildren();const image=node('img');image.src=d.gallery[0].src;image.alt='Parent–teacher meeting at TGMS Somaram';art.append(image,node('small',lang==='te'?'సోమారం పాఠశాలలో తల్లిదండ్రుల సమావేశం':'PARENT–TEACHER MEETING · TGMS SOMARAM'));}
 const heroP=main.querySelector('.sheet p');if(heroP)heroP.textContent=lang==='te'?'సోమారం తెలంగాణ మోడల్ స్కూల్ & జూనియర్ కళాశాలకు స్వాగతం. సిబ్బంది వివరాలు, పాఠశాల కార్యక్రమాలు, విద్యా వనరులు ఈ వెబ్‌సైట్‌లో చూడవచ్చు.':'Welcome to Telangana Model School & Junior College, Somaram, Suryapet district. Meet our teaching team, explore school activities and access educational resources.';
 const grid=node('section',null,'gallery-grid');for(const photo of (d.gallery||[]).slice(0,3))grid.append(photoCard(photo));main.append(grid);return;}
const sheet=main.querySelector('.sheet');if(!sheet)return;
if(id==='achievements'){
 const photos=(d.gallery||[]).filter(photo=>/^achievements?$/i.test(String(photo.category||'').trim()));
 sheet.replaceChildren(node('h2',lang==='te'?'విద్యార్థుల విజయాలు':'Student Achievements'));
 if(photos.length){const grid=node('div',null,'gallery-grid');photos.forEach(photo=>grid.append(photoCard(photo)));sheet.append(grid);}else sheet.append(node('p',lang==='te'?'విజయాల ఫొటోలు అందిన తర్వాత ఇక్కడ ప్రచురిస్తాము.':'Achievement photographs will appear here when supplied by the school.'));
}else if(id==='gallery'||id==='events'){
 renderModernGalleryPage(sheet, d);
}else if(id==='contact'){
 sheet.replaceChildren(node('h2',t('contact')),node('h3','School Office'),node('p',d.address),node('h3',d.principal.name+' · Principal FAC'),node('p',d.principal.qualification),link('☎ '+d.principal.phone,'tel:+91'+d.principal.phone,'resource'),link('✉ '+d.principal.email,'mailto:'+d.principal.email,'resource'));
}else if(id==='faculty'){
 renderModernFacultyPage(sheet, d);
}else if(id==='strength'||id==='students'||id==='portal'){
 renderModernStrengthPage(sheet, d);
}else if(id==='academics'){
 renderModernAcademicsPage(sheet);
}else if(id==='results'){
 renderModernResultsPage(sheet);
}else if(id==='school'||id==='about-us'){
 const subnav=node('div',null,'school-subpage-nav');
 for(const [sLabel,sTarget] of [
   [lang==='te'?'మా పాఠశాల & ప్రిన్సిపాల్':'Overview & Principal','school'],
   [lang==='te'?'మా గురించి & సందేశం':'About Us & Vision','about-us'],
   [lang==='te'?'విద్యార్థుల సంఖ్య':'School Strength','students'],
   [lang==='te'?'ల్యాబ్‌లు & సదుపాయాలు':'Campus & Labs','campus'],
   [lang==='te'?'పాఠశాలల డైరెక్టరీ':'194 School Directory','directory']
 ]){
   const btn=link(sLabel,'#'+sTarget,'school-subnav-btn'+(id===sTarget?' active':''));
   subnav.append(btn);
 }
 const princMessageNode = node('div', null, 'school-principal-message-card');
 const pm = d.principalPress || {};
 const pmTitle = lang === 'te' ? (pm.teluguTitle || pm.title || 'ప్రిన్సిపాల్ సందేశం') : (pm.title || 'Principal’s Message');
 const pmText = lang === 'te' ? (pm.teluguText || pm.text) : (pm.text || pm.teluguText);
 if (pmText) {
   princMessageNode.append(node('h3', '📜 ' + pmTitle));
   pmText.split(/\n{2,}/).forEach(para => {
     if (para.trim()) princMessageNode.append(node('p', para.trim()));
   });
   if (pm.importantText) {
     const q = node('div', null, 'pm-quote');
     q.append(node('strong', (pm.importantTitle || 'Note') + ': '), document.createTextNode(pm.importantText));
     princMessageNode.append(q);
   }
 }
 sheet.replaceChildren(subnav,node('h2',id==='school'?'Our School & Principal':t('about')),node('p',lang==='te'?'సోమారం తెలంగాణ మోడల్ స్కూల్ & జూనియర్ కళాశాల కరీంనగర్ జిల్లా, సైదాపూర్ మండలంలో ఉంది. విద్య, సహపాఠ్య కార్యక్రమాలు, పాఠశాల–తల్లిదండ్రుల భాగస్వామ్యాన్ని ఈ వెబ్‌సైట్ పరిచయం చేస్తుంది.':'Telangana Model School & Junior College, Somaram is located in Saidapur Mandal, Karimnagar District, Telangana. This website introduces the school’s teaching team, academic areas and school community activities.'),principalCard(),princMessageNode,node('h3',t('vision')),node('p',t('visionBody')),node('h3',t('mission')),node('p',t('missionBody')));
 if(id==='about-us'){
 const messages={
 en:{title:'Dream. Learn. Grow.',intro:'Every student brings curiosity, talent and the ability to grow. At TGMS Somaram, let your education be a journey of discovery: ask questions, practise with purpose and take one positive step every day.',items:[['Believe in your potential','Your present marks do not define your future. Set a realistic goal, recognise your strengths and build confidence through steady effort.'],['Small steps, lasting progress','Follow a daily study plan, revise regularly and ask for help when a concept is difficult. Mistakes are opportunities to understand and improve.'],['Learn beyond the textbook','Read widely, explore science and technology, express yourself through art and take part in sports. Curiosity and creativity help you discover new possibilities.'],['Grow together','Respect others, support your classmates and work honestly. Kindness, teamwork and responsibility are as valuable as academic knowledge.'],['Care for yourself','Make time for sleep, movement and rest. Share your concerns with a trusted teacher, parent or guardian; asking for support is a strength.']],closing:'Your next chapter begins with what you choose to learn today.'},
 te:{title:'కలలు కనండి. నేర్చుకోండి. ఎదగండి.',intro:'ప్రతి విద్యార్థిలో ఆసక్తి, ప్రతిభ, ఎదగగల సామర్థ్యం ఉంటాయి. సోమారం TGMSలో మీ విద్యా ప్రయాణాన్ని అన్వేషణగా మార్చుకోండి: ప్రశ్నించండి, పట్టుదలతో సాధన చేయండి, ప్రతిరోజూ ఒక మంచి అడుగు ముందుకు వేయండి.',items:[['మీ సామర్థ్యాన్ని నమ్మండి','ప్రస్తుత మార్కులే మీ భవిష్యత్తును నిర్ణయించవు. సాధించగల లక్ష్యాన్ని ఎంచుకోండి, మీ బలాలను గుర్తించండి, నిరంతర కృషితో ఆత్మవిశ్వాసాన్ని పెంచుకోండి.'],['చిన్న అడుగులతో గొప్ప పురోగతి','రోజువారీ చదువు ప్రణాళికను పాటించండి, క్రమం తప్పకుండా పునశ్చరణ చేయండి. అర్థం కానప్పుడు సహాయం అడగండి. తప్పులను నేర్చుకునే అవకాశాలుగా చూడండి.'],['పాఠ్యపుస్తకాలకు మించి నేర్చుకోండి','పుస్తకాలు చదవండి, విజ్ఞానాన్ని అన్వేషించండి, కళలు–క్రీడల్లో పాల్గొనండి. జిజ్ఞాస, సృజనాత్మకత కొత్త అవకాశాలను పరిచయం చేస్తాయి.'],['కలిసి ఎదగండి','అందరినీ గౌరవించండి, సహవిద్యార్థులకు తోడ్పడండి, నిజాయితీగా పనిచేయండి. దయ, సహకారం, బాధ్యత కూడా విద్యలో ముఖ్యమైన భాగాలే.'],['మీ ఆరోగ్యాన్ని చూసుకోండి','నిద్ర, వ్యాయామం, విశ్రాంతికి సమయం ఇవ్వండి. ఆందోళనలను నమ్మకమైన ఉపాధ్యాయులు లేదా తల్లిదండ్రులతో పంచుకోండి. సహాయం కోరడం ధైర్యానికి గుర్తు.']],closing:'ఈ రోజు మీరు నేర్చుకునే విషయంతోనే మీ రేపటి ప్రయాణం మొదలవుతుంది.'},
 hi:{title:'सपने देखें। सीखें। आगे बढ़ें।',intro:'हर विद्यार्थी में जिज्ञासा, प्रतिभा और आगे बढ़ने की क्षमता है। TGMS सोमाराम में अपनी शिक्षा को खोज की यात्रा बनाएं: प्रश्न पूछें, नियमित अभ्यास करें और हर दिन एक सकारात्मक कदम उठाएं।',items:[['अपनी क्षमता पर विश्वास रखें','आज के अंक आपका भविष्य तय नहीं करते। एक व्यावहारिक लक्ष्य चुनें और निरंतर प्रयास से आत्मविश्वास बढ़ाएं।'],['छोटे कदम, निरंतर प्रगति','रोज पढ़ने की योजना बनाएं, दोहराएं और कठिन विषयों में मदद मांगें। गलतियों से सीखकर सुधार करें।'],['पुस्तकों से आगे सीखें','पढ़ें, विज्ञान को खोजें और कला व खेल में भाग लें। जिज्ञासा और रचनात्मकता नई संभावनाएं खोलती हैं।'],['मिलकर आगे बढ़ें','दूसरों का सम्मान करें और सहपाठियों की मदद करें। ईमानदारी, दया और जिम्मेदारी को अपनाएं।'],['अपना ध्यान रखें','नींद, व्यायाम और आराम के लिए समय निकालें। अपनी चिंताएं किसी भरोसेमंद शिक्षक या अभिभावक से साझा करें।']],closing:'आज की सीख से आपके कल की शुरुआत होती है।'}
 };
 const message=messages[lang]||messages.en;
 const inspiration=node('section',null,'about-inspiration');
 inspiration.append(node('h3',message.title),node('p',message.intro));
 const cards=node('div',null,'cards');
 for(const [heading,body] of message.items){const card=node('article',null,'card');card.append(node('h3',heading),node('p',body));cards.append(card);}
 const closing=node('blockquote',message.closing);
 inspiration.append(cards,closing);sheet.append(inspiration);
 }
}else if(id==='academics'){
 sheet.replaceChildren(node('h2',lang==='te'?'విద్యా విభాగాలు':'Academics & Vocational Learning'),node('h3','Subject Areas'),node('p','Mathematics · Physics · Chemistry · Botany · Zoology · Economics · Civics · Commerce · English · Telugu · Hindi · Social Studies'),node('h3','Vocational Education'),node('p','Media and Entertainment · Health Care'),node('p',lang==='te'?'తరగతులు, గ్రూపులు, ప్రవేశాల సీట్ల వివరాలు పాఠశాల నిర్ధారణ తర్వాత జోడిస్తాము.':'Class-wise courses, Intermediate groups and admission seat details will be added after school confirmation.','pending'));
}}

