/* ================= PASSWORD VISIBILITY TOGGLE ================= */
const togglePasswordButtons = document.querySelectorAll(".toggle-password");

togglePasswordButtons.forEach(button => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = button.dataset.target;
    const inputField = document.getElementById(targetId);

    if (!inputField) return;

    if (inputField.type === "password") {
      inputField.type = "text";
      button.classList.add("visible");
    } else {
      inputField.type = "password";
      button.classList.remove("visible");
    }
  });
});


/* ================= MODAL ================= */
function createModal() {
  let modal = document.getElementById("confirmModal");
  if (modal) return modal;

  modal = document.createElement("div");
  modal.id = "confirmModal";
  modal.className = "modal";

  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-icon">✓</div>
      <h2>Informasi</h2>
      <p></p>
      <div class="modal-buttons"></div>
    </div>
  `;

  document.body.appendChild(modal);
  return modal;
}

function showModal(message, options = {}) {
  const modal = createModal();

  const icon = modal.querySelector(".modal-icon");
  const title = modal.querySelector("h2");
  const text = modal.querySelector("p");
  const buttons = modal.querySelector(".modal-buttons");

  text.textContent = message;

  icon.textContent = options.icon || "✓";
  title.textContent = options.title || "Informasi";

  buttons.innerHTML = "";

  // default OK button
  const okBtn = document.createElement("button");
  okBtn.className = "modal-confirm-btn";
  okBtn.textContent = options.okText || "OK";

  okBtn.onclick = () => {
    hideModal();
    if (options.onOk) options.onOk();
  };

  buttons.appendChild(okBtn);

  // optional cancel
  if (options.showCancel) {
    const cancelBtn = document.createElement("button");
    cancelBtn.className = "modal-cancel-btn";
    cancelBtn.textContent = options.cancelText || "Batal";

    cancelBtn.onclick = () => {
      hideModal();
      if (options.onCancel) options.onCancel();
    };

    buttons.appendChild(cancelBtn);
  }

  modal.classList.add("show");
  return modal;
}

function hideModal() {
  const modal = document.getElementById("confirmModal");
  if (modal) modal.classList.remove("show");
}


/* ================= PASSWORD FORM ================= */
const passwordForm = document.getElementById("passwordForm");
const cancelBtn = document.getElementById("cancelBtn");

passwordForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const oldPassword = document.getElementById("oldPassword").value.trim();
  const newPassword = document.getElementById("newPassword").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();

  /* ===== VALIDASI FRONTEND ===== */
  if (!oldPassword) return showModal("Password lama tidak boleh kosong", { icon: "⚠️" });
  if (!newPassword) return showModal("Password baru tidak boleh kosong", { icon: "⚠️" });
  if (!confirmPassword) return showModal("Konfirmasi password tidak boleh kosong", { icon: "⚠️" });

  if (oldPassword === newPassword) {
    return showModal("Password baru tidak boleh sama dengan password lama", { icon: "⚠️" });
  }

  if (newPassword !== confirmPassword) {
    return showModal("Password baru dan konfirmasi tidak sama", { icon: "⚠️" });
  }

  if (newPassword.length < 6) {
    return showModal("Password baru minimal 6 karakter", { icon: "⚠️" });
  }

  /* ===== CALL BACKEND ===== */
  try {
    console.log("📤 Mengirim ubah password request...");
    const res = await fetch("/profile/ubah-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        oldPassword,
        newPassword,
        confirmPassword
      })
    });

    const data = await res.json();
    console.log("📥 Response dari server:", { status: res.status, data });

    if (!res.ok) {
      console.error("❌ Error:", data.message);
      return showModal(data.message || "Gagal ubah password", { icon: "⚠️" });
    }

    console.log("✅ Password berhasil diubah");
    showModal("Password berhasil diubah", {
      icon: "✅",
      onOk: () => {
        // Redirect to about page
        window.location.href = "/about";
      }
    });

  } catch (err) {
    console.error("❌ Network error:", err);
    showModal("Terjadi kesalahan saat menghubungi server: " + err.message, { icon: "❌" });
  }
});


/* ================= CANCEL BUTTON ================= */
cancelBtn.addEventListener("click", () => {
  showModal("Apakah anda yakin ingin membatalkan perubahan password?", {
    icon: "⚠️",
    title: "Konfirmasi",
    okText: "Ya",
    cancelText: "Tidak",
    showCancel: true,
    onOk: () => window.history.back()
  });
});