// notices.js — Live Flash News Editor
// Depends on api.js

window.AdminModules = window.AdminModules || {};
window.AdminModules.notices = {
  data: [],

  render: async function() {
    var view = document.getElementById('admin-view');
    view.innerHTML = '\
      <div class="section-header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">\
        <div>\
          <h1>🗞️ Live Flash News Editor</h1>\
          <p>Add, edit, toggle, and delete official school flash notices and announcements.</p>\
        </div>\
        <button id="add-notice-btn" class="btn btn-primary-dash">+ New Notice</button>\
      </div>\
      <div class="card">\
        <div class="table-wrap">\
          <table class="data-table">\
            <thead>\
              <tr>\
                <th>Status</th>\
                <th>Notice Title</th>\
                <th>Detail</th>\
                <th>Date</th>\
                <th style="text-align:right">Actions</th>\
              </tr>\
            </thead>\
            <tbody id="notices-table-body">\
              <tr><td colspan="5" class="text-center" style="padding:24px">Loading notices...</td></tr>\
            </tbody>\
          </table>\
        </div>\
      </div>\
      <div id="notice-modal" class="modal-backdrop hidden"></div>';

    document.getElementById('add-notice-btn').onclick = () => this.showModal();
    await this.loadNotices();
  },

  loadNotices: async function() {
    var res = await window.AdminAPI.get('/api/admin/notices', { all: 'true' });
    var tbody = document.getElementById('notices-table-body');
    if (!tbody) return;

    if (!res || !res.data || !res.data.length) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted" style="padding:24px">No notices found. Click "+ New Notice" to create one.</td></tr>';
      return;
    }

    this.data = res.data;
    var self = this;
    tbody.innerHTML = this.data.map(function(n) {
      return '\
        <tr>\
          <td>\
            <button class="badge ' + (n.is_active ? 'badge-success' : 'badge-danger') + '" style="cursor:pointer;border:none;" onclick="window.AdminModules.notices.toggleStatus(\'' + n.id + '\', ' + n.is_active + ')">\
              ' + (n.is_active ? '● Active' : '○ Inactive') + '\
            </button>\
          </td>\
          <td style="font-weight:600;max-width:320px;word-break:break-word;">' + (n.title || '') + '</td>\
          <td style="max-width:280px;word-break:break-word;color:#64748b;">' + (n.detail || '-') + '</td>\
          <td style="white-space:nowrap;color:#64748b;">' + (n.date || '-') + '</td>\
          <td style="text-align:right;">\
            <div class="table-actions" style="justify-content:flex-end;">\
              <button class="btn btn-sm btn-secondary" onclick="window.AdminModules.notices.editNotice(\'' + n.id + '\')">✏️ Edit</button>\
              <button class="btn btn-sm btn-danger" onclick="window.AdminModules.notices.deleteNotice(\'' + n.id + '\')">🗑️</button>\
            </div>\
          </td>\
        </tr>';
    }).join('');
  },

  toggleStatus: async function(id, currentStatus) {
    var res = await window.AdminAPI.put('/api/admin/notices', { id: id, is_active: !currentStatus });
    if (res && res.data) {
      window.AdminAPI.showToast('Notice status updated', 'success');
      await this.loadNotices();
    } else {
      window.AdminAPI.showToast(res?.error || 'Failed to update status', 'error');
    }
  },

  deleteNotice: async function(id) {
    if (!confirm('Are you sure you want to delete this notice?')) return;
    var res = await window.AdminAPI.del('/api/admin/notices', { id: id });
    if (res && res.success) {
      window.AdminAPI.showToast('Notice deleted', 'info');
      await this.loadNotices();
    } else {
      window.AdminAPI.showToast(res?.error || 'Failed to delete notice', 'error');
    }
  },

  editNotice: function(id) {
    var item = this.data.find(function(n) { return n.id === id; });
    if (item) this.showModal(item);
  },

  showModal: function(item) {
    var modal = document.getElementById('notice-modal');
    if (!modal) return;
    var isEdit = !!item;
    var today = new Date().toISOString().split('T')[0];

    modal.innerHTML = '\
      <div class="modal">\
        <div class="modal-header">\
          <h2>' + (isEdit ? 'Edit Notice' : 'New Flash Notice') + '</h2>\
          <button type="button" class="modal-close-btn" id="close-modal-btn">&times;</button>\
        </div>\
        <div class="modal-body">\
          <form id="notice-form">\
            <div class="form-group-dash">\
              <label for="notice-title">Notice Title / Headline *</label>\
              <input type="text" id="notice-title" required value="' + (item?.title || '').replace(/"/g, '&quot;') + '" placeholder="e.g. Admissions Open for Academic Year 2026-27" />\
            </div>\
            <div class="form-group-dash">\
              <label for="notice-detail">Additional Details (Optional)</label>\
              <textarea id="notice-detail" rows="3" placeholder="Enter detailed announcement or instructions...">' + (item?.detail || '') + '</textarea>\
            </div>\
            <div class="form-row">\
              <div class="form-group-dash">\
                <label for="notice-date">Publish Date</label>\
                <input type="date" id="notice-date" value="' + (item?.date || today) + '" />\
              </div>\
              <div class="form-group-dash" style="display:flex;align-items:center;gap:10px;margin-top:28px;">\
                <input type="checkbox" id="notice-active" style="width:20px;height:20px;accent-color:var(--primary);cursor:pointer;" ' + (item?.is_active !== false ? 'checked' : '') + ' />\
                <label for="notice-active" style="margin:0;cursor:pointer;font-weight:600;">Display Live on Website</label>\
              </div>\
            </div>\
            <div class="modal-footer">\
              <button type="button" id="cancel-modal-btn" class="btn btn-secondary">Cancel</button>\
              <button type="submit" class="btn btn-primary-dash">' + (isEdit ? 'Save Changes' : 'Publish Notice') + '</button>\
            </div>\
          </form>\
        </div>\
      </div>';

    modal.classList.remove('hidden');

    var closeModal = function() { modal.classList.add('hidden'); };
    document.getElementById('close-modal-btn').onclick = closeModal;
    document.getElementById('cancel-modal-btn').onclick = closeModal;

    var self = this;
    document.getElementById('notice-form').onsubmit = async function(e) {
      e.preventDefault();
      var title = document.getElementById('notice-title').value.trim();
      var detail = document.getElementById('notice-detail').value.trim();
      var date = document.getElementById('notice-date').value;
      var is_active = document.getElementById('notice-active').checked;

      var payload = { title: title, detail: detail, date: date, is_active: is_active };
      var res;
      if (isEdit) {
        payload.id = item.id;
        res = await window.AdminAPI.put('/api/admin/notices', payload);
      } else {
        res = await window.AdminAPI.post('/api/admin/notices', payload);
      }

      if (res && res.data) {
        window.AdminAPI.showToast(isEdit ? 'Notice updated' : 'Notice published', 'success');
        closeModal();
        await self.loadNotices();
      } else {
        window.AdminAPI.showToast(res?.error || 'Operation failed', 'error');
      }
    };
  }
};

