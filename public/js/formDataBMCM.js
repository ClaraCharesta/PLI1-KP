/* =========================================================
   FORM DATA BMCM - UI ONLY SCRIPT
   (NO FETCH, NO AJAX, LET FORM SUBMIT NATIVELY)
   ========================================================= */

/* ================= INPUT COUNTER ================= */
document.querySelectorAll('.btn-counter').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();

    const action = btn.dataset.action;
    const input = btn.parentElement.querySelector('input[type="number"]');
    if (!input) return;

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
function setupImagePreview(inputId, previewId) {
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);

  if (!input || !preview) return;

  const uploadBox = input.closest('.upload-box');
  const placeholder = uploadBox?.querySelector('.upload-placeholder');

  input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) {
      preview.innerHTML = '';
      if (placeholder) placeholder.classList.remove('hidden');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      preview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
      if (placeholder) placeholder.classList.add('hidden');
    };
    reader.readAsDataURL(file);
  });

  // Check if there's already an image on page load (for update forms)
  if (preview.querySelector('img')) {
    if (placeholder) placeholder.classList.add('hidden');
  }
}

setupImagePreview('fotoSafetyTalk', 'previewSafetyTalk');
setupImagePreview('fotoCheckSheet', 'previewCheckSheet');

/* ================= FORM SUBMIT (NATIVE) ================= */
const formDataBMCM = document.getElementById('formDataBMCM');

if (formDataBMCM) {
  console.log('formDataBMCM.js loaded (native submit mode)');

  // OPTIONAL: simple client-side validation
  formDataBMCM.addEventListener('submit', (e) => {
    const requiredIds = [
      'tanggal',
      'area',
      'supervisor',
      'executor',
      'activitiesCategory',
      'activities',
      'duration',
      'jumlahPersonel',
      'statusPersen',
      'status'
    ];

    const missing = requiredIds.filter(id => {
      const el = document.getElementById(id);
      return !el || !el.value;
    });

    if (missing.length > 0) {
      e.preventDefault(); // STOP submit
      alert('Field wajib belum diisi:\n- ' + missing.join('\n- '));
    }

    // JIKA TIDAK ADA e.preventDefault()
    // 👉 FORM AKAN SUBMIT NORMAL
    // 👉 MULTER AKTIF
    // 👉 FILE TERKIRIM
  });
}

/* ================= CANCEL BUTTON ================= */
const btnCancel = document.querySelector('.btn-cancel');
const cancelModal = document.getElementById('cancelModal');
const confirmCancelBtn = document.getElementById('confirmCancelBtn');
const keepCancelBtn = document.getElementById('keepCancelBtn');

if (btnCancel && cancelModal) {
  btnCancel.addEventListener('click', (e) => {
    e.preventDefault();
    cancelModal.classList.add('show');
  });

  if (confirmCancelBtn) {
    confirmCancelBtn.addEventListener('click', () => {
      cancelModal.classList.remove('show');
      window.history.back();
    });
  }

  if (keepCancelBtn) {
    keepCancelBtn.addEventListener('click', () => {
      cancelModal.classList.remove('show');
    });
  }
}

/* ================= ACTIVITIES FILTER ================= */
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
