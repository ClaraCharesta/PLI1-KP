document.addEventListener("DOMContentLoaded", () => {

  /* ================= ELEMENT ================= */
  const searchInput = document.getElementById("searchInput");
  const btnSearch = document.getElementById("btnSearch");
  const tableRows = document.querySelectorAll(".table tbody tr");

  if (!searchInput || tableRows.length === 0) {
    console.error("Search input atau table row tidak ditemukan");
    return;
  }

  /* ================= SEARCH FUNCTION ================= */
  const doSearch = () => {
    const keyword = searchInput.value.toLowerCase().trim();

    tableRows.forEach(row => {
      const rowText = row.innerText.toLowerCase();

      if (rowText.includes(keyword)) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  };

  /* ================= EVENT ================= */

  // Ketik langsung search
  searchInput.addEventListener("input", doSearch);

  // Klik tombol Search
  btnSearch.addEventListener("click", doSearch);

  // Tekan ENTER di input
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      doSearch();
    }

    // ESC untuk reset
    if (e.key === "Escape") {
      searchInput.value = "";
      doSearch();
      searchInput.blur();
    }
  });

  /* ================= DELETE BUTTON & MODAL ================= */
  const modal = document.getElementById("deleteModal");
  const deleteBtn = document.getElementById("deleteBtn");
  const keepBtn = document.getElementById("keepBtn");
  let rowToDelete = null;

  document.querySelectorAll(".delete").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      rowToDelete = btn.closest("tr");
      modal.classList.add("show");
    });
  });

  deleteBtn.addEventListener("click", () => {
    if (rowToDelete) {
      rowToDelete.remove();
      modal.classList.remove("show");
      rowToDelete = null;
    }
  });

  keepBtn.addEventListener("click", () => {
    modal.classList.remove("show");
    rowToDelete = null;
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("show");
      rowToDelete = null;
    }
  });

  /* ================= EDIT BUTTON ================= */
  document.querySelectorAll(".edit").forEach((btn, index) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const rowId = index + 1;
      window.location.href = `/updateDataAbnormalitas?id=${rowId}`;
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

});
