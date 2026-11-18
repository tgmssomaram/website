// faculty.js — Professional Faculty Manager
// Supports direct photo upload to Supabase cloud storage

window.AdminModules = window.AdminModules || {};
window.AdminModules.faculty = {
  data: [],

  render: async function() {
    var view = document.getElementById('admin-view');
    view.innerHTML = '\
      <div class="section-header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">\
        <div>\
          <h1>👨‍🏫 Faculty Manager</h1>\
          <p>Manage teaching staff, designations, academic qualifications, and profile photos.</p>\
        </div>\
        <button id="add-faculty-btn" class="btn btn-primary-dash">\
          <span>+ Add Faculty Member</span>\
        </button>\
      </div>\
      <div class="card">\
        <div class="table-wrap">\
          <table class="data-table">\
            <thead>\
              <tr>\
                <th>Order</th>\
                <th>Staff Member</th>\
                <th>Designation</th>\
                <th>Subject</th>\
                <th>Qualification</th>\
                <th>Status</th>\
                <th style="text-align:right">Actions</th>\
              </tr>\
            </thead>\
            <tbody id="faculty-table-body">\
              <tr><td colspan="7" class="text-center" style="padding:32px;color:var(--text-muted);">Loading faculty list...</td></tr>\
            </tbody>\
          </table>\
        </div>\
      </div>\
      <div id="faculty-modal" class="modal-backdrop hidden"></div>';

    document.getElementById('add-faculty-btn').onclick = () => this.showModal();
    await this.loadFaculty();
  },

  loadFaculty: async function() {
    var res = await window.AdminAPI.get('/api/admin/faculty');
    var tbody = document.getElementById('faculty-table-body');
    if (!tbody) return;

    if (!res || !res.data || !res.data.length) {
      tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted" style="padding:48px;">No faculty members found. Click "+ Add Faculty Member" to create one.</td></tr>';
      return;
    }

    this.data = res.data;
    var self = this;
    tbody.innerHTML = this.data.map(function(f) {
      return '\
        <tr>\
          <td style="color:var(--text-muted);font-weight:700;">#' + (f.order_index ?? 0) + '</td>\
          <td>\
            <div style="display:flex;align-items:center;gap:12px;">\
              <div style="width:40px;height:40px;border-radius:50%;background:#e2e8f0;overflow:hidden;flex-shrink:0;border:1.5px solid var(--border-color);display:flex;align-items:center;justify-content:center;">\
                ' + (f.photo_url ? '<img src="' + f.photo_url + '" style="width:100%;height:100%;object-fit:cover;" onerror="this.src=\'/images/telangana-emblem-trimmed.svg\'">' : '<span style="font-size:1.2rem;">👤</span>') + '\
              </div>\
              <div>\
                <div style="font-weight:700;color:var(--text-primary);">' + (f.name || '') + '</div>\
              </div>\
            </div>\
          </td>\
          <td style="font-weight:600;color:var(--text-secondary);">' + (f.designation || '-') + '</td>\
          <td><span class="badge badge-info">' + (f.subject || '-') + '</span></td>\
          <td style="color:var(--text-muted);font-size:0.85rem;">' + (f.qualification || '-') + '</td>\
          <td>\
            <button class="badge ' + (f.is_active ? 'badge-success' : 'badge-danger') + '" style="cursor:pointer;border:none;" onclick="window.AdminModules.faculty.toggleStatus(\'' + f.id + '\', ' + f.is_active + ')">\
              ' + (f.is_active ? '● Active' : '○ Hidden') + '\
            </button>\
          </td>\
          <td style="text-align:right;">\
            <div style="display:flex;gap:6px;justify-content:flex-end;">\
              <button class="btn btn-sm btn-secondary" onclick="window.AdminModules.faculty.editFaculty(\'' + f.id + '\')">✏️ Edit</button>\
              <button class="btn btn-sm btn-danger" onclick="window.AdminModules.faculty.deleteFaculty(\'' + f.id + '\')">🗑️</button>\
            </div>\
          </td>\
        </tr>';
    }).join('');
  },

  toggleStatus: async function(id, currentStatus) {
    var res = await window.AdminAPI.put('/api/admin/faculty', { id: id, is_active: !currentStatus });
    if (res && res.data) {
      window.AdminAPI.showToast('Faculty status updated', 'success');
      await this.loadFaculty();
      window.AdminAPI.broadcastUpdate({ facultyList: this.data });
    } else {
      window.AdminAPI.showToast(res?.error || 'Failed to update status', 'error');
    }
  },

  deleteFaculty: async function(id) {
    if (!confirm('Are you sure you want to remove this faculty record?')) return;
    var res = await window.AdminAPI.del('/api/admin/faculty', { id: id });
    if (res && res.success) {
      window.AdminAPI.showToast('Faculty member removed', 'info');
      await this.loadFaculty();
      window.AdminAPI.broadcastUpdate({ facultyList: this.data });
    } else {
      window.AdminAPI.showToast(res?.error || 'Failed to delete faculty', 'error');
    }
  },

  editFaculty: function(id) {
    var item = this.data.find(function(f) { return f.id === id; });
    if (item) this.showModal(item);
  },

  showModal: function(item) {
    var modal = document.getElementById('faculty-modal');
    if (!modal) return;
    var isEdit = !!item;
    var currentPhotoUrl = item?.photo_url || '';

    modal.innerHTML = '\
      <div class="modal">\
        <div class="modal-header">\
          <h2>' + (isEdit ? 'Edit Faculty Member' : 'Add New Faculty Member') + '</h2>\
          <button type="button" class="modal-close-btn" id="close-faculty-modal-btn">&times;</button>\
        </div>\
        <div class="modal-body">\
          <form id="faculty-form">\
            <!-- DIRECT PHOTO UPLOADER -->\
            <div class="image-upload-wrapper">\
              <label style="display:block;font-size:0.85rem;font-weight:700;color:var(--text-primary);margin-bottom:8px;">Profile Photo</label>\
              \
              <div class="upload-zone" id="faculty-dropzone" style="' + (currentPhotoUrl ? 'display:none;' : '') + '">\
                <input type="file" id="faculty-file-input" accept="image/*" style="display:none;" />\
                <span class="upload-zone-icon">👤</span>\
                <div class="upload-zone-text">Upload photo, or <span>Browse</span></div>\
                <div class="upload-zone-subtext">Passport size or portrait photo (PNG, JPG)</div>\
              </div>\
              \
              <div id="faculty-preview-box" class="upload-preview-container" style="background:#f8fafc;' + (currentPhotoUrl ? '' : 'display:none;') + '">\
                <img id="faculty-preview-img" src="' + currentPhotoUrl + '" class="upload-preview-img" style="max-height:180px;object-fit:cover;border-radius:50%;width:140px;height:140px;margin:16px 0;border:3px solid var(--primary);" />\
                <button type="button" id="remove-faculty-img" class="upload-preview-remove">✕ Change Photo</button>\
              </div>\
              \
              <div id="faculty-upload-status" style="margin-top:8px;font-size:0.82rem;font-weight:600;color:var(--primary-hover);display:none;"></div>\
              \
              <input type="hidden" id="faculty-photo" value="' + currentPhotoUrl + '" />\
              \
              <button type="button" class="upload-toggle-url" id="toggle-faculty-url-mode">Or enter photo web URL manually</button>\
              <div id="manual-faculty-url-container" style="display:none;margin-top:10px;">\
                <input type="text" id="faculty-url-manual" value="' + currentPhotoUrl + '" placeholder="https://example.com/photo.jpg or /images/..." style="width:100%;padding:10px 14px;border:1.5px solid var(--border-color);border-radius:8px;font-size:0.88rem;" />\
              </div>\
            </div>\
            \
            <div class="form-row">\
              <div class="form-group-dash">\
                <label for="faculty-name">Full Name *</label>\
                <input type="text" id="faculty-name" required value="' + (item?.name || '').replace(/"/g, '&quot;') + '" placeholder="e.g. Farhana" />\
              </div>\
              <div class="form-group-dash">\
                <label for="faculty-designation">Designation *</label>\
                <input type="text" id="faculty-designation" required value="' + (item?.designation || '').replace(/"/g, '&quot;') + '" placeholder="e.g. Principal FAC / PGT Mathematics" />\
              </div>\
            </div>\
            \
            <div class="form-row">\
              <div class="form-group-dash">\
                <label for="faculty-subject">Subject</label>\
                <input type="text" id="faculty-subject" value="' + (item?.subject || '').replace(/"/g, '&quot;') + '" placeholder="e.g. Mathematics" />\
              </div>\
              <div class="form-group-dash">\
                <label for="faculty-qualification">Qualification</label>\
                <input type="text" id="faculty-qualification" value="' + (item?.qualification || '').replace(/"/g, '&quot;') + '" placeholder="e.g. M.Sc., B.Ed." />\
              </div>\
            </div>\
            \
            <div class="form-row">\
              <div class="form-group-dash">\
                <label for="faculty-order">Display Order Index</label>\
                <input type="number" id="faculty-order" value="' + (item?.order_index ?? 0) + '" min="0" />\
              </div>\
              <div class="form-group-dash" style="display:flex;align-items:center;gap:10px;margin-top:28px;">\
                <input type="checkbox" id="faculty-active" style="width:20px;height:20px;accent-color:var(--primary);cursor:pointer;" ' + (item?.is_active !== false ? 'checked' : '') + ' />\
                <label for="faculty-active" style="margin:0;cursor:pointer;font-weight:600;">Active on Website</label>\
              </div>\
            </div>\
            \
            <div class="modal-footer">\
              <button type="button" id="cancel-faculty-modal-btn" class="btn btn-secondary">Cancel</button>\
              <button type="submit" id="save-faculty-btn" class="btn btn-primary-dash">' + (isEdit ? 'Save Changes' : 'Add Faculty Member') + '</button>\
            </div>\
          </form>\
        </div>\
      </div>';

    modal.classList.remove('hidden');

    var closeModal = function() { modal.classList.add('hidden'); };
    document.getElementById('close-faculty-modal-btn').onclick = closeModal;
    document.getElementById('cancel-faculty-modal-btn').onclick = closeModal;

    // Direct Photo Upload Handling
    var dropzone = document.getElementById('faculty-dropzone');
    var fileInput = document.getElementById('faculty-file-input');
    var previewBox = document.getElementById('faculty-preview-box');
    var previewImg = document.getElementById('faculty-preview-img');
    var hiddenUrl = document.getElementById('faculty-photo');
    var removeBtn = document.getElementById('remove-faculty-img');
    var statusEl = document.getElementById('faculty-upload-status');
    var saveBtn = document.getElementById('save-faculty-btn');

    var toggleBtn = document.getElementById('toggle-faculty-url-mode');
    var manualContainer = document.getElementById('manual-faculty-url-container');
    var manualInput = document.getElementById('faculty-url-manual');

    toggleBtn.onclick = function() {
      if (manualContainer.style.display === 'none') {
        manualContainer.style.display = 'block';
        toggleBtn.textContent = 'Hide URL box';
      } else {
        manualContainer.style.display = 'none';
        toggleBtn.textContent = 'Or enter photo web URL manually';
      }
    };

    manualInput.oninput = function() {
      hiddenUrl.value = manualInput.value.trim();
      if (hiddenUrl.value) {
        previewImg.src = hiddenUrl.value;
        previewBox.style.display = 'flex';
        dropzone.style.display = 'none';
      }
    };

    dropzone.onclick = function() { fileInput.click(); };

    dropzone.ondragover = function(e) {
      e.preventDefault();
      dropzone.classList.add('dragover');
    };

    dropzone.ondragleave = function() {
      dropzone.classList.remove('dragover');
    };

    dropzone.ondrop = function(e) {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileSelect(e.dataTransfer.files[0]);
      }
    };

    fileInput.onchange = function() {
      if (fileInput.files && fileInput.files[0]) {
        handleFileSelect(fileInput.files[0]);
      }
    };

    removeBtn.onclick = function() {
      hiddenUrl.value = '';
      previewImg.src = '';
      previewBox.style.display = 'none';
      dropzone.style.display = 'block';
      fileInput.value = '';
      if (manualInput) manualInput.value = '';
    };

    async function handleFileSelect(file) {
      if (!file.type.startsWith('image/')) {
        alert('Please choose an image file (PNG, JPG, WebP).');
        return;
      }

      var localReader = new FileReader();
      localReader.onload = function(e) {
        previewImg.src = e.target.result;
        previewBox.style.display = 'flex';
        dropzone.style.display = 'none';
      };
      localReader.readAsDataURL(file);

      statusEl.style.display = 'block';
      statusEl.textContent = 'Uploading photo to cloud storage...';
      saveBtn.disabled = true;

      try {
        var res = await window.AdminAPI.uploadImage(file, 'faculty');
        if (res && res.success && res.url) {
          hiddenUrl.value = res.url;
          if (manualInput) manualInput.value = res.url;
          statusEl.textContent = '✓ Uploaded successfully!';
          statusEl.style.color = 'var(--success)';
          window.AdminAPI.showToast('Faculty photo uploaded to cloud storage', 'success');
        } else {
          throw new Error(res?.error || 'Upload failed');
        }
      } catch (err) {
        statusEl.textContent = 'Upload failed: ' + (err.message || 'Unknown error');
        statusEl.style.color = 'var(--danger)';
        window.AdminAPI.showToast('Photo upload failed: ' + err.message, 'error');
      } finally {
        saveBtn.disabled = false;
      }
    }

    var self = this;
    document.getElementById('faculty-form').onsubmit = async function(e) {
      e.preventDefault();
      var name = document.getElementById('faculty-name').value.trim();
      var designation = document.getElementById('faculty-designation').value.trim();
      var subject = document.getElementById('faculty-subject').value.trim();
      var qualification = document.getElementById('faculty-qualification').value.trim();
      var photo_url = hiddenUrl.value.trim();
      var order_index = parseInt(document.getElementById('faculty-order').value) || 0;
      var is_active = document.getElementById('faculty-active').checked;

      var payload = {
        name: name,
        designation: designation,
        subject: subject,
        qualification: qualification,
        photo_url: photo_url,
        order_index: order_index,
        is_active: is_active
      };

      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving...';

      var res;
      if (isEdit) {
        payload.id = item.id;
        res = await window.AdminAPI.put('/api/admin/faculty', payload);
      } else {
        res = await window.AdminAPI.post('/api/admin/faculty', payload);
      }

      saveBtn.disabled = false;

      if (res && res.data) {
        window.AdminAPI.showToast(isEdit ? 'Faculty member updated' : 'Faculty member added', 'success');
        closeModal();
        await self.loadFaculty();
        window.AdminAPI.broadcastUpdate({ facultyList: self.data });
      } else {
        window.AdminAPI.showToast(res?.error || 'Operation failed', 'error');
      }
    };
  }
};
