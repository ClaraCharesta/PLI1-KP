document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");

  if (btn && sidebar) {
    btn.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });
  }

  // auto close sidebar di mobile setelah klik menu
  document.querySelectorAll(".sidebar .menu li a").forEach(link => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        sidebar.classList.remove("open");
      }
    });
  });
});
