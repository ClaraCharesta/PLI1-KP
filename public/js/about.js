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

/* ================= BUTTON HANDLERS ================= */
document.querySelector(".btn-password").addEventListener("click", () => {
  window.location.href = "/ubahPassword";
});

document.getElementById("editProfileBtn").addEventListener("click", () => {
  window.location.href = "/editProfil";
});
