/* ================= FORM HANDLER ================= */
document.addEventListener("DOMContentLoaded", () => {
  const formAddUser = document.getElementById("formAddUser");
  const cancelBtn = document.getElementById("cancelBtn");

  // Form submit handler
  formAddUser.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const nama = document.getElementById("nama").value.trim();
    const nip = document.getElementById("nip").value.trim();
    const role = document.getElementById("role").value;
    const createAt = document.getElementById("createAt").value;

    // Validasi
    if (!email) {
      alert("Email tidak boleh kosong");
      return;
    }

    // Validasi email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Format email tidak valid");
      return;
    }

    if (!nama) {
      alert("Nama tidak boleh kosong");
      return;
    }

    if (!nip) {
      alert("NIP tidak boleh kosong");
      return;
    }

    if (!role) {
      alert("Role harus dipilih");
      return;
    }

    if (!createAt) {
      alert("Create At tidak boleh kosong");
      return;
    }

    // Jika semua validasi passed
    alert("User berhasil ditambahkan!");
    formAddUser.reset();
    // Redirect ke halaman kelola user
    setTimeout(() => {
      window.location.href = "/kelola-user";
    }, 1500);
  });

  // Cancel button handler
  cancelBtn.addEventListener("click", () => {
    window.location.href = "/kelola-user";
  });

  // Set default date to today
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("createAt").value = today;
});
