// settings.js — Admin Settings & Credentials
// Depends on api.js

window.AdminModules = window.AdminModules || {};
window.AdminModules.settings = {
  render: async function() {
    var view = document.getElementById('admin-view');
    view.innerHTML = '\
      <div class="section-header">\
        <h1>⚙️ Admin Settings & Security</h1>\
        <p>Manage administrative credentials, check database status, and review deployment notes.</p>\
      </div>\
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;" class="dashboard-grid">\
        <div class="card">\
          <h3 style="font-size:1.1rem;font-weight:600;margin-bottom:16px;">Change Admin Password</h3>\
          <form id="password-form">\
            <div class="form-group-dash">\
              <label for="current-pwd">Current Password *</label>\
              <input type="password" id="current-pwd" required placeholder="Enter current password" />\
            </div>\
            <div class="form-group-dash">\
              <label for="new-pwd">New Password * (min 8 characters)</label>\
              <input type="password" id="new-pwd" required minlength="8" placeholder="Enter new strong password" />\
            </div>\
            <div class="form-group-dash">\
              <label for="confirm-pwd">Confirm New Password *</label>\
              <input type="password" id="confirm-pwd" required minlength="8" placeholder="Confirm new password" />\
            </div>\
            <button type="submit" id="change-pwd-btn" class="btn btn-primary-dash">Update Password</button>\
          </form>\
          <div id="pwd-msg" style="margin-top:14px;font-size:0.85rem;"></div>\
        </div>\
        <div class="card">\
          <h3 style="font-size:1.1rem;font-weight:600;margin-bottom:16px;">System & Database Status</h3>\
          <div style="display:flex;flex-direction:column;gap:14px;">\
            <div style="display:flex;justify-content:space-between;align-items:center;padding:12px;background:#f8fafc;border-radius:8px;">\
              <span>Supabase Database</span>\
              <span class="badge badge-success" id="db-status-badge">Connected</span>\
            </div>\
            <div style="display:flex;justify-content:space-between;align-items:center;padding:12px;background:#f8fafc;border-radius:8px;">\
              <span>Admin Email</span>\
              <span style="font-weight:600;font-size:0.85rem;color:#334155;">tgmssomaram.knr@gmail.com</span>\
            </div>\
            <div style="display:flex;justify-content:space-between;align-items:center;padding:12px;background:#f8fafc;border-radius:8px;">\
              <span>Hosting Platform</span>\
              <span class="badge badge-info">Vercel Edge</span>\
            </div>\
          </div>\
          <div style="margin-top:20px;padding:14px;background:#fffbeb;border:1px solid #fde68a;border-radius:8px;font-size:0.85rem;color:#92400e;line-height:1.5;">\
            <strong>📌 Notice on Environment Variables:</strong><br>\
            If your deployment uses Vercel environment variables for <code>ADMIN_PASSWORD</code>, updating the password here will update the database, but also ensure you update <code>ADMIN_PASSWORD</code> in your Vercel Dashboard for consistency.\
          </div>\
        </div>\
      </div>';

    document.getElementById('password-form').onsubmit = async function(e) {
      e.preventDefault();
      var current_password = document.getElementById('current-pwd').value;
      var new_password = document.getElementById('new-pwd').value;
      var confirm_password = document.getElementById('confirm-pwd').value;
      var msgEl = document.getElementById('pwd-msg');
      var btn = document.getElementById('change-pwd-btn');

      if (new_password !== confirm_password) {
        msgEl.innerHTML = '<span style="color:#ef4444;">Passwords do not match.</span>';
        return;
      }

      btn.disabled = true;
      btn.textContent = 'Updating...';
      msgEl.innerHTML = '';

      var res = await window.AdminAPI.post('/api/admin/settings', {
        current_password: current_password,
        new_password: new_password,
        confirm_password: confirm_password
      });

      btn.disabled = false;
      btn.textContent = 'Update Password';

      if (res && res.success) {
        window.AdminAPI.showToast('Password updated successfully', 'success');
        msgEl.innerHTML = '<span style="color:#15803d;">' + (res.message || 'Password updated.') + '</span>';
        document.getElementById('password-form').reset();
      } else {
        var err = res?.error || 'Failed to update password';
        window.AdminAPI.showToast(err, 'error');
        msgEl.innerHTML = '<span style="color:#ef4444;">' + err + '</span>';
      }
    };
  }
};
