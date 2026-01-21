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

/* ================= FORM SUBMIT ================= */
const formDataAbnormalitas = document.getElementById('formDataAbnormalitas');

if (formDataAbnormalitas) {
  formDataAbnormalitas.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Ambil data dari form
    const formData = new FormData(formDataAbnormalitas);
    const data = Object.fromEntries(formData);
    
    console.log('Data form:', data);
    alert('Data abnormalitas berhasil disimpan! (Frontend only - belum ada backend)');
    
    // Reset form
    formDataAbnormalitas.reset();
    previewSebelum.innerHTML = '';
    previewSesudah.innerHTML = '';
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
