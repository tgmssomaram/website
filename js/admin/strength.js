// strength.js — Student Enrolment & School Strength Manager
// Depends on api.js

window.AdminModules = window.AdminModules || {};
window.AdminModules.strength = {
  data: null,

  render: async function() {
    var view = document.getElementById('admin-view');
    view.innerHTML = '\
      <div class="section-header">\
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;">\
          <div>\
            <h1>📈 Student Enrolment & School Strength</h1>\
            <p>Manage student numbers for Classes VI–X and Junior College. Changes reflect live on the Students tab.</p>\
          </div>\
          <button type="button" id="strength-save-btn" class="btn btn-primary-dash">💾 Save Strength Changes</button>\
        </div>\
      </div>\
      <div id="strength-kpi-bar" class="stats-grid" style="margin-bottom:24px;">\
        <div class="stat-card"><div class="stat-icon">👥</div><div class="stat-number" id="kpi-total">...</div><div class="stat-label">Total Enrolment</div></div>\
        <div class="stat-card"><div class="stat-icon">👦</div><div class="stat-number" id="kpi-boys">...</div><div class="stat-label">Boys Enrolled</div></div>\
        <div class="stat-card"><div class="stat-icon">👧</div><div class="stat-number" id="kpi-girls">...</div><div class="stat-label">Girls Enrolled</div></div>\
        <div class="stat-card"><div class="stat-icon">⚖️</div><div class="stat-number" id="kpi-parity">...</div><div class="stat-label">Gender Parity Ratio</div></div>\
      </div>\
      <div class="card" id="strength-content" style="padding:24px;">\
        <p class="text-center" style="padding:24px;">Loading student enrolment data...</p>\
      </div>';

    document.getElementById('strength-save-btn').onclick = this.saveData.bind(this);
    await this.loadData();
  },

  loadData: async function() {
    var res = await window.AdminAPI.get('/api/admin/strength');
    var raw = (res && res.data) || {
      year: '2026–27',
      groups: [
        { title: 'School · Classes VI–X', rows: [['VI',48,33],['VII',55,21],['VIII',63,34],['IX',51,46],['X',55,39]] },
        { title: 'Junior College · First Year (Intermediate)', rows: [['MPC',18,28],['BiPC',4,37],['CEC',15,16],['ACE',7,10]] },
        { title: 'Junior College · Second Year (Intermediate)', rows: [['MPC',16,33],['BiPC',0,39],['CEC',15,11]] }
      ],
      sections: [['IX A',49],['IX B',50],['X A',46],['X B',48],['I CEC',31],['II CEC',25]]
    };

    this.data = JSON.parse(JSON.stringify(raw));
    this.renderForm();
    this.recalculateKPIs();
  },

  renderForm: function() {
    var container = document.getElementById('strength-content');
    if (!container || !this.data) return;

    var html = '\
      <div style="margin-bottom:24px;display:flex;align-items:center;gap:16px;">\
        <label for="str-academic-year" style="font-weight:700;color:var(--text-primary);font-size:0.95rem;">Academic Year:</label>\
        <input type="text" id="str-academic-year" value="' + (this.data.year || '2026–27') + '" style="max-width:180px;padding:8px 14px;border:1px solid var(--border-color);border-radius:var(--radius-sm);font-weight:600;" />\
      </div>';

    var self = this;
    (this.data.groups || []).forEach(function(group, gIdx) {
      html += '\
        <div style="margin-bottom:28px;border:1px solid var(--border-color);border-radius:var(--radius-md);overflow:hidden;">\
          <div style="background:#f8fafc;padding:12px 18px;border-bottom:1px solid var(--border-color);display:flex;justify-content:space-between;align-items:center;">\
            <h3 style="font-size:1rem;font-weight:700;color:var(--text-primary);margin:0;">' + group.title + '</h3>\
            <span id="group-subtotal-' + gIdx + '" class="badge badge-success" style="font-size:0.85rem;padding:4px 10px;">Subtotal: 0</span>\
          </div>\
          <div style="overflow-x:auto;">\
            <table class="data-table" style="width:100%;text-align:left;border-collapse:collapse;">\
              <thead>\
                <tr style="background:#f1f5f9;color:#475569;font-size:0.8rem;text-transform:uppercase;">\
                  <th style="padding:10px 16px;">Class / Stream</th>\
                  <th style="padding:10px 16px;">Boys</th>\
                  <th style="padding:10px 16px;">Girls</th>\
                  <th style="padding:10px 16px;">Total</th>\
                </tr>\
              </thead>\
              <tbody>';

      (group.rows || []).forEach(function(row, rIdx) {
        var boys = Number(row[1]) || 0;
        var girls = Number(row[2]) || 0;
        var rowTotal = boys + girls;
        html += '\
          <tr style="border-bottom:1px solid var(--border-light);">\
            <td style="padding:10px 16px;font-weight:600;color:var(--text-primary);">' + row[0] + '</td>\
            <td style="padding:8px 16px;">\
              <input type="number" min="0" max="999" class="str-input" data-group="' + gIdx + '" data-row="' + rIdx + '" data-col="1" value="' + boys + '" style="width:90px;padding:6px 10px;border:1px solid var(--border-color);border-radius:var(--radius-sm);font-weight:600;" />\
            </td>\
            <td style="padding:8px 16px;">\
              <input type="number" min="0" max="999" class="str-input" data-group="' + gIdx + '" data-row="' + rIdx + '" data-col="2" value="' + girls + '" style="width:90px;padding:6px 10px;border:1px solid var(--border-color);border-radius:var(--radius-sm);font-weight:600;" />\
            </td>\
            <td style="padding:10px 16px;font-weight:700;color:#059669;" id="row-total-' + gIdx + '-' + rIdx + '">' + rowTotal + '</td>\
          </tr>';
      });

      html += '</tbody></table></div></div>';
    });

    container.innerHTML = html;

    // Attach real-time input recalculation
    var inputs = container.querySelectorAll('.str-input');
    inputs.forEach(function(input) {
      input.addEventListener('input', function() {
        var g = parseInt(this.dataset.group, 10);
        var r = parseInt(this.dataset.row, 10);
        var c = parseInt(this.dataset.col, 10);
        var val = parseInt(this.value, 10) || 0;
        if (self.data.groups[g] && self.data.groups[g].rows[r]) {
          self.data.groups[g].rows[r][c] = val;
          var b = self.data.groups[g].rows[r][1] || 0;
          var gCount = self.data.groups[g].rows[r][2] || 0;
          var rtEl = document.getElementById('row-total-' + g + '-' + r);
          if (rtEl) rtEl.textContent = (b + gCount);
        }
        self.recalculateKPIs();
      });
    });
  },

  recalculateKPIs: function() {
    if (!this.data || !this.data.groups) return;

    var totalBoys = 0;
    var totalGirls = 0;

    this.data.groups.forEach(function(group, gIdx) {
      var groupTotal = 0;
      (group.rows || []).forEach(function(row) {
        var b = Number(row[1]) || 0;
        var g = Number(row[2]) || 0;
        totalBoys += b;
        totalGirls += g;
        groupTotal += (b + g);
      });
      var subEl = document.getElementById('group-subtotal-' + gIdx);
      if (subEl) subEl.textContent = 'Subtotal: ' + groupTotal + ' Students';
    });

    var grandTotal = totalBoys + totalGirls;
    var ratio = '1 : 1';
    if (totalBoys > 0 && totalGirls > 0) {
      if (totalBoys === totalGirls) {
        ratio = '1 : 1';
      } else {
        var gcd = function(a, b) { return b === 0 ? a : gcd(b, a % b); };
        var d = gcd(totalBoys, totalGirls);
        ratio = Math.round((totalBoys / d) * 10) / 10 + ' : ' + Math.round((totalGirls / d) * 10) / 10;
      }
    }

    var kpiTotal = document.getElementById('kpi-total');
    var kpiBoys = document.getElementById('kpi-boys');
    var kpiGirls = document.getElementById('kpi-girls');
    var kpiParity = document.getElementById('kpi-parity');

    if (kpiTotal) kpiTotal.textContent = grandTotal;
    if (kpiBoys) kpiBoys.textContent = totalBoys;
    if (kpiGirls) kpiGirls.textContent = totalGirls;
    if (kpiParity) kpiParity.textContent = ratio;
  },

  saveData: async function() {
    var btn = document.getElementById('strength-save-btn');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Saving...';
    }

    var yearInput = document.getElementById('str-academic-year');
    if (yearInput && this.data) {
      this.data.year = yearInput.value.trim() || '2026–27';
    }

    try {
      var res = await window.AdminAPI.put('/api/admin/strength', { strength: this.data });
      if (btn) {
        btn.disabled = false;
        btn.textContent = '💾 Save Strength Changes';
      }

      if (res && (res.success || res.data)) {
        window.AdminAPI.showToast('Student enrolment & strength updated successfully! Changes reflected live.', 'success');
        // Broadcast to main site
        window.AdminAPI.broadcastUpdate({ strength: this.data });
      } else {
        window.AdminAPI.showToast(res?.error || 'Failed to save strength data', 'error');
      }
    } catch (err) {
      if (btn) {
        btn.disabled = false;
        btn.textContent = '💾 Save Strength Changes';
      }
      window.AdminAPI.showToast('Error saving: ' + err.message, 'error');
    }
  }
};
