document.addEventListener("DOMContentLoaded", () => {

  const searchInput = document.getElementById("searchInput");
  if (!searchInput) {
    console.error("searchInput tidak ditemukan");
    return;
  }

  /* =====================================================
     DETECT MODE : CARD atau TABLE
  ===================================================== */

  const cards = document.querySelectorAll(".card");
  const tableRows = document.querySelectorAll("table tbody tr");

  /* =====================================================
     SEARCH FUNCTION
  ===================================================== */

  const doSearch = () => {
    const keyword = searchInput.value.toLowerCase().trim();

    /* ================= CARD MODE ================= */
    if (cards.length > 0) {
      cards.forEach(card => {
        const text = card.innerText.toLowerCase();

        if (text.includes(keyword)) {
          card.style.display = "flex";
          card.classList.add("fade-in");
        } else {
          card.style.display = "none";
          card.classList.remove("fade-in");
        }
      });
      return;
    }

    /* ================= TABLE MODE ================= */
    if (tableRows.length > 0) {
      tableRows.forEach(row => {
        const rowText = row.innerText.toLowerCase();

        if (rowText.includes(keyword)) {
          row.style.display = "";
        } else {
          row.style.display = "none";
        }
      });
      return;
    }

    console.warn("Tidak ada card atau table row untuk di-search");
  };

  /* =====================================================
     EVENT
  ===================================================== */

  searchInput.addEventListener("input", doSearch);

  // ESC reset
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      searchInput.value = "";
      doSearch();
      searchInput.blur();
    }
  });

});
