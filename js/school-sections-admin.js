// Administration editors for the school sections (public side is school-sections.js). Everything saves through the normal publishSchool() into the school profile.
//  Facilities (About us) · Co-curricular · Extra-curricular · Innovation · Government orders · Feedback inbox · Staff import from Excel (.xlsx) or CSV
(() => {
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined && text !== null) n.textContent = text; return n; };
  const btn = (label, onClick, cls) => { const b = el('button', cls || '', label); b.type = 'button'; b.onclick = onClick; return b; };
  const httpsOnly = value => { try { const u = new URL(String(value || '').trim()); return u.protocol === 'https:' && !u.username && !u.password ? u.href : ''; } catch { return ''; } };
  const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Botany', 'Zoology', 'Biology', 'General Science', 'Economics', 'Civics', 'Commerce', 'Social Studies', 'English', 'Telugu', 'Hindi', 'Computer Science'];

  // ---------- generic list editor (title + text + optional photo, or custom fields) ----------
  function listEditor(sheet, cfg) {
    const form = el('form', 'admin-form');
    form.dataset.adminSection = cfg.key;
    form.append(el('h3', '', cfg.title), el('p', '', cfg.intro));
    const rows = [];
    const box = el('div', 'admin-rows sa-rows');
    const status = el('p', 'form-status');
    status.setAttribute('role', 'status');
    const move = (entry, by) => { const i = rows.indexOf(entry), j = i + by; if (j < 0 || j >= rows.length) return; rows.splice(j, 0, rows.splice(i, 1)[0]); box.insertBefore(by < 0 ? entry.row : entry.row.nextElementSibling, by < 0 ? entry.row.previousElementSibling : entry.row); };
    function addRow(values = {}) {
      if (rows.length >= (cfg.max || 60)) { status.textContent = 'Maximum ' + (cfg.max || 60) + ' entries.'; return; }
      const row = el('div', 'sa-row');
      const entry = { row, photo: values.photo || '', inputs: {} };
      for (const f of cfg.fields) {
        const input = f.type === 'textarea' ? el('textarea') : el('input');
        if (f.type !== 'textarea') input.type = f.type === 'url' ? 'url' : 'text';
        if (f.type === 'textarea') input.rows = 3;
        input.maxLength = f.max || 120;
        input.placeholder = f.label;
        input.setAttribute('aria-label', cfg.title + ' – ' + f.label);
        input.value = values[f.name] == null ? '' : String(values[f.name]);
        if (f.list) { const id = 'sa-list-' + cfg.key; if (!document.getElementById(id)) { const dl = el('datalist'); dl.id = id; f.list.forEach(v => { const o = document.createElement('option'); o.value = v; dl.append(o); }); document.body.append(dl); } input.setAttribute('list', id); }
        entry.inputs[f.name] = input;
        row.append(input);
      }
      if (cfg.photo) {
        const photoBox = el('div', 'sa-photo');
        const thumb = el('img', 'sa-thumb');
        thumb.alt = '';
        const state = el('small', '', '');
        const showPhoto = () => { if (entry.photo) { thumb.src = entry.photo; thumb.hidden = false; state.textContent = 'Photo added'; } else { thumb.hidden = true; state.textContent = 'No photo'; } };
        const file = document.createElement('input');
        file.type = 'file'; file.accept = 'image/jpeg,image/png,image/webp'; file.setAttribute('aria-label', 'Choose photo');
        file.onchange = async () => {
          if (!file.files || !file.files[0]) return;
          state.textContent = 'Uploading…';
          try { entry.photo = await managedUpload(file.files[0], 1200); showPhoto(); status.textContent = 'Photo uploaded. Press Save to publish.'; }
          catch (error) { state.textContent = error.message; }
          file.value = '';
        };
        const clear = btn('Remove photo', () => { entry.photo = ''; showPhoto(); }, 'small');
        photoBox.append(thumb, state, file, clear);
        row.append(photoBox);
        showPhoto();
      }
      const controls = el('div', 'sa-controls');
      const up = btn('↑', () => move(entry, -1), 'small'), down = btn('↓', () => move(entry, 1), 'small');
      up.setAttribute('aria-label', 'Move up'); down.setAttribute('aria-label', 'Move down');
      controls.append(up, down, btn('Remove', () => { rows.splice(rows.indexOf(entry), 1); row.remove(); }, 'danger'));
      row.append(controls);
      rows.push(entry);
      box.append(row);
      return entry;
    }
    (Array.isArray(schoolData[cfg.key]) ? schoolData[cfg.key] : []).forEach(addRow);
    form.append(box);
    const adders = el('div', 'sa-adders');
    adders.append(btn('+ Add ' + cfg.noun, () => addRow()));
    for (const s of cfg.suggestions || []) adders.append(btn('+ ' + s, () => { const entry = addRow({ [cfg.fields[0].name]: s }); if (entry) entry.inputs[cfg.fields[0].name].focus(); }, 'small'));
    form.append(adders);
    const save = el('button', 'action', 'Save & publish');
    save.type = 'submit';
    form.append(save, status);
    form.onsubmit = async e => {
      e.preventDefault();
      save.disabled = true;
      const previous = schoolData[cfg.key];
      try {
        const out = [];
        for (const entry of rows) {
          const item = {};
          for (const f of cfg.fields) item[f.name] = entry.inputs[f.name].value.trim();
          if (cfg.photo) item.photo = entry.photo;
          if (!cfg.fields.some(f => item[f.name]) && !item.photo) continue;
          for (const f of cfg.fields) if (f.required && !item[f.name]) throw Error(cfg.noun + ': "' + f.label + '" is required.');
          if (cfg.fields.some(f => f.type === 'url')) for (const f of cfg.fields.filter(x => x.type === 'url')) { if (item[f.name]) { const safe = httpsOnly(item[f.name]); if (!safe) throw Error(cfg.noun + ': "' + f.label + '" must be a public https:// link.'); item[f.name] = safe; } else if (f.required) throw Error(cfg.noun + ': "' + f.label + '" is required.'); }
          out.push(item);
        }
        schoolData[cfg.key] = out;
        try { await publishSchool(); } catch (error) { schoolData[cfg.key] = previous; throw error; }
        status.textContent = out.length + ' saved and published.';
      } catch (error) { status.textContent = error.message; } finally { save.disabled = false; }
    };
    sheet.append(form);
  }

  const SECTIONS = [
    { key: 'facilities', title: 'Facilities (About us page)', noun: 'facility', photo: true, max: 30, intro: 'Library, computer lab, reading hall, playground, laboratories and other facilities shown on the About us page. Add a name, a short description and a photo for each.', fields: [{ name: 'title', label: 'Facility name', max: 80, required: true }, { name: 'text', label: 'Description', type: 'textarea', max: 600 }], suggestions: ['Library', 'Computer Lab', 'Reading Hall', 'Science Labs', 'Playground', 'Vocational Lab'] },
    { key: 'cocurricular', title: 'Co-curricular Activities', noun: 'activity', photo: true, max: 60, intro: 'Activities such as quiz, debate, science fair, drawing and cultural programmes. They appear on the Co-curricular page.', fields: [{ name: 'title', label: 'Activity title', max: 100, required: true }, { name: 'text', label: 'Description', type: 'textarea', max: 600 }] },
    { key: 'extracurricular', title: 'Extra-curricular Activities', noun: 'activity', photo: true, max: 60, intro: 'Sports, NCC / NSS, scouts, yoga, clubs and similar activities. They appear on the Extra-curricular page.', fields: [{ name: 'title', label: 'Activity title', max: 100, required: true }, { name: 'text', label: 'Description', type: 'textarea', max: 600 }] },
    { key: 'innovation', title: 'Innovation (subject-wise)', noun: 'innovation', photo: true, max: 120, intro: 'Student and teacher innovations, models and projects. Choose the subject for each entry; the Innovation page groups them by subject.', fields: [{ name: 'subject', label: 'Subject', max: 60, list: SUBJECTS }, { name: 'title', label: 'Innovation title', max: 100, required: true }, { name: 'text', label: 'Description', type: 'textarea', max: 600 }] },
    { key: 'govtOrders', title: 'Government Orders (GO corner)', noun: 'order', photo: false, max: 100, intro: 'Government orders and circulars. Give the order a title and a public https:// link to the document (for example a Telangana government site or a public Google Drive link).', fields: [{ name: 'title', label: 'Order title', max: 160, required: true }, { name: 'ref', label: 'Number / reference', max: 60 }, { name: 'date', label: 'Date (for example 12-10-2026)', max: 30 }, { name: 'url', label: 'Link to the document (https://…)', type: 'url', max: 500, required: true }] },
  ];

  // ---------- feedback inbox ----------
  function feedbackInbox(sheet) {
    const form = el('form', 'admin-form');
    form.dataset.adminSection = 'feedback';
    form.append(el('h3', '', 'Feedback received'), el('p', '', 'Messages sent from the Feedback page. Only you can see them. Delete a message when you no longer need it.'));
    const list = el('div', 'sa-feedback-list');
    const status = el('p', 'form-status');
    status.setAttribute('role', 'status');
    async function load() {
      status.textContent = 'Loading…';
      try {
        const response = await fetch('/api/admin/feedback', { cache: 'no-store' });
        const body = await response.json();
        if (!response.ok) throw Error(body.error || 'Could not load feedback.');
        list.replaceChildren();
        for (const item of body.feedback) {
          const article = el('article', 'sa-feedback');
          const head = el('div', 'sa-feedback-head');
          head.append(el('strong', '', (item.name || 'Anonymous') + ' · ' + item.role), el('small', '', new Date(item.submittedAt).toLocaleString()));
          article.append(head);
          if (item.contact) article.append(el('p', 'sa-feedback-contact', 'Contact: ' + item.contact));
          article.append(el('p', 'sa-feedback-message', item.message));
          article.append(btn('Delete', async () => {
            if (!window.confirm('Delete this feedback message?')) return;
            const res = await fetch('/api/admin/feedback/delete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: item.id }) });
            if (res.ok) { article.remove(); status.textContent = 'Deleted.'; } else status.textContent = 'Could not delete.';
          }, 'danger'));
          list.append(article);
        }
        status.textContent = body.feedback.length ? body.feedback.length + ' message(s).' : 'No feedback yet.';
      } catch (error) { status.textContent = error.message; }
    }
    form.append(btn('Refresh', load), status, list);
    form.onsubmit = e => e.preventDefault();
    sheet.append(form);
    load();
  }

  // ---------- staff import from Excel (.xlsx) or CSV ----------
  const GROUPS = [['faculty', 'Regular Teaching Staff'], ['guest', 'HBT / Guest Teaching Staff'], ['vocational', 'Vocational Trainers'], ['support', 'Support Staff']];
  async function inflateRaw(bytes) { const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw')); return new Uint8Array(await new Response(stream).arrayBuffer()); }
  function zipEntries(buffer) {
    const view = new DataView(buffer);
    let eocd = -1;
    for (let i = buffer.byteLength - 22; i >= Math.max(0, buffer.byteLength - 65557); i--) if (view.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
    if (eocd < 0) throw Error('This is not an .xlsx file.');
    const count = view.getUint16(eocd + 10, true);
    let p = view.getUint32(eocd + 16, true);
    const entries = new Map();
    for (let n = 0; n < count; n++) {
      if (view.getUint32(p, true) !== 0x02014b50) throw Error('This .xlsx file is damaged.');
      const nameLength = view.getUint16(p + 28, true), extraLength = view.getUint16(p + 30, true), commentLength = view.getUint16(p + 32, true);
      entries.set(new TextDecoder().decode(new Uint8Array(buffer, p + 46, nameLength)), { method: view.getUint16(p + 10, true), size: view.getUint32(p + 20, true), usize: view.getUint32(p + 24, true), offset: view.getUint32(p + 42, true) });
      p += 46 + nameLength + extraLength + commentLength;
    }
    return entries;
  }
  async function zipText(buffer, entries, name) {
    const e = entries.get(name);
    if (!e) return null;
    if (e.usize > 8000000) throw Error('The spreadsheet is too large.');
    const view = new DataView(buffer);
    const start = e.offset + 30 + view.getUint16(e.offset + 26, true) + view.getUint16(e.offset + 28, true);
    const data = new Uint8Array(buffer, start, e.size);
    return new TextDecoder().decode(e.method === 0 ? data : await inflateRaw(data));
  }
  const columnIndex = ref => { let n = 0; for (const ch of ref.replace(/[0-9]/g, '')) n = n * 26 + ch.charCodeAt(0) - 64; return n - 1; };
  async function readXlsx(buffer) {
    if (typeof DecompressionStream === 'undefined') throw Error('This browser cannot read .xlsx files. Save the sheet as CSV and choose that file.');
    const entries = zipEntries(buffer);
    const parse = xml => new DOMParser().parseFromString(xml, 'application/xml');
    const sharedXml = await zipText(buffer, entries, 'xl/sharedStrings.xml');
    const shared = sharedXml ? [...parse(sharedXml).getElementsByTagName('si')].map(si => [...si.getElementsByTagName('t')].map(t => t.textContent).join('')) : [];
    const sheets = [...entries.keys()].filter(n => /^xl\/worksheets\/sheet\d+\.xml$/.test(n)).sort((a, b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0]));
    for (const name of sheets) {
      const doc = parse(await zipText(buffer, entries, name));
      const out = [];
      for (const row of [...doc.getElementsByTagName('row')].slice(0, 600)) {
        const cells = [];
        for (const c of row.getElementsByTagName('c')) {
          const i = columnIndex(c.getAttribute('r') || 'A1');
          if (i > 40) continue;
          const type = c.getAttribute('t'), v = c.getElementsByTagName('v')[0];
          cells[i] = String(type === 's' ? shared[Number(v && v.textContent)] || '' : type === 'inlineStr' ? [...c.getElementsByTagName('t')].map(t => t.textContent).join('') : v ? v.textContent : '').trim();
        }
        if (cells.some(Boolean)) out.push(Array.from(cells, x => x || ''));
      }
      if (out.length) return out;
    }
    throw Error('No data found in the spreadsheet.');
  }
  function readCsv(text) {
    text = text.replace(/^﻿/, '');
    const first = text.split(/\r?\n/, 1)[0] || '';
    const delimiter = [',', '\t', ';'].map(d => [d, first.split(d).length]).sort((a, b) => b[1] - a[1])[0][0];
    const rows = [];
    let row = [], value = '', quoted = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (quoted) { if (ch === '"' && text[i + 1] === '"') { value += '"'; i++; } else if (ch === '"') quoted = false; else value += ch; }
      else if (ch === '"' && !value) quoted = true;
      else if (ch === delimiter) { row.push(value.trim()); value = ''; }
      else if (ch === '\n' || ch === '\r') { if (ch === '\r' && text[i + 1] === '\n') i++; row.push(value.trim()); value = ''; if (row.some(Boolean)) rows.push(row); row = []; if (rows.length > 600) break; }
      else value += ch;
    }
    row.push(value.trim());
    if (row.some(Boolean)) rows.push(row);
    return rows;
  }
  function mapStaffRows(rows) {
    const headerRow = rows[0].map(x => String(x).toLowerCase());
    const find = re => headerRow.findIndex(h => re.test(h));
    let nameCol = find(/name|teacher|staff|పేరు/), roleCol = find(/designation|subject|post|role|హోదా/), qualCol = find(/qualification|degree|అర్హత/);
    const groupCol = find(/group|category|type|wing/);
    let body = rows.slice(1);
    if (nameCol < 0 && roleCol < 0) { nameCol = 0; roleCol = 1; qualCol = 2; body = rows; }   // no headings: Name, Designation, Qualification
    if (nameCol < 0) nameCol = 0;
    const groupOf = text => { const t = String(text || '').toLowerCase(); if (/guest|hbt|hourly/.test(t)) return 'guest'; if (/vocational|trainer/.test(t)) return 'vocational'; if (/support|non-?teaching|office|attender|watch|sweeper|cook/.test(t)) return 'support'; if (/regular|teaching|permanent|pgt|tgt|prt|jl|principal/.test(t)) return 'faculty'; return ''; };
    const people = [];
    let skipped = 0;
    for (const r of body) {
      const name = String(r[nameCol] || '').trim(), role = roleCol >= 0 ? String(r[roleCol] || '').trim() : '', qual = qualCol >= 0 ? String(r[qualCol] || '').trim() : '';
      if (!name) continue;
      if (!role) { skipped++; continue; }
      people.push({ name: name.slice(0, 80), role: role.slice(0, 80), qual: qual.slice(0, 120), group: groupCol >= 0 ? groupOf(r[groupCol]) : '' });
    }
    return { people, skipped, hasGroup: groupCol >= 0 };
  }
  function staffImport(sheet) {
    const form = el('form', 'admin-form');
    form.dataset.adminSection = 'staff-import';
    form.append(el('h3', '', 'Import staff from Excel / CSV'), el('p', '', 'Choose an Excel (.xlsx) or CSV file with the columns Name, Designation (or Subject) and Qualification in the first row. You can see a preview before anything is published. Photos and experience stay attached to a person with the same name.'));
    const group = el('select');
    group.setAttribute('aria-label', 'Staff group');
    GROUPS.forEach(([value, label]) => { const o = el('option', '', label); o.value = value; group.append(o); });
    const mode = el('select');
    mode.setAttribute('aria-label', 'Import mode');
    [['add', 'Add to the existing list'], ['replace', 'Replace this group with the file']].forEach(([value, label]) => { const o = el('option', '', label); o.value = value; mode.append(o); });
    const file = document.createElement('input');
    file.type = 'file'; file.accept = '.xlsx,.csv,.tsv,.txt,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'; file.setAttribute('aria-label', 'Choose Excel or CSV file');
    const preview = el('div', 'sa-preview');
    const status = el('p', 'form-status');
    status.setAttribute('role', 'status');
    const go = el('button', 'action', 'Import & publish');
    go.type = 'submit'; go.disabled = true;
    let parsed = null;
    file.onchange = async () => {
      parsed = null; go.disabled = true; preview.replaceChildren(); status.textContent = '';
      const f = file.files && file.files[0];
      if (!f) return;
      try {
        if (f.size > 2000000) throw Error('Choose a file smaller than 2 MB.');
        const rows = /\.xlsx$/i.test(f.name) ? await readXlsx(await f.arrayBuffer()) : readCsv(await f.text());
        if (rows.length < 1) throw Error('The file has no rows.');
        parsed = mapStaffRows(rows);
        if (!parsed.people.length) throw Error('No people found. Check that the first row has the headings Name and Designation.');
        const table = el('table', 'sa-preview-table');
        const head = el('tr');
        ['Name', 'Designation / subject', 'Qualification'].forEach(h => head.append(el('th', '', h)));
        table.append(head);
        parsed.people.slice(0, 8).forEach(p => { const tr = el('tr'); [p.name, p.role, p.qual].forEach(v => tr.append(el('td', '', v))); table.append(tr); });
        preview.append(table);
        status.textContent = parsed.people.length + ' people found' + (parsed.people.length > 8 ? ' (first 8 shown)' : '') + (parsed.skipped ? '; ' + parsed.skipped + ' row(s) without a designation were skipped' : '') + (parsed.hasGroup ? '. A "group" column was found: rows are placed in their own groups, others in the group chosen above.' : '.');
        go.disabled = false;
      } catch (error) { status.textContent = error.message; }
    };
    form.append(el('label', '', 'Staff group (used when the file has no group column)'), group, el('label', '', 'Mode'), mode, el('label', '', 'File'), file, preview, go, status);
    form.onsubmit = async e => {
      e.preventDefault();
      if (!parsed) return;
      go.disabled = true;
      const keys = GROUPS.map(g => g[0]);
      const previous = Object.fromEntries(keys.map(k => [k, schoolData[k]]));
      try {
        const touched = new Set();
        const next = Object.fromEntries(keys.map(k => [k, Array.isArray(schoolData[k]) ? schoolData[k].map(r => [...r]) : []]));
        for (const p of parsed.people) { const key = p.group || group.value; touched.add(key); }
        if (mode.value === 'replace') for (const key of touched) next[key] = [];
        for (const p of parsed.people) {
          const key = p.group || group.value;
          const existing = next[key].findIndex(r => String(r[0]).trim().toLowerCase() === p.name.toLowerCase());
          const row = [p.name, p.role, p.qual];
          if (existing >= 0) next[key][existing] = row; else next[key].push(row);
        }
        for (const key of keys) schoolData[key] = next[key];
        try { await publishSchool(); } catch (error) { for (const key of keys) schoolData[key] = previous[key]; throw error; }
        status.textContent = parsed.people.length + ' people imported and published.';
        parsed = null; file.value = '';
        setTimeout(() => { try { render(); } catch { /* ignore */ } }, 400);
      } catch (error) { status.textContent = error.message; go.disabled = false; }
    };
    sheet.append(form);
  }

  const original = window.principalPressEditor;
  window.principalPressEditor = function (sheet) {
    if (typeof original === 'function') original(sheet);
    for (const build of [...SECTIONS.map(cfg => s => listEditor(s, cfg)), feedbackInbox, staffImport]) { try { build(sheet); } catch (error) { console.error(error); } }
  };
  // the admin page may have been rendered before this script was installed: render it again so the new editors appear
  setTimeout(() => { try { if (location.hash === '#admin' && typeof schoolData === 'object' && schoolData && !document.querySelector('[data-admin-section]')) render(); } catch { /* ignore */ } }, 300);
})();
