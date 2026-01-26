document.addEventListener("DOMContentLoaded", () => {

  /* ================= SEARCH ================= */
  const searchInput = document.getElementById("searchInput");
  const tableRows = document.querySelectorAll("table tbody tr");

  if (searchInput && tableRows.length > 0) {
    const doSearch = () => {
      const keyword = searchInput.value.toLowerCase().trim();

      tableRows.forEach(row => {
        const rowText = row.innerText.toLowerCase();
        row.style.display = rowText.includes(keyword) ? "" : "none";
      });
    };

    searchInput.addEventListener("input", doSearch);

    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        searchInput.value = "";
        doSearch();
        searchInput.blur();
      }
    });
  }

  /* ================= ADD BUTTON ================= */
  const btnAdd = document.getElementById("btnAdd");
  if (btnAdd) {
    btnAdd.addEventListener("click", () => {
      window.location.href = "/formDataBMCM";
    });
  }

  /* ================= EDIT BUTTON ================= */
  document.querySelectorAll(".edit").forEach((btn, index) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation(); // cegah konflik event lain
      const rowId = index + 1; // simulasi ID
      window.location.href = `/updateDataBMCM?id=${rowId}`;
    });
  });

  /* ================= DELETE MODAL ================= */
  const modal = document.getElementById("deleteModal");
  const deleteBtn = document.getElementById("deleteBtn");
  const keepBtn = document.getElementById("keepBtn");

  let rowToDelete = null;

  document.querySelectorAll(".delete").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      rowToDelete = btn.closest("tr");
      modal.classList.add("show");
    });
  });

  // Konfirmasi delete
  deleteBtn.addEventListener("click", () => {
    if (rowToDelete) {
      rowToDelete.remove();
      rowToDelete = null;
    }
    modal.classList.remove("show");
  });

  // Batal delete
  keepBtn.addEventListener("click", () => {
    rowToDelete = null;
    modal.classList.remove("show");
  });

  // Klik backdrop
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      rowToDelete = null;
      modal.classList.remove("show");
    }
  });

});
