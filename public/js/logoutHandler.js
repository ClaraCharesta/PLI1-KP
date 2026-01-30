/* ================= LOGOUT MODAL HANDLER ================= */
function createLogoutModal() {
  const modal = document.createElement("div");
  modal.id = "logoutModal";
  modal.className = "modal show";
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-icon">👋</div>
      <h2>Konfirmasi Logout</h2>
      <p>Apakah anda yakin ingin keluar dari aplikasi?</p>
      <div class="modal-buttons">
        <button id="logoutBtn" class="btn-logout">Logout</button>
        <button id="stayBtn" class="btn-stay">Stay</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  return modal;
}

// Add CSS styles for logout modal
function addLogoutStyles() {
  if (document.getElementById("logoutStyles")) return;
  
  const style = document.createElement("style");
  style.id = "logoutStyles";
  style.textContent = `
    .modal {
      display: none;
      position: fixed;
      z-index: 1000;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      align-items: center;
      justify-content: center;
    }

    .modal.show {
      display: flex;
    }

    .modal-content {
      background-color: #fff;
      padding: 40px 32px;
      border-radius: 12px;
      text-align: center;
      max-width: 400px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
    }

    .modal-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }

    .modal-content h2 {
      font-size: 20px;
      font-weight: 600;
      color: #333;
      margin: 0 0 8px 0;
    }

    .modal-content p {
      font-size: 14px;
      color: #666;
      margin: 0 0 24px 0;
    }

    .modal-buttons {
      display: flex;
      gap: 12px;
      justify-content: center;
    }

    .btn-logout,
    .btn-stay {
      padding: 10px 24px;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.25s ease;
    }

    .btn-logout {
      background-color: #8b0000;
      color: #fff;
      box-shadow: 0 4px 10px rgba(139, 0, 0, 0.35);
    }

    .btn-logout:hover {
      background-color: #a00000;
      box-shadow: 0 6px 14px rgba(139, 0, 0, 0.45);
      transform: translateY(-1px);
    }

    .btn-logout:active {
      transform: scale(0.97);
    }

    .btn-stay {
      background-color: #f0f0f0;
      color: #333;
      border: 1px solid #ddd;
    }

    .btn-stay:hover {
      background-color: #e0e0e0;
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
    }

    .btn-stay:active {
      transform: scale(0.97);
    }

    @media (max-width: 768px) {
      .modal-content {
        max-width: 90%;
        padding: 24px 20px;
      }

      .modal-icon {
        font-size: 40px;
      }

      .modal-content h2 {
        font-size: 18px;
      }

      .modal-content p {
        font-size: 13px;
      }

      .modal-buttons {
        flex-direction: column;
      }

      .btn-logout,
      .btn-stay {
        width: 100%;
      }
    }
  `;
  document.head.appendChild(style);
}

// Initialize logout handler
document.addEventListener("DOMContentLoaded", () => {
  addLogoutStyles();
  
  // Find logout link and prevent default
  const logoutLink = document.querySelector("a[href='/logout']");
  if (logoutLink) {
    logoutLink.addEventListener("click", (e) => {
      e.preventDefault();
      
      // Remove existing modal if any
      const existingModal = document.getElementById("logoutModal");
      if (existingModal) {
        existingModal.remove();
      }
      
      const modal = createLogoutModal();
      const logoutBtn = modal.querySelector("#logoutBtn");
      const stayBtn = modal.querySelector("#stayBtn");
      
      logoutBtn.addEventListener("click", () => {
        // Navigate to /logout route so server destroys session and redirects to login
        window.location.href = "/logout";
      });
      
      stayBtn.addEventListener("click", () => {
        modal.remove();
      });
      
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.remove();
        }
      });
    });
  }
});
