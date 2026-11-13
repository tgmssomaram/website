'use strict';
function flashNewsEditor(sheet){
 const form=node('form',null,'admin-form');form.id='flash-news-editor';
 form.append(node('h3','FLASH NEWS · Add / Edit / Delete'),node('p','Add news, edit its text, or delete an item. Clear all removes every Flash News item from the draft. Press Save & publish Flash News to apply changes to the live website. Latest News and calendar stay separate.'),node('p','వార్తలు జోడించండి, మార్చండి లేదా తొలగించండి. చివరగా Save & publish Flash News నొక్కండి.'));
 const fields=node('fieldset');fields.style.border='0';fields.style.padding='0';fields.style.minWidth='0';
 let items=(schoolData.flashNews||[]).map(item=>({...item}));const list=node('div');
 const status=node('p');status.setAttribute('role','status');
 function fill(){
  list.replaceChildren(node('p',items.length+' Flash News item(s)'));
  if(!items.length)list.append(node('p','No Flash News items. Click Add Flash News to create one.'));
  items.forEach((item,index)=>{
   const row=node('div',null,'managed-content-row');
   const title=field(row,'News '+(index+1)+' — Telugu / English',item.title||'','textarea');title.required=true;title.maxLength=2000;title.rows=3;
   title.addEventListener('input',()=>{item.title=title.value;item.detail=title.value;});
   const remove=node('button','Delete this news');remove.type='button';remove.setAttribute('aria-label','Delete Flash News '+(index+1));
   remove.onclick=()=>{items=items.filter(value=>value!==item);fill();status.textContent='Removed from draft. Press Save & publish Flash News to make this deletion live.';};row.append(remove);list.append(row);
  });
 }
 const add=node('button','+ Add Flash News');add.type='button';add.onclick=()=>{items.push({id:crypto.randomUUID(),title:'',detail:'',date:indiaToday()});fill();};
 const clear=node('button','Clear all Flash News');clear.type='button';clear.onclick=()=>{if(confirm('Clear all Flash News? Changes go live only after Save & publish.')){items=[];fill();status.textContent='Draft cleared. Press Save & publish Flash News to remove all Flash News from the website.';}};
 const save=submitButton(fields,'Save & publish Flash News');fields.prepend(list,add,clear);form.append(fields,status);fill();
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(items.some(item=>!item.title.trim())){status.textContent='Enter text for every news item.';return;}
  const previous=schoolData.flashNews;fields.disabled=true;status.textContent='Publishing Flash News…';schoolData.flashNews=items.map(item=>({...item,title:item.title.trim(),detail:(item.detail||item.title).trim()}));
  try{await publishSchool();renderNews();status.textContent='Flash News published successfully. Additions, edits and deletions are now live.';}
  catch(error){schoolData.flashNews=previous;status.textContent=error.message;}
  finally{fields.disabled=false;}
 });sheet.prepend(form);
}
