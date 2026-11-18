// message.js — Principal's Message & Press Note Manager
// Telangana Model School & Junior College, Somaram

window.AdminModules = window.AdminModules || {};
window.AdminModules.message = {
  data: null,

  render: async function() {
    var view = document.getElementById('admin-view');
    view.innerHTML = '\
      <div class="section-header">\
        <div>\
          <h1>📜 Principal’s Message & Leadership Address</h1>\
          <p>Publish inspiring guidance, press releases, important notices, and announcements from the Principal’s desk.</p>\
        </div>\
      </div>\
      <div id="message-container" class="card" style="padding:28px;">\
        <div style="text-align:center;padding:32px;color:var(--text-muted);">Loading message...</div>\
      </div>';

    await this.loadData();
  },

  loadData: async function() {
    var res = await window.AdminAPI.get('/api/admin/principal-message');
    var msg = (res && res.data) || {};
    this.data = msg;
    var container = document.getElementById('message-container');
    if (!container) return;

    var currentImg = msg.image || '';

    container.innerHTML = '\
      <form id="principal-message-form">\
        <div style="display:grid;grid-template-columns:1fr;gap:24px;">\
          <!-- Section 1: Main Headings -->\
          <div style="background:#f8fafc;padding:20px;border-radius:10px;border:1px solid #e2e8f0;">\
            <h3 style="font-size:1.05rem;font-weight:600;margin-bottom:14px;color:#1e293b;">1. Message Titles</h3>\
            <div class="form-row">\
              <div class="form-group-dash">\
                <label for="pm-title">Heading (English) *</label>\
                <input type="text" id="pm-title" required value="' + (msg.title || 'Principal’s Message').replace(/"/g, '&quot;') + '" placeholder="e.g. Principal’s Message" />\
              </div>\
              <div class="form-group-dash">\
                <label for="pm-te-title">Heading (Telugu)</label>\
                <input type="text" id="pm-te-title" value="' + (msg.teluguTitle || 'ప్రిన్సిపాల్ సందేశం').replace(/"/g, '&quot;') + '" placeholder="e.g. ప్రిన్సిపాల్ సందేశం" />\
              </div>\
            </div>\
          </div>\
\
          <!-- Section 2: Inspiring Body Message -->\
          <div style="background:#f8fafc;padding:20px;border-radius:10px;border:1px solid #e2e8f0;">\
            <h3 style="font-size:1.05rem;font-weight:600;margin-bottom:6px;color:#1e293b;">2. Principal’s Address & Body Content</h3>\
            <p style="font-size:0.83rem;color:#64748b;margin-bottom:14px;">Leave an empty blank line between paragraphs. URLs automatically turn into clickable links.</p>\
            <div class="form-group-dash">\
              <label for="pm-text">Message in English *</label>\
              <textarea id="pm-text" rows="7" required style="width:100%;padding:12px;border:1.5px solid var(--border-color);border-radius:8px;font-family:inherit;font-size:0.92rem;line-height:1.6;" placeholder="Write the principal’s inspiring guidance for students, teachers and parents...">' + (msg.text || '') + '</textarea>\
            </div>\
            <div class="form-group-dash" style="margin-top:14px;">\
              <label for="pm-te-text">Telugu Translation / సందేశం (Optional)</label>\
              <textarea id="pm-te-text" rows="5" style="width:100%;padding:12px;border:1.5px solid var(--border-color);border-radius:8px;font-family:inherit;font-size:0.92rem;line-height:1.6;" placeholder="సందేశం తెలుగు అనువాదం ఇక్కడ రాయవచ్చు...">' + (msg.teluguText || '') + '</textarea>\
            </div>\
          </div>\
\
          <!-- Section 3: Important Highlight Box -->\
          <div style="background:#fffbeb;padding:20px;border-radius:10px;border:1px solid #fef3c7;">\
            <h3 style="font-size:1.05rem;font-weight:600;margin-bottom:6px;color:#92400e;">3. Important Highlight Note (Displayed Below Principal Portrait)</h3>\
            <p style="font-size:0.83rem;color:#b45309;margin-bottom:14px;">Short official notice or key takeaway from the leadership.</p>\
            <div class="form-row">\
              <div class="form-group-dash">\
                <label for="pm-imp-title" style="color:#78350f;">Highlight Heading</label>\
                <input type="text" id="pm-imp-title" value="' + (msg.importantTitle || 'Principal FAC · Dr. Bandari Sampath Kumar').replace(/"/g, '&quot;') + '" placeholder="e.g. Principal Important Message" />\
              </div>\
            </div>\
            <div class="form-group-dash">\
              <label for="pm-imp-text" style="color:#78350f;">Highlight Description</label>\
              <textarea id="pm-imp-text" rows="3" style="width:100%;padding:10px 12px;border:1.5px solid #fde68a;border-radius:8px;font-size:0.9rem;" placeholder="e.g. Admissions for Classes VI to XII are conducted through the state CGG entrance portal...">' + (msg.importantText || '') + '</textarea>\
            </div>\
          </div>\
\
          <!-- Section 4: Press Clipping / Attachment Image -->\
          <div style="background:#f8fafc;padding:20px;border-radius:10px;border:1px solid #e2e8f0;">\
            <h3 style="font-size:1.05rem;font-weight:600;margin-bottom:6px;color:#1e293b;">4. Press Clipping / Event Media (Optional)</h3>\
            <p style="font-size:0.83rem;color:#64748b;margin-bottom:14px;">Displays on the right side of the Principal row on the homepage.</p>\
            <div style="display:flex;gap:20px;align-items:flex-start;flex-wrap:wrap;">\
              <div style="flex:1;min-width:260px;">\
                <div class="upload-zone" id="pm-dropzone" style="' + (currentImg ? 'display:none;' : '') + '">\
                  <input type="file" id="pm-file-input" accept="image/*" style="display:none;" />\
                  <div style="font-size:2rem;margin-bottom:8px;">📰</div>\
                  <div style="font-weight:600;color:#1e293b;">Click to upload press clipping / photograph</div>\
                  <div style="font-size:0.8rem;color:#64748b;">Supports JPG, PNG, WebP (up to 5MB)</div>\
                </div>\
                <div id="pm-preview-box" class="upload-preview-container" style="' + (currentImg ? '' : 'display:none;') + '">\
                  <img id="pm-preview-img" src="' + currentImg + '" class="upload-preview-img" style="max-height:160px;object-fit:cover;" />\
                  <button type="button" id="remove-pm-img" class="upload-preview-remove">✕ Remove Photo</button>\
                </div>\
                <input type="hidden" id="pm-image-url" value="' + currentImg.replace(/"/g, '&quot;') + '" />\
              </div>\
              <div style="flex:1;min-width:260px;">\
                <div class="form-group-dash">\
                  <label for="pm-img-caption">Photo Caption / Note</label>\
                  <input type="text" id="pm-img-caption" value="' + (msg.imageCaption || '').replace(/"/g, '&quot;') + '" placeholder="e.g. Dr. Bandari Sampath Kumar addressing parents" />\
                </div>\
                <div class="form-group-dash" style="margin-top:12px;">\
                  <label for="pm-img-alt">Accessible Screen Reader Description</label>\
                  <input type="text" id="pm-img-alt" value="' + (msg.imageAlt || '').replace(/"/g, '&quot;') + '" placeholder="e.g. Principal address at orientation" />\
                </div>\
              </div>\
            </div>\
          </div>\
        </div>\
\
        <!-- Save Button Bar -->\
        <div style="display:flex;justify-content:flex-end;gap:12px;margin-top:28px;padding-top:20px;border-top:1px solid #e2e8f0;">\
          <button type="submit" id="save-pm-btn" class="btn btn-primary-dash" style="padding:12px 28px;font-size:1rem;">\
            💾 Save & Publish Principal’s Message\
          </button>\
        </div>\
      </form>';

    this.bindEvents();
  },

  bindEvents: function() {
    var self = this;
    var dropzone = document.getElementById('pm-dropzone');
    var fileInput = document.getElementById('pm-file-input');
    var previewBox = document.getElementById('pm-preview-box');
    var previewImg = document.getElementById('pm-preview-img');
    var hiddenUrl = document.getElementById('pm-image-url');
    var removeBtn = document.getElementById('remove-pm-img');
    var saveBtn = document.getElementById('save-pm-btn');

    if (dropzone && fileInput) {
      dropzone.onclick = function() { fileInput.click(); };
      dropzone.ondragover = function(e) { e.preventDefault(); dropzone.classList.add('dragover'); };
      dropzone.ondragleave = function() { dropzone.classList.remove('dragover'); };
      dropzone.ondrop = function(e) {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          handleFile(e.dataTransfer.files[0]);
        }
      };
      fileInput.onchange = function() {
        if (fileInput.files && fileInput.files[0]) {
          handleFile(fileInput.files[0]);
        }
      };
    }

    async function handleFile(file) {
      if (!file.type.startsWith('image/')) {
        window.AdminAPI.showToast('Please select a valid image file', 'error');
        return;
      }
      var reader = new FileReader();
      reader.onload = function(e) {
        previewImg.src = e.target.result;
        previewBox.style.display = 'block';
        dropzone.style.display = 'none';
      };
      reader.readAsDataURL(file);

      try {
        saveBtn.disabled = true;
        saveBtn.textContent = '⏳ Uploading media...';
        var res = await window.AdminAPI.uploadImage(file, 'general');
        if (res && res.url) {
          hiddenUrl.value = res.url;
          window.AdminAPI.showToast('Photo uploaded successfully', 'success');
        }
      } catch (err) {
        window.AdminAPI.showToast('Upload failed: ' + err.message, 'error');
      } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = '💾 Save & Publish Principal’s Message';
      }
    }

    if (removeBtn) {
      removeBtn.onclick = function() {
        hiddenUrl.value = '';
        previewImg.src = '';
        previewBox.style.display = 'none';
        dropzone.style.display = 'flex';
        if (fileInput) fileInput.value = '';
      };
    }

    var form = document.getElementById('principal-message-form');
    if (form) {
      form.onsubmit = async function(e) {
        e.preventDefault();
        saveBtn.disabled = true;
        saveBtn.textContent = '⏳ Saving...';

        var payload = {
          title: document.getElementById('pm-title').value.trim(),
          teluguTitle: document.getElementById('pm-te-title').value.trim(),
          text: document.getElementById('pm-text').value.trim(),
          teluguText: document.getElementById('pm-te-text').value.trim(),
          importantTitle: document.getElementById('pm-imp-title').value.trim(),
          importantText: document.getElementById('pm-imp-text').value.trim(),
          image: hiddenUrl.value.trim(),
          imageCaption: document.getElementById('pm-img-caption').value.trim(),
          imageAlt: document.getElementById('pm-img-alt').value.trim(),
          links: (self.data && self.data.links) || []
        };

        try {
          var res = await window.AdminAPI.put('/api/admin/principal-message', payload);
          if (res && res.error) throw new Error(res.error);

          window.AdminAPI.showToast('Principal’s message saved and published live!', 'success');
          self.data = payload;

          // Real-time broadcast to main website tabs
          window.AdminAPI.broadcastUpdate({ principalPress: payload });
        } catch (err) {
          window.AdminAPI.showToast('Error saving: ' + err.message, 'error');
        } finally {
          saveBtn.disabled = false;
          saveBtn.textContent = '💾 Save & Publish Principal’s Message';
        }
      };
    }
  }
};
