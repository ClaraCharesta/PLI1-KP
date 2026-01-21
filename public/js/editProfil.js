/* ================= FILE UPLOAD HANDLER ================= */
const profilePictureInput = document.getElementById("profilePictureInput");
const profileImg = document.getElementById("profileImg");
const fileStatus = document.getElementById("fileStatus");

profilePictureInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  
  if (file) {
    // Validasi tipe file
    if (!file.type.startsWith("image/")) {
      alert("Mohon pilih file gambar (JPG, PNG, GIF, etc)");
      profilePictureInput.value = "";
      fileStatus.textContent = "Tidak ada file yang dipilih";
      return;
    }

    // Validasi ukuran file (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran file terlalu besar. Maksimal 5MB");
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
    alert("Username tidak boleh kosong");
    return;
  }

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

  if (!noHP) {
    alert("Nomor HP tidak boleh kosong");
    return;
  }

  // Validasi nomor HP (hanya angka, min 10 digit)
  const phoneRegex = /^[\d+\-\s()]+$/;
  if (!phoneRegex.test(noHP)) {
    alert("Format nomor HP tidak valid");
    return;
  }

  // Jika semua validasi passed
  alert("Perubahan profil berhasil disimpan!");
  // Di sini bisa dikirim ke backend untuk disimpan ke database
});

// Cancel button
cancelBtn.addEventListener("click", () => {
  if (confirm("Apakah anda yakin ingin membatalkan perubahan?")) {
    window.history.back();
  }
});
