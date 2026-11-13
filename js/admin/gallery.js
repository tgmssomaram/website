// gallery.js — Photo Uploader & Gallery Manager
// Depends on api.js

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
          <p>Upload, organize, and manage school photo albums and event galleries.</p>\
        </div>\
        <button id="add-gallery-btn" class="btn btn-primary-dash">+ Add Photo</button>\
      </div>\
      <div class="card" style="margin-bottom:20px;">\
        <div style="display:flex;gap:10px;flex-wrap:wrap;" id="gallery-categories">\
          <button class="btn btn-sm btn-primary-dash" data-cat="">All Photos</button>\
          <button class="btn btn-sm btn-secondary" data-cat="School Activities">School Activities</button>\
          <button class="btn btn-sm btn-secondary" data-cat="Campus">Campus</button>\
          <button class="btn btn-sm btn-secondary" data-cat="Events">Events</button>\
          <button class="btn btn-sm btn-secondary" data-cat="Sports">Sports</button>\
        </div>\
      </div>\
      <div id="gallery-grid-container">\
        <div class="card text-center" style="padding:40px;">Loading gallery items...</div>\
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
        <div class="card text-center text-muted" style="padding:48px;">\
          <div style="font-size:2.5rem;margin-bottom:12px;">📷</div>\
          <h3>No gallery photos found</h3>\
          <p style="margin-top:6px;">Click "+ Add Photo" to link an image to this category.</p>\
        </div>';
      return;
    }

    this.data = res.data;
    container.innerHTML = '<div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(260px, 1fr));gap:20px;">' +
      this.data.map(function(item) {
        return '\
          <div class="card" style="padding:0;overflow:hidden;display:flex;flex-direction:column;">\
            <div style="position:relative;height:180px;background:#e2e8f0;overflow:hidden;">\
              <img src="' + item.image_url + '" style="width:100%;height:100%;object-fit:cover;" onerror="this.src=\'../images/munagala-campus-background.jpg\'" />\
              <span class="badge ' + (item.is_active ? 'badge-success' : 'badge-danger') + '" style="position:absolute;top:10px;right:10px;">\
                ' + (item.is_active ? 'Active' : 'Hidden') + '\
              </span>\
              <span class="badge badge-purple" style="position:absolute;bottom:10px;left:10px;">\
                ' + (item.category || 'General') + '\
              </span>\
            </div>\
            <div style="padding:16px;flex:1;display:flex;flex-direction:column;justify-content:space-between;">\
              <div>\
                <h4 style="font-size:1rem;font-weight:600;margin-bottom:6px;word-break:break-word;">' + (item.title || 'Untitled Photo') + '</h4>\
                <p style="font-size:0.85rem;color:#64748b;margin-bottom:12px;line-height:1.4;">' + (item.caption || 'No caption provided.') + '</p>\
              </div>\
              <div style="display:flex;justify-content:space-between;align-items:center;padding-top:12px;border-top:1px solid #f1f5f9;">\
                <button class="btn btn-sm btn-secondary" onclick="window.AdminModules.gallery.editItem(\'' + item.id + '\')">✏️ Edit</button>\
                <button class="btn btn-sm btn-danger" onclick="window.AdminModules.gallery.deleteItem(\'' + item.id + '\')">🗑️ Delete</button>\
              </div>\
            </div>\
          </div>';
      }).join('') +
    '</div>';
  },

  deleteItem: async function(id) {
    if (!confirm('Are you sure you want to remove this photo?')) return;
    var res = await window.AdminAPI.del('/api/admin/gallery', { id: id });
    if (res && res.success) {
      window.AdminAPI.showToast('Photo removed', 'info');
      await this.loadGallery();
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

    modal.innerHTML = '\
      <div class="modal" style="max-width:540px;background:#fff;border-radius:12px;padding:24px;box-shadow:0 10px 40px rgba(0,0,0,0.2);">\
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;">\
          <h2 style="font-size:1.2rem;margin:0;">' + (isEdit ? 'Edit Gallery Photo' : 'Add New Photo') + '</h2>\
          <button id="close-gallery-modal-btn" style="background:none;border:none;font-size:1.4rem;cursor:pointer;">&times;</button>\
        </div>\
        <form id="gallery-form">\
          <div class="form-group-dash">\
            <label for="gallery-title">Photo Title *</label>\
            <input type="text" id="gallery-title" required value="' + (item?.title || '').replace(/"/g, '&quot;') + '" placeholder="e.g. Science Exhibition & Lab Experiments" />\
          </div>\
          <div class="form-group-dash">\
            <label for="gallery-url">Image URL * (Direct Link or Local path)</label>\
            <input type="text" id="gallery-url" required value="' + (item?.image_url || '').replace(/"/g, '&quot;') + '" placeholder="e.g. /images/yoga-session.jpg or Supabase / Imgur URL" />\
          </div>\
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
              <input type="checkbox" id="gallery-active" style="width:20px;height:20px;accent-color:#FF9933;" ' + (item?.is_active !== false ? 'checked' : '') + ' />\
              <label for="gallery-active" style="margin:0;cursor:pointer;">Active on Website</label>\
            </div>\
          </div>\
          <div class="form-group-dash">\
            <label for="gallery-caption">Caption (Optional)</label>\
            <textarea id="gallery-caption" rows="2" placeholder="Brief description of the photo...">' + (item?.caption || '') + '</textarea>\
          </div>\
          <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:20px;">\
            <button type="button" id="cancel-gallery-modal-btn" class="btn btn-secondary">Cancel</button>\
            <button type="submit" class="btn btn-primary-dash">' + (isEdit ? 'Save Changes' : 'Add Photo') + '</button>\
          </div>\
        </form>\
      </div>';

    modal.classList.remove('hidden');

    var closeModal = function() { modal.classList.add('hidden'); };
    document.getElementById('close-gallery-modal-btn').onclick = closeModal;
    document.getElementById('cancel-gallery-modal-btn').onclick = closeModal;

    var self = this;
    document.getElementById('gallery-form').onsubmit = async function(e) {
      e.preventDefault();
      var title = document.getElementById('gallery-title').value.trim();
      var image_url = document.getElementById('gallery-url').value.trim();
      var category = document.getElementById('gallery-cat').value;
      var caption = document.getElementById('gallery-caption').value.trim();
      var is_active = document.getElementById('gallery-active').checked;

      var payload = {
        title: title,
        image_url: image_url,
        category: category,
        caption: caption,
        is_active: is_active
      };

      var res;
      if (isEdit) {
        payload.id = item.id;
        res = await window.AdminAPI.put('/api/admin/gallery', payload);
      } else {
        res = await window.AdminAPI.post('/api/admin/gallery', payload);
      }

      if (res && res.data) {
        window.AdminAPI.showToast(isEdit ? 'Photo updated' : 'Photo added', 'success');
        closeModal();
        await self.loadGallery();
      } else {
        window.AdminAPI.showToast(res?.error || 'Operation failed', 'error');
      }
    };
  }
};

