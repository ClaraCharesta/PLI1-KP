document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("togglePassword");
  const password = document.getElementById("password");

  if (!toggle || !password) return;

  toggle.addEventListener("click", () => {
    if (password.type === "password") {
      password.type = "text";
      toggle.classList.remove("fa-eye");
      toggle.classList.add("fa-eye-slash");
    } else {
      password.type = "password";
      toggle.classList.remove("fa-eye-slash");
      toggle.classList.add("fa-eye");
    }
  });
});

