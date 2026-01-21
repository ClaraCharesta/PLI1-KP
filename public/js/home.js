/* ================= SEARCH FUNCTIONALITY ================= */
const searchInput = document.getElementById("searchInput");
const cards = document.querySelectorAll(".card");

searchInput.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase().trim();

  cards.forEach(card => {
    const cardTitle = card.querySelector(".card-title").textContent.toLowerCase();

    if (cardTitle.includes(searchTerm)) {
      card.style.display = "";
      card.classList.add("fade-in");
    } else {
      card.style.display = "none";
      card.classList.remove("fade-in");
    }
  });
});

// Clear search on ESC key
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

  // Keyboard accessibility
  card.addEventListener("keypress", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      card.click();
    }
  });
});
