document.addEventListener("DOMContentLoaded", () => {
  loadData();

  document.getElementById("btnAdd").addEventListener("click", () => {
    window.location.href = "/dataBMCM/add";
  });
});

async function loadData() {
  try {
    const res = await fetch("/dataBMCM/json");
    const data = await res.json();

    const tbody = document.getElementById("dataTableBody");
    tbody.innerHTML = "";

    data.forEach((item, index) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${item.week || "-"}</td>
        <td>${item.tanggal || "-"}</td>
        <td>${item.area || "-"}</td>
        <td>${item.supervisor || "-"}</td>
        <td>${item.executor || "-"}</td>
        <td>${item.activity_category || "-"}</td>
        <td>${item.activities || "-"}</td>
        <td>${item.detail_activities || "-"}</td>
        <td>${item.duration || 0}</td>
        <td>${item.jumlah_personil || 0}</td>
        <td>${item.main_hour || 0}</td>
        <td>${item.status_persen || 0}%</td>
        <td>${item.status || "-"}</td>

        <td>
          ${
            item.foto_safety_talk
              ? `<img src="/uploads/${item.foto_safety_talk}" width="60">`
              : "-"
          }
        </td>

        <td>
          ${
            item.foto_check_sheet
              ? `<img src="/uploads/${item.foto_check_sheet}" width="60">`
              : "-"
          }
        </td>

        <td>${item.keterangan || "-"}</td>
        <td>${item.creator?.nama || "-"}</td>

        <!-- ===== AKSI (FIXED) ===== -->
        <td class="aksi">
          <button class="edit" data-id="${item.pk_id}">Edit</button>
          <button class="delete" data-id="${item.pk_id}">Hapus</button>
        </td>
      `;
      
      tbody.appendChild(tr);
    });

    // Initialize search after data is loaded
    initSearch();
  } catch (err) {
    console.error("Gagal load data:", err);
  }
}

// ================= SEARCH FUNCTION =================
let searchInitialized = false;

function initSearch() {
  if (searchInitialized) return; // Prevent double initialization
  
  const searchInput = document.getElementById("searchInput");
  const btnSearch = document.getElementById("btnSearch");
  const tbody = document.getElementById("dataTableBody");

  if (!searchInput || !tbody) return;

  function performSearch() {
    const keyword = searchInput.value.toLowerCase().trim();
    const rows = tbody.querySelectorAll("tr");

    rows.forEach(row => {
      const text = row.innerText.toLowerCase();
      row.style.display = text.includes(keyword) ? "" : "none";
    });
  }

  // Search on input
  searchInput.addEventListener("input", performSearch);

  // Search on button click
  if (btnSearch) {
    btnSearch.addEventListener("click", performSearch);
  }

  // Search on Enter key
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      performSearch();
    }
  });

  searchInitialized = true;
}


// ================= EVENT TABLE =================
const tbody = document.getElementById("dataTableBody");
const deleteModal = document.getElementById("deleteModal");
const deleteBtn = document.getElementById("deleteBtn");
const keepBtn = document.getElementById("keepBtn");

let deleteId = null;

tbody.addEventListener("click", (e) => {

if (e.target.classList.contains("edit")) {
  const id = e.target.dataset.id;
  window.location.href = `/dataBMCM/edit/${id}`;
}

if (e.target.classList.contains("delete")) {
  deleteId = e.target.dataset.id;
  deleteModal.classList.add("show");
}

});


// ================= DELETE MODAL =================
keepBtn.addEventListener("click", () => {
  deleteId = null;
  deleteModal.classList.remove("show");
});

deleteBtn.addEventListener("click", async () => {
  if (!deleteId) return;

  try {
    const res = await fetch(`/dataBMCM/${deleteId}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Gagal hapus data");

    deleteModal.classList.remove("show");
    deleteId = null;
    loadData(); // refresh table
  } catch (err) {
    console.error("Gagal hapus data:", err);
  }
});