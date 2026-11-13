// inquiries.js — Inquiry & Feedback Viewer
// Depends on api.js

window.AdminModules = window.AdminModules || {};
window.AdminModules.inquiries = {
  data: [],
  page: 1,
  limit: 15,
  totalPages: 1,
  search: '',

  render: async function() {
    var view = document.getElementById('admin-view');
    view.innerHTML = '\
      <div class="section-header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">\
        <div>\
          <h1>📩 Inquiries & Messages</h1>\
          <p>Review admissions inquiries, community feedback, and contact form submissions.</p>\
        </div>\
        <button id="export-csv-btn" class="btn btn-secondary">📥 Export CSV</button>\
      </div>\
      <div class="card" style="margin-bottom:20px;">\
        <div style="display:flex;gap:12px;align-items:center;">\
          <input type="text" id="inquiry-search" placeholder="Search by name, contact, or keywords..." style="flex:1;padding:10px 14px;border:1px solid #e2e8f0;border-radius:8px;outline:none;" />\
          <button id="search-btn" class="btn btn-primary-dash">Search</button>\
        </div>\
      </div>\
      <div class="card">\
        <div class="table-wrap">\
          <table class="data-table">\
            <thead>\
              <tr>\
                <th>Date & Time</th>\
                <th>Name</th>\
                <th>Role / Interest</th>\
                <th>Contact</th>\
                <th>Message Snippet</th>\
                <th style="text-align:right">Action</th>\
              </tr>\
            </thead>\
            <tbody id="inquiries-table-body">\
              <tr><td colspan="6" class="text-center" style="padding:24px">Loading inquiries...</td></tr>\
            </tbody>\
          </table>\
        </div>\
        <div id="inquiries-pagination" style="display:flex;justify-content:space-between;align-items:center;padding:16px 4px 4px;margin-top:10px;border-top:1px solid #f1f5f9;"></div>\
      </div>\
      <div id="inquiry-modal" class="modal-backdrop hidden"></div>';

    var self = this;
    document.getElementById('search-btn').onclick = function() {
      self.search = document.getElementById('inquiry-search').value.trim();
      self.page = 1;
      self.loadInquiries();
    };

    document.getElementById('inquiry-search').onkeydown = function(e) {
      if (e.key === 'Enter') {
        self.search = document.getElementById('inquiry-search').value.trim();
        self.page = 1;
        self.loadInquiries();
      }
    };

    document.getElementById('export-csv-btn').onclick = () => this.exportCSV();
    await this.loadInquiries();
  },

  loadInquiries: async function() {
    var params = { page: this.page, limit: this.limit };
    if (this.search) params.search = this.search;

    var res = await window.AdminAPI.get('/api/admin/inquiries', params);
    var tbody = document.getElementById('inquiries-table-body');
    var pagEl = document.getElementById('inquiries-pagination');
    if (!tbody) return;

    if (!res || !res.data || !res.data.length) {
      tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted" style="padding:28px">No inquiries found.</td></tr>';
      if (pagEl) pagEl.innerHTML = '';
      return;
    }

    this.data = res.data;
    this.totalPages = res.totalPages || 1;

    tbody.innerHTML = this.data.map(function(item) {
      var dateStr = item.created_at ? new Date(item.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '-';
      var snippet = (item.message || '').length > 60 ? (item.message.substring(0, 60) + '...') : (item.message || '-');
      return '\
        <tr>\
          <td style="white-space:nowrap;color:#64748b;font-size:0.8rem;">' + dateStr + '</td>\
          <td style="font-weight:600;">' + (item.name || 'Anonymous') + '</td>\
          <td><span class="badge badge-info">' + (item.role || 'Visitor') + '</span></td>\
          <td style="color:#64748b;">' + (item.contact || '-') + '</td>\
          <td style="max-width:280px;color:#374151;">' + snippet + '</td>\
          <td style="text-align:right;">\
            <button class="btn btn-sm btn-secondary" onclick="window.AdminModules.inquiries.viewDetails(\'' + item.id + '\')">View</button>\
          </td>\
        </tr>';
    }).join('');

    if (pagEl) {
      var self = this;
      pagEl.innerHTML = '\
        <span style="font-size:0.85rem;color:#64748b;">Showing page ' + this.page + ' of ' + this.totalPages + ' (' + (res.total || 0) + ' total)</span>\
        <div style="display:flex;gap:8px;">\
          <button class="btn btn-sm btn-secondary" id="prev-page-btn" ' + (this.page <= 1 ? 'disabled style="opacity:0.5"' : '') + '>Previous</button>\
          <button class="btn btn-sm btn-secondary" id="next-page-btn" ' + (this.page >= this.totalPages ? 'disabled style="opacity:0.5"' : '') + '>Next</button>\
        </div>';

      var prevBtn = document.getElementById('prev-page-btn');
      var nextBtn = document.getElementById('next-page-btn');
      if (prevBtn) prevBtn.onclick = function() { if (self.page > 1) { self.page--; self.loadInquiries(); } };
      if (nextBtn) nextBtn.onclick = function() { if (self.page < self.totalPages) { self.page++; self.loadInquiries(); } };
    }
  },

  viewDetails: function(id) {
    var item = this.data.find(function(i) { return i.id === id; });
    if (!item) return;

    var modal = document.getElementById('inquiry-modal');
    if (!modal) return;

    var dateStr = item.created_at ? new Date(item.created_at).toLocaleString('en-IN') : '-';

    modal.innerHTML = '\
      <div class="modal" style="max-width:540px;background:#fff;border-radius:12px;padding:24px;box-shadow:0 10px 40px rgba(0,0,0,0.2);">\
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;">\
          <h2 style="font-size:1.2rem;margin:0;">Inquiry Details</h2>\
          <button id="close-inq-modal-btn" style="background:none;border:none;font-size:1.4rem;cursor:pointer;">&times;</button>\
        </div>\
        <div style="margin-bottom:14px;">\
          <div style="font-size:0.8rem;color:#64748b;text-transform:uppercase;font-weight:600;">Sender Name</div>\
          <div style="font-size:1rem;font-weight:600;color:#1a1a2e;">' + (item.name || 'Anonymous') + '</div>\
        </div>\
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px;">\
          <div>\
            <div style="font-size:0.8rem;color:#64748b;text-transform:uppercase;font-weight:600;">Role / Interest</div>\
            <div><span class="badge badge-info">' + (item.role || 'General') + '</span></div>\
          </div>\
          <div>\
            <div style="font-size:0.8rem;color:#64748b;text-transform:uppercase;font-weight:600;">Date & Time</div>\
            <div style="font-size:0.85rem;color:#374151;">' + dateStr + '</div>\
          </div>\
        </div>\
        <div style="margin-bottom:14px;">\
          <div style="font-size:0.8rem;color:#64748b;text-transform:uppercase;font-weight:600;">Contact Details</div>\
          <div style="font-size:0.95rem;color:#1a1a2e;">' + (item.contact || 'None provided') + '</div>\
        </div>\
        <div style="margin-bottom:20px;">\
          <div style="font-size:0.8rem;color:#64748b;text-transform:uppercase;font-weight:600;margin-bottom:4px;">Message</div>\
          <div style="background:#f8fafc;padding:14px;border-radius:8px;font-size:0.9rem;line-height:1.5;color:#334155;white-space:pre-wrap;border:1px solid #e2e8f0;">' + (item.message || 'No message content.') + '</div>\
        </div>\
        <div style="display:flex;justify-content:flex-end;">\
          <button id="dismiss-inq-btn" class="btn btn-secondary">Close</button>\
        </div>\
      </div>';

    modal.classList.remove('hidden');

    var closeModal = function() { modal.classList.add('hidden'); };
    document.getElementById('close-inq-modal-btn').onclick = closeModal;
    document.getElementById('dismiss-inq-btn').onclick = closeModal;
  },

  exportCSV: function() {
    if (!this.data || !this.data.length) {
      window.AdminAPI.showToast('No inquiries to export', 'info');
      return;
    }

    var headers = ['ID', 'Date', 'Name', 'Role', 'Contact', 'Message'];
    var rows = this.data.map(function(item) {
      return [
        item.id,
        item.created_at || '',
        '"' + (item.name || '').replace(/"/g, '""') + '"',
        '"' + (item.role || '').replace(/"/g, '""') + '"',
        '"' + (item.contact || '').replace(/"/g, '""') + '"',
        '"' + (item.message || '').replace(/"/g, '""') + '"'
      ].join(',');
    });

    var csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'tgms_somaram_inquiries_' + new Date().toISOString().split('T')[0] + '.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.AdminAPI.showToast('CSV downloaded', 'success');
  }
};
