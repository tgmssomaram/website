(()=>{
  const el=(tag,text)=>{const e=document.createElement(tag);if(text)e.textContent=text;return e;};
  function inquiry(){
    const form=el('form');form.dataset.privateInquiry='1';form.style.cssText='display:grid;gap:14px;max-width:640px;padding:20px;border:1px solid #ccc;border-radius:12px;background:white;color:#123';
    form.append(el('h2','School Inquiry / స్కూల్ విచారణ'),el('p','Official admission applications must be completed separately through the CGG portal. We collect only these details for school follow-up.'));
    const fields={};for(const [key,title,type,max]of [['studentName','Student name / విద్యార్థి పేరు','text',120],['fatherName','Parent / guardian name / సంరక్షకుని పేరు','text',120],['phone','Guardian phone / సంరక్షకుని ఫోన్','tel',10],['email','Email (optional)','email',150],['targetClass','Class / group sought','text',80]]){
      const label=el('label',title),input=el('input');input.type=type;input.name=key;input.maxLength=max;input.required=key!=='email';input.style.cssText='display:block;width:100%;padding:10px;box-sizing:border-box';if(key==='phone')input.pattern='[0-9]{10}';label.append(input);fields[key]=input;form.append(label);
    }
    const label=el('label'),consent=el('input');consent.type='checkbox';consent.required=true;label.append(consent,document.createTextNode(' I consent to private school follow-up and deletion after 90 days. / వివరాలను స్కూల్ విచారణకు మాత్రమే వాడి 90 రోజుల తరువాత తొలగించేందుకు సమ్మతిస్తున్నాను.'));form.append(label,el('p','Do not enter DOB, address, Aadhaar, caste, bank details or identity documents.'));
    const button=el('button','Submit inquiry / పంపండి'),status=el('p');button.type='submit';status.setAttribute('role','status');form.append(button,status);let requestId=crypto.randomUUID();
    form.addEventListener('submit',async event=>{event.preventDefault();if(!consent.checked||!form.reportValidity())return;button.disabled=true;try{const data=Object.fromEntries(Object.entries(fields).map(([k,v])=>[k,v.value.trim()]));const r=await fetch('/api/admissions',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...data,requestId,consent:true})});const body=await r.json();if(!r.ok)throw Error(body.error||'Could not save');status.textContent='Saved privately. Reference: '+body.appNumber;form.reset();requestId=crypto.randomUUID();}catch(e){status.textContent=e.message;}finally{button.disabled=false;}});return form;
  }
  function enhance(){
    const place=document.getElementById('private-inquiry');if(place&&!place.firstChild)place.append(inquiry());
    for(const old of document.querySelectorAll('form.admission-inquiry-form,#admissions form'))if(!old.dataset.privateInquiry)old.replaceWith(inquiry());
    for(const form of document.querySelectorAll('form.ss-form'))if(form.querySelector('textarea')&&!form.querySelector('[data-feedback-consent]')){
      const label=el('label'),check=el('input');check.type='checkbox';check.required=true;check.dataset.feedbackConsent='1';label.append(check,document.createTextNode(' I consent to private school feedback processing and deletion after 90 days. / 90 రోజుల గోప్య నిల్వకు సమ్మతిస్తున్నాను.'));form.insertBefore(label,form.querySelector('button[type=submit]')||form.lastChild);
    }
  }
  const original=window.fetch.bind(window);window.fetch=async(input,options)=>{
    const url=new URL(typeof input==='string'?input:input.url,location.href);
    if(url.origin===location.origin&&url.pathname==='/api/feedback'&&options?.method==='POST'){
      if(!document.querySelector('[data-feedback-consent]:checked'))return new Response(JSON.stringify({error:'Please confirm private feedback processing and the 90-day deletion policy.'}),{status:400,headers:{'Content-Type':'application/json'}});
      try{options={...options,body:JSON.stringify({...JSON.parse(options.body),consent:true})};}catch{}
    }return original(input,options);
  };
  let pending=false;new MutationObserver(()=>{if(!pending){pending=true;requestAnimationFrame(()=>{pending=false;enhance();});}}).observe(document.documentElement,{childList:true,subtree:true});enhance();
})();