// Home-page row: principal (left) | message / press note text with links (middle) | press image (right).
// Data: schoolData.principalPress = { title, text, links:[{label,url}], image, imageAlt, imageCaption }  (all optional; empty = nothing is shown).
// Edited by the school administrator in Admin > "Principal Message & Press Note" (principalPressEditor below). Shared by all buildless TGMS sites (tools/apply-ux.mjs copies it).
function ppData() {
  const d = typeof schoolData === 'object' && schoolData && schoolData.principalPress;
  return d && typeof d === 'object' ? d : {};
}
// Only http(s) addresses (and our own uploaded photos) are ever turned into links or images - never javascript: or data: URLs.
function ppSafeUrl(value, allowOwnImage) {
  const v = String(value || '').trim();
  if (!v) return '';
  if (allowOwnImage && /^\/(?:api\/photos|images)\/[A-Za-z0-9._\-]+$/.test(v)) return v;
  try { const u = new URL(v); return u.protocol === 'https:' || u.protocol === 'http:' ? u.href : ''; } catch { return ''; }
}
function ppLinks(d) { return (Array.isArray(d.links) ? d.links : []).filter(l => l && String(l.label || '').trim() && ppSafeUrl(l.url)); }
function principalPressActive() {
  const d = ppData();
  return !!(d && (String(d.text || '').trim() || String(d.importantText || '').trim() || ppLinks(d).length || ppSafeUrl(d.image, true))) || !!(typeof schoolData === 'object' && schoolData?.principal?.name);
}
function ppExternal(href, label) {
  const a = document.createElement('a');
  a.href = href; a.textContent = label; a.target = '_blank'; a.rel = 'noopener noreferrer';
  return a;
}
function ppAppendText(parent, text) {
  for (const para of String(text || '').split(/\n{2,}/)) {
    const trimmed = para.trim();
    if (!trimmed) continue;
    const p = document.createElement('p');
    for (const part of trimmed.split(/(https?:\/\/[^\s<>"']+)/g)) {
      const safe = /^https?:\/\//.test(part) ? ppSafeUrl(part) : '';
      p.append(safe ? ppExternal(safe, part) : document.createTextNode(part));
    }
    parent.append(p);
  }
}
function principalPressSection() {
  if (!principalPressActive()) return null;
  const d = ppData(), te = typeof lang === 'string' && lang === 'te';
  const section = document.createElement('section');
  section.className = 'principal-press';
  section.setAttribute('aria-label', te ? 'ప్రిన్సిపల్ సందేశం మరియు ప్రెస్ నోట్' : 'Principal message and press note');
  const left = document.createElement('div');
  left.className = 'pp-principal';
  left.append(principalCard());
  const important = document.createElement('section');
  important.className = 'pp-important';
  const importantHeading = document.createElement('h3');
  importantHeading.textContent = String(d.importantTitle || '').trim() || (te ? 'ప్రిన్సిపల్ ముఖ్య సందేశం' : 'Principal Important Message');
  important.append(importantHeading);
  ppAppendText(important, String(d.importantText || '').trim() || (te ? 'ప్రిన్సిపల్ ముఖ్య సందేశం ఇంకా ప్రచురించలేదు.' : 'The principal has not yet published an important message.'));
  left.append(important);
  section.append(left);
  const text = String(d.text || '').trim(), links = ppLinks(d);
  if (true) {
    const box = document.createElement('article');
    box.className = 'pp-note';
    const h = document.createElement('h2');
    h.textContent = String(d.title || '').trim() || (te ? 'ప్రిన్సిపల్ సందేశం' : 'Principal’s Message');
    box.append(h);
    ppAppendText(box, text || (te ? 'ప్రిన్సిపల్ సందేశం ప్రచురించిన తర్వాత ఇక్కడ కనిపిస్తుంది.' : 'The principal’s message will appear here after publication.'));
    if (links.length) {
      const ul = document.createElement('ul');
      ul.className = 'pp-links';
      for (const l of links) { const li = document.createElement('li'); li.append(ppExternal(ppSafeUrl(l.url), String(l.label).trim() + ' ↗')); ul.append(li); }
      box.append(ul);
    }
    section.append(box);
  }
  const src = ppSafeUrl(d.image, true);
  if (src) {
    const fig = document.createElement('figure');
    fig.className = 'pp-image';
    const a = document.createElement('a');
    a.href = src; a.target = '_blank'; a.rel = 'noopener noreferrer';
    a.title = te ? 'పెద్దగా చూడటానికి నొక్కండి' : 'Open the full image';
    const img = document.createElement('img');
    img.src = src; img.alt = String(d.imageAlt || '').trim() || (te ? 'ప్రెస్ క్లిప్పింగ్' : 'Press clipping'); img.loading = 'lazy'; img.decoding = 'async';
    a.append(img);
    fig.append(a);
    const cap = String(d.imageCaption || '').trim();
    if (cap) { const c = document.createElement('figcaption'); c.textContent = cap; fig.append(c); }
    section.append(fig);
  }
  return section;
}

// ---- Admin editor (called from the admin settings page) ----
function principalPressEditor(sheet) {
  const form = node('form', null, 'admin-form');
  form.append(node('h3', 'Principal Message & Press Note'), node('p', 'Home page row: principal on the left, this text in the middle (message, press note, anything) with links, and one press image on the right. Leave everything empty to hide it.'));
  const saved = structuredClone(ppData() || {});
  const title = field(form, 'Box heading (for example: Principal’s Message, Press Note)', saved.title || '');
  title.maxLength = 80;
  const text = field(form, 'Message / press note text (a blank line starts a new paragraph; web addresses become links)', saved.text || '', 'textarea');
  text.maxLength = 3000; text.rows = 8;
  const importantTitle = field(form, 'Heading below principal photo', saved.importantTitle || 'Principal Important Message');
  importantTitle.maxLength = 80;
  const importantText = field(form, 'Important message below principal photo', saved.importantText || '', 'textarea');
  importantText.maxLength = 1500; importantText.rows = 5;
  form.append(node('h4', 'Links (each opens in a new tab)'));
  const box = node('div'), rows = [];
  form.append(box);
  const addRow = (l = {}) => {
    const row = node('div', null, 'pp-link-row'), label = node('input'), url = node('input');
    label.value = l.label || ''; label.placeholder = 'Link text'; label.maxLength = 80; label.setAttribute('aria-label', 'Link text');
    url.type = 'url'; url.value = l.url || ''; url.placeholder = 'https://...'; url.maxLength = 500; url.setAttribute('aria-label', 'Link address');
    const entry = { label, url }, remove = node('button', 'Remove');
    remove.type = 'button'; remove.onclick = () => { rows.splice(rows.indexOf(entry), 1); row.remove(); };
    rows.push(entry); row.append(label, url, remove); box.append(row);
  };
  (saved.links || []).forEach(addRow);
  const add = node('button', '+ Add link');
  add.type = 'button'; add.onclick = () => { if (rows.length < 8) addRow(); };
  form.append(add);
  form.append(node('h4', 'Press image'));
  let image = saved.image || '', removeImage = false;
  const current = node('p');
  const refresh = () => { current.textContent = removeImage ? 'The image will be removed when you save.' : image ? 'An image is published. Choose a new file to replace it, or remove it.' : 'No image yet.'; };
  refresh();
  form.append(current);
  const file = field(form, 'Press paper / press release image (JPG, PNG or WebP)', '', 'file');
  file.accept = 'image/jpeg,image/png,image/webp';
  const removeBtn = node('button', 'Remove image');
  removeBtn.type = 'button'; removeBtn.onclick = () => { removeImage = true; file.value = ''; refresh(); };
  form.append(removeBtn);
  const alt = field(form, 'Image description (read by screen readers)', saved.imageAlt || '');
  alt.maxLength = 160;
  const caption = field(form, 'Image caption (optional)', saved.imageCaption || '');
  caption.maxLength = 200;
  const save = submitButton(form, 'Save & publish'), status = statusNode(form);
  form.onsubmit = async e => {
    e.preventDefault();
    save.disabled = true;
    try {
      const links = [];
      for (const r of rows) {
        const label = r.label.value.trim(), href = r.url.value.trim();
        if (!label && !href) continue;
        if (!label || !ppSafeUrl(href)) throw Error('Every link needs a text and a web address starting with https://');
        links.push({ label, url: ppSafeUrl(href) });
      }
      let nextImage = removeImage ? '' : image;
      if (file.files && file.files[0]) nextImage = await managedUpload(file.files[0], 1800);
      const next = { importantTitle: importantTitle.value.trim(), importantText: importantText.value.trim(), title: title.value.trim(), text: text.value.trim(), links, image: nextImage, imageAlt: alt.value.trim(), imageCaption: caption.value.trim() };
      const previous = schoolData.principalPress;
      schoolData.principalPress = (next.text || next.importantText || links.length || nextImage) ? next : undefined;
      try { await publishSchool(); } catch (error) { schoolData.principalPress = previous; throw error; }
      image = nextImage; removeImage = false; file.value = ''; refresh();
      status.textContent = 'Published. Reload the home page to see it.';
    } catch (error) { status.textContent = error.message; } finally { save.disabled = false; }
  };
  sheet.append(form);
}

window.principalPressSection = principalPressSection;
window.refreshPrincipalPress = function() {
  const existing = document.querySelector('.principal-press');
  if (existing) {
    const updated = principalPressSection();
    if (updated) {
      existing.replaceWith(updated);
    }
  }
};
window.addEventListener('tgms-content', function() {
  if (typeof window.refreshPrincipalPress === 'function') {
    window.refreshPrincipalPress();
  }
});
