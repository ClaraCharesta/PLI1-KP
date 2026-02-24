document.addEventListener("DOMContentLoaded", () => {

  /* ================= FILE UPLOAD HANDLER ================= */
  const profilePictureInput = document.getElementById("profilePictureInput");
  const profileImg = document.getElementById("profileImg");
  const fileStatus = document.getElementById("fileStatus");
  const btnPassword = document.querySelector(".btn-password");

  if (profilePictureInput) {
    profilePictureInput.addEventListener("change", async (e) => {
      const file = e.target.files[0];

      if (!file) {
        fileStatus.textContent = "Tidak ada file yang dipilih";
        return;
      }

      // ✅ Validasi tipe file
      if (!file.type.startsWith("image/")) {
        alert("Mohon pilih file gambar (JPG, PNG, GIF, dll)");
        profilePictureInput.value = "";
        fileStatus.textContent = "Tidak ada file yang dipilih";
        return;
      }

      // ✅ Validasi ukuran file (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Ukuran file terlalu besar. Maksimal 5MB");
        profilePictureInput.value = "";
        fileStatus.textContent = "Tidak ada file yang dipilih";
        return;
      }

      try {
        /* ================= PREVIEW ================= */
        const reader = new FileReader();
        reader.onload = (event) => {
          profileImg.src = event.target.result;
          fileStatus.textContent = file.name;
        };
        reader.readAsDataURL(file);

        /* ================= UPLOAD KE SERVER ================= */
        const formData = new FormData();
        formData.append("profile", file);

        const res = await fetch("/uploadProfile", {
          method: "POST",
          body: formData
        });

        const data = await res.json();

        if (!data.success) {
          console.error("Upload gagal");
        }

      } catch (err) {
        console.error("Upload error:", err);
      }
    });
  }

  /* ================= BUTTON HANDLERS ================= */
  if (btnPassword) {
    btnPassword.addEventListener("click", () => {
      window.location.href = "/ubahPassword";
    });
  }

});