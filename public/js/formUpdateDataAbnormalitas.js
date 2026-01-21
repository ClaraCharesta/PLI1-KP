/* ================= FILE UPLOAD PREVIEW ================= */
const fotoSebelum = document.getElementById('fotoSebelum');
const previewSebelum = document.getElementById('previewSebelum');

if (fotoSebelum) {
  fotoSebelum.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        previewSebelum.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
      };
      reader.readAsDataURL(file);
    }
  });
}

const fotoSesudah = document.getElementById('fotoSesudah');
const previewSesudah = document.getElementById('previewSesudah');

if (fotoSesudah) {
  fotoSesudah.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        previewSesudah.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
      };
      reader.readAsDataURL(file);
    }
  });
}

/* ================= FORM SUBMIT (UPDATE) ================= */
const formUpdateDataAbnormalitas = document.getElementById('formUpdateDataAbnormalitas');

if (formUpdateDataAbnormalitas) {
  formUpdateDataAbnormalitas.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Ambil data dari form
    const formData = new FormData(formUpdateDataAbnormalitas);
    const data = Object.fromEntries(formData);
    
    console.log('Data update:', data);
    alert('Data abnormalitas berhasil diupdate! (Frontend only - belum ada backend)');
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
      status: 'Open',
      abnormalDate: '2025-08-26',
      reportBy: 'Fill Ardi',
      area: 'FM5',
      nomenclature: 'FM-841',
      activity: 'Bearing Check',
      prioritas: 'High',
      condition: 'Bearing Panas',
      action: 'Penggantian Bearing',
      abnormal: 'Suara Bising',
      source: 'Operator',
      informasiDetail: 'Bearing temperature naik 45°C',
      rencanaPerbaikan: 'Ganti bearing FM-841 minggu depan',
      notifikasiUnitLain: 'Maintenance',
      idMSO: 'MSO-001'
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
