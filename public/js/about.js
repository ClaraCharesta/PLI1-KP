document.addEventListener("DOMContentLoaded", () => {

  /* ================= FILE UPLOAD HANDLER ================= */
  const profilePictureInput = document.getElementById("profilePictureInput");
  const profileImg = document.getElementById("profileImg");
  const fileStatus = document.getElementById("fileStatus");
  const btnPassword = document.querySelector(".btn-password");
  const btnSavePhoto = document.getElementById("btnSavePhoto");
  const btnDeletePhoto = document.getElementById("btnDeletePhoto");

  let selectedFile = null;
  const originalSrc = profileImg.src;

  if (profilePictureInput) {
    profilePictureInput.addEventListener("change", (e) => {
      const file = e.target.files[0];

      if (!file) {
        fileStatus.textContent = "Tidak ada file yang dipilih";
        btnSavePhoto.style.display = "none";
        return;
      }

      // ✅ Validasi tipe file
      if (!file.type.startsWith("image/")) {
        alert("Mohon pilih file gambar (JPG, PNG, GIF, dll)");
        profilePictureInput.value = "";
        fileStatus.textContent = "Tidak ada file yang dipilih";
        btnSavePhoto.style.display = "none";
        return;
      }

      // ✅ Validasi ukuran file (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Ukuran file terlalu besar. Maksimal 5MB");
        profilePictureInput.value = "";
        fileStatus.textContent = "Tidak ada file yang dipilih";
        btnSavePhoto.style.display = "none";
        return;
      }

      try {
        /* ================= PREVIEW ================= */
        const reader = new FileReader();
        reader.onload = (event) => {
          profileImg.src = event.target.result;
          fileStatus.textContent = file.name;
          btnSavePhoto.style.display = "block"; // Tampilkan button Save
          selectedFile = file;
        };
        reader.readAsDataURL(file);

      } catch (err) {
        console.error("Error reading file:", err);
      }
    });
  }

  /* ================= SAVE PHOTO ================= */
  if (btnSavePhoto) {
    btnSavePhoto.addEventListener("click", async () => {
      if (!selectedFile) {
        alert("Pilih file terlebih dahulu");
        return;
      }

      btnSavePhoto.disabled = true;
      btnSavePhoto.textContent = "Menyimpan...";

      try {
        const formData = new FormData();
        formData.append("profile", selectedFile);

        const res = await fetch("/uploadProfile", {
          method: "POST",
          body: formData
        });

        const data = await res.json();

        if (data.success) {
          alert("Foto profil berhasil disimpan!");
          fileStatus.textContent = selectedFile.name + " (Tersimpan)";
          btnSavePhoto.style.display = "none";
          btnDeletePhoto.style.display = "block";
          profilePictureInput.value = "";
          selectedFile = null;
        } else {
          alert("Gagal menyimpan foto: " + (data.message || "Unknown error"));
          profileImg.src = originalSrc;
          fileStatus.textContent = "Gagal menyimpan foto";
        }
      } catch (err) {
        console.error("Upload error:", err);
        alert("Terjadi kesalahan saat upload");
        profileImg.src = originalSrc;
        fileStatus.textContent = "Tidak ada file yang dipilih";
      } finally {
        btnSavePhoto.disabled = false;
        btnSavePhoto.textContent = "Simpan Foto";
      }
    });
  }

  /* ================= DELETE PHOTO ================= */
  if (btnDeletePhoto) {
    btnDeletePhoto.addEventListener("click", async () => {
      if (confirm("Apakah Anda yakin ingin menghapus foto profil?")) {
        btnDeletePhoto.disabled = true;
        btnDeletePhoto.textContent = "Menghapus...";

        try {
          const res = await fetch("/deleteProfile", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            }
          });

          const data = await res.json();

          if (data.success) {
            alert("Foto profil berhasil dihapus!");
            profileImg.src = "/img/default.svg";
            fileStatus.textContent = "Tidak ada file yang dipilih";
            btnDeletePhoto.style.display = "none";
            btnSavePhoto.style.display = "none";
            profilePictureInput.value = "";
            selectedFile = null;
          } else {
            alert("Gagal menghapus foto: " + (data.message || "Unknown error"));
          }
        } catch (err) {
          console.error("Delete error:", err);
          alert("Terjadi kesalahan saat menghapus");
        } finally {
          btnDeletePhoto.disabled = false;
          btnDeletePhoto.textContent = "Hapus Foto";
        }
      }
    });
  }

  /* ================= BUTTON HANDLERS ================= */
  if (btnPassword) {
    btnPassword.addEventListener("click", () => {
      window.location.href = "/ubahPassword";
    });
  }

  /* ================= HAMBURGER MENU ================= */
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.querySelector('.sidebar');
  const main = document.querySelector('.main');

  if (menuToggle && sidebar && main) {
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('closed');
      main.classList.toggle('expanded');
    });
  }

});