// api.js — Global API helper (window.AdminAPI)
// Plain script, no import/export. Loaded first.

window.AdminAPI = {
  async get(path, params) {
    params = params || {};
    var url = new URL(path, window.location.origin);
    Object.entries(params).forEach(function(entry) {
      url.searchParams.set(entry[0], entry[1]);
    });
    var r = await fetch(url.toString(), { credentials: 'include' });
    if (r.status === 401) {
      window.AdminAuth && window.AdminAuth.showLoginScreen();
      return null;
    }
    return r.json();
  },

  async post(path, body) {
    var r = await fetch(path, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return r.json();
  },

  async put(path, body) {
    var r = await fetch(path, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return r.json();
  },

  async del(path, body) {
    var opts = {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    };
    if (body !== undefined) opts.body = JSON.stringify(body);
    var r = await fetch(path, opts);
    return r.json();
  },

  async uploadImage(file, folder) {
    folder = folder || 'general';
    return new Promise(function(resolve, reject) {
      if (!file) return reject(new Error('No file selected'));
      if (file.size > 10 * 1024 * 1024) {
        return reject(new Error('File size exceeds 10MB limit'));
      }
      var reader = new FileReader();
      reader.onload = async function() {
        try {
          var res = await window.AdminAPI.post('/api/admin/upload', {
            data: reader.result,
            name: file.name,
            folder: folder
          });
          resolve(res);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = function(err) { reject(err); };
      reader.readAsDataURL(file);
    });
  },

  showToast(message, type) {
    type = type || 'info';
    var container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    var t = document.createElement('div');
    t.className = 'toast toast-' + type;
    t.textContent = message;
    container.appendChild(t);
    setTimeout(function() {
      t.style.opacity = '0';
      t.style.transform = 'translateX(100%)';
      t.style.transition = 'all 0.3s';
      setTimeout(function() { t.remove(); }, 300);
    }, 3000);
  },

  broadcastUpdate(payload) {
    try {
      var current = {};
      var raw = localStorage.getItem('tgms_school_data_live');
      if (raw) {
        try { current = JSON.parse(raw); } catch (e) {}
      }
      var merged = Object.assign({}, current, payload);
      localStorage.setItem('tgms_school_data_live', JSON.stringify(merged));
      localStorage.setItem('tgms_last_sync_timestamp', String(Date.now()));

      if (typeof BroadcastChannel !== 'undefined') {
        var ch = new BroadcastChannel('tgms_admin_sync');
        ch.postMessage({ type: 'UPDATE', data: merged, timestamp: Date.now() });
      }
    } catch (e) {
      console.warn('Admin broadcast sync notice:', e);
    }
  }
};
