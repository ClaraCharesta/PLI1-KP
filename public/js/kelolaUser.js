/* ================= DELETE MODAL HANDLER ================= */
const modal = document.getElementById("deleteModal");
const deleteBtn = document.getElementById("deleteBtn");
const keepBtn = document.getElementById("keepBtn");
let rowToDelete = null;

// Show modal saat delete button diklik
document.querySelectorAll(".btn-delete").forEach((btn, index) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    rowToDelete = btn.closest("tr");
    modal.classList.add("show");
  });
});

// Delete button di modal
deleteBtn.addEventListener("click", () => {
  if (rowToDelete) {
    rowToDelete.remove();
    modal.classList.remove("show");
    rowToDelete = null;
  }
});

// Keep button di modal
keepBtn.addEventListener("click", () => {
  modal.classList.remove("show");
  rowToDelete = null;
});

// Close modal saat click backdrop
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("show");
    rowToDelete = null;
  }
});

/* ================= EDIT BUTTON HANDLER ================= */
document.querySelectorAll(".btn-edit").forEach((btn, index) => {
  btn.addEventListener("click", () => {
    alert("Fitur edit user akan segera hadir");
    // Nantinya bisa di-redirect ke halaman edit user atau buka modal form
  });
});

/* ================= ADD USER BUTTON HANDLER ================= */
document.getElementById("addUserBtn").addEventListener("click", () => {
  alert("Fitur tambah user akan segera hadir");
  // Nantinya bisa di-redirect ke halaman add user atau buka modal form
});
