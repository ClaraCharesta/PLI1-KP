/* ================= FILE UPLOAD PREVIEW ================= */
const fotoSebelum = document.getElementById('fotoSebelum');
const previewSebelum = document.getElementById('previewSebelum');

if (fotoSebelum && previewSebelum) {
  const uploadBoxSebelum = fotoSebelum.closest('.upload-box');
  const placeholderSebelum = uploadBoxSebelum?.querySelector('.upload-placeholder');
  
  fotoSebelum.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        previewSebelum.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
        if (placeholderSebelum) placeholderSebelum.classList.add('hidden');
      };
      reader.readAsDataURL(file);
    } else {
      previewSebelum.innerHTML = '';
      if (placeholderSebelum) placeholderSebelum.classList.remove('hidden');
    }
  });

  // Check if there's already an image on page load
  if (previewSebelum.querySelector('img')) {
    if (placeholderSebelum) placeholderSebelum.classList.add('hidden');
  }
}

const fotoSesudah = document.getElementById('fotoSesudah');
const previewSesudah = document.getElementById('previewSesudah');

if (fotoSesudah && previewSesudah) {
  const uploadBoxSesudah = fotoSesudah.closest('.upload-box');
  const placeholderSesudah = uploadBoxSesudah?.querySelector('.upload-placeholder');
  
  fotoSesudah.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        previewSesudah.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
        if (placeholderSesudah) placeholderSesudah.classList.add('hidden');
      };
      reader.readAsDataURL(file);
    } else {
      previewSesudah.innerHTML = '';
      if (placeholderSesudah) placeholderSesudah.classList.remove('hidden');
    }
  });

  // Check if there's already an image on page load
  if (previewSesudah.querySelector('img')) {
    if (placeholderSesudah) placeholderSesudah.classList.add('hidden');
  }
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
      window.location.href = '/dataAbnormalitas';
    });
  }

  if (keepCancelBtn) {
    keepCancelBtn.addEventListener('click', () => {
      cancelModal.classList.remove('show');
    });
  }
}
