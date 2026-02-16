document.addEventListener('DOMContentLoaded', () => {

  /* ================= COUNTER (LOGIKA LIMIT 100%) ================= */
  document.querySelectorAll('.btn-counter').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const counter = btn.closest('.input-counter');
      if (!counter) return;
      
      const input = counter.querySelector('input[type="number"]');
      if (!input) {
        // Fallback: coba cari input biasa jika tidak ada input[type="number"]
        const fallbackInput = counter.querySelector('input');
        if (!fallbackInput) return;
        handleCounterClick(btn, fallbackInput);
        return;
      }

      handleCounterClick(btn, input);
    });
  });

  function handleCounterClick(btn, input) {
    let val = parseInt(input.value) || 0;
    
    // Mengambil nilai max dari atribut HTML
    const maxAttr = input.getAttribute('max');
    const max = (maxAttr !== null && maxAttr !== "" && !isNaN(parseInt(maxAttr))) ? parseInt(maxAttr) : Infinity;

    if (btn.dataset.action === 'plus') {
      // LOGIKA UTAMA: Button + berfungsi selama nilai < max (100)
      if (val < max) {
        input.value = val + 1;
        // Trigger input event untuk memastikan nilai ter-update
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }

    if (btn.dataset.action === 'minus') {
      // Tombol minus tetap berfungsi selama nilai di atas 0
      if (val > 0) {
        input.value = val - 1;
        // Trigger input event untuk memastikan nilai ter-update
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  }

    /* ================= IMAGE PREVIEW ================= */
    function previewImage(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;
  
  const uploadBox = input.closest('.upload-box');
  const preview = uploadBox?.querySelector('.upload-preview');
  const placeholder = uploadBox?.querySelector('.upload-placeholder');

  if (!preview) return;

  input.addEventListener('change', () => {
    const file = input.files[0];
    if (!file) {
      preview.innerHTML = '';
      if (placeholder) placeholder.classList.remove('hidden');
      return;
    }

    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.onload = () => URL.revokeObjectURL(img.src);

    preview.innerHTML = '';
    preview.appendChild(img);
    if (placeholder) placeholder.classList.add('hidden');
  });

  // Check if there's already an image on page load
  if (preview.querySelector('img')) {
    if (placeholder) placeholder.classList.add('hidden');
  }
}

previewImage('fotoSafetyTalk');
previewImage('fotoCheckSheet');


  /* ================= ACTIVITIES FILTER ================= */
    const categorySelect = document.getElementById('activitiesCategory');
    const activitiesSelect = document.getElementById('activities');

    if (categorySelect && activitiesSelect) {
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
            ]
        };

        function loadActivities(category) {
            // Ambil nilai yang tersimpan di data-current (dari database)
            const currentValue = activitiesSelect.getAttribute('data-current') || '';
            
            activitiesSelect.innerHTML = `<option value="">-- Pilih Aktivitas --</option>`;

            if (activitiesMap[category]) {
                activitiesMap[category].forEach(act => {
                    const opt = document.createElement('option');
                    opt.value = act;
                    opt.textContent = act;

                    // Jika aktivitas ini sama dengan yang di database, jadikan 'selected'
                    if (act === currentValue) {
                        opt.selected = true;
                    }
                    activitiesSelect.appendChild(opt);
                });
            }
        }

        // Jalankan otomatis saat halaman edit terbuka
        if (categorySelect.value) {
            loadActivities(categorySelect.value);
        }

        // Jalankan setiap kali kategori diubah manual oleh user
        categorySelect.addEventListener('change', function() {
            // Hapus data-current jika user mengubah kategori secara sengaja
            activitiesSelect.setAttribute('data-current', ''); 
            loadActivities(this.value);
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
        window.location.href = '/data-bmcm/page';
      });
    }

    if (keepCancelBtn) {
      keepCancelBtn.addEventListener('click', () => {
        cancelModal.classList.remove('show');
      });
    }
  }
});