// gallery.js — Professional Photo Uploader & Gallery Manager
// Supports direct drag-and-drop file upload to Supabase cloud storage

window.AdminModules = window.AdminModules || {};
window.AdminModules.gallery = {
  data: [],
  selectedCategory: '',

  render: async function() {
    var view = document.getElementById('admin-view');
    view.innerHTML = '\
      <div class="section-header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">\
        <div>\
          <h1>🖼️ Gallery Manager</h1>\
          <p>Upload campus photos, manage albums, and showcase school activities.</p>\
        </div>\
        <button id="add-gallery-btn" class="btn btn-primary-dash">\
          <span>+ Upload New Photo</span>\
        </button>\
      </div>\
      <div class="card" style="margin-bottom:24px;">\
        <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;" id="gallery-categories">\
          <span style="font-size:0.85rem;font-weight:700;color:var(--text-muted);margin-right:4px;">Filter:</span>\
          <button class="btn btn-sm btn-primary-dash" data-cat="">All Photos</button>\
          <button class="btn btn-sm btn-secondary" data-cat="School Activities">School Activities</button>\
          <button class="btn btn-sm btn-secondary" data-cat="Campus">Campus</button>\
          <button class="btn btn-sm btn-secondary" data-cat="Events">Events</button>\
          <button class="btn btn-sm btn-secondary" data-cat="Sports">Sports</button>\
        </div>\
      </div>\
      <div id="gallery-grid-container">\
        <div class="card text-center" style="padding:48px;color:var(--text-muted);">\
          <div style="font-size:2rem;margin-bottom:8px;">⏳</div>\
          <div>Loading school photo albums...</div>\
        </div>\
      </div>\
      <div id="gallery-modal" class="modal-backdrop hidden"></div>';

    var self = this;
    document.querySelectorAll('#gallery-categories button').forEach(function(btn) {
      btn.onclick = function() {
        document.querySelectorAll('#gallery-categories button').forEach(function(b) {
          b.className = 'btn btn-sm btn-secondary';
        });
        btn.className = 'btn btn-sm btn-primary-dash';
        self.selectedCategory = btn.getAttribute('data-cat') || '';
        self.loadGallery();
      };
    });

    document.getElementById('add-gallery-btn').onclick = () => this.showModal();
    await this.loadGallery();
  },

  loadGallery: async function() {
    var params = {};
    if (this.selectedCategory) params.category = this.selectedCategory;
    var res = await window.AdminAPI.get('/api/admin/gallery', params);
    var container = document.getElementById('gallery-grid-container');
    if (!container) return;

    if (!res || !res.data || !res.data.length) {
      container.innerHTML = '\
        <div class="card text-center" style="padding:56px 24px;">\
          <div style="font-size:3rem;margin-bottom:12px;">📷</div>\
          <h3 style="font-size:1.15rem;font-weight:700;color:var(--text-primary);margin-bottom:6px;">No photos found in this category</h3>\
          <p style="font-size:0.9rem;color:var(--text-muted);margin-bottom:20px;">Click the button below to upload your first campus photo.</p>\
          <button class="btn btn-primary-dash" onclick="window.AdminModules.gallery.showModal()">+ Upload New Photo</button>\
        </div>';
      return;
    }

    this.data = res.data;
    container.innerHTML = '<div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(280px, 1fr));gap:20px;">' +
      this.data.map(function(item) {
        return '\
          <div class="card" style="padding:0;overflow:hidden;display:flex;flex-direction:column;border:1px solid var(--border-color);transition:transform 0.2s, box-shadow 0.2s;">\
            <div style="position:relative;height:190px;background:#0f172a;overflow:hidden;">\
              <img src="' + item.image_url + '" style="width:100%;height:100%;object-fit:cover;transition:transform 0.3s;" onerror="this.src=\'/images/munagala-campus-background.jpg\'" />\
              <span class="badge ' + (item.is_active ? 'badge-success' : 'badge-danger') + '" style="position:absolute;top:12px;right:12px;box-shadow:0 2px 8px rgba(0,0,0,0.2);">\
                ' + (item.is_active ? '● Live' : '○ Hidden') + '\
              </span>\
              <span class="badge badge-purple" style="position:absolute;bottom:12px;left:12px;box-shadow:0 2px 8px rgba(0,0,0,0.2);">\
                ' + (item.category || 'School Activities') + '\
              </span>\
            </div>\
            <div style="padding:18px;flex:1;display:flex;flex-direction:column;justify-content:space-between;">\
              <div>\
                <h4 style="font-size:1rem;font-weight:700;color:var(--text-primary);margin-bottom:6px;word-break:break-word;">' + (item.title || 'Untitled Photo') + '</h4>\
                <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:14px;line-height:1.45;">' + (item.caption || 'No caption provided.') + '</p>\
              </div>\
              <div style="display:flex;justify-content:space-between;align-items:center;padding-top:14px;border-top:1px solid var(--border-light);">\
                <button class="btn btn-sm btn-secondary" onclick="window.AdminModules.gallery.editItem(\'' + item.id + '\')">✏️ Edit</button>\
                <button class="btn btn-sm btn-danger" onclick="window.AdminModules.gallery.deleteItem(\'' + item.id + '\')">🗑️ Delete</button>\
              </div>\
            </div>\
          </div>';
      }).join('') +
    '</div>';
  },

  deleteItem: async function(id) {
    if (!confirm('Are you sure you want to delete this photo from the gallery?')) return;
    var res = await window.AdminAPI.del('/api/admin/gallery', { id: id });
    if (res && res.success) {
      window.AdminAPI.showToast('Photo deleted successfully', 'info');
      await this.loadGallery();
      window.AdminAPI.broadcastUpdate({ gallery: this.data.map(function(g) { return { src: g.image_url, title: g.title, te: g.caption || g.title, category: g.category || 'School Activities' }; }) });
    } else {
      window.AdminAPI.showToast(res?.error || 'Failed to delete photo', 'error');
    }
  },

  editItem: function(id) {
    var item = this.data.find(function(g) { return g.id === id; });
    if (item) this.showModal(item);
  },

  showModal: function(item) {
    var modal = document.getElementById('gallery-modal');
    if (!modal) return;
    var isEdit = !!item;
    var currentImageUrl = item?.image_url || '';

    modal.innerHTML = '\
      <div class="modal">\
        <div class="modal-header">\
          <h2>' + (isEdit ? 'Edit Gallery Photo' : 'Upload New Photo') + '</h2>\
          <button type="button" class="modal-close-btn" id="close-gallery-modal-btn">&times;</button>\
        </div>\
        <div class="modal-body">\
          <form id="gallery-form">\
            <!-- DIRECT IMAGE UPLOADER -->\
            <div class="image-upload-wrapper">\
              <label style="display:block;font-size:0.85rem;font-weight:700;color:var(--text-primary);margin-bottom:8px;">Photo File *</label>\
              \
              <div class="upload-zone" id="gallery-dropzone" style="' + (currentImageUrl ? 'display:none;' : '') + '">\
                <input type="file" id="gallery-file-input" accept="image/*" style="display:none;" />\
                <span class="upload-zone-icon">☁️</span>\
                <div class="upload-zone-text">Drag & drop your photo here, or <span>Browse</span></div>\
                <div class="upload-zone-subtext">Supports JPG, PNG, WebP up to 10MB</div>\
              </div>\
              \
              <div id="gallery-preview-box" class="upload-preview-container" style="' + (currentImageUrl ? '' : 'display:none;') + '">\
                <img id="gallery-preview-img" src="' + currentImageUrl + '" class="upload-preview-img" />\
                <button type="button" id="remove-gallery-img" class="upload-preview-remove">✕ Change Photo</button>\
              </div>\
              \
              <div id="upload-status" style="margin-top:8px;font-size:0.82rem;font-weight:600;color:var(--primary-hover);display:none;"></div>\
              \
              <input type="hidden" id="gallery-image-url" value="' + currentImageUrl + '" />\
              \
              <button type="button" class="upload-toggle-url" id="toggle-url-mode">Or enter image web URL manually</button>\
              <div id="manual-url-container" style="display:none;margin-top:10px;">\
                <input type="text" id="gallery-url-manual" value="' + currentImageUrl + '" placeholder="https://example.com/photo.jpg or /images/..." style="width:100%;padding:10px 14px;border:1.5px solid var(--border-color);border-radius:8px;font-size:0.88rem;" />\
              </div>\
            </div>\
            \
            <div class="form-group-dash">\
              <label for="gallery-title">Photo Title *</label>\
              <input type="text" id="gallery-title" required value="' + (item?.title || '').replace(/"/g, '&quot;') + '" placeholder="e.g. Science Exhibition & Lab Experiments" />\
            </div>\
            \
            <div class="form-row">\
              <div class="form-group-dash">\
                <label for="gallery-cat">Category</label>\
                <select id="gallery-cat">\
                  <option value="School Activities"' + (item?.category === 'School Activities' ? ' selected' : '') + '>School Activities</option>\
                  <option value="Campus"' + (item?.category === 'Campus' ? ' selected' : '') + '>Campus</option>\
                  <option value="Events"' + (item?.category === 'Events' ? ' selected' : '') + '>Events</option>\
                  <option value="Sports"' + (item?.category === 'Sports' ? ' selected' : '') + '>Sports</option>\
                </select>\
              </div>\
              <div class="form-group-dash" style="display:flex;align-items:center;gap:10px;margin-top:28px;">\
                <input type="checkbox" id="gallery-active" style="width:20px;height:20px;accent-color:var(--primary);cursor:pointer;" ' + (item?.is_active !== false ? 'checked' : '') + ' />\
                <label for="gallery-active" style="margin:0;cursor:pointer;font-weight:600;">Display Live on Website</label>\
              </div>\
            </div>\
            \
            <div class="form-group-dash">\
              <label for="gallery-caption">Caption / Description (Optional)</label>\
              <textarea id="gallery-caption" rows="2" placeholder="Brief note about this event or activity...">' + (item?.caption || '') + '</textarea>\
            </div>\
            \
            <div class="modal-footer">\
              <button type="button" id="cancel-gallery-modal-btn" class="btn btn-secondary">Cancel</button>\
              <button type="submit" id="save-gallery-btn" class="btn btn-primary-dash">' + (isEdit ? 'Save Changes' : 'Upload & Publish') + '</button>\
            </div>\
          </form>\
        </div>\
      </div>';

    modal.classList.remove('hidden');

    var closeModal = function() { modal.classList.add('hidden'); };
    document.getElementById('close-gallery-modal-btn').onclick = closeModal;
    document.getElementById('cancel-gallery-modal-btn').onclick = closeModal;

    // Direct Image Upload Handling
    var dropzone = document.getElementById('gallery-dropzone');
    var fileInput = document.getElementById('gallery-file-input');
    var previewBox = document.getElementById('gallery-preview-box');
    var previewImg = document.getElementById('gallery-preview-img');
    var hiddenUrl = document.getElementById('gallery-image-url');
    var removeBtn = document.getElementById('remove-gallery-img');
    var statusEl = document.getElementById('upload-status');
    var saveBtn = document.getElementById('save-gallery-btn');

    // Toggle manual URL input
    var toggleBtn = document.getElementById('toggle-url-mode');
    var manualContainer = document.getElementById('manual-url-container');
    var manualInput = document.getElementById('gallery-url-manual');

    toggleBtn.onclick = function() {
      if (manualContainer.style.display === 'none') {
        manualContainer.style.display = 'block';
        toggleBtn.textContent = 'Hide URL box';
      } else {
        manualContainer.style.display = 'none';
        toggleBtn.textContent = 'Or enter image web URL manually';
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

      // Show immediate local preview
      var localReader = new FileReader();
      localReader.onload = function(e) {
        previewImg.src = e.target.result;
        previewBox.style.display = 'flex';
        dropzone.style.display = 'none';
      };
      localReader.readAsDataURL(file);

      // Upload file directly to Supabase Storage
      statusEl.style.display = 'block';
      statusEl.textContent = 'Uploading to cloud storage...';
      saveBtn.disabled = true;

      try {
        var res = await window.AdminAPI.uploadImage(file, 'gallery');
        if (res && res.success && res.url) {
          hiddenUrl.value = res.url;
          if (manualInput) manualInput.value = res.url;
          statusEl.textContent = '✓ Uploaded successfully!';
          statusEl.style.color = 'var(--success)';
          window.AdminAPI.showToast('Image uploaded to cloud storage', 'success');
        } else {
          throw new Error(res?.error || 'Upload failed');
        }
      } catch (err) {
        statusEl.textContent = 'Upload failed: ' + (err.message || 'Unknown error');
        statusEl.style.color = 'var(--danger)';
        window.AdminAPI.showToast('Image upload failed: ' + err.message, 'error');
      } finally {
        saveBtn.disabled = false;
      }
    }

    // Submit form
    var self = this;
    document.getElementById('gallery-form').onsubmit = async function(e) {
      e.preventDefault();
      var title = document.getElementById('gallery-title').value.trim();
      var image_url = hiddenUrl.value.trim();
      var category = document.getElementById('gallery-cat').value;
      var caption = document.getElementById('gallery-caption').value.trim();
      var is_active = document.getElementById('gallery-active').checked;

      if (!image_url) {
        alert('Please upload a photo or enter an image URL.');
        return;
      }

      var payload = {
        title: title,
        image_url: image_url,
        category: category,
        caption: caption,
        is_active: is_active
      };

      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving...';

      var res;
      if (isEdit) {
        payload.id = item.id;
        res = await window.AdminAPI.put('/api/admin/gallery', payload);
      } else {
        res = await window.AdminAPI.post('/api/admin/gallery', payload);
      }

      saveBtn.disabled = false;

      if (res && res.data) {
        window.AdminAPI.showToast(isEdit ? 'Photo updated' : 'Photo added to gallery', 'success');
        closeModal();
        await self.loadGallery();
        window.AdminAPI.broadcastUpdate({ gallery: self.data.map(function(g) { return { src: g.image_url, title: g.title, te: g.caption || g.title, category: g.category || 'School Activities' }; }) });
      } else {
        window.AdminAPI.showToast(res?.error || 'Operation failed', 'error');
      }
    };
  }
};
