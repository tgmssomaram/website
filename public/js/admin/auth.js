// auth.js — Authentication helper (window.AdminAuth)
// Depends on api.js (window.AdminAPI)

window.AdminAuth = {
  showLoginScreen: function() {
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('dashboard-screen').classList.add('hidden');
  },

  showDashboard: function() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('dashboard-screen').classList.remove('hidden');
  },

  checkSession: async function() {
    var data = await fetch('/api/admin/session', { credentials: 'include' })
      .then(function(r) { return r.json(); })
      .catch(function() { return { authenticated: false }; });
    if (data.authenticated) {
      this.showDashboard();
      return true;
    } else {
      this.showLoginScreen();
      return false;
    }
  },

  login: async function(email, password) {
    return await window.AdminAPI.post('/api/admin/login', { email: email, password: password });
  },

  logout: async function() {
    await fetch('/api/admin/session', { method: 'DELETE', credentials: 'include' });
    this.showLoginScreen();
    window.AdminAPI.showToast('Logged out successfully', 'info');
  },

  initLoginForm: function() {
    var form = document.getElementById('login-form');
    if (!form) return;
    var self = this;
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      var email = document.getElementById('admin-email').value.trim();
      var password = document.getElementById('admin-password').value;
      var btn = document.getElementById('login-btn');
      var errorEl = document.getElementById('login-error');
      var spinner = document.getElementById('login-spinner');
      btn.disabled = true;
      btn.textContent = 'Signing in...';
      if (spinner) spinner.style.display = 'block';
      errorEl.textContent = '';
      try {
        var data = await self.login(email, password);
        if (data && data.success) {
          self.showDashboard();
          window.AdminApp && window.AdminApp.navigate('dashboard');
          window.AdminAPI.showToast('Welcome back!', 'success');
        } else {
          errorEl.textContent = (data && data.error) || 'Login failed. Check credentials.';
        }
      } catch (err) {
        errorEl.textContent = 'Connection error. Please try again.';
      } finally {
        btn.disabled = false;
        btn.textContent = 'Sign In';
        if (spinner) spinner.style.display = 'none';
      }
    });
  }
};
