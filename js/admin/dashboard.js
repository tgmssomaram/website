// dashboard.js — Dashboard section module
// Depends on api.js

window.AdminModules = window.AdminModules || {};
window.AdminModules.dashboard = {
  render: async function() {
    var view = document.getElementById('admin-view');
    view.innerHTML = '\
      <div class="section-header">\
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;">\
          <div>\
            <h1>📊 Dashboard</h1>\
            <p>Welcome to TGMS Somaram Central Administration. Manage academic data, faculty, news, and school media.</p>\
          </div>\
          <div style="display:flex;gap:10px;">\
            <button type="button" class="btn btn-secondary-dash" id="dash-quick-sync">⚡ Sync & Verify Live Site</button>\
            <a href="/" target="_blank" rel="noopener noreferrer" class="btn btn-primary-dash">🌐 Open Live Website ↗</a>\
          </div>\
        </div>\
      </div>\
      <div class="stats-grid" id="stats-grid">\
        <div class="stat-card"><div class="skeleton-line" style="width:60%;height:40px;margin-bottom:8px"></div><div class="skeleton-line" style="width:80%"></div></div>\
        <div class="stat-card"><div class="skeleton-line" style="width:60%;height:40px;margin-bottom:8px"></div><div class="skeleton-line" style="width:80%"></div></div>\
        <div class="stat-card"><div class="skeleton-line" style="width:60%;height:40px;margin-bottom:8px"></div><div class="skeleton-line" style="width:80%"></div></div>\
        <div class="stat-card"><div class="skeleton-line" style="width:60%;height:40px;margin-bottom:8px"></div><div class="skeleton-line" style="width:80%"></div></div>\
      </div>\
      <div class="card" style="margin-bottom:24px;padding:20px;">\
        <h3 style="font-size:1.05rem;font-weight:700;margin-bottom:14px;color:var(--text-primary);">🚀 Quick Administration Actions</h3>\
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:12px;">\
          <button type="button" class="btn btn-secondary-dash" style="justify-content:flex-start;padding:12px 14px;" onclick="window.AdminApp.navigate(\'strength\')">📈 Edit Student Strength</button>\
          <button type="button" class="btn btn-secondary-dash" style="justify-content:flex-start;padding:12px 14px;" onclick="window.AdminApp.navigate(\'notices\')">📢 Add Flash Notice</button>\
          <button type="button" class="btn btn-secondary-dash" style="justify-content:flex-start;padding:12px 14px;" onclick="window.AdminApp.navigate(\'faculty\')">👨‍🏫 Manage Faculty</button>\
          <button type="button" class="btn btn-secondary-dash" style="justify-content:flex-start;padding:12px 14px;" onclick="window.AdminApp.navigate(\'gallery\')">🖼️ Add Campus Photo</button>\
          <button type="button" class="btn btn-secondary-dash" style="justify-content:flex-start;padding:12px 14px;" onclick="window.AdminApp.navigate(\'alumni\')">🎓 Manage Alumni Stories</button>\
          <button type="button" class="btn btn-secondary-dash" style="justify-content:flex-start;padding:12px 14px;" onclick="window.AdminApp.navigate(\'profile\')">🏫 School Profile & Photo</button>\
        </div>\
      </div>\
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:4px" class="dashboard-grid">\
        <div class="card">\
          <div class="card-title" style="display:flex;justify-content:space-between;align-items:center;">\
            <span>🗞️ Recent Flash News & Notices</span>\
            <button type="button" class="btn btn-sm btn-secondary" onclick="window.AdminApp.navigate(\'notices\')">View All</button>\
          </div>\
          <div id="recent-notices">Loading...</div>\
        </div>\
        <div class="card">\
          <div class="card-title" style="display:flex;justify-content:space-between;align-items:center;">\
            <span>📬 Recent Inquiries & Feedback</span>\
            <button type="button" class="btn btn-sm btn-secondary" onclick="window.AdminApp.navigate(\'inquiries\')">View All</button>\
          </div>\
          <div id="recent-inquiries">Loading...</div>\
        </div>\
      </div>';

    var syncBtn = document.getElementById('dash-quick-sync');
    if (syncBtn) {
      syncBtn.onclick = function() {
        syncBtn.textContent = 'Syncing...';
        syncBtn.disabled = true;
        window.AdminAPI.broadcastUpdate({});
        setTimeout(function() {
          syncBtn.textContent = '✓ Live Sync Sent';
          window.AdminAPI.showToast('Live site sync signal transmitted successfully', 'success');
          setTimeout(function() {
            syncBtn.textContent = '⚡ Sync & Verify Live Site';
            syncBtn.disabled = false;
          }, 1500);
        }, 500);
      };
    }

    // Fetch stats
    var stats = await window.AdminAPI.get('/api/admin/stats');
    if (stats) {
      document.getElementById('stats-grid').innerHTML =
        '<div class="stat-card" style="cursor:pointer;" onclick="window.AdminApp.navigate(\'strength\')"><div class="stat-icon">👥</div><div class="stat-number">' + (stats.total_students || 694) + '</div><div class="stat-label">Total Students Enrolled</div></div>' +
        '<div class="stat-card" style="cursor:pointer;" onclick="window.AdminApp.navigate(\'notices\')"><div class="stat-icon">📢</div><div class="stat-number">' + (stats.active_notices || 0) + '</div><div class="stat-label">Active Notices</div></div>' +
        '<div class="stat-card" style="cursor:pointer;" onclick="window.AdminApp.navigate(\'faculty\')"><div class="stat-icon">👨‍🏫</div><div class="stat-number">' + (stats.total_faculty || 0) + '</div><div class="stat-label">Faculty Members</div></div>' +
        '<div class="stat-card" style="cursor:pointer;" onclick="window.AdminApp.navigate(\'gallery\')"><div class="stat-icon">🖼️</div><div class="stat-number">' + (stats.total_gallery || 0) + '</div><div class="stat-label">Gallery Photos</div></div>' +
        '<div class="stat-card" style="cursor:pointer;" onclick="window.AdminApp.navigate(\'alumni\')"><div class="stat-icon">🎓</div><div class="stat-number">' + (stats.total_alumni || 0) + '</div><div class="stat-label">Alumni Stories</div></div>' +
        '<div class="stat-card" style="cursor:pointer;" onclick="window.AdminApp.navigate(\'inquiries\')"><div class="stat-icon">📬</div><div class="stat-number">' + (stats.total_inquiries || 0) + '</div><div class="stat-label">Total Inquiries</div></div>';
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
      inqEl.innerHTML = '<p class="text-muted text-center" style="padding:20px">No inquiries received yet</p>';
    }
  }
};
