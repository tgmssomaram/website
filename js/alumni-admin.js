import {alumniRecords,alumniPhoto} from './alumni-core.mjs';
(() => {
 const el=(tag,text,cls)=>{const e=document.createElement(tag);if(text)e.textContent=text;if(cls)e.className=cls;return e;};
 const button=(text,fn)=>{const b=el('button',text);b.type='button';b.onclick=fn;return b;};
 function editor(host){
  const form=el('form','','tgms-alumni-admin admin-form');form.dataset.adminSection='alumni';
  form.append(el('h3','Alumni / పూర్వ విద్యార్థులు'),el('p','Add alumni names, batches, stories and photos. Tick publication permission to display an entry. Save & publish applies all changes. Removing a photo removes it from the website; the stored file is retained.'));
  const box=el('div'),status=el('p');status.setAttribute('role','status');let entries=[];
  function add(value={}){
   if(entries.length>=100){status.textContent='Maximum 100 entries.';return;}
   const row=el('fieldset','','tgms-alumni-row');row.append(el('legend','Alumni entry'));
   const entry={row,id:value.id||crypto.randomUUID(),photo:alumniPhoto(value.photo),inputs:{}};
   for(const [key,title,max] of [['name','Alumni name',100],['batch','Batch / passing year',40],['achievement','Achievement / story',600]]){
    const label=el('label',title),input=el(key==='achievement'?'textarea':'input');if(key!=='achievement')input.type='text';else input.rows=3;input.value=value[key]||'';input.maxLength=max;input.required=key==='name';label.append(input);row.append(label);entry.inputs[key]=input;
   }
   const thumb=el('img');thumb.alt=value.name||'Alumni photo';thumb.width=120;thumb.height=150;
   function show(){thumb.hidden=!entry.photo;if(entry.photo)thumb.src=entry.photo;else thumb.removeAttribute('src');}
   const label=el('label','Upload / replace photo'),file=el('input');file.type='file';file.accept='image/jpeg,image/png,image/webp';label.append(file);entry.file=file;
   row.append(thumb,label,button('Remove photo',()=>{entry.photo='';file.value='';show();}));
   const consent=el('label','School approved; permission to publish this name, story and photo is confirmed.'),check=el('input');check.type='checkbox';check.checked=value.approved===true;consent.prepend(check);entry.approved=check;
   row.append(consent,button('Remove alumni entry',()=>{entries=entries.filter(x=>x!==entry);row.remove();}));show();entries.push(entry);box.append(row);
  }
  for(const r of schoolData.alumni||[])add(r);
  const save=el('button','Save & publish alumni','action');save.type='submit';
  form.append(box,button('+ Add alumni',()=>add()),save,status);
  form.onsubmit=async e=>{
   e.preventDefault();const previous=schoolData.alumni;form.inert=true;status.textContent='Saving alumni…';
   try{
    // Validate every row before uploading any file or changing the school profile.
    alumniRecords(entries.map(x=>({id:x.id,...Object.fromEntries(Object.entries(x.inputs).map(([k,i])=>[k,i.value])),photo:x.photo,approved:x.approved.checked})));
    for(const x of entries)if(x.file.files?.[0]){status.textContent='Uploading photo: '+x.inputs.name.value; x.photo=await managedUpload(x.file.files[0],900);x.file.value='';}
    const next=alumniRecords(entries.map(x=>({id:x.id,...Object.fromEntries(Object.entries(x.inputs).map(([k,i])=>[k,i.value])),photo:x.photo,approved:x.approved.checked})));
    schoolData.alumni=next;
    try{await publishSchool();}catch(error){schoolData.alumni=previous;throw error;}
    for(const x of entries){const img=x.row.querySelector('img');img.hidden=!x.photo;if(x.photo)img.src=x.photo;}
    status.textContent=next.length+' alumni entries saved. '+next.filter(r=>r.approved).length+' published.';
    window.dispatchEvent(new Event('tgms-content'));
   }catch(error){status.textContent='Not published: '+error.message;}finally{form.inert=false;}
  };
  host.append(form);
 }
 let queued=false;
 function apply(){queued=false;
  const signed=typeof adminSignedIn==='boolean'&&adminSignedIn&&typeof schoolData==='object'&&schoolData;
  if(!signed){document.querySelectorAll('.tgms-alumni-admin').forEach(e=>e.remove());return;}
  const host=document.querySelector('.photo-manager-react-admin')||(location.hash==='#admin'?document.querySelector('#main .sheet'):null);
  if(host&&!host.querySelector('.tgms-alumni-admin'))editor(host);
 }
 function schedule(){if(!queued){queued=true;requestAnimationFrame(apply);}}
 new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
 addEventListener('hashchange',schedule);addEventListener('tgms-content',schedule);schedule();
})();
