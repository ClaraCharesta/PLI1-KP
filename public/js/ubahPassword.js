/* ================= PASSWORD VISIBILITY TOGGLE ================= */
const togglePasswordButtons = document.querySelectorAll(".toggle-password");

togglePasswordButtons.forEach(button => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = button.dataset.target;
    const inputField = document.getElementById(targetId);
    
    if (inputField.type === "password") {
      inputField.type = "text";
      button.classList.add("visible");
    } else {
      inputField.type = "password";
      button.classList.remove("visible");
    }
  });
});

/* ================= MODAL HELPER FUNCTIONS ================= */
function showModal(message) {
  const modal = document.getElementById("confirmModal") || createModal();
  const modalContent = modal.querySelector(".modal-content p");
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
      <p>Apakah anda yakin ingin membatalkan perubahan password?</p>
      <div class="modal-buttons">
        <button id="confirmBtn" class="modal-confirm-btn">Ya</button>
        <button id="cancelModalBtn" class="modal-cancel-btn">Tidak</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  return modal;
}

/* ================= PASSWORD FORM HANDLER ================= */
const passwordForm = document.getElementById("passwordForm");
const cancelBtn = document.getElementById("cancelBtn");

passwordForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const oldPassword = document.getElementById("oldPassword").value.trim();
  const newPassword = document.getElementById("newPassword").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();

  // Validasi
  if (!oldPassword) {
    const modal = showModal("Password lama tidak boleh kosong");
    const okBtn = modal.querySelector(".modal-confirm-btn") || document.createElement("button");
    if (!okBtn.id) {
      okBtn.id = "confirmBtn";
      okBtn.className = "modal-confirm-btn";
      okBtn.textContent = "OK";
      modal.querySelector(".modal-buttons").innerHTML = '';
      modal.querySelector(".modal-buttons").appendChild(okBtn);
      okBtn.addEventListener("click", hideModal);
    }
    return;
  }

  if (!newPassword) {
    const modal = showModal("Password baru tidak boleh kosong");
    modal.querySelector(".modal-confirm-btn").addEventListener("click", hideModal);
    return;
  }

  if (!confirmPassword) {
    const modal = showModal("Konfirmasi password tidak boleh kosong");
    modal.querySelector(".modal-confirm-btn").addEventListener("click", hideModal);
    return;
  }

  // Cek jika password lama dan password baru sama
  if (oldPassword === newPassword) {
    const modal = showModal("Password baru tidak boleh sama dengan password lama");
    modal.querySelector(".modal-confirm-btn").addEventListener("click", hideModal);
    return;
  }

  // Cek jika password baru dan konfirmasi sama
  if (newPassword !== confirmPassword) {
    const modal = showModal("Password baru dan konfirmasi password tidak sesuai");
    modal.querySelector(".modal-confirm-btn").addEventListener("click", hideModal);
    return;
  }

  // Cek panjang password minimal 6 karakter
  if (newPassword.length < 6) {
    const modal = showModal("Password baru minimal 6 karakter");
    modal.querySelector(".modal-confirm-btn").addEventListener("click", hideModal);
    return;
  }

  // Jika semua validasi passed
  const modal = showModal("Password berhasil diubah!");
  modal.querySelector(".modal-confirm-btn").textContent = "OK";
  modal.querySelector(".modal-confirm-btn").addEventListener("click", () => {
    hideModal();
    passwordForm.reset();
  });
  modal.querySelector(".modal-buttons").innerHTML = '<button class="modal-confirm-btn" style="flex: 1;">OK</button>';
  modal.querySelector(".modal-confirm-btn").addEventListener("click", () => {
    hideModal();
    passwordForm.reset();
  });
});

// Cancel button
cancelBtn.addEventListener("click", () => {
  const modal = showModal("Apakah anda yakin ingin membatalkan perubahan password?");
  modal.querySelector(".modal-icon").textContent = "⚠️";
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
