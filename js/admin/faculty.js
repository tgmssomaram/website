// faculty.js — Faculty Manager
// Depends on api.js

window.AdminModules = window.AdminModules || {};
window.AdminModules.faculty = {
  data: [],

  render: async function() {
    var view = document.getElementById('admin-view');
    view.innerHTML = '\
      <div class="section-header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">\
        <div>\
          <h1>👨‍🏫 Faculty Manager</h1>\
          <p>Manage teaching staff, designations, qualifications, and profile photos.</p>\
        </div>\
        <button id="add-faculty-btn" class="btn btn-primary-dash">+ Add Faculty</button>\
      </div>\
      <div class="card">\
        <div class="table-wrap">\
          <table class="data-table">\
            <thead>\
              <tr>\
                <th>Order</th>\
                <th>Name</th>\
                <th>Designation</th>\
                <th>Subject</th>\
                <th>Qualification</th>\
                <th>Status</th>\
                <th style="text-align:right">Actions</th>\
              </tr>\
            </thead>\
            <tbody id="faculty-table-body">\
              <tr><td colspan="7" class="text-center" style="padding:24px">Loading faculty...</td></tr>\
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
      tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted" style="padding:24px">No faculty members found. Click "+ Add Faculty" to add one.</td></tr>';
      return;
    }

    this.data = res.data;
    var self = this;
    tbody.innerHTML = this.data.map(function(f) {
      return '\
        <tr>\
          <td style="color:#64748b;font-weight:600;">' + (f.order_index ?? 0) + '</td>\
          <td style="font-weight:600;display:flex;align-items:center;gap:10px;">\
            <div style="width:36px;height:36px;border-radius:50%;background:#e2e8f0;overflow:hidden;flex-shrink:0;display:flex;align-items:center;justify-content:center;">\
              ' + (f.photo_url ? '<img src="' + f.photo_url + '" style="width:100%;height:100%;object-fit:cover;" onerror="this.src=\'../images/telangana-emblem-trimmed.svg\'">' : '<span>👤</span>') + '\
            </div>\
            <span>' + (f.name || '') + '</span>\
          </td>\
          <td>' + (f.designation || '-') + '</td>\
          <td><span class="badge badge-info">' + (f.subject || '-') + '</span></td>\
          <td style="color:#64748b;">' + (f.qualification || '-') + '</td>\
          <td>\
            <button class="badge ' + (f.is_active ? 'badge-success' : 'badge-danger') + '" style="cursor:pointer;border:none;" onclick="window.AdminModules.faculty.toggleStatus(\'' + f.id + '\', ' + f.is_active + ')">\
              ' + (f.is_active ? 'Active' : 'Hidden') + '\
            </button>\
          </td>\
          <td style="text-align:right;">\
            <div class="table-actions" style="justify-content:flex-end;">\
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
    } else {
      window.AdminAPI.showToast(res?.error || 'Failed to update status', 'error');
    }
  },

  deleteFaculty: async function(id) {
    if (!confirm('Are you sure you want to remove this faculty record?')) return;
    var res = await window.AdminAPI.del('/api/admin/faculty', { id: id });
    if (res && res.success) {
      window.AdminAPI.showToast('Faculty member deleted', 'info');
      await this.loadFaculty();
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

    modal.innerHTML = '\
      <div class="modal" style="max-width:560px;background:#fff;border-radius:12px;padding:24px;box-shadow:0 10px 40px rgba(0,0,0,0.2);">\
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;">\
          <h2 style="font-size:1.2rem;margin:0;">' + (isEdit ? 'Edit Faculty Member' : 'Add New Faculty Member') + '</h2>\
          <button id="close-faculty-modal-btn" style="background:none;border:none;font-size:1.4rem;cursor:pointer;">&times;</button>\
        </div>\
        <form id="faculty-form">\
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
          <div class="form-row">\
            <div class="form-group-dash">\
              <label for="faculty-photo">Photo URL</label>\
              <input type="text" id="faculty-photo" value="' + (item?.photo_url || '').replace(/"/g, '&quot;') + '" placeholder="e.g. /images/principal.jpg or web URL" />\
            </div>\
            <div class="form-group-dash">\
              <label for="faculty-order">Display Order</label>\
              <input type="number" id="faculty-order" value="' + (item?.order_index ?? 0) + '" min="0" />\
            </div>\
          </div>\
          <div class="form-group-dash" style="display:flex;align-items:center;gap:10px;margin-top:10px;">\
            <input type="checkbox" id="faculty-active" style="width:20px;height:20px;accent-color:#FF9933;" ' + (item?.is_active !== false ? 'checked' : '') + ' />\
            <label for="faculty-active" style="margin:0;cursor:pointer;">Active and Visible on Website</label>\
          </div>\
          <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:20px;">\
            <button type="button" id="cancel-faculty-modal-btn" class="btn btn-secondary">Cancel</button>\
            <button type="submit" class="btn btn-primary-dash">' + (isEdit ? 'Save Changes' : 'Add Faculty') + '</button>\
          </div>\
        </form>\
      </div>';

    modal.classList.remove('hidden');

    var closeModal = function() { modal.classList.add('hidden'); };
    document.getElementById('close-faculty-modal-btn').onclick = closeModal;
    document.getElementById('cancel-faculty-modal-btn').onclick = closeModal;

    var self = this;
    document.getElementById('faculty-form').onsubmit = async function(e) {
      e.preventDefault();
      var name = document.getElementById('faculty-name').value.trim();
      var designation = document.getElementById('faculty-designation').value.trim();
      var subject = document.getElementById('faculty-subject').value.trim();
      var qualification = document.getElementById('faculty-qualification').value.trim();
      var photo_url = document.getElementById('faculty-photo').value.trim();
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

      var res;
      if (isEdit) {
        payload.id = item.id;
        res = await window.AdminAPI.put('/api/admin/faculty', payload);
      } else {
        res = await window.AdminAPI.post('/api/admin/faculty', payload);
      }

      if (res && res.data) {
        window.AdminAPI.showToast(isEdit ? 'Faculty updated' : 'Faculty added', 'success');
        closeModal();
        await self.loadFaculty();
      } else {
        window.AdminAPI.showToast(res?.error || 'Operation failed', 'error');
      }
    };
  }
};
