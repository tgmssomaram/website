// profile.js — School Profile Editor
// Depends on api.js

window.AdminModules = window.AdminModules || {};
window.AdminModules.profile = {
  render: async function() {
    var view = document.getElementById('admin-view');
    view.innerHTML = '\
      <div class="section-header">\
        <h1>🏫 School Profile & Information</h1>\
        <p>Update official school leadership, contact information, address, and metadata.</p>\
      </div>\
      <div class="card" id="profile-container">\
        <p class="text-center" style="padding:24px;">Loading profile...</p>\
      </div>';

    await this.loadProfile();
  },

  loadProfile: async function() {
    var res = await window.AdminAPI.get('/api/admin/profile');
    var container = document.getElementById('profile-container');
    if (!container) return;

    var val = (res && res.data && res.data.values) || {};

    container.innerHTML = '\
      <form id="profile-form">\
        <h3 style="font-size:1.05rem;font-weight:600;margin-bottom:16px;color:#1e293b;border-bottom:1px solid #f1f5f9;padding-bottom:8px;">Basic Institution Details</h3>\
        <div class="form-row">\
          <div class="form-group-dash">\
            <label for="prof-name">Institution Name (English)</label>\
            <input type="text" id="prof-name" value="' + (val.name || 'Telangana Model School & Junior College, Somaram').replace(/"/g, '&quot;') + '" />\
          </div>\
          <div class="form-group-dash">\
            <label for="prof-telugu">Telugu Name</label>\
            <input type="text" id="prof-telugu" value="' + (val.teluguName || 'తెలంగాణ మోడల్ స్కూల్ & జూనియర్ కళాశాల, సోమారం').replace(/"/g, '&quot;') + '" />\
          </div>\
        </div>\
        <div class="form-row">\
          <div class="form-group-dash">\
            <label for="prof-udise">UDISE+ Code</label>\
            <input type="text" id="prof-udise" value="' + (val.udise || '36131100206').replace(/"/g, '&quot;') + '" />\
          </div>\
          <div class="form-group-dash">\
            <label for="prof-college">College Code</label>\
            <input type="text" id="prof-college" value="' + (val.collegeCode || '15124').replace(/"/g, '&quot;') + '" />\
          </div>\
        </div>\
        <h3 style="font-size:1.05rem;font-weight:600;margin:24px 0 16px;color:#1e293b;border-bottom:1px solid #f1f5f9;padding-bottom:8px;">Leadership & Principal Details</h3>\
        <div class="form-row">\
          <div class="form-group-dash">\
            <label for="prof-principal">Principal (FAC) Name</label>\
            <input type="text" id="prof-principal" value="' + (val.principal || 'Dr.Bandari Sampath Kumar').replace(/"/g, '&quot;') + '" />\
          </div>\
          <div class="form-group-dash">\
            <label for="prof-qualification">Principal Qualification</label>\
            <input type="text" id="prof-qualification" value="' + (val.principalQualification || 'Phd in chemistry, B.Ed.').replace(/"/g, '&quot;') + '" />\
          </div>\
        </div>\
        <h3 style="font-size:1.05rem;font-weight:600;margin:24px 0 16px;color:#1e293b;border-bottom:1px solid #f1f5f9;padding-bottom:8px;">Contact & Location</h3>\
        <div class="form-row">\
          <div class="form-group-dash">\
            <label for="prof-email">School Office Email</label>\
            <input type="email" id="prof-email" value="' + (val.email || 'tgmssomaram.knr@gmail.com').replace(/"/g, '&quot;') + '" />\
          </div>\
          <div class="form-group-dash">\
            <label for="prof-phone">Contact Phone</label>\
            <input type="text" id="prof-phone" value="' + (val.phone || '').replace(/"/g, '&quot;') + '" />\
          </div>\
        </div>\
        <div class="form-row">\
          <div class="form-group-dash">\
            <label for="prof-address">Address & Village</label>\
            <input type="text" id="prof-address" value="' + (val.address || 'Somaram (Village), Saidapur Mandal, Karimnagar Dist.').replace(/"/g, '&quot;') + '" />\
          </div>\
          <div class="form-group-dash">\
            <label for="prof-pincode">Postal PIN Code</label>\
            <input type="text" id="prof-pincode" value="' + (val.pinCode || '505490').replace(/"/g, '&quot;') + '" />\
          </div>\
        </div>\
        <div style="display:flex;justify-content:flex-end;margin-top:24px;">\
          <button type="submit" id="save-profile-btn" class="btn btn-primary-dash">Save School Profile</button>\
        </div>\
      </form>';

    document.getElementById('profile-form').onsubmit = async function(e) {
      e.preventDefault();
      var btn = document.getElementById('save-profile-btn');
      btn.disabled = true;
      btn.textContent = 'Saving...';

      var payload = {
        name: document.getElementById('prof-name').value.trim(),
        teluguName: document.getElementById('prof-telugu').value.trim(),
        udise: document.getElementById('prof-udise').value.trim(),
        collegeCode: document.getElementById('prof-college').value.trim(),
        principal: document.getElementById('prof-principal').value.trim(),
        principalQualification: document.getElementById('prof-qualification').value.trim(),
        email: document.getElementById('prof-email').value.trim(),
        phone: document.getElementById('prof-phone').value.trim(),
        address: document.getElementById('prof-address').value.trim(),
        pinCode: document.getElementById('prof-pincode').value.trim()
      };

      var res = await window.AdminAPI.put('/api/admin/profile', payload);
      btn.disabled = false;
      btn.textContent = 'Save School Profile';

      if (res && res.data) {
        window.AdminAPI.showToast('School profile updated successfully!', 'success');
      } else {
        window.AdminAPI.showToast(res?.error || 'Failed to update profile', 'error');
      }
    };
  }
};

