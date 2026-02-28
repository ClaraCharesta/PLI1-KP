/* ================= LOGOUT HANDLER ================= */
const modal = document.getElementById("logoutModal");
const logoutBtn = document.getElementById("logoutBtn");
const stayBtn = document.getElementById("stayBtn");

// Logout button - redirect to /logout route to destroy session
logoutBtn.addEventListener("click", () => {
  window.location.href = "/logout";
});

// Stay button
stayBtn.addEventListener("click", () => {
  // Redirect ke halaman home
  window.location.href = "/home";
});

// Close modal saat click backdrop
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    window.location.href = "/home";
  }
});

// Prevent user dari menutup dengan ESC key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    e.preventDefault();
  }
});
