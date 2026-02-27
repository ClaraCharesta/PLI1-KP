document.addEventListener("DOMContentLoaded", () => {

  /* ================= SEARCH FUNCTIONALITY ================= */

  const searchInput = document.getElementById("searchInput");
  const cards = document.querySelectorAll(".card");

  if (!searchInput || cards.length === 0) {
    console.error("SearchInput atau Card tidak ditemukan");
    return;
  }

  searchInput.addEventListener("input", function () {
    const keyword = this.value.toLowerCase().trim();

    cards.forEach(card => {
      const titleEl = card.querySelector(".card-title");
      if (!titleEl) return;

      const titleText = titleEl.textContent.toLowerCase();

      if (titleText.includes(keyword)) {
        card.style.display = "flex";   // ⬅️ PENTING
        card.classList.add("fade-in");
      } else {
        card.style.display = "none";
        card.classList.remove("fade-in");
      }
    });
  });

  // ESC untuk reset
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      searchInput.value = "";
      searchInput.dispatchEvent(new Event("input"));
      searchInput.blur();
    }
  });

  /* ================= CARD NAVIGATION ================= */

  cards.forEach(card => {

    card.addEventListener("click", () => {
      const route = card.dataset.route;
      if (route) {
        window.location.href = route;
      }
    });

    // Akses keyboard
    card.setAttribute("tabindex", "0");

    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        card.click();
      }
    });
  });

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
