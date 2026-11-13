// app.js — Main Admin Portal App Controller
// Loaded last, wires up navigation, auth, and submodules.

window.AdminApp = {
  currentSection: 'dashboard',

  init: function() {
    this.bindEvents();
    window.AdminAuth.initLoginForm();
    this.checkAuthAndStart();
  },

  checkAuthAndStart: async function() {
    var authed = await window.AdminAuth.checkSession();
    if (authed) {
      this.navigate('dashboard');
    }
  },

  bindEvents: function() {
    var self = this;

    // Sidebar navigation clicks
    var navLinks = document.querySelectorAll('.sidebar-nav a[data-section]');
    navLinks.forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        var sec = link.getAttribute('data-section');
        if (sec) self.navigate(sec);
      });
    });

    // Mobile sidebar toggle
    var toggleBtn = document.getElementById('sidebar-toggle');
    var sidebar = document.getElementById('sidebar');
    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener('click', function() {
        sidebar.classList.toggle('open');
      });
    }

    // Logout button
    var logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function() {
        window.AdminAuth.logout();
      });
    }
  },

  navigate: function(section) {
    this.currentSection = section;

    // Update active class on nav links
    var navLinks = document.querySelectorAll('.sidebar-nav a[data-section]');
    navLinks.forEach(function(link) {
      if (link.getAttribute('data-section') === section) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Update topbar title
    var topbarTitle = document.getElementById('topbar-title');
    if (topbarTitle) {
      var titles = {
        dashboard: 'Dashboard',
        notices: 'Flash News & Notices',
        faculty: 'Faculty Manager',
        gallery: 'Gallery Manager',
        inquiries: 'Inquiries & Feedback',
        profile: 'School Profile',
        settings: 'Admin Settings'
      };
      topbarTitle.textContent = titles[section] || 'Dashboard';
    }

    // Close mobile sidebar if open
    var sidebar = document.getElementById('sidebar');
    if (sidebar && sidebar.classList.contains('open')) {
      sidebar.classList.remove('open');
    }

    // Render section module
    var mod = window.AdminModules && window.AdminModules[section];
    if (mod && typeof mod.render === 'function') {
      mod.render();
    } else {
      var view = document.getElementById('admin-view');
      if (view) {
        view.innerHTML = '<div class="card text-center" style="padding:40px;"><h3>Section Under Construction</h3></div>';
      }
    }
  }
};

document.addEventListener('DOMContentLoaded', function() {
  window.AdminApp.init();
});
