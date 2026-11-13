// Admin extras for school sites (project-level, loaded after features-news-15.js; the master template is frozen):
//  1. School Main Photo - add / replace / remove the large photograph on the home page
//  2. Faculty & Staff - every name, designation and qualification editable one by one (add / remove / reorder); replaces the old text-box editor
//  3. Courses & Seats - the courses (Junior College groups) and classes shown in "Admission Seats" are editable, with a show/hide switch
// All data is saved through the normal admin publish (publishSchool) into the school profile.
(() => {
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined && text !== null) n.textContent = text; return n; };
  const btn = (label, onClick, cls) => { const b = el('button', cls || '', label); b.type = 'button'; b.onclick = onClick; return b; };
  const input = (value, label, max, type) => { const i = document.createElement('input'); i.type = type || 'text'; i.value = value == null ? '' : String(value); i.maxLength = max || 120; i.setAttribute('aria-label', label); return i; };
  const GROUPS = [['faculty', 'Regular Teaching Staff'], ['guest', 'HBT / Guest Teaching Staff'], ['vocational', 'Vocational Trainers'], ['support', 'Support Staff']];

  // ---------- main photo state (applies on every render, also for visitors) ----------
  const applyMainPhotoState = () => document.documentElement.classList.toggle('school-main-photo-removed', !!(typeof schoolData === 'object' && schoolData && schoolData.mainPhotoRemoved));
  const previousRender = window.render;
  if (typeof previousRender === 'function') window.render = function () { const r = previousRender.apply(this, arguments); try { applyMainPhotoState(); } catch { /* data not loaded yet */ } return r; };

  // ---------- courses: panel built from data when schoolData.seatsConfig exists ----------
  const originalPanel = window.admissionSeatsPanel;
  const seatsConfig = () => { try { const c = schoolData && schoolData.seatsConfig; return c && Array.isArray(c.college) && Array.isArray(c.school) ? c : null; } catch { return null; } };
  function buildPanel(cfg) {
    const section = el('section', 'admission-seats');
    section.setAttribute('aria-labelledby', 'admission-seats-title');
    const title = el('h2', '', 'Admission Seats ');
    title.id = 'admission-seats-title';
    title.append(el('span', '', 'ప్రవేశాల సీట్ల వివరాలు'));
    section.append(title);
    for (const [heading, rows, gridClass] of [['Junior College / జూనియర్ కళాశాల', cfg.college, 'college-seat-grid'], ['School / పాఠశాల', cfg.school, 'school-seat-grid']]) {
      if (!rows.length) continue;
      const group = el('div', 'admission-seat-group');
      group.append(el('h3', '', heading));
      const grid = el('div', 'admission-seat-grid ' + gridClass);
      for (const [name, seats] of rows) {
        const card = el('article', 'admission-seat-card'), p = el('p');
        p.append(el('strong', '', String(seats)), el('span', '', 'Seats / సీట్లు'));
        card.append(el('h4', '', String(name)), p);
        grid.append(card);
      }
      group.append(grid);
      section.append(group);
    }
    return section;
  }
  window.admissionSeatsPanel = function () { const cfg = seatsConfig(); return cfg ? buildPanel(cfg) : (originalPanel ? originalPanel() : el('section')); };
  function currentCourses() {
    const cfg = seatsConfig();
    if (cfg) return { college: cfg.college.map(r => [...r]), school: cfg.school.map(r => [...r]) };
    const out = { college: [], school: [] };
    try {
      const sec = originalPanel ? originalPanel() : null;
      const groups = sec ? [...sec.querySelectorAll('.admission-seat-group')] : [];
      const rows = g => [...g.querySelectorAll('.admission-seat-card')].map(c => [c.querySelector('h4').textContent, Number(c.querySelector('strong').textContent) || 0]);
      if (groups[0]) out.college = rows(groups[0]);
      if (groups[1]) out.school = rows(groups[1]);
    } catch { /* fall through */ }
    if (!out.college.length && !out.school.length) { out.college = [['MPC', 40], ['BiPC', 40], ['CEC', 40], ['ACE', 40]]; out.school = [6, 7, 8, 9, 10].map(n => ['Class ' + n, 100]); }
    return out;
  }

  // ---------- editors ----------
  function mainPhotoEditor(sheet) {
    const form = el('form', 'admin-form');
    form.dataset.adminExtras = '1';
    form.append(el('h3', '', 'School Main Photo'), el('p', '', 'The large photograph under the header on the home page. Add or replace it with the school’s own photo, or remove it.'));
    const preview = el('img', 'admin-main-photo-preview');
    preview.alt = 'Current school main photo';
    const state = el('p', 'admin-main-photo-state');
    const refresh = () => {
      const url = schoolData.mainPhotoRemoved ? '' : schoolData.campusPhotoUrl;
      if (url) { preview.src = url; preview.hidden = false; state.textContent = 'A main photo is shown on the home page.'; }
      else { preview.hidden = true; state.textContent = schoolData.mainPhotoRemoved ? 'The main photo is removed (nothing is shown).' : 'The default photo is shown. Upload a photo to replace it.'; }
    };
    form.append(preview, state);
    const file = document.createElement('input');
    file.type = 'file'; file.accept = 'image/jpeg,image/png,image/webp'; file.setAttribute('aria-label', 'Choose school main photo');
    const label = el('label', '', 'Choose school photo (JPG, PNG or WebP)');
    label.append(file);
    form.append(label);
    const add = el('button', 'action', 'Upload & publish main photo');
    add.type = 'submit';
    const remove = btn('Remove main photo', async () => {
      if (!window.confirm('Remove the main photo from the home page?')) return;
      remove.disabled = true;
      const prev = { u: schoolData.campusPhotoUrl, r: schoolData.mainPhotoRemoved };
      schoolData.campusPhotoUrl = ''; schoolData.mainPhotoRemoved = true;
      try { await publishSchool(); status.textContent = 'Main photo removed.'; applyMainPhotoState(); refresh(); }
      catch (e) { schoolData.campusPhotoUrl = prev.u; schoolData.mainPhotoRemoved = prev.r; status.textContent = e.message; }
      finally { remove.disabled = false; }
    }, 'danger');
    const status = el('p', 'form-status');
    status.setAttribute('role', 'status');
    form.append(add, remove, status);
    form.onsubmit = async e => {
      e.preventDefault();
      add.disabled = true;
      const prev = { u: schoolData.campusPhotoUrl, r: schoolData.mainPhotoRemoved };
      try {
        const url = await managedUpload(file.files && file.files[0], 1800);
        schoolData.campusPhotoUrl = url; delete schoolData.mainPhotoRemoved;
        try { await publishSchool(); } catch (err) { schoolData.campusPhotoUrl = prev.u; schoolData.mainPhotoRemoved = prev.r; throw err; }
        file.value = ''; status.textContent = 'Main photo published.'; applyMainPhotoState(); refresh();
      } catch (err) { status.textContent = err.message; } finally { add.disabled = false; }
    };
    refresh();
    sheet.append(form);
  }

  function coursesEditor(sheet) {
    const form = el('form', 'admin-form');
    form.append(el('h3', '', 'Courses & Seats'), el('p', '', 'Edit the courses (for example MPC, BiPC, CEC) and classes shown in "Admission Seats" on the home page, with their seats. Add or remove rows as needed.'));
    const data = currentCourses();
    const show = document.createElement('input');
    show.type = 'checkbox'; show.checked = schoolData.showAdmissionSeats !== false;
    const showLabel = el('label', 'admin-check', ' Show the Admission Seats section on the home page');
    showLabel.prepend(show);
    form.append(showLabel);
    const lists = {};
    for (const [key, title] of [['college', 'Junior College courses'], ['school', 'School classes']]) {
      form.append(el('h4', '', title));
      const box = el('div', 'admin-rows');
      const rows = [];
      lists[key] = rows;
      const addRow = (name = '', seats = 0) => {
        const row = el('div', 'admin-row');
        const n = input(name, title + ' name', 40), s = input(seats, title + ' seats', 5, 'number');
        s.min = '0'; s.max = '10000'; s.step = '1';
        const entry = { n, s };
        const rm = btn('Remove', () => { rows.splice(rows.indexOf(entry), 1); row.remove(); });
        rows.push(entry);
        row.append(n, s, rm);
        box.append(row);
      };
      data[key].forEach(([n, s]) => addRow(n, s));
      form.append(box, btn('+ Add ' + (key === 'college' ? 'course' : 'class'), () => { if (rows.length < 20) addRow(); }));
    }
    const save = el('button', 'action', 'Save & publish courses');
    save.type = 'submit';
    const status = el('p', 'form-status');
    status.setAttribute('role', 'status');
    form.append(save, status);
    form.onsubmit = async e => {
      e.preventDefault();
      save.disabled = true;
      const prev = { c: schoolData.seatsConfig, s: schoolData.showAdmissionSeats, g: schoolData.groups };
      try {
        const out = {};
        for (const key of ['college', 'school']) {
          out[key] = [];
          for (const r of lists[key]) {
            const name = r.n.value.trim(), seats = Number(r.s.value);
            if (!name && !r.s.value) continue;
            if (!name || !Number.isInteger(seats) || seats < 0 || seats > 10000) throw Error('Every row needs a name and seats from 0 to 10000.');
            out[key].push([name, seats]);
          }
        }
        schoolData.seatsConfig = out;
        schoolData.showAdmissionSeats = show.checked;
        if (out.college.length) schoolData.groups = out.college.map(r => r[0]).join(', ');
        try { await publishSchool(); } catch (err) { schoolData.seatsConfig = prev.c; schoolData.showAdmissionSeats = prev.s; schoolData.groups = prev.g; throw err; }
        status.textContent = 'Courses and seats published. Reload the home page to see them.';
      } catch (err) { status.textContent = err.message; } finally { save.disabled = false; }
    };
    sheet.append(form);
  }

  function facultyEditor(sheet) {
    const form = el('form', 'admin-form');
    form.dataset.mine = '1';
    form.append(el('h3', '', 'Faculty & Staff (edit names)'), el('p', '', 'Edit every person: name, designation / subject and qualification. Use the arrows to reorder, Remove to delete, and + Add to add a new person. Publish school-approved public details only (no personal phone numbers).'));
    const sets = {};
    for (const [key, title] of GROUPS) {
      const details = document.createElement('details');
      if (key === 'faculty') details.open = true;
      const list = Array.isArray(schoolData[key]) ? schoolData[key] : [];
      const summary = el('summary', '', title + ' (' + list.length + ')');
      details.append(summary);
      const box = el('div', 'admin-rows');
      const rows = [];
      sets[key] = rows;
      const refreshCount = () => { summary.textContent = title + ' (' + rows.length + ')'; };
      const addRow = (r = ['', '', '']) => {
        const row = el('div', 'admin-row admin-staff-row');
        const entry = { orig: r[0] || '', n: input(r[0], title + ' name', 80), d: input(r[1], title + ' designation', 80), q: input(r[2] === '—' ? '' : r[2], title + ' qualification', 120) };
        entry.n.placeholder = 'Name'; entry.d.placeholder = 'Designation / subject'; entry.q.placeholder = 'Qualification';
        const up = btn('↑', () => { const i = rows.indexOf(entry); if (i > 0) { rows.splice(i - 1, 0, rows.splice(i, 1)[0]); box.insertBefore(row, row.previousElementSibling); } }, 'small');
        const down = btn('↓', () => { const i = rows.indexOf(entry); if (i < rows.length - 1) { rows.splice(i + 1, 0, rows.splice(i, 1)[0]); box.insertBefore(row.nextElementSibling, row); } }, 'small');
        up.setAttribute('aria-label', 'Move up'); down.setAttribute('aria-label', 'Move down');
        const rm = btn('Remove', () => { rows.splice(rows.indexOf(entry), 1); row.remove(); refreshCount(); });
        rows.push(entry);
        row.append(entry.n, entry.d, entry.q, up, down, rm);
        box.append(row);
        refreshCount();
      };
      list.forEach(r => addRow(r));
      details.append(box, btn('+ Add person', () => { if (rows.length < 100) addRow(); }));
      form.append(details);
    }
    const save = el('button', 'action', 'Save & publish faculty');
    save.type = 'submit';
    const status = el('p', 'form-status');
    status.setAttribute('role', 'status');
    form.append(save, status);
    form.onsubmit = async e => {
      e.preventDefault();
      save.disabled = true;
      const prev = {};
      for (const [key] of GROUPS) prev[key] = schoolData[key];
      const prevPhotos = schoolData.staffPhotos, prevExp = schoolData.staffExperience;
      try {
        const next = {}, renames = [];
        for (const [key, title] of GROUPS) {
          next[key] = [];
          for (const r of sets[key]) {
            const name = r.n.value.trim(), role = r.d.value.trim(), qual = r.q.value.trim();
            if (!name && !role && !qual) continue;
            if (!name || !role) throw Error(title + ': every person needs a name and a designation.');
            next[key].push([name, role, qual]);
            if (r.orig && r.orig !== name) renames.push([r.orig, name]);
          }
        }
        // keep photos / experience attached to a person whose name was edited
        const photos = { ...(schoolData.staffPhotos || {}) }, exp = { ...(schoolData.staffExperience || {}) };
        for (const [from, to] of renames) { if (photos[from] && !photos[to]) { photos[to] = photos[from]; delete photos[from]; } if (exp[from] && !exp[to]) { exp[to] = exp[from]; delete exp[from]; } }
        for (const [key] of GROUPS) schoolData[key] = next[key];
        schoolData.staffPhotos = photos; schoolData.staffExperience = exp;
        try { await publishSchool(); } catch (err) { for (const [key] of GROUPS) schoolData[key] = prev[key]; schoolData.staffPhotos = prevPhotos; schoolData.staffExperience = prevExp; throw err; }
        for (const [key] of GROUPS) for (const r of sets[key]) r.orig = r.n.value.trim();
        status.textContent = 'Faculty published.';
      } catch (err) { status.textContent = err.message; } finally { save.disabled = false; }
    };
    sheet.append(form);
  }

  // the old one-textarea staff editor is replaced by the table editor above
  const hideOld = () => {
    for (const f of document.querySelectorAll('form.admin-form')) {
      const h = f.querySelector('h3');
      if (h && h.textContent === 'Faculty & Staff' && !f.dataset.mine && !f.hidden) {
        f.hidden = true;
        for (const a of document.querySelectorAll('.admin-settings-index a')) if (a.textContent === 'Faculty & Staff') a.remove();
      }
    }
  };
  new MutationObserver(hideOld).observe(document.documentElement, { childList: true, subtree: true });

  // The first home render can run before this script is installed (fast connections): fix up what is already on the page.
  const refreshNow = () => {
    try {
      applyMainPhotoState();
      const cfg = seatsConfig(), cur = document.querySelector('.admission-seats');
      if (cfg && cur && !cur.dataset.fromConfig) { const p = buildPanel(cfg); p.dataset.fromConfig = '1'; cur.replaceWith(p); }
    } catch { /* data not loaded yet */ }
  };
  refreshNow();
  for (const ms of [150, 600, 1500]) setTimeout(refreshNow, ms);
  // the admin page may have been rendered before this script was installed: render it again so the new editors appear
  setTimeout(() => { try { if (location.hash === '#admin' && typeof schoolData === 'object' && schoolData && !document.querySelector('[data-admin-extras]')) render(); } catch { /* ignore */ } }, 250);

  const original = window.principalPressEditor;
  window.principalPressEditor = function (sheet) {
    if (typeof original === 'function') original(sheet);
    for (const build of [mainPhotoEditor, coursesEditor, facultyEditor]) { try { build(sheet); } catch (e) { console.error(e); } }
  };
})();
