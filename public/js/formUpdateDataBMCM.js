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

/* ================= FORM SUBMIT (UPDATE) ================= */
const formUpdateDataBMCM = document.getElementById('formUpdateDataBMCM');

if (formUpdateDataBMCM) {
  formUpdateDataBMCM.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Ambil data dari form
    const formData = new FormData(formUpdateDataBMCM);
    const data = Object.fromEntries(formData);
    
    console.log('Data update:', data);
    alert('Data berhasil diupdate! (Frontend only - belum ada backend)');
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

/* ================= PRE-POPULATE DATA (OPTIONAL) ================= */
function loadDataFromURL() {
  const params = new URLSearchParams(window.location.search);
  
  const dataId = params.get('id');
  
  if (dataId) {
    // Simulasi fetch data dari backend
    console.log('Loading data ID:', dataId);
    
    // Contoh data dummy (dalam produksi ini dari backend)
    const dummyData = {
      tanggal: '2026-01-20',
      area: 'RM5',
      supervisor: 'Fill Ardi',
      executor: 'Rivaldi',
      activitiesCategory: 'BM (Basic Maintenance)',
      activities: 'Filter Dust Cleaning Task',
      detailActivities: 'Cleaning filter di area intake',
      duration: '3',
      jumlahPersonel: '2',
      statusPersen: '80',
      status: 'In Progress',
      keterangan: 'Proses pembersihan sudah mencapai 80%'
    };
    
    // Populate form dengan data
    Object.keys(dummyData).forEach(key => {
      const element = document.getElementById(key);
      if (element) {
        element.value = dummyData[key];
      }
    });
  }
}

// Load data saat halaman dibuka
document.addEventListener('DOMContentLoaded', loadDataFromURL);

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
    'PM (Plannet Corective Maint)': [
      'Coupling Alignment Check',
      'Motor Repair',
      'Bearing Replacement',
      'Seal Repair'
    ],
    'Pekerjaan CAPEX': [
      'Installation Equipment',
      'Testing System',
      'Commissioning'
    ],
    'Persiapan Runnning': [
      'System Check',
      'Safety Training',
      'Documentation Review'
    ],
    'PCM': [
      'Vibration Analysis',
      'Temperature Monitoring',
      'Oil Analysis'
    ],
    'Lain-Lain': [
      'General Maintenance',
      'Support Activity',
      'Other Work'
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
