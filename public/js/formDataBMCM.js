/* ================= INPUT COUNTER ================= */
document.querySelectorAll('.btn-counter').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    
    const action = btn.dataset.action;
    const input = btn.parentElement.querySelector('input[type="number"]');
    const currentValue = parseInt(input.value) || 0;
    const maxValue = parseInt(input.max) || Infinity;
    
    if (action === 'plus') {
      input.value = Math.min(currentValue + 1, maxValue);
    } else if (action === 'minus') {
      input.value = Math.max(currentValue - 1, 0);
    }
  });
});

/* ================= FILE UPLOAD PREVIEW ================= */
const fotoSafetyTalk = document.getElementById('fotoSafetyTalk');
const previewSafetyTalk = document.getElementById('previewSafetyTalk');

if (fotoSafetyTalk) {
  fotoSafetyTalk.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        previewSafetyTalk.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
      };
      reader.readAsDataURL(file);
    }
  });
}

const fotoCheckSheet = document.getElementById('fotoCheckSheet');
const previewCheckSheet = document.getElementById('previewCheckSheet');

if (fotoCheckSheet) {
  fotoCheckSheet.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        previewCheckSheet.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
      };
      reader.readAsDataURL(file);
    }
  });
}

/* ================= FORM SUBMIT ================= */
const formDataBMCM = document.getElementById('formDataBMCM');
console.log('formDataBMCM.js loaded');

// Presence check for required elements will run only when the form exists (prevents warnings on other pages)
if (formDataBMCM) {
  const requiredIds = ['tanggal','area','supervisor','executor','activitiesCategory','activities','duration','jumlahPersonel','statusPersen','status'];
  requiredIds.forEach(id => {
    const exists = document.getElementById(id) !== null;
    if (!exists) console.warn(`Form element with id="${id}" is missing from DOM`);
  });
}

if (formDataBMCM) {
  function getValueSafe(id) {
    const el = document.getElementById(id);
    if (!el) {
      console.error(`Element with id="${id}" not found`);
      return null;
    }
    return el.value;
  }

  formDataBMCM.addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
      // Ambil data dari form (ambil nilai teks, jangan kirim file saat ini)
      const tanggal = getValueSafe('tanggal');
      const area = getValueSafe('area');
      const supervisor = getValueSafe('supervisor');
      const executor = getValueSafe('executor');
      const activity_category = getValueSafe('activitiesCategory');
      const activitiesVal = getValueSafe('activities');
      const detail_activities = getValueSafe('detailActivities');
      const durationRaw = getValueSafe('duration');
      const jumlahPersonelRaw = getValueSafe('jumlahPersonel');
      const statusPersenRaw = getValueSafe('statusPersen');
      const status = getValueSafe('status');
      const keterangan = getValueSafe('keterangan');

      // If any required element is missing, stop and show clear error
      const requiredIds = ['tanggal','area','supervisor','executor','activitiesCategory','activities','duration','jumlahPersonel','statusPersen','status'];
      const missing = requiredIds.filter(id => document.getElementById(id) === null);
      if (missing.length) {
        const msg = 'Form element(s) missing: ' + missing.join(', ');
        console.error(msg);
        alert(msg);
        return;
      }

      const duration = Number(durationRaw || 0);
      const jumlah_personil = Number(jumlahPersonelRaw || 0);
      const status_persen = Number(statusPersenRaw || 0);

      const payload = {
        tanggal,
        area,
        supervisor,
        executor,
        activity_category,
        activities: activitiesVal,
        detail_activities,
        duration,
        jumlah_personil,
        status_persen,
        status,
        keterangan,
        // file upload TBD
        foto_safety_talk: null,
        foto_check_sheet: null
      };

      console.log('Submitting payload', payload);

      const res = await fetch('/data-bmcm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin', // include session cookie
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Request failed');
      }

      const json = await res.json();
      console.log('Server response', json);
      alert('Data berhasil disimpan');

      // Reset form
      formDataBMCM.reset();
      if (previewSafetyTalk) previewSafetyTalk.innerHTML = '';
      if (previewCheckSheet) previewCheckSheet.innerHTML = '';

      // Optional: redirect to list page
      window.location.href = '/dataBMCM';
    } catch (err) {
      console.error('Submit error', err);
      alert('Gagal menyimpan data: ' + (err.message || 'Error'));
    }
  });
}

/* ================= CANCEL BUTTON ================= */
const btnCancel = document.querySelector('.btn-cancel');

if (btnCancel) {
  btnCancel.addEventListener('click', (e) => {
    e.preventDefault();
    
    if (confirm('Batalkan perubahan?')) {
      window.history.back();
    }
  });
}

/* ================= ACTIVITIES FILTER (OPTIONAL) ================= */
const activitiesCategory = document.getElementById('activitiesCategory');
const activities = document.getElementById('activities');

if (activitiesCategory && activities) {
  const activitiesMap = {
    'BM (Basic Maintenance)': [
      'Filter Dust Cleaning Task',
      'Gearbox Lubrication Check',
      'Bearing Temperature Monitoring',
      'Brake Shoe Inspection',
      'Bolt & Nut Tightening'
    ],
    'CM (Corective Maintenance)': [
      'Coupling Alignment Check',
      'Motor Repair',
      'Bearing Replacement',
      'Seal Repair'
    ],
    'Condition Monitoring': [
      'Vibration Analysis',
      'Temperature Monitoring',
      'Oil Analysis',
      'Performance Monitoring'
    ]
  };

  activitiesCategory.addEventListener('change', () => {
    const selectedCategory = activitiesCategory.value;
    const activityList = activitiesMap[selectedCategory] || [];
    
    activities.innerHTML = '<option value="">-- Pilih Aktivitas --</option>';
    
    activityList.forEach(activity => {
      const option = document.createElement('option');
      option.value = activity;
      option.textContent = activity;
      activities.appendChild(option);
    });
  });
}


