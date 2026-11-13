// School sections shared by every TGMS school site (data comes from the school profile that the administrator edits; nothing is invented):
//  - About us: "Facilities" cards (library, computer lab, reading hall, playground ...)      schoolData.facilities
//  - Co-curricular and Extra-curricular pages                                                    schoolData.cocurricular / schoolData.extracurricular
//  - Innovation page grouped by subject                                                          schoolData.innovation
//  - Government orders (GO) corner                                                               schoolData.govtOrders
//  - Feedback form (saved privately in the school database, read in Admin)                       POST /api/feedback
// The editors live in school-sections-admin.js. Navigation groups are in final-model-mandal-20.js.
(() => {
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined && text !== null) n.textContent = text; return n; };
  const pick = (en, te, hi) => { const l = typeof lang === 'string' ? lang : 'en'; return (l === 'te' && te) || (l === 'hi' && hi) || en; };
  const safeSrc = value => { const v = String(value || '').trim(); return /^\/(?!\/)/.test(v) || /^https:\/\//i.test(v) ? v : ''; };
  const safeHref = value => { try { const u = new URL(String(value || '').trim()); return u.protocol === 'https:' && !u.username && !u.password ? u.href : ''; } catch { return ''; } };

  const PAGES = [
    ['cocurricular', 'Co-curricular', 'సహపాఠ్య కార్యక్రమాలు', 'सह-पाठ्यचर्या'],
    ['extracurricular', 'Extra-curricular', 'పాఠ్యేతర కార్యక్రమాలు', 'पाठ्येतर गतिविधियाँ'],
    ['innovation', 'Innovation', 'ఆవిష్కరణలు', 'नवाचार'],
    ['gos', 'Government orders', 'ప్రభుత్వ ఉత్తర్వులు (GOs)', 'सरकारी आदेश (GO)'],
    ['feedback', 'Feedback', 'అభిప్రాయం', 'प्रतिक्रिया'],
  ];
  // labels of the navigation groups added in final-model-mandal-20.js, translated here so it works on every site
  const NAV = { 'Activities': ['కార్యక్రమాలు', 'गतिविधियाँ'], 'Co-curricular': [PAGES[0][2], PAGES[0][3]], 'Extra-curricular': [PAGES[1][2], PAGES[1][3]], 'Innovation': [PAGES[2][2], PAGES[2][3]], 'Government orders': [PAGES[3][2], PAGES[3][3]], 'Feedback': [PAGES[4][2], PAGES[4][3]] };
  if (typeof menu !== 'undefined' && Array.isArray(menu)) for (const p of PAGES) if (!menu.some(m => m[0] === p[0])) menu.push(p);

  function card(item, withSubject) {
    const article = el('article', 'ss-card');
    const src = safeSrc(item.photo);
    if (src) { const img = el('img'); img.src = src; img.alt = item.title || ''; img.loading = 'lazy'; article.append(img); }
    const body = el('div', 'ss-card-body');
    if (withSubject && item.subject) body.append(el('small', 'ss-subject', item.subject));
    body.append(el('h3', '', item.title || ''));
    if (item.text) body.append(el('p', '', item.text));
    article.append(body);
    return article;
  }
  const list = key => (Array.isArray(schoolData && schoolData[key]) ? schoolData[key] : []).filter(r => r && typeof r === 'object' && String(r.title || '').trim());

  // ---------- pages ----------
  function activitiesPage(key) {
    const names = key === 'cocurricular' ? ['Co-curricular activities', 'సహపాఠ్య కార్యక్రమాలు', 'सह-पाठ्यचर्या गतिविधियाँ'] : ['Extra-curricular activities', 'పాఠ్యేతర కార్యక్రమాలు', 'पाठ्येतर गतिविधियाँ'];
    const out = [el('h2', '', pick(...names))];
    const rows = list(key).slice();
    const gallery = (schoolData.gallery || []).filter(p => new RegExp('^' + (key === 'cocurricular' ? 'co-?curricular' : 'extra-?curricular') + '$', 'i').test(String(p.category || '').trim()));
    for (const p of gallery) rows.push({ title: p.title, photo: p.src });
    if (!rows.length) { out.push(el('p', 'ss-empty', pick('Activities will be shown here.', 'కార్యక్రమాల వివరాలు ఇక్కడ కనిపిస్తాయి.', 'गतिविधियों का विवरण यहाँ दिखाया जाएगा।'))); return out; }
    const grid = el('div', 'ss-grid');
    rows.forEach(r => grid.append(card(r)));
    out.push(grid);
    return out;
  }

  function innovationPage() {
    const out = [el('h2', '', pick('Innovation', 'ఆవిష్కరణలు', 'नवाचार')), el('p', '', pick('Subject-wise innovations and projects by our students and teachers.', 'మా విద్యార్థులు, ఉపాధ్యాయుల సబ్జెక్టు వారీ ఆవిష్కరణలు, ప్రాజెక్టులు.', 'हमारे विद्यार्थियों और शिक्षकों के विषयवार नवाचार और परियोजनाएँ।'))];
    const rows = list('innovation');
    if (!rows.length) { out.push(el('p', 'ss-empty', pick('Innovations will be shown here.', 'ఆవిష్కరణల వివరాలు ఇక్కడ కనిపిస్తాయి.', 'नवाचार यहाँ दिखाए जाएँगे।'))); return out; }
    const groups = new Map();
    for (const r of rows) { const subject = String(r.subject || '').trim() || pick('General', 'సాధారణం', 'सामान्य'); if (!groups.has(subject)) groups.set(subject, []); groups.get(subject).push(r); }
    if (groups.size > 1) {
      const chips = el('nav', 'ss-chips');
      chips.setAttribute('aria-label', 'Subjects');
      [...groups.keys()].forEach((subject, i) => { const a = el('a', '', subject); a.href = '#innovation'; a.addEventListener('click', e => { e.preventDefault(); const target = document.getElementById('innovation-' + i); if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }); chips.append(a); });
      out.push(chips);
    }
    [...groups.entries()].forEach(([subject, items], i) => {
      const section = el('section', 'ss-subject-block');
      section.id = 'innovation-' + i;
      section.append(el('h3', 'ss-subject-title', subject));
      const grid = el('div', 'ss-grid');
      items.forEach(r => grid.append(card(r)));
      section.append(grid);
      out.push(section);
    });
    return out;
  }

  function gosPage() {
    const out = [el('h2', '', pick('Government orders (GOs)', 'ప్రభుత్వ ఉత్తర్వులు (GOs)', 'सरकारी आदेश (GO)')), el('p', '', pick('Government orders and circulars relevant to the school.', 'పాఠశాలకు సంబంధించిన ప్రభుత్వ ఉత్తర్వులు, సర్క్యులర్లు.', 'विद्यालय से संबंधित सरकारी आदेश और परिपत्र।'))];
    const rows = list('govtOrders');
    if (!rows.length) { out.push(el('p', 'ss-empty', pick('Government orders will be listed here.', 'ప్రభుత్వ ఉత్తర్వులు ఇక్కడ జాబితా అవుతాయి.', 'सरकारी आदेश यहाँ सूचीबद्ध होंगे।'))); return out; }
    const wrap = el('div', 'table-scroll');
    wrap.tabIndex = 0;
    const table = el('table', 'ss-go-table');
    const head = el('thead'), hr = el('tr');
    for (const label of [pick('Order', 'ఉత్తర్వు', 'आदेश'), pick('Number / reference', 'నంబర్ / రెఫరెన్స్', 'संख्या / संदर्भ'), pick('Date', 'తేదీ', 'दिनांक'), pick('Open', 'తెరవండి', 'खोलें')]) hr.append(el('th', '', label));
    head.append(hr);
    const body = el('tbody');
    for (const r of rows) {
      const tr = el('tr');
      tr.append(el('td', '', r.title), el('td', '', r.ref || '—'), el('td', '', r.date || '—'));
      const td = el('td');
      const href = safeHref(r.url);
      if (href) { const a = el('a', 'ss-go-link', pick('Open ↗', 'తెరవండి ↗', 'खोलें ↗')); a.href = href; a.target = '_blank'; a.rel = 'noopener noreferrer'; td.append(a); } else td.textContent = '—';
      tr.append(td);
      body.append(tr);
    }
    table.append(head, body);
    wrap.append(table);
    out.push(wrap);
    return out;
  }

  function feedbackPage() {
    const out = [el('h2', '', pick('Feedback', 'అభిప్రాయం', 'प्रतिक्रिया')), el('p', '', pick('Parents, students and visitors can share their suggestions with the school. Your message goes only to the school administrator.', 'తల్లిదండ్రులు, విద్యార్థులు, సందర్శకులు తమ సూచనలను పాఠశాలకు తెలియజేయవచ్చు. మీ సందేశం పాఠశాల నిర్వాహకులకు మాత్రమే చేరుతుంది.', 'अभिभावक, विद्यार्थी और आगंतुक अपने सुझाव विद्यालय को भेज सकते हैं। आपका संदेश केवल विद्यालय प्रशासक तक पहुँचता है।'))];
    const form = el('form', 'ss-form');
    form.noValidate = false;
    const field = (label, control) => { const l = el('label', '', label); l.append(control); return l; };
    const name = el('input'); name.type = 'text'; name.maxLength = 80; name.autocomplete = 'name';
    const role = el('select');
    [['Parent', 'Parent', 'తల్లిదండ్రులు', 'अभिभावक'], ['Student', 'Student', 'విద్యార్థి', 'विद्यार्थी'], ['Alumni', 'Alumni', 'పూర్వ విద్యార్థి', 'पूर्व छात्र'], ['Teacher', 'Teacher', 'ఉపాధ్యాయులు', 'शिक्षक'], ['Visitor', 'Visitor', 'సందర్శకులు', 'आगंतुक']].forEach(([value, en, te, hi]) => { const o = el('option', '', pick(en, te, hi)); o.value = value; role.append(o); });
    const contact = el('input'); contact.type = 'text'; contact.maxLength = 120; contact.autocomplete = 'off';
    const message = el('textarea'); message.rows = 6; message.maxLength = 1000; message.required = true; message.minLength = 5;
    const hp = el('input', 'ss-hp'); hp.type = 'text'; hp.name = 'website'; hp.tabIndex = -1; hp.autocomplete = 'off'; hp.setAttribute('aria-hidden', 'true');
    const send = el('button', 'action', pick('Send feedback', 'అభిప్రాయం పంపండి', 'प्रतिक्रिया भेजें'));
    send.type = 'submit';
    const status = el('p', 'ss-status');
    status.setAttribute('role', 'status');
    form.append(field(pick('Your name (optional)', 'మీ పేరు (ఐచ్ఛికం)', 'आपका नाम (वैकल्पिक)'), name), field(pick('You are a', 'మీరు', 'आप हैं'), role), field(pick('Phone or e-mail (optional, only if you want a reply)', 'ఫోన్ లేదా ఇమెయిల్ (ఐచ్ఛికం, సమాధానం కావాలంటే)', 'फ़ोन या ई-मेल (वैकल्पिक, उत्तर चाहिए तो)'), contact), field(pick('Your feedback', 'మీ అభిప్రాయం', 'आपकी प्रतिक्रिया'), message), hp, el('p', 'ss-note', pick('Please do not write Aadhaar, bank or password details here.', 'దయచేసి ఆధార్, బ్యాంక్, పాస్‌వర్డ్ వివరాలు ఇక్కడ రాయకండి.', 'कृपया यहाँ आधार, बैंक या पासवर्ड की जानकारी न लिखें।')), send, status);
    form.addEventListener('submit', async e => {
      e.preventDefault();
      send.disabled = true;
      status.textContent = '';
      try {
        const response = await fetch('/api/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ requestId: crypto.randomUUID(), name: name.value, role: role.value, contact: contact.value, message: message.value, website: hp.value }) });
        const body = await response.json().catch(() => ({}));
        if (!response.ok) throw Error(body.error || pick('Could not send. Please try again.', 'పంపడం సాధ్యం కాలేదు. మళ్లీ ప్రయత్నించండి.', 'भेजा नहीं जा सका। कृपया पुनः प्रयास करें।'));
        const done = el('div', 'ss-thanks');
        done.append(el('h3', '', pick('Thank you!', 'ధన్యవాదాలు!', 'धन्यवाद!')), el('p', '', pick('Your feedback has been sent to the school.', 'మీ అభిప్రాయం పాఠశాలకు పంపబడింది.', 'आपकी प्रतिक्रिया विद्यालय को भेज दी गई है।')));
        form.replaceWith(done);
      } catch (error) { status.textContent = error.message; send.disabled = false; }
    });
    out.push(form);
    return out;
  }

  const RENDERERS = { cocurricular: () => activitiesPage('cocurricular'), extracurricular: () => activitiesPage('extracurricular'), innovation: innovationPage, gos: gosPage, feedback: feedbackPage };

  function facilitiesSection() {
    const rows = list('facilities');
    if (!rows.length) return null;
    const section = el('section', 'ss-facilities');
    section.append(el('h3', '', pick('Facilities', 'సౌకర్యాలు', 'सुविधाएँ')));
    const grid = el('div', 'ss-grid');
    rows.forEach(r => grid.append(card(r)));
    section.append(grid);
    return section;
  }

  function translateNav() {
    const l = typeof lang === 'string' ? lang : 'en';
    if (l === 'en') return;
    const index = l === 'te' ? 0 : 1;
    for (const node of document.querySelectorAll('#menu a, #menu button')) {
      const arrow = /\s▾$/.test(node.textContent) ? ' ▾' : '';
      const base = node.textContent.replace(/\s▾$/, '').trim();
      if (NAV[base] && NAV[base][index]) node.textContent = NAV[base][index] + arrow;
    }
  }

  function decorate() {
    if (typeof schoolData !== 'object' || !schoolData) return;
    const id = location.hash.slice(1) || 'home';
    const sheet = document.querySelector('main .sheet');
    if (sheet && RENDERERS[id]) sheet.replaceChildren(...RENDERERS[id]());
    else if (sheet && id === 'about-us') { const extra = facilitiesSection(); if (extra && !sheet.querySelector('.ss-facilities')) sheet.append(extra); }
    else if (sheet && id === 'contact' && !sheet.querySelector('.ss-feedback-link')) { const a = el('a', 'ss-feedback-link action secondary', pick('Share your feedback →', 'మీ అభిప్రాయం తెలియజేయండి →', 'अपनी प्रतिक्रिया दें →')); a.href = '#feedback'; sheet.append(a); }
    translateNav();
  }

  const previousRender = window.render;
  if (typeof previousRender === 'function') window.render = function () { const result = previousRender.apply(this, arguments); try { decorate(); } catch (error) { console.error(error); } return result; };
  // the first render can run before this script is installed: render once more when a page of this module is open
  setTimeout(() => { try { const id = location.hash.slice(1); if (typeof schoolData === 'object' && schoolData && (RENDERERS[id] || id === 'about-us' || id === 'contact') && !document.querySelector('.ss-grid,.ss-form,.ss-empty,.ss-go-table,.ss-facilities,.ss-feedback-link')) render(); } catch { /* ignore */ } }, 400);
})();
