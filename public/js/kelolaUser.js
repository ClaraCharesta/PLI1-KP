document.addEventListener("DOMContentLoaded", () => {

  /* ================= DELETE MODAL HANDLER ================= */

  const modal = document.getElementById("deleteModal");
  const deleteBtn = document.getElementById("deleteBtn");
  const keepBtn = document.getElementById("keepBtn");
  let rowToDelete = null;

  document.querySelectorAll(".delete").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      rowToDelete = btn.closest("tr");
      modal.classList.add("show");
    });
  });

  deleteBtn?.addEventListener("click", () => {
    if (rowToDelete) {
      rowToDelete.remove();
      modal.classList.remove("show");
      rowToDelete = null;
    }
  });

  keepBtn?.addEventListener("click", () => {
    modal.classList.remove("show");
    rowToDelete = null;
  });

  modal?.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("show");
      rowToDelete = null;
    }
  });

  /* ================= EDIT BUTTON HANDLER ================= */

  document.querySelectorAll(".edit").forEach((btn, index) => {
    btn.addEventListener("click", () => {
      const userId = index + 1; // Simulasi ID dari row
      window.location.href = `/formUpdateKelolaUser?id=${userId}`;
    });
  });

  /* ================= ADD BUTTON HANDLER ================= */

  const addBtn = document.getElementById("addUserBtn");
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      window.location.href = "/formKelolaUser";
    });
  }

  /* ================= SEARCH TABLE FUNCTIONALITY ================= */

  const searchInput = document.getElementById("searchInput");
  const btnSearch = document.getElementById("btnSearch");
  const tableRows = document.querySelectorAll("tbody tr");

  if (!searchInput) return;

  function filterTable() {
    const keyword = searchInput.value.toLowerCase().trim();

    tableRows.forEach(row => {
      const rowText = row.textContent.toLowerCase();

      if (rowText.includes(keyword)) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  }

  // Klik tombol search
  btnSearch?.addEventListener("click", filterTable);

  // Enter & ESC
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      filterTable();
    }

    if (e.key === "Escape") {
      searchInput.value = "";
      filterTable();
      searchInput.blur();
    }
  });

  // Realtime search (direkomendasikan)
  searchInput.addEventListener("input", filterTable);

});
