/* ================= HISTORY NOMENCLATURE PAGE ================= */
document.addEventListener("DOMContentLoaded", () => {
  // Page loaded
  console.log("History Nomenclature page loaded");

  /* ================= SEARCH FUNCTIONALITY ================= */
  const searchInput = document.getElementById("searchInput");
  const btnSearch = document.getElementById("btnSearch");
  const tableRows = document.querySelectorAll(".history-table tbody tr");

  if (!searchInput) return;

  function filterTables() {
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
  btnSearch?.addEventListener("click", filterTables);

  // Enter & ESC
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      filterTables();
    }

    if (e.key === "Escape") {
      searchInput.value = "";
      filterTables();
      searchInput.blur();
    }
  });

  // Realtime search
  searchInput.addEventListener("input", filterTables);
});
