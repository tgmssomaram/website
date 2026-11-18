// alumni.js — Alumni Management Module for Admin Portal
// Depends on api.js

window.AdminModules = window.AdminModules || {};
window.AdminModules.alumni = {
  items: [],

  render: async function() {
    var view = document.getElementById('admin-view');
    view.innerHTML = '\
      <div class="section-header">\
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;">\
          <div>\
            <h1>🎓 Alumni Manager</h1>\
            <p>Showcase proud alumni stories, academic achievements, batches, and photographs.</p>\
          </div>\
          <button type="button" id="add-alumni-btn" class="btn btn-primary-dash">+ Add Alumni Story</button>\
        </div>\
      </div>\
      <div id="alumni-list-container">\
        <div class="card text-center" style="padding:40px;"><p>Loading alumni stories...</p></div>\
      </div>\
      <div id="alumni-modal" class="modal-backdrop hidden">\
        <div class="modal-card">\
          <div class="modal-header">\
            <h3 id="alumni-modal-title">Add Alumni Story</h3>\
            <button type="button" class="modal-close-btn" id="alumni-modal-close">×</button>\
          </div>\
          <form id="alumni-form">\
            <input type="hidden" id="alm-id" />\
            <input type="hidden" id="alm-photo-url" />\
            <div class="form-group-dash">\
              <label for="alm-name">Full Name *</label>\
              <input type="text" id="alm-name" required placeholder="e.g. K. Praveen Kumar" />\
            </div>\
            <div class="form-row">\
              <div class="form-group-dash">\
                <label for="alm-batch">Batch / Passing Year</label>\
                <input type="text" id="alm-batch" placeholder="e.g. 2020–2022 (CEC)" />\
              </div>\
              <div class="form-group-dash">\
                <label for="alm-photo-file">Photograph</label>\
                <input type="file" id="alm-photo-file" accept="image/*" />\
              </div>\
            </div>\
            <div id="alm-photo-preview" style="margin-bottom:14px;display:none;">\
              <img id="alm-preview-img" src="" alt="Preview" style="width:70px;height:84px;object-fit:cover;border-radius:6px;border:1px solid #cbd5e1;" />\
            </div>\
            <div class="form-group-dash">\
              <label for="alm-achievement">Achievement / Current Role / Story</label>\
              <textarea id="alm-achievement" rows="3" placeholder="e.g. Completed B.Tech CSE; currently Software Engineer at TCS Hyderabad..."></textarea>\
            </div>\
            <div class="form-group-dash" style="display:flex;align-items:center;gap:10px;margin-top:10px;">\
              <input type="checkbox" id="alm-approved" checked style="width:18px;height:18px;" />\
              <label for="alm-approved" style="margin:0;cursor:pointer;font-weight:600;">Publish & Display on School Website</label>\
            </div>\
            <div style="display:flex;justify-content:flex-end;gap:12px;margin-top:24px;">\
              <button type="button" class="btn btn-secondary-dash" id="alumni-modal-cancel">Cancel</button>\
              <button type="submit" class="btn btn-primary-dash" id="alumni-modal-submit">Save Alumni</button>\
            </div>\
          </form>\
        </div>\
      </div>';

    this.bindEvents();
    await this.loadAlumni();
  },

  bindEvents: function() {
    var self = this;
    var addBtn = document.getElementById('add-alumni-btn');
    if (addBtn) addBtn.onclick = function() { self.openModal(); };

    var closeBtn = document.getElementById('alumni-modal-close');
    var cancelBtn = document.getElementById('alumni-modal-cancel');
    var modal = document.getElementById('alumni-modal');

    var closeModal = function() {
      if (modal) modal.classList.add('hidden');
    };
    if (closeBtn) closeBtn.onclick = closeModal;
    if (cancelBtn) cancelBtn.onclick = closeModal;

    var fileInput = document.getElementById('alm-photo-file');
    if (fileInput) {
      fileInput.onchange = function(e) {
        var file = e.target.files[0];
        if (file) {
          var reader = new FileReader();
          reader.onload = function(evt) {
            var prevBox = document.getElementById('alm-photo-preview');
            var prevImg = document.getElementById('alm-preview-img');
            if (prevBox && prevImg) {
              prevImg.src = evt.target.result;
              prevBox.style.display = 'block';
            }
          };
          reader.readAsDataURL(file);
        }
      };
    }

    var form = document.getElementById('alumni-form');
    if (form) {
      form.onsubmit = async function(e) {
        e.preventDefault();
        var submitBtn = document.getElementById('alumni-modal-submit');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving...';

        var id = document.getElementById('alm-id').value;
        var name = document.getElementById('alm-name').value.trim();
        var batch = document.getElementById('alm-batch').value.trim();
        var achievement = document.getElementById('alm-achievement').value.trim();
        var approved = document.getElementById('alm-approved').checked;
        var photoUrl = document.getElementById('alm-photo-url').value;

        var file = fileInput && fileInput.files[0];
        if (file) {
          try {
            submitBtn.textContent = 'Uploading photo...';
            var upRes = await window.AdminAPI.uploadImage(file, 'alumni');
            if (upRes && upRes.url) {
              photoUrl = upRes.url;
            }
          } catch (uploadErr) {
            console.warn('Alumni photo upload warning:', uploadErr);
          }
        }

        var payload = {
          name: name,
          batch: batch,
          achievement: achievement,
          approved: approved,
          photo: photoUrl || null
        };

        try {
          var res;
          if (id) {
            payload.id = id;
            res = await window.AdminAPI.put('/api/admin/alumni', payload);
          } else {
            res = await window.AdminAPI.post('/api/admin/alumni', payload);
          }

          submitBtn.disabled = false;
          submitBtn.textContent = 'Save Alumni';

          if (res && (res.success || res.data)) {
            closeModal();
            window.AdminAPI.showToast(id ? 'Alumni story updated!' : 'Alumni story added!', 'success');
            await self.loadAlumni();
            window.AdminAPI.broadcastUpdate({ alumni: self.items });
          } else {
            window.AdminAPI.showToast(res?.error || 'Failed to save alumni', 'error');
          }
        } catch (err) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Save Alumni';
          window.AdminAPI.showToast('Error: ' + err.message, 'error');
        }
      };
    }
  },

  openModal: function(item) {
    var modal = document.getElementById('alumni-modal');
    var title = document.getElementById('alumni-modal-title');
    var idInput = document.getElementById('alm-id');
    var nameInput = document.getElementById('alm-name');
    var batchInput = document.getElementById('alm-batch');
    var achInput = document.getElementById('alm-achievement');
    var appInput = document.getElementById('alm-approved');
    var photoInput = document.getElementById('alm-photo-url');
    var fileInput = document.getElementById('alm-photo-file');
    var prevBox = document.getElementById('alm-photo-preview');
    var prevImg = document.getElementById('alm-preview-img');

    if (fileInput) fileInput.value = '';

    if (item) {
      if (title) title.textContent = 'Edit Alumni Story';
      if (idInput) idInput.value = item.id || '';
      if (nameInput) nameInput.value = item.name || '';
      if (batchInput) batchInput.value = item.batch || '';
      if (achInput) achInput.value = item.achievement || '';
      if (appInput) appInput.checked = item.approved !== false;
      if (photoInput) photoInput.value = item.photo || '';
      if (prevBox && prevImg && item.photo) {
        prevImg.src = item.photo;
        prevBox.style.display = 'block';
      } else if (prevBox) {
        prevBox.style.display = 'none';
      }
    } else {
      if (title) title.textContent = 'Add Alumni Story';
      if (idInput) idInput.value = '';
      if (nameInput) nameInput.value = '';
      if (batchInput) batchInput.value = '';
      if (achInput) achInput.value = '';
      if (appInput) appInput.checked = true;
      if (photoInput) photoInput.value = '';
      if (prevBox) prevBox.style.display = 'none';
    }

    if (modal) modal.classList.remove('hidden');
  },

  loadAlumni: async function() {
    var res = await window.AdminAPI.get('/api/admin/alumni');
    this.items = (res && res.data) || [];
    this.renderList();
  },

  renderList: function() {
    var container = document.getElementById('alumni-list-container');
    if (!container) return;

    if (!this.items.length) {
      container.innerHTML = '\
        <div class="card text-center" style="padding:48px;">\
          <div style="font-size:2.5rem;margin-bottom:12px;">🎓</div>\
          <h3>No alumni stories yet</h3>\
          <p class="text-muted" style="margin-top:8px;">Add your first alumni story to inspire current students.</p>\
          <button type="button" class="btn btn-primary-dash" style="margin-top:16px;" onclick="window.AdminModules.alumni.openModal()">+ Add First Alumni</button>\
        </div>';
      return;
    }

    var self = this;
    var html = '<div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(320px, 1fr));gap:20px;">';

    this.items.forEach(function(item) {
      var photoSrc = item.photo || '/images/default-avatar.svg';
      var badgeClass = item.approved ? 'badge-success' : 'badge-danger';
      var badgeText = item.approved ? 'Published' : 'Hidden';

      html += '\
        <div class="card" style="display:flex;flex-direction:column;justify-content:space-between;padding:20px;border-top:3px solid ' + (item.approved ? '#10b981' : '#f59e0b') + ';">\
          <div>\
            <div style="display:flex;align-items:flex-start;gap:14px;margin-bottom:14px;">\
              <img src="' + photoSrc + '" alt="' + (item.name || 'Alumni').replace(/"/g, '&quot;') + '" style="width:64px;height:76px;object-fit:cover;border-radius:8px;border:1px solid #e2e8f0;background:#f8fafc;" onerror="this.src=\'/images/rmsa-logo-trimmed.svg\'" />\
              <div style="flex:1;">\
                <div style="display:flex;justify-content:space-between;align-items:flex-start;">\
                  <h3 style="font-size:1.05rem;font-weight:700;color:var(--text-primary);margin:0;">' + (item.name || '') + '</h3>\
                  <span class="badge ' + badgeClass + '" style="font-size:0.75rem;">' + badgeText + '</span>\
                </div>\
                <p style="font-size:0.85rem;font-weight:600;color:#64748b;margin:4px 0 0;">' + (item.batch ? 'Batch: ' + item.batch : '') + '</p>\
              </div>\
            </div>\
            <p style="font-size:0.88rem;color:#475569;line-height:1.5;margin:0 0 16px;">' + (item.achievement || 'No achievement details recorded.') + '</p>\
          </div>\
          <div style="display:flex;justify-content:space-between;align-items:center;padding-top:12px;border-top:1px solid var(--border-light);">\
            <button type="button" class="btn btn-secondary-dash" style="font-size:0.82rem;padding:6px 12px;" onclick=\'window.AdminModules.alumni.editItem("' + item.id + '")\'>✏️ Edit</button>\
            <div style="display:flex;gap:8px;">\
              <button type="button" class="btn btn-secondary-dash" style="font-size:0.82rem;padding:6px 10px;" onclick=\'window.AdminModules.alumni.toggleApproval("' + item.id + '")\'>' + (item.approved ? 'Hide' : 'Publish') + '</button>\
              <button type="button" class="btn btn-secondary-dash" style="font-size:0.82rem;padding:6px 10px;color:#dc2626;" onclick=\'window.AdminModules.alumni.deleteItem("' + item.id + '")\'>🗑️</button>\
            </div>\
          </div>\
        </div>';
    });

    html += '</div>';
    container.innerHTML = html;
  },

  editItem: function(id) {
    var item = this.items.find(function(a) { return a.id === id; });
    if (item) this.openModal(item);
  },

  toggleApproval: async function(id) {
    var item = this.items.find(function(a) { return a.id === id; });
    if (!item) return;

    var newApproved = !item.approved;
    try {
      var res = await window.AdminAPI.put('/api/admin/alumni', { id: id, approved: newApproved });
      if (res && res.data) {
        item.approved = newApproved;
        this.renderList();
        window.AdminAPI.showToast(newApproved ? 'Alumni story published!' : 'Alumni story hidden.', 'success');
        window.AdminAPI.broadcastUpdate({ alumni: this.items });
      }
    } catch (err) {
      window.AdminAPI.showToast('Error: ' + err.message, 'error');
    }
  },

  deleteItem: async function(id) {
    if (!confirm('Are you sure you want to delete this alumni story?')) return;
    try {
      var res = await window.AdminAPI.del('/api/admin/alumni', { id: id });
      if (res && res.success) {
        this.items = this.items.filter(function(a) { return a.id !== id; });
        this.renderList();
        window.AdminAPI.showToast('Alumni story deleted.', 'success');
        window.AdminAPI.broadcastUpdate({ alumni: this.items });
      }
    } catch (err) {
      window.AdminAPI.showToast('Error: ' + err.message, 'error');
    }
  }
};
