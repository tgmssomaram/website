import {alumniPhoto} from './alumni-core.mjs';
// Public alumni section. Each school supplies its own approved alumni records.
(() => {
  const make = (tag, text, cls) => { const e = document.createElement(tag); if (text) e.textContent = text; if (cls) e.className = cls; return e; };
  const label = () => typeof lang === 'string' && lang === 'te' ? 'పూర్వ విద్యార్థులు' : typeof lang === 'string' && lang === 'hi' ? 'पूर्व विद्यार्थी' : 'Alumni';
  let queued = false;
  function apply() {
    queued = false;
    if (/^#admin/.test(location.hash) || location.pathname.startsWith('/admin')) return;
    const main = document.querySelector('main'); if (!main) return;
    const nav = document.querySelector('#menu') || document.querySelector('header nav');
    if (nav && !nav.querySelector('[data-alumni-nav]')) {
      const a = make('a', label(), 'tgms-alumni-nav'); a.href = '#alumni'; a.dataset.alumniNav = 'true';
      const contact = [...nav.children].find(e => e.matches('a[href="#contact"]') || /^contact us$/i.test(e.textContent.trim()));
      nav.insertBefore(a, contact || null);
    }
    const data = typeof schoolData === 'object' && schoolData ? schoolData : {};
    const records = (Array.isArray(data.alumni) ? data.alumni : []).filter(r => r && r.approved === true && String(r.name || '').trim());
    const key = JSON.stringify([label(), records, location.hash === '#alumni']);
    let section = main.querySelector('#alumni');
    if (section && section.dataset.alumniKey === key) return;
    const next = make('section', '', 'tgms-alumni'); next.id = 'alumni'; next.dataset.alumniKey = key; next.setAttribute('aria-labelledby', 'alumni-heading');
    const h = make('h2', label()); h.id = 'alumni-heading'; next.append(h);
    next.append(make('p', 'Stay connected with your school. Share your journey, achievements and ideas for supporting current students.'));
    if (records.length) {
      const grid = make('div', '', 'tgms-alumni-grid');
      for (const r of records) {
        const card = make('article');
        const src=alumniPhoto(r.photo);
        if(src){const image=make('img');image.src=src;image.alt=String(r.name);image.width=160;image.height=200;image.loading='lazy';card.append(image);}
        card.append(make('h3', String(r.name)));
        if (r.batch) card.append(make('p', 'Batch: ' + String(r.batch)));
        if (r.achievement) card.append(make('p', String(r.achievement)));
        grid.append(card);
      }
      next.append(grid);
    } else next.append(make('p', 'School-approved alumni stories and updates will appear here.', 'tgms-alumni-empty'));
    const a = make('a', 'Contact the school to connect', 'tgms-alumni-contact'); a.href = '#contact';
    a.addEventListener('click', () => { if (!document.querySelector('#menu')) [...document.querySelectorAll('header button,nav button')].find(b => /^contact us$/i.test(b.textContent.trim()))?.click(); });
    next.append(a);
    if (location.hash === '#alumni' && main.id === 'main' && typeof window.render === 'function') {
      const sheet = make('div', '', 'sheet'); sheet.append(next); main.replaceChildren(sheet);
    } else if (section) section.replaceWith(next); else main.append(next);
    if (location.hash === '#alumni') requestAnimationFrame(() => next.scrollIntoView({block: 'start'}));
  }
  function schedule() { if (!queued) { queued = true; requestAnimationFrame(apply); } }
  new MutationObserver(schedule).observe(document.body, {childList: true, subtree: true});
  addEventListener('hashchange', schedule); addEventListener('tgms-content', schedule); schedule();
})();
