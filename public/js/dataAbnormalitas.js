document.addEventListener("DOMContentLoaded", () => {
    loadData();
    
    // Add button handler
    const btnAdd = document.getElementById("btnAdd");
    if (btnAdd) {
        btnAdd.addEventListener("click", () => {
            window.location.href = "/dataAbnormalitas/add";
        });
    }

    // Initialize search for server-side rendered data
    initSearch();
});

async function loadData() {
    try {
        const res = await fetch("/dataAbnormalitas/api"); // Pastikan path ini benar
        const data = await res.json();
        const tbody = document.querySelector(".table tbody");
        tbody.innerHTML = "";

        data.forEach((item, index) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.status || "-"}</td>
                <td>${item.week_number || "-"}</td>
                <td>${item.abnormal_date || "-"}</td>
                <td>${item.report_by || "-"}</td>
                <td>${item.area || "-"}</td>
                <td>${item.nomenclature || "-"}</td>
                <td>${item.activity || "-"}</td>
                <td>${item.prioritas || "-"}</td>
                <td>${item.condition || "-"}</td>
                <td>${item.action || "-"}</td>
                <td>${item.abnormal || "-"}</td>
                <td>${item.source || "-"}</td>
                <td>${item.detail_info || "-"}</td>
                <td>${item.rencana_perbaikan || "-"}</td>
                <td>${item.notifikasi_unit || "-"}</td>
                <td>${item.id_mso || "-"}</td>
                <td>
                    ${item.foto_sebelum ? `<img src="/uploads/${item.foto_sebelum}" class="img-thumb">` : "-"}
                </td>
                <td>
                    ${item.foto_sesudah ? `<img src="/uploads/${item.foto_sesudah}" class="img-thumb">` : "-"}
                </td>
                <td class="aksi">
                    <button class="edit" data-id="${item.abnormal_id}">Edit</button>
                    <button class="delete" data-id="${item.abnormal_id}">Hapus</button>
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
    const tbody = document.querySelector(".table tbody");

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

// EVENT LISTENER TABLE
const deleteModal = document.getElementById("deleteModal");
const deleteBtn = document.getElementById("deleteBtn");
const keepBtn = document.getElementById("keepBtn");
let deleteId = null;

// Use event delegation on the table wrapper to handle dynamically added rows
const tableWrapper = document.querySelector(".table-wrapper");
if (tableWrapper) {
    tableWrapper.addEventListener("click", (e) => {
        if (e.target.classList.contains("edit")) {
            const id = e.target.dataset.id;
            window.location.href = `/dataAbnormalitas/edit/${id}`;
        }
        if (e.target.classList.contains("delete")) {
            deleteId = e.target.dataset.id;
            if (deleteModal) deleteModal.classList.add("show");
        }
    });
}

if (deleteBtn) {
    deleteBtn.addEventListener("click", async () => {
        if (!deleteId) return;
        
        try {
            const res = await fetch(`/dataAbnormalitas/${deleteId}`, {
                method: "DELETE"
            });
            
            if (!res.ok) throw new Error("Gagal hapus data");
            
            if (deleteModal) deleteModal.classList.remove("show");
            deleteId = null;
            loadData(); // refresh table
        } catch (err) {
            console.error("Gagal hapus data:", err);
            alert("Gagal menghapus data");
        }
    });
}

if (keepBtn) {
    keepBtn.addEventListener("click", () => {
        deleteId = null;
        if (deleteModal) deleteModal.classList.remove("show");
    });
}