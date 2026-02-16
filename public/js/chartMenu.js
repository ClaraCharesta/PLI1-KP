document.addEventListener("DOMContentLoaded", () => {

  const searchInput = document.getElementById("searchInput");
  const cards = document.querySelectorAll(".chart-card");

  if (!searchInput || cards.length === 0) {
    return;
  }

  searchInput.addEventListener("input", function () {
    const keyword = this.value.toLowerCase().trim();

    cards.forEach(card => {
      const titleEl = card.querySelector(".chart-card-title");
      if (!titleEl) return;

      const titleText = titleEl.textContent.toLowerCase();

      if (titleText.includes(keyword)) {
        card.style.display = "flex";
        card.classList.add("fade-in");
      } else {
        card.style.display = "none";
        card.classList.remove("fade-in");
      }
    });
  });

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      searchInput.value = "";
      searchInput.dispatchEvent(new Event("input"));
      searchInput.blur();
    }
  });

  cards.forEach(card => {
    card.addEventListener("click", () => {
      const route = card.dataset.route;
      if (route) {
        window.location.href = route;
      }
    });

    card.setAttribute("tabindex", "0");

    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        card.click();
      }
    });
  });

});
