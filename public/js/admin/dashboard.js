// dashboard.js — Dashboard section module
// Depends on api.js

window.AdminModules = window.AdminModules || {};
window.AdminModules.dashboard = {
  render: async function() {
    var view = document.getElementById('admin-view');
    view.innerHTML = '\
      <div class="section-header">\
        <h1>\uD83D\uDCCA Dashboard</h1>\
        <p>Welcome back, Admin! Here\'s what\'s happening at TGMS Somaram.</p>\
      </div>\
      <div class="stats-grid" id="stats-grid">\
        <div class="stat-card"><div class="skeleton-line" style="width:60%;height:40px;margin-bottom:8px"></div><div class="skeleton-line" style="width:80%"></div></div>\
        <div class="stat-card"><div class="skeleton-line" style="width:60%;height:40px;margin-bottom:8px"></div><div class="skeleton-line" style="width:80%"></div></div>\
        <div class="stat-card"><div class="skeleton-line" style="width:60%;height:40px;margin-bottom:8px"></div><div class="skeleton-line" style="width:80%"></div></div>\
        <div class="stat-card"><div class="skeleton-line" style="width:60%;height:40px;margin-bottom:8px"></div><div class="skeleton-line" style="width:80%"></div></div>\
      </div>\
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:4px" class="dashboard-grid">\
        <div class="card">\
          <div class="card-title">\uD83D\uDDDE\uFE0F Recent Flash News</div>\
          <div id="recent-notices">Loading...</div>\
        </div>\
        <div class="card">\
          <div class="card-title">\uD83D\uDCE9 Recent Inquiries</div>\
          <div id="recent-inquiries">Loading...</div>\
        </div>\
      </div>';

    // Fetch stats
    var stats = await window.AdminAPI.get('/api/admin/stats');
    if (stats) {
      document.getElementById('stats-grid').innerHTML =
        '<div class="stat-card"><div class="stat-icon">\uD83D\uDDDE\uFE0F</div><div class="stat-number">' + (stats.active_notices || 0) + '</div><div class="stat-label">Active Notices</div></div>' +
        '<div class="stat-card"><div class="stat-icon">\uD83D\uDC68\u200D\uD83C\uDFEB</div><div class="stat-number">' + (stats.total_faculty || 0) + '</div><div class="stat-label">Faculty Members</div></div>' +
        '<div class="stat-card"><div class="stat-icon">\uD83D\uDDBC\uFE0F</div><div class="stat-number">' + (stats.total_gallery || 0) + '</div><div class="stat-label">Gallery Items</div></div>' +
        '<div class="stat-card"><div class="stat-icon">\uD83D\uDCE9</div><div class="stat-number">' + (stats.total_inquiries || 0) + '</div><div class="stat-label">Total Inquiries</div></div>';
    }

    // Fetch recent notices
    var notices = await window.AdminAPI.get('/api/admin/notices', { all: 'true' });
    var noticesEl = document.getElementById('recent-notices');
    if (notices && notices.data && notices.data.length) {
      noticesEl.innerHTML = notices.data.slice(0, 5).map(function(n) {
        return '<div style="padding:10px 0;border-bottom:1px solid #f1f5f9;display:flex;justify-content:space-between;align-items:start">' +
          '<span style="font-size:0.85rem;color:#374151;flex:1;padding-right:12px">' + (n.title || '') + '</span>' +
          '<span class="badge ' + (n.is_active ? 'badge-success' : 'badge-danger') + '">' + (n.is_active ? 'Active' : 'Off') + '</span>' +
          '</div>';
      }).join('');
    } else {
      noticesEl.innerHTML = '<p class="text-muted text-center" style="padding:20px">No notices yet</p>';
    }

    // Fetch recent inquiries
    var inq = await window.AdminAPI.get('/api/admin/inquiries', { limit: '5' });
    var inqEl = document.getElementById('recent-inquiries');
    if (inq && inq.data && inq.data.length) {
      inqEl.innerHTML = inq.data.map(function(i) {
        return '<div style="padding:10px 0;border-bottom:1px solid #f1f5f9">' +
          '<div style="display:flex;justify-content:space-between;margin-bottom:2px">' +
          '<strong style="font-size:0.85rem">' + (i.name || 'Anonymous') + '</strong>' +
          '<span class="badge badge-info">' + (i.role || 'User') + '</span>' +
          '</div>' +
          '<div style="font-size:0.8rem;color:#64748b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + (i.message || '') + '</div>' +
          '</div>';
      }).join('');
    } else {
      inqEl.innerHTML = '<p class="text-muted text-center" style="padding:20px">No inquiries yet</p>';
    }
  }
};
