document.addEventListener("DOMContentLoaded", () => {

  /* ================= CARD CLICK TO NAVIGATE ================= */

  const cards = document.querySelectorAll(".card");

  cards.forEach(card => {
    card.addEventListener("click", () => {
      const route = card.dataset.route;
      if (route) {
        window.location.href = route;
      }
    });
  });

  /* ================= SEARCH FUNCTIONALITY ================= */

  const btnSearch = document.getElementById("btnSearch");
  const searchInput = document.getElementById("searchInput");

  if (!searchInput) return;

  function filterCards() {
    const keyword = searchInput.value.toLowerCase().trim();

    cards.forEach(card => {
      const titleEl = card.querySelector(".card-title");
      if (!titleEl) return;

      const text = titleEl.textContent.toLowerCase();

      if (text.includes(keyword)) {
        card.style.display = "flex"; // penting untuk grid
      } else {
        card.style.display = "none";
      }
    });
  }

  // Klik tombol Search
  if (btnSearch) {
    btnSearch.addEventListener("click", filterCards);
  }

  // Tekan Enter
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      filterCards();
    }

    // ESC untuk reset
    if (e.key === "Escape") {
      searchInput.value = "";
      filterCards();
      searchInput.blur();
    }
  });

  // (OPSIONAL tapi disarankan) realtime search
  searchInput.addEventListener("input", filterCards);

});
