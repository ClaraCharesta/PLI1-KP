/* ================= FILE UPLOAD PREVIEW ================= */
// Foto Sebelum
const inputSebelum = document.getElementById('fotoSebelum');
const previewSebelum = document.getElementById('previewSebelum');

if (inputSebelum && previewSebelum) {
    const uploadBoxSebelum = inputSebelum.closest('.upload-box');
    const placeholderSebelum = uploadBoxSebelum?.querySelector('.upload-placeholder');
    
    inputSebelum.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewSebelum.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                if (placeholderSebelum) placeholderSebelum.classList.add('hidden');
            }
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

// Foto Sesudah
const inputSesudah = document.getElementById('fotoSesudah');
const previewSesudah = document.getElementById('previewSesudah');

if (inputSesudah && previewSesudah) {
    const uploadBoxSesudah = inputSesudah.closest('.upload-box');
    const placeholderSesudah = uploadBoxSesudah?.querySelector('.upload-placeholder');
    
    inputSesudah.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewSesudah.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                if (placeholderSesudah) placeholderSesudah.classList.add('hidden');
            }
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
      window.history.back();
    });
  }

  if (keepCancelBtn) {
    keepCancelBtn.addEventListener('click', () => {
      cancelModal.classList.remove('show');
    });
  }
}
