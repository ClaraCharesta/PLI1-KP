/* ================= FORM UPDATE HANDLER ================= */
document.addEventListener("DOMContentLoaded", () => {
  const formUpdateUser = document.getElementById("formUpdateUser");
  const cancelBtn = document.getElementById("cancelBtn");

  // Get user data from URL parameters (simulated)
  const params = new URLSearchParams(window.location.search);
  const userId = params.get("id") || "1";
  
  // Load user data (in real app, this would come from database)
  loadUserData(userId);

  function loadUserData(userId) {
    // Simulated user data - in real app, fetch from API
    const userData = {
      email: "itarm@gmail.com",
      nama: "Tarmizi",
      nip: "6207071",
      role: "admin",
      createAt: "2025-10-10"
    };

    // Fill form with user data
    document.getElementById("email").value = userData.email;
    document.getElementById("nama").value = userData.nama;
    document.getElementById("nip").value = userData.nip;
    document.getElementById("role").value = userData.role;
    document.getElementById("createAt").value = userData.createAt;
  }

  // Form submit handler
  formUpdateUser.addEventListener("submit", (e) => {
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
    alert("User berhasil diperbarui!");
    // Redirect ke halaman kelola user
    setTimeout(() => {
      window.location.href = "/kelola-user";
    }, 1500);
  });

  // Cancel button handler
  cancelBtn.addEventListener("click", () => {
    window.location.href = "/kelola-user";
  });
});
