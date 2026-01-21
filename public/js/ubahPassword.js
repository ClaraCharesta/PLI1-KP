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
    alert("Password lama tidak boleh kosong");
    return;
  }

  if (!newPassword) {
    alert("Password baru tidak boleh kosong");
    return;
  }

  if (!confirmPassword) {
    alert("Konfirmasi password tidak boleh kosong");
    return;
  }

  // Cek jika password lama dan password baru sama
  if (oldPassword === newPassword) {
    alert("Password baru tidak boleh sama dengan password lama");
    return;
  }

  // Cek jika password baru dan konfirmasi sama
  if (newPassword !== confirmPassword) {
    alert("Password baru dan konfirmasi password tidak sesuai");
    return;
  }

  // Cek panjang password minimal 6 karakter
  if (newPassword.length < 6) {
    alert("Password baru minimal 6 karakter");
    return;
  }

  // Jika semua validasi passed
  alert("Password berhasil diubah!");
  // Di sini bisa dikirim ke backend untuk disimpan ke database
  passwordForm.reset();
});

// Cancel button
cancelBtn.addEventListener("click", () => {
  if (confirm("Apakah anda yakin ingin membatalkan perubahan password?")) {
    window.history.back();
  }
});
