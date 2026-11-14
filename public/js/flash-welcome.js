// Welcome text belongs to this school's Flash News, never Latest News.
(() => {
 let queued=false;
 function apply(){queued=false;
  const configured=document.querySelector('meta[name="tgms-school-name"]')?.content;
  const name=String(configured || (typeof schoolData==='object'&&schoolData?.settings?.schoolTitle) || (typeof text==='object'&&text.en?.school) || document.querySelector('.model-menu-school-name strong')?.textContent || '').trim();
  if(!name)return;
  const welcome='WELCOME TO '+name.toUpperCase();
  const main=document.querySelector('main'),fallback=document.querySelector('[data-flash-welcome-fallback]');
  const native=[...document.querySelectorAll('.model-flash-news .news-group,.bulletin[data-news-kind="flash"] .news-group')].some(g=>!g.closest('[data-flash-welcome-fallback]'));
  if(native&&fallback)fallback.remove();
  // A custom text-only home can omit the usual campus/news layout.
  if(!native&&!fallback&&main?.id==='main'&&(!location.hash||location.hash==='#home')&&typeof renderNews==='function'&&typeof schoolData==='object'&&schoolData){
   const bar=document.createElement('div');bar.className='bulletin model-home-bulletin model-flash-news';bar.dataset.newsKind='flash';bar.dataset.flashWelcomeFallback='true';main.prepend(bar);renderNews(bar);
  }
  for(const group of document.querySelectorAll('.model-flash-news .news-group,.bulletin[data-news-kind="flash"] .news-group,.news-bulletin-flash .bulletin-track > span')){
   let item=group.querySelector('[data-flash-welcome]');
   if(item){if(item.textContent!==welcome+'  ✦  ')item.textContent=welcome+'  ✦  ';continue;}
   if(group.textContent.toUpperCase().includes(welcome))continue;
   item=document.createElement('span');item.dataset.flashWelcome='true';item.className='bulletin-item flash-welcome-item';item.textContent=welcome+'  ✦  ';item.style.cssText='display:inline-block;padding-right:2rem;font-weight:800;white-space:nowrap';group.prepend(item);
  }
 }
 function schedule(){if(!queued){queued=true;requestAnimationFrame(apply);}}
 new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
 addEventListener('tgms-content',schedule);addEventListener('load',schedule);schedule();
})();
