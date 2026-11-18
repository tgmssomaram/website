// profile.js — School Profile Editor
// Depends on api.js

window.AdminModules = window.AdminModules || {};
window.AdminModules.profile = {
  render: async function() {
    var view = document.getElementById('admin-view');
    view.innerHTML = '\
      <div class="section-header">\
        <h1>🏫 School Profile & Information</h1>\
        <p>Update official school leadership, photographs, contact information, address, and metadata.</p>\
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
    var princPhoto = val.principalPhoto || '';
    var campusPhoto = val.campusPhotoUrl || '';

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
        <div class="form-row">\
          <div class="form-group-dash" style="flex:1;">\
            <label for="prof-principal-photo-file">Principal Official Photograph</label>\
            <input type="file" id="prof-principal-photo-file" accept="image/*" />\
            <input type="hidden" id="prof-principal-photo" value="' + (princPhoto).replace(/"/g, '&quot;') + '" />\
          </div>\
          <div style="display:flex;align-items:center;gap:12px;margin-top:18px;">\
            <img id="princ-photo-preview" src="' + (princPhoto || '/images/default-avatar.svg') + '" alt="Principal Photo" style="width:60px;height:72px;object-fit:cover;border-radius:6px;border:1px solid #cbd5e1;background:#f8fafc;" onerror="this.src=\'/images/rmsa-logo-trimmed.svg\'" />\
            <small style="color:#64748b;">Current portrait displayed across website</small>\
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
            <input type="text" id="prof-phone" value="' + (val.phone || '08727-285222').replace(/"/g, '&quot;') + '" />\
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
        <h3 style="font-size:1.05rem;font-weight:600;margin:24px 0 16px;color:#1e293b;border-bottom:1px solid #f1f5f9;padding-bottom:8px;">Campus Media & Preferences</h3>\
        <div class="form-row">\
          <div class="form-group-dash" style="flex:1;">\
            <label for="prof-campus-photo-file">Campus Hero Banner Photo</label>\
            <input type="file" id="prof-campus-photo-file" accept="image/*" />\
            <input type="hidden" id="prof-campus-photo" value="' + (campusPhoto).replace(/"/g, '&quot;') + '" />\
          </div>\
          <div style="display:flex;align-items:center;gap:12px;margin-top:18px;">\
            <img id="campus-photo-preview" src="' + (campusPhoto || '/images/munagala-campus-blue-sky.jpg') + '" alt="Campus Photo" style="width:100px;height:55px;object-fit:cover;border-radius:6px;border:1px solid #cbd5e1;background:#f8fafc;" />\
            <small style="color:#64748b;">Hero campus photograph</small>\
          </div>\
        </div>\
        <div class="form-group-dash" style="display:flex;align-items:center;gap:10px;margin-top:14px;">\
          <input type="checkbox" id="prof-admission-seats" ' + (val.showAdmissionSeats !== false ? 'checked' : '') + ' style="width:18px;height:18px;" />\
          <label for="prof-admission-seats" style="margin:0;cursor:pointer;font-weight:600;">Display Admission Seat Availability Matrix on Homepage</label>\
        </div>\
        <div style="display:flex;justify-content:flex-end;margin-top:24px;">\
          <button type="submit" id="save-profile-btn" class="btn btn-primary-dash">💾 Save School Profile</button>\
        </div>\
      </form>';

    // Image preview hooks
    var princFileInput = document.getElementById('prof-principal-photo-file');
    if (princFileInput) {
      princFileInput.onchange = function(e) {
        var file = e.target.files[0];
        if (file) {
          var reader = new FileReader();
          reader.onload = function(evt) {
            var img = document.getElementById('princ-photo-preview');
            if (img) img.src = evt.target.result;
          };
          reader.readAsDataURL(file);
        }
      };
    }

    var campusFileInput = document.getElementById('prof-campus-photo-file');
    if (campusFileInput) {
      campusFileInput.onchange = function(e) {
        var file = e.target.files[0];
        if (file) {
          var reader = new FileReader();
          reader.onload = function(evt) {
            var img = document.getElementById('campus-photo-preview');
            if (img) img.src = evt.target.result;
          };
          reader.readAsDataURL(file);
        }
      };
    }

    document.getElementById('profile-form').onsubmit = async function(e) {
      e.preventDefault();
      var btn = document.getElementById('save-profile-btn');
      btn.disabled = true;
      btn.textContent = 'Saving...';

      var princPhotoUrl = document.getElementById('prof-principal-photo').value;
      if (princFileInput && princFileInput.files[0]) {
        try {
          btn.textContent = 'Uploading Principal Photo...';
          var upRes = await window.AdminAPI.uploadImage(princFileInput.files[0], 'faculty');
          if (upRes && upRes.url) princPhotoUrl = upRes.url;
        } catch (upErr) {
          console.warn('Principal photo upload warning:', upErr);
        }
      }

      var campusPhotoUrl = document.getElementById('prof-campus-photo').value;
      if (campusFileInput && campusFileInput.files[0]) {
        try {
          btn.textContent = 'Uploading Campus Photo...';
          var upCampRes = await window.AdminAPI.uploadImage(campusFileInput.files[0], 'campus');
          if (upCampRes && upCampRes.url) campusPhotoUrl = upCampRes.url;
        } catch (upCampErr) {
          console.warn('Campus photo upload warning:', upCampErr);
        }
      }

      btn.textContent = 'Saving Profile...';

      var payload = {
        name: document.getElementById('prof-name').value.trim(),
        teluguName: document.getElementById('prof-telugu').value.trim(),
        udise: document.getElementById('prof-udise').value.trim(),
        collegeCode: document.getElementById('prof-college').value.trim(),
        principal: document.getElementById('prof-principal').value.trim(),
        principalQualification: document.getElementById('prof-qualification').value.trim(),
        principalPhoto: princPhotoUrl,
        campusPhotoUrl: campusPhotoUrl,
        showAdmissionSeats: document.getElementById('prof-admission-seats').checked,
        email: document.getElementById('prof-email').value.trim(),
        phone: document.getElementById('prof-phone').value.trim(),
        address: document.getElementById('prof-address').value.trim(),
        pinCode: document.getElementById('prof-pincode').value.trim()
      };

      try {
        var res = await window.AdminAPI.put('/api/admin/profile', payload);
        btn.disabled = false;
        btn.textContent = '💾 Save School Profile';

        if (res && res.data) {
          window.AdminAPI.showToast('School profile updated successfully! Changes reflected live.', 'success');
          // Broadcast to main site
          window.AdminAPI.broadcastUpdate({
            settings: {
              schoolTitle: payload.name,
              teluguTitle: payload.teluguName
            },
            name: payload.name,
            teluguName: payload.teluguName,
            udiseCode: payload.udise,
            collegeCode: payload.collegeCode,
            principal: {
              name: payload.principal,
              designation: 'Principal FAC',
              qualification: payload.principalQualification,
              email: payload.email,
              phone: payload.phone
            },
            principalPhoto: payload.principalPhoto,
            campusPhotoUrl: payload.campusPhotoUrl,
            showAdmissionSeats: payload.showAdmissionSeats,
            address: payload.address + (payload.pinCode && !payload.address.includes(payload.pinCode) ? ' – ' + payload.pinCode : '')
          });
        } else {
          window.AdminAPI.showToast(res?.error || 'Failed to update profile', 'error');
        }
      } catch (err) {
        btn.disabled = false;
        btn.textContent = '💾 Save School Profile';
        window.AdminAPI.showToast('Error: ' + err.message, 'error');
      }
    };
  }
};
