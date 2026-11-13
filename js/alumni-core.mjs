export function alumniPhoto(value) {
 const s=String(value||'').trim();
 return /^\/api\/photos\/[a-f0-9-]+\.(?:jpe?g|png|webp)$/i.test(s)||/^\/images\/[a-z0-9_./-]+\.(?:jpe?g|png|webp)$/i.test(s)&&!s.includes('..')?s:'';
}
export function alumniRecords(rows) {
 if(!Array.isArray(rows)||rows.length>100)throw Error('Use up to 100 alumni entries.');
 return rows.map(r=>{
  const out={id:String(r.id||''),name:String(r.name||'').trim(),batch:String(r.batch||'').trim(),achievement:String(r.achievement||'').trim(),photo:alumniPhoto(r.photo),approved:r.approved===true};
  if(!out.name||out.name.length>100||out.batch.length>40||out.achievement.length>600)throw Error('Enter an alumni name (up to 100 characters), batch (40) and story (600).');
  if(r.photo&&!out.photo)throw Error('Choose a school photo using Upload.');
  return out;
 });
}
