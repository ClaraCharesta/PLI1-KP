/* ================= DELETE BUTTON & MODAL ================= */
const modal = document.getElementById("deleteModal");
const deleteBtn = document.getElementById("deleteBtn");
const keepBtn = document.getElementById("keepBtn");
let rowToDelete = null;

// Show modal saat delete button diklik
document.querySelectorAll(".delete").forEach(btn => {
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

/* ================= EDIT BUTTON ================= */
document.querySelectorAll(".edit").forEach((btn, index) => {
  btn.addEventListener("click", () => {
    const rowId = index + 1; // Simulasi ID dari row
    window.location.href = `/updateDataBMCM?id=${rowId}`;
  });
});

/* ================= ADD BUTTON ================= */
document.querySelectorAll(".btn-add").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.target;
    if (target) {
      window.location.href = `/${target}`;
    }
  });
});

/* ================= TOGGLE ROW DETAIL (OPTIONAL) ================= */
document.querySelectorAll(".table tbody tr").forEach(row => {
  row.addEventListener("click", (e) => {
    // Jangan toggle kalau yang di-click adalah button
    if (e.target.tagName !== "BUTTON" && e.target.tagName !== "I") {
      row.style.background = "rgba(139, 0, 0, 0.1)";
    }
  });
});
