// Home page: "Learning platforms" banner cards directly below the photo gallery. Data comes from /home-banners.json (one file per school).
// Added per school project (the master template is frozen); see tgms-platform/PENDING-TEMPLATE-CHANGES.md.
(() => {
  let fallbackBanners = {"title": "Learning platforms", "titleTe": "అభ్యాస వేదికలు", "items": [{"title": "Khan Academy", "te": "ఖాన్ అకాడమీ", "text": "Free video lessons and practice in mathematics and science.", "textTe": "గణితం, సైన్స్ లో ఉచిత వీడియో పాఠాలు, సాధన.", "accent": "#2d7a4f", "links": [{"label": "Open Khan Academy", "labelTe": "ఖాన్ అకాడమీ తెరవండి", "url": "https://www.khanacademy.org/"}]}, {"title": "Physics Wallah (PW)", "te": "ఫిజిక్స్ వాలా (PW)", "text": "Online learning for school subjects and NEET / JEE preparation.", "textTe": "స్కూల్ సబ్జెక్టులు, NEET / JEE సన్నద్ధతకు ఆన్‌లైన్ పాఠాలు.", "accent": "#b98722", "links": [{"label": "Open PW", "labelTe": "PW తెరవండి", "url": "https://www.pw.live/"}]}]}; let data = fallbackBanners, loading = false, timer = 0;
  const te = () => typeof lang === 'string' && lang === 'te';
  const safe = u => {
    const v = String(u || '').trim();
    if (v.startsWith('#')) return v;
    try { const x = new URL(v); return x.protocol === 'https:' || x.protocol === 'http:' ? x.href : ''; } catch { return ''; }
  };
  const isHome = () => { const h = location.hash.slice(1); return !h || h === 'home'; };
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text) n.textContent = text; return n; };
  function build() {
    const custom = (typeof schoolData === 'object' && Array.isArray(schoolData.homeBannerLinks) ? schoolData.homeBannerLinks : []).map(i => ({...i, custom:true}));
    const items = [...(Array.isArray(data.items) ? data.items : []), ...custom].filter(i => i && i.title);
    if (!items.length) return null;
    const section = el('section', 'home-banners');
    section.setAttribute('aria-label', data.title || 'Learning platforms');
    section.append(el('h2', '', (te() && data.titleTe) || data.title || 'Learning platforms'));
    const grid = el('div', 'home-banner-grid');
    for (const it of items) {
      const card = el('article', 'home-banner' + (it.custom ? ' home-banner-custom' : ''));
      if (/^#[0-9a-fA-F]{3,8}$/.test(it.accent || '')) card.style.setProperty('--accent', it.accent);
      card.append(el('h3', '', it.title));
      if (it.te) card.append(el('small', '', it.te));
      const text = (te() && it.textTe) || it.text;
      if (text) card.append(el('p', '', text));
      const row = el('div', 'home-banner-links');
      for (const l of Array.isArray(it.links) ? it.links : []) {
        const href = safe(l.url);
        if (!href || !l.label) continue;
        const a = el('a', 'home-banner-link', ((te() && l.labelTe) || l.label) + (href.startsWith('#') ? '' : ' ↗'));
        a.href = href;
        if (!href.startsWith('#')) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
        row.append(a);
      }
      if (row.children.length) card.append(row);
      grid.append(card);
    }
    section.append(grid);
    return section;
  }
  function place() {
    timer = 0;
    if (!isHome()) return;
    const main = document.querySelector('main');
    if (!main || main.querySelector('.home-banners')) return;
    const anchor = main.querySelector(':scope > .model-school-media') || main.querySelector(':scope > .gallery-grid');
    if (!anchor) return;
    if (!data) {
      if (!loading) {
        loading = true;
        fetch('data/home-banners.json', { cache: 'no-store' }).catch(()=>fetch('/data/home-banners.json', { cache: 'no-store' })).then(r => (r.ok ? r.json() : null)).then(j => { data = j || { items: [] }; schedule(); }).catch(() => { data = fallbackBanners; schedule(); });
      }
      return;
    }
    const section = build();
    if (section) anchor.after(section);
  }
  function schedule() { if (!timer) timer = setTimeout(place, 40); }
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener('hashchange', schedule);

  // Uses the existing school-specific authenticated profile publishing flow.
  window.homeBannerEditor = function(sheet) {
    const form = node('form', null, 'admin-form');
    form.append(node('h3', 'Home Page Link Cards'), node('p', 'Add cards below Khan Academy and Physics Wallah using the same design. Existing learning-platform cards remain unchanged.'));
    const container = node('div', null, 'home-link-editor'), rows = [];
    form.append(container);
    function addRow(item = {}) {
      const box = node('fieldset');box.append(node('legend', 'Additional link card'));
      const title = field(box, 'Card name', item.title || '');title.maxLength=100;
      const text = field(box, 'Short description', item.text || '', 'textarea');text.maxLength=500;
      const url = field(box, 'Website URL (https://...)', item.links?.[0]?.url || '', 'url');url.maxLength=500;
      const label = field(box, 'Button text', item.links?.[0]?.label || 'Open website');label.maxLength=100;
      const row={box,title,text,url,label};rows.push(row);
      const remove=node('button','Remove card');remove.type='button';remove.onclick=()=>{rows.splice(rows.indexOf(row),1);box.remove();};box.append(remove);container.append(box);
    }
    (schoolData.homeBannerLinks || []).forEach(addRow);
    const add=node('button','+ Add link card');add.type='button';
    const save=submitButton(form,'Save & publish link cards'), status=statusNode(form);
    add.onclick=()=>{if(rows.length>=20){status.textContent='You can add up to 20 cards.';return;}addRow();};form.append(add);
    form.onsubmit=async e=>{
      e.preventDefault();save.disabled=true;
      try {
        const next=[];
        for(const row of rows){
          const title=row.title.value.trim(),text=row.text.value.trim(),url=row.url.value.trim(),label=row.label.value.trim();
          if(!title&&!text&&!url)continue;
          if(!title||!label)throw Error('Each card needs a name and button text.');
          const href=safe(url);if(!/^https?:\/\//i.test(href))throw Error('Enter a valid http:// or https:// website URL.');
          next.push({title,text,links:[{label,url:href}]});
        }
        const previous=schoolData.homeBannerLinks;schoolData.homeBannerLinks=next;
        try{await publishSchool();}catch(error){schoolData.homeBannerLinks=previous;throw error;}
        status.textContent='Published. The cards appear below Khan Academy and Physics Wallah on the home page.';
      }catch(error){status.textContent=error.message;}finally{save.disabled=false;}
    };
    sheet.append(form);
  };

  if (location.hash === '#admin' && typeof render === 'function' && typeof schoolData === 'object' && schoolData) render();
  schedule();
})();
