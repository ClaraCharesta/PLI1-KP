/* ================= MODAL HELPER FUNCTIONS ================= */
function showModal(message, icon = "✓") {
  const modal = document.getElementById("confirmModal") || createModal();
  const modalContent = modal.querySelector(".modal-content p");
  const modalIcon = modal.querySelector(".modal-icon");
  modalIcon.textContent = icon;
  modalContent.textContent = message;
  modal.classList.add("show");
  return modal;
}

function hideModal() {
  const modal = document.getElementById("confirmModal");
  if (modal) {
    modal.classList.remove("show");
  }
}

function createModal() {
  const modal = document.createElement("div");
  modal.id = "confirmModal";
  modal.className = "modal";
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-icon">✓</div>
      <h2>Konfirmasi</h2>
      <p>Pesan</p>
      <div class="modal-buttons">
        <button id="confirmBtn" class="modal-confirm-btn">Ya</button>
        <button id="cancelModalBtn" class="modal-cancel-btn">Tidak</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  return modal;
}

/* ================= FILE UPLOAD HANDLER ================= */
const profilePictureInput = document.getElementById("profilePictureInput");
const profileImg = document.getElementById("profileImg");
const fileStatus = document.getElementById("fileStatus");

profilePictureInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  
  if (file) {
    // Validasi tipe file
    if (!file.type.startsWith("image/")) {
      const modal = showModal("Mohon pilih file gambar (JPG, PNG, GIF, etc)", "⚠️");
      modal.querySelector(".modal-buttons").innerHTML = '<button class="modal-confirm-btn" style="flex: 1;">OK</button>';
      modal.querySelector(".modal-confirm-btn").addEventListener("click", hideModal);
      profilePictureInput.value = "";
      fileStatus.textContent = "Tidak ada file yang dipilih";
      return;
    }

    // Validasi ukuran file (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      const modal = showModal("Ukuran file terlalu besar. Maksimal 5MB", "⚠️");
      modal.querySelector(".modal-buttons").innerHTML = '<button class="modal-confirm-btn" style="flex: 1;">OK</button>';
      modal.querySelector(".modal-confirm-btn").addEventListener("click", hideModal);
      profilePictureInput.value = "";
      fileStatus.textContent = "Tidak ada file yang dipilih";
      return;
    }

    // Read file dan tampilkan preview
    const reader = new FileReader();
    reader.onload = (event) => {
      profileImg.src = event.target.result;
      fileStatus.textContent = file.name;
    };
    reader.readAsDataURL(file);
  } else {
    fileStatus.textContent = "Tidak ada file yang dipilih";
  }
});

/* ================= FORM HANDLER ================= */
const editProfilForm = document.getElementById("editProfilForm");
const cancelBtn = document.getElementById("cancelBtn");

// Submit form
editProfilForm.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const noHP = document.getElementById("noHP").value.trim();

  // Validasi
  if (!username) {
    const modal = showModal("Username tidak boleh kosong", "⚠️");
    modal.querySelector(".modal-buttons").innerHTML = '<button class="modal-confirm-btn" style="flex: 1;">OK</button>';
    modal.querySelector(".modal-confirm-btn").addEventListener("click", hideModal);
    return;
  }

  if (!email) {
    const modal = showModal("Email tidak boleh kosong", "⚠️");
    modal.querySelector(".modal-buttons").innerHTML = '<button class="modal-confirm-btn" style="flex: 1;">OK</button>';
    modal.querySelector(".modal-confirm-btn").addEventListener("click", hideModal);
    return;
  }

  // Validasi email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    const modal = showModal("Format email tidak valid", "⚠️");
    modal.querySelector(".modal-buttons").innerHTML = '<button class="modal-confirm-btn" style="flex: 1;">OK</button>';
    modal.querySelector(".modal-confirm-btn").addEventListener("click", hideModal);
    return;
  }

  if (!noHP) {
    const modal = showModal("Nomor HP tidak boleh kosong", "⚠️");
    modal.querySelector(".modal-buttons").innerHTML = '<button class="modal-confirm-btn" style="flex: 1;">OK</button>';
    modal.querySelector(".modal-confirm-btn").addEventListener("click", hideModal);
    return;
  }

  // Validasi nomor HP (hanya angka, min 10 digit)
  const phoneRegex = /^[\d+\-\s()]+$/;
  if (!phoneRegex.test(noHP)) {
    const modal = showModal("Format nomor HP tidak valid", "⚠️");
    modal.querySelector(".modal-buttons").innerHTML = '<button class="modal-confirm-btn" style="flex: 1;">OK</button>';
    modal.querySelector(".modal-confirm-btn").addEventListener("click", hideModal);
    return;
  }

  // Jika semua validasi passed
  const modal = showModal("Perubahan profil berhasil disimpan!", "✓");
  modal.querySelector(".modal-buttons").innerHTML = '<button class="modal-confirm-btn" style="flex: 1;">OK</button>';
  modal.querySelector(".modal-confirm-btn").addEventListener("click", () => {
    hideModal();
  });
});

// Cancel button
cancelBtn.addEventListener("click", () => {
  const modal = showModal("Apakah anda yakin ingin membatalkan perubahan?", "⚠️");
  modal.querySelector("h2").textContent = "Konfirmasi";
  
  const confirmBtn = modal.querySelector(".modal-confirm-btn");
  const cancelModalBtn = modal.querySelector(".modal-cancel-btn");
  
  confirmBtn.textContent = "Ya";
  cancelModalBtn.textContent = "Tidak";
  
  confirmBtn.onclick = () => {
    hideModal();
    window.history.back();
  };
  
  cancelModalBtn.onclick = () => {
    hideModal();
  };
});
