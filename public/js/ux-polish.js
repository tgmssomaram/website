// UX polish shared by all buildless TGMS school sites (see tgms-platform/tools/apply-ux.mjs).
// 1. the first crumb of "TGMS <SCHOOL> / <PAGE>" becomes a link back to the home page;
// 2. an address that does not exist (the Worker answers it with a real 404) shows a short notice with a way home.
(() => {
  const crumbs = () => {
    for (const b of document.querySelectorAll('.breadcrumb')) {
      if (b.querySelector('a')) continue;
      const t = b.textContent, i = t.indexOf(' / ');
      if (i < 1) continue;
      const a = document.createElement('a');
      a.href = '#home';
      a.textContent = t.slice(0, i);
      b.replaceChildren(a, document.createTextNode(t.slice(i)));
    }
  };
  let queued = false;
  const schedule = () => { if (queued) return; queued = true; setTimeout(() => { queued = false; crumbs(); }, 30); };
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
  crumbs();
  const path = location.pathname;
  if (path !== '/' && !/\/index\.html$/.test(path)) {
    const show = () => {
      if (document.querySelector('.ux-notfound')) return;
      const main = document.querySelector('main');
      if (!main) return;
      const box = document.createElement('div');
      box.className = 'ux-notfound';
      box.setAttribute('role', 'alert');
      const text = document.createElement('span');
      text.textContent = 'This page address does not exist. ';
      const link = document.createElement('a');
      link.href = '/#home';
      link.textContent = 'Go to the home page';
      box.append(text, link);
      main.prepend(box);
      document.title = 'Page not found | ' + document.title;
    };
    document.addEventListener('DOMContentLoaded', () => setTimeout(show, 600));
    setTimeout(show, 1500);
  }
})();
