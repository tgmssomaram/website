import {schoolAnswer, safeWebsite} from './school-help-core.mjs';
const make = (tag, value, cls) => { const e=document.createElement(tag); if(value)e.textContent=value;if(cls)e.className=cls;return e; };
const anchor = (title,href) => {const a=make('a',title);a.href=href;if(href.startsWith('https:')){a.target='_blank';a.rel='noopener noreferrer';}return a;};
let directoryPromise;
const directory = () => directoryPromise ||= fetch('data/school-directory-websites.json').catch(()=>fetch('/data/school-directory-websites.json')).then(r=>{if(!r.ok)throw Error('Directory unavailable');return r.json();}).catch(error=>{directoryPromise=null;throw error;});
const language = () => document.documentElement.lang || 'en';
const label = (en,te,hi) => language()==='te'?te:language()==='hi'?hi:en;
export async function renderSchoolDirectory(sheet) {
  sheet.setAttribute('translate','no');
  sheet.replaceChildren();sheet.classList.add('school-directory-page');
  sheet.append(make('span','EXPLORE TELANGANA','directory-eyebrow'),make('h2',label('194 Model Schools','194 మోడల్ స్కూల్స్','194 मॉडल स्कूल')),
    make('p',label('Find a school by district, mandal or name. Published website links open in a new tab.','జిల్లా, మండలం, స్కూల్ పేరుతో వెతకండి. వెబ్‌సైట్ లింకులు కొత్త ట్యాబ్‌లో తెరుచుకుంటాయి.','जिला, मंडल या विद्यालय के नाम से खोजें। वेबसाइट लिंक नए टैब में खुलते हैं।')));
  const tools=make('div',null,'directory-tools');const search=make('input');search.type='search';search.placeholder=label('Search school / district / mandal','స్కూల్ / జిల్లా / మండలం వెతకండి','विद्यालय / जिला / मंडल खोजें');search.setAttribute('aria-label',search.placeholder);
  const select=make('select');select.setAttribute('aria-label','Filter by district');select.append(new Option(label('All districts','అన్ని జిల్లాలు','सभी जिले'),''));
  const only=make('input');only.type='checkbox';const check=make('label',null,'directory-online');check.append(only,make('span',label('With website links','వెబ్‌సైట్ లింకులు ఉన్నవి','वेबसाइट लिंक वाले')));tools.append(search,select,check);
  const count=make('p',label('Loading schools…','స్కూల్స్ లోడ్ అవుతున్నాయి…','विद्यालय लोड हो रहे हैं…'),'directory-count');count.setAttribute('role','status');
  const results=make('div',null,'directory-districts');sheet.append(tools,count,results);
  const source=make('p',null,'directory-source');source.append(document.createTextNode('Directory source: '),anchor('Telangana Model Schools — district list','https://telanganamodelschool.com/schools'),document.createTextNode(' · checked 23 October 2026. Seven independently confirmed TGMS website links added. This source is a public directory, not a government certification. Missing links are not guessed. Mandal names supplemented from the original PDF can use older administrative labels. '),anchor('Original 194-school PDF','/downloads/telangana-model-schools-194-source.pdf'));sheet.append(source);
  try {
    const schools=await directory();if(!sheet.isConnected)return;
    for(const district of [...new Set(schools.map(s=>s.district))].sort())select.append(new Option(district,district));
    const fill=()=>{
      const q=search.value.trim().toLowerCase();const filtered=schools.filter(s=>(!select.value||s.district===select.value)&&(!only.checked||safeWebsite(s.website))&&[s.location,s.district,s.mandal,...(s.aliases||[])].join(' ').toLowerCase().includes(q));
      count.textContent=`${filtered.length} / ${schools.length} ${label('schools','స్కూల్స్','विद्यालय')} · ${schools.filter(s=>safeWebsite(s.website)).length} ${label('website links','వెబ్‌సైట్ లింకులు','वेबसाइट लिंक')}`;
      results.replaceChildren();
      if(!filtered.length){results.append(make('p',label('No schools found. Try another name or clear the filters.','స్కూల్స్ కనిపించలేదు. మరో పేరు ప్రయత్నించండి లేదా ఫిల్టర్లు తీసేయండి.','कोई विद्यालय नहीं मिला। दूसरा नाम खोजें या फ़िल्टर हटाएँ।')));return;}
      for(const district of [...new Set(filtered.map(s=>s.district))].sort()){
        const entries=filtered.filter(s=>s.district===district),group=make('section',null,'directory-district');const heading=make('h3',district);heading.append(make('span',String(entries.length)));const grid=make('ul',null,'directory-school-grid');
        for(const s of entries){const li=make('li',null,'directory-school');const href=safeWebsite(s.website),body=href?anchor(s.location+' ↗',href):make('strong',s.location);body.classList.add('directory-school-name');li.append(body);const address=make('address',s.address||[s.location,s.mandal?s.mandal+' Mandal':null,s.district+' District','Telangana'].filter(Boolean).join(', '),'directory-address');li.append(address);const url=href?anchor(href,href):make('span',label('Website link not available','వెబ్‌సైట్ లింక్ అందుబాటులో లేదు','वेबसाइट लिंक उपलब्ध नहीं'));url.className=href?'directory-domain':'directory-unavailable';li.append(url);grid.append(li);}
        group.append(heading,grid);results.append(group);
      }
    };search.addEventListener('input',fill);select.addEventListener('change',fill);only.addEventListener('change',fill);fill();
  } catch {count.textContent=label('Directory could not be loaded. Please try again.','డైరెక్టరీ లోడ్ కాలేదు. మళ్లీ ప్రయత్నించండి.','निर्देशिका लोड नहीं हुई। फिर प्रयास करें।');results.append(anchor('View source directory ↗','https://telanganamodelschool.com/schools'));}
}
if(typeof schoolDirectoryPage==='function')schoolDirectoryPage=renderSchoolDirectory;
let configPromise;
async function publicSchoolContext(){
  if(typeof schoolData==='object'&&schoolData)return schoolData;
  try{
    const config=await(configPromise ||= fetch('data/school-assistant-config.json').catch(()=>fetch('/data/school-assistant-config.json')).then(r=>{if(!r.ok)throw Error();return r.json();}));
    try{const response=await fetch('api/content').catch(()=>fetch('/api/content'));if(!response.ok)throw Error();const content=await response.json();let p=content.values?.[config.profileKey];if(typeof p==='string')p=JSON.parse(p);if(p)return {address:p.address,principal:{name:p.principalName,designation:p.principalDesignation,phone:p.principalPhone,email:p.officialEmail}};}catch{}
    return config.fallback||{};
  }catch{return {};}
}
function openDirectoryOverlay(){
 if(document.querySelector('.school-directory-overlay'))return;
 const previous=document.activeElement,overlay=make('div',null,'school-directory-overlay');overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','194 school directory');
 const close=make('button','Close directory','directory-close');close.type='button';const sheet=make('section',null,'sheet');overlay.append(close,sheet);document.body.append(overlay);close.focus();
 const dismiss=()=>{overlay.remove();if(previous?.isConnected)previous.focus();};close.addEventListener('click',dismiss);overlay.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();dismiss();}if(e.key==='Tab'){const items=[...overlay.querySelectorAll('button,a,input,select')].filter(e=>!e.disabled);if(e.shiftKey&&document.activeElement===items[0]){e.preventDefault();items.at(-1)?.focus();}else if(!e.shiftKey&&document.activeElement===items.at(-1)){e.preventDefault();items[0]?.focus();}}});renderSchoolDirectory(sheet);
}
// React sites keep their own navigation and data; the shared public directory is an overlay.
document.addEventListener('click',e=>{
 if(!document.querySelector('.final-template-nav'))return;
 const control=e.target.closest('a,button');if(!control)return;
 const href=control.getAttribute('href');
 if(href==='#directory'||(/^(194\s*schools|school directory)$/i.test(control.textContent.trim())&&!control.closest('.school-directory-overlay'))){e.preventDefault();e.stopImmediatePropagation();openDirectoryOverlay();return;}
 if(!control.closest('.school-help-sources')||!href?.startsWith('#'))return;
 const targets={principal:[/^our school$/i],contact:[/^contact us$/i,/^contact/i],admissions:[/^admissions$/i],faculty:[/^faculty$/i,/^our team$/i],strength:[/^school strength$/i],books:[/^books download$/i],portal:[/^student portal$/i],academics:[/^academic programmes$/i,/^academics$/i]};
 const tests=targets[href.slice(1)]||[];const buttons=[...document.querySelectorAll('.final-template-nav .final-nav-panel button,.final-template-nav>button')];
 const button=buttons.find(b=>tests.some(re=>re.test(b.textContent.trim())));if(button){e.preventDefault();e.stopImmediatePropagation();button.click();}
},true);
let hoverTimer;
document.addEventListener('pointerover',e=>{const group=e.target.closest('.final-nav-group,.model-nav-group');if(!group||group.contains(e.relatedTarget)||!matchMedia('(hover: hover) and (pointer: fine)').matches)return;clearTimeout(hoverTimer);const b=group.querySelector('.final-nav-trigger,.model-nav-trigger');if(b?.getAttribute('aria-expanded')==='false')b.click();});
document.addEventListener('pointerout',e=>{const group=e.target.closest('.final-nav-group,.model-nav-group');if(!group||group.contains(e.relatedTarget))return;hoverTimer=setTimeout(()=>{const b=group.querySelector('.final-nav-trigger,.model-nav-trigger');if(!group.matches(':hover')&&!group.contains(document.activeElement)&&b?.getAttribute('aria-expanded')==='true')b.click();},180);});
function installAssistant() {
  const launch=make('button','Ask Veda','school-help-launch');launch.type='button';launch.setAttribute('aria-expanded','false');launch.setAttribute('aria-controls','school-help-panel');
  launch.setAttribute('translate','no');
  const panel=make('section',null,'school-help-panel');panel.id='school-help-panel';panel.hidden=true;panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','false');panel.setAttribute('aria-labelledby','school-help-title');
  panel.setAttribute('translate','no');
  const head=make('div',null,'school-help-heading');const title=make('h2','Ask Veda');title.id='school-help-title';const close=make('button','×');close.type='button';close.setAttribute('aria-label','Close Ask Veda');head.append(title,close);
  const intro=make('p',label('A guide to this school’s published information. Source-based answers, not a live AI service. Do not share passwords, OTPs or personal student data.','స్కూల్ ప్రచురించిన సమాచారం ఆధారంగా సహాయం. ఇది లైవ్ AI సేవ కాదు. పాస్‌వర్డ్‌లు, OTPలు, విద్యార్థుల వ్యక్తిగత వివరాలు పంపవద్దు.','विद्यालय की प्रकाशित जानकारी का मार्गदर्शक। यह लाइव AI सेवा नहीं है। पासवर्ड, OTP या निजी छात्र विवरण न भेजें।'),'school-help-intro');
  const log=make('div',null,'school-help-log');log.setAttribute('role','log');log.setAttribute('aria-live','polite');log.setAttribute('aria-label','Ask Veda conversation');
  const suggestions=make('div',null,'school-help-suggestions');
  const form=make('form');const questionLabel=make('label',label('Your question','మీ ప్రశ్న','आपका प्रश्न'));questionLabel.htmlFor='school-help-question';const input=make('input');input.id='school-help-question';input.maxLength=500;input.required=true;input.autocomplete='off';const send=make('button',label('Ask','అడగండి','पूछें'));send.type='submit';const clear=make('button',label('Clear chat','చాట్ తొలగించండి','चैट साफ़ करें'));clear.type='button';clear.addEventListener('click',()=>{log.replaceChildren();input.value='';input.focus();});form.append(questionLabel,input,send,clear);
  panel.append(head,intro,suggestions,log,form);document.body.append(panel,launch);
  function toggle(open){panel.hidden=!open;launch.setAttribute('aria-expanded',String(open));if(open)input.focus();else launch.focus();}
  launch.addEventListener('click',()=>toggle(panel.hidden));close.addEventListener('click',()=>toggle(false));panel.addEventListener('keydown',e=>{if(e.key==='Escape')toggle(false);});
  let busy=false;
  async function ask(value) {
    const q=value.trim();if(!q||q.length>500||busy)return;busy=true;send.disabled=true;input.value='';
    log.append(make('p',q,'school-help-user'));
    try {
      let schools=[];try{schools=await directory();}catch{}
      const data=await publicSchoolContext();
      const response=schoolAnswer(q,data,schools,language());const message=make('div',null,'school-help-answer');message.append(make('p',response.body));
      const sources=make('div',null,'school-help-sources');for(const [name,href]of response.links){if(href.startsWith('#')||safeWebsite(href))sources.append(anchor(name,href));}message.append(sources);log.append(message);log.scrollTop=log.scrollHeight;
      // Keep only a short in-memory display; no localStorage or server chat history.
      while(log.children.length>20)log.firstElementChild.remove();
    } finally {busy=false;send.disabled=false;input.focus();}
  }
  for(const q of [label('How do I apply for admission?','ప్రవేశానికి దరఖాస్తు ఎలా?','प्रवेश के लिए आवेदन कैसे करें?'),label('194 schools directory','194 స్కూల్స్ డైరెక్టరీ','194 विद्यालयों की निर्देशिका'),label('Principal details','ప్రిన్సిపాల్ వివరాలు','प्रधानाचार्य विवरण')]){const b=make('button',q);b.type='button';b.addEventListener('click',()=>ask(q));suggestions.append(b);}
  form.addEventListener('submit',e=>{e.preventDefault();ask(input.value);});
}
function installDirectoryButton(){
 const nav=document.querySelector('#menu,.final-template-nav');
 if(!nav||nav.querySelector('.model-directory-button'))return;
 const button=anchor('194 MODEL SCHOOLS','#directory');button.className='model-directory-button';button.setAttribute('translate','no');
 const contact=[...nav.children].find(e=>e.matches('a[href="#contact"]')||e.matches('button')&&/^contact(?: us)?$/i.test(e.textContent.trim()));
 nav.insertBefore(button,contact||null);
}
installDirectoryButton();
let directoryButtonQueued=false;
new MutationObserver(()=>{if(directoryButtonQueued)return;directoryButtonQueued=true;queueMicrotask(()=>{directoryButtonQueued=false;installDirectoryButton();});}).observe(document.body,{childList:true,subtree:true});
installAssistant();
if(location.hash==='#directory'&&typeof render==='function')render();
