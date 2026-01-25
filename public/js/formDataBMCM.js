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

if (formDataBMCM) {
  formDataBMCM.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Ambil data dari form
    const formData = new FormData(formDataBMCM);
    const data = Object.fromEntries(formData);
    
    console.log('Data form:', data);
    alert('Data berhasil disimpan! (Frontend only - belum ada backend)');
    
    // Reset form
    formDataBMCM.reset();
    previewSafetyTalk.innerHTML = '';
    previewCheckSheet.innerHTML = '';
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
    'PM (Preventive Maintenance)': [
      'Filter Dust Cleaning Task',
      'Gearbox Lubrication Check',
      'Bearing Temperature Monitoring',
      'Brake Shoe Inspection',
      'Bolt & Nut Tightening'
    ],
    'Corrective Maintenance': [
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


