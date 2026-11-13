// School-specific faculty passport photo editor. Uses existing authenticated photo/profile APIs.
async function fitFacultyPassport(file) {
 if(!file||!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>10485760)throw Error('Choose a JPG, PNG or WebP photo under 10 MB.');
 const image=await createImageBitmap(file);
 try{
  if(!image.width||!image.height)throw Error('This image could not be opened.');
  const canvas=document.createElement('canvas');canvas.width=400;canvas.height=500;
  const ctx=canvas.getContext('2d');if(!ctx)throw Error('Photo processing is unavailable.');
  const scale=Math.max(400/image.width,500/image.height),width=image.width*scale,height=image.height*scale;
  ctx.fillStyle='#fff';ctx.fillRect(0,0,400,500);ctx.drawImage(image,(400-width)/2,(500-height)*.2,width,height);
  const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',.86));if(!blob)throw Error('Photo processing failed.');
  return new File([blob],'faculty-passport.jpg',{type:'image/jpeg'});
 }finally{image.close();}
}
function facultyPhotoEditor(sheet) {
 const form=node('form',null,'admin-form');form.append(node('h3','Faculty Passport Photos'),node('p','Choose a faculty member and upload a photo. It is automatically fitted to a 4:5 passport frame and shown beside their name.'));
 const people=new Map();for(const key of ['faculty','guest','vocational','support'])for(const row of schoolData[key]||[])if(row[0]&&!people.has(row[0]))people.set(row[0],row[1]||'');
 if(!people.size){form.append(node('p','Add faculty names first, then upload their photographs.'));sheet.append(form);return;}
 const label=node('label','Faculty member'),select=node('select');select.setAttribute('aria-label','Faculty member');
 for(const [name,role]of people){const option=node('option',name+' — '+role);option.value=name;select.append(option);}label.append(select);form.append(label);
 const preview=node('img');preview.className='faculty-passport-preview';preview.alt='Selected faculty passport photo';preview.hidden=true;form.append(preview);
 const file=field(form,'Choose passport photo','','file');file.accept='image/jpeg,image/png,image/webp';
 const save=submitButton(form,'Fit, upload & publish photo'),remove=node('button','Remove published photo'),status=statusNode(form);remove.type='button';form.append(remove);
 let temporary='';const clearTemporary=()=>{if(temporary){URL.revokeObjectURL(temporary);temporary='';}};
 const showSaved=()=>{clearTemporary();file.value='';const src=(schoolData.staffPhotos||{})[select.value];preview.hidden=!src;if(src)preview.src=src;else preview.removeAttribute('src');};
 select.onchange=showSaved;showSaved();
 file.onchange=()=>{clearTemporary();const selected=file.files?.[0];if(!selected){showSaved();return;}if(!['image/jpeg','image/png','image/webp'].includes(selected.type)||selected.size>10485760){showSaved();status.textContent='Choose a JPG, PNG or WebP under 10 MB.';return;}temporary=URL.createObjectURL(selected);preview.src=temporary;preview.hidden=false;status.textContent='Photo selected. It will be fitted automatically when published.';};
 form.onsubmit=async e=>{e.preventDefault();save.disabled=remove.disabled=select.disabled=true;try{const name=select.value;if(!people.has(name))throw Error('Choose an existing faculty member.');const fitted=await fitFacultyPassport(file.files?.[0]),url=await managedUpload(fitted,500),previous=schoolData.staffPhotos;schoolData.staffPhotos={...(previous||{}),[name]:url};try{await publishSchool();}catch(error){schoolData.staffPhotos=previous;throw error;}showSaved();status.textContent='Passport photo fitted and published for '+name+'.';}catch(error){status.textContent=error.message;}finally{save.disabled=remove.disabled=select.disabled=false;}};
 remove.onclick=async()=>{save.disabled=remove.disabled=select.disabled=true;const previous=schoolData.staffPhotos;try{const next={...(previous||{})};delete next[select.value];schoolData.staffPhotos=next;try{await publishSchool();}catch(error){schoolData.staffPhotos=previous;throw error;}showSaved();status.textContent='Photo removed from the faculty page. The stored file has not been deleted.';}catch(error){status.textContent=error.message;}finally{save.disabled=remove.disabled=select.disabled=false;}};
 sheet.append(form);
}
if(location.hash==='#admin'&&typeof render==='function'&&typeof schoolData==='object'&&schoolData)render();
