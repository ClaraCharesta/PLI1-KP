document.addEventListener("DOMContentLoaded", () => {

  // ===== FIX BUTTON ADD =====
  const btnAdd = document.getElementById("btnAdd");
  if (btnAdd) {
    btnAdd.addEventListener("click", () => {
      window.location.href = "/dataBMCMPPI/add";
    });
  }

  const tbody = document.getElementById("tableBody");
  const searchInput = document.getElementById("searchInput");

  fetch("/dataBMCMPPI/data")
    .then(res => {
      if (!res.ok) throw new Error("Fetch gagal");
      return res.json();
    })
    .then(data => {
      tbody.innerHTML = "";

      if (!data.length) {
        tbody.innerHTML = `<tr><td colspan="19">Data kosong</td></tr>`;
        return;
      }

      data.forEach((row, index) => {
        tbody.insertAdjacentHTML("beforeend", `
          <tr>
            <td>${index + 1}</td>
            <td>${row.week || "-"}</td>
            <td>${row.tanggal || "-"}</td>
            <td>${row.area || "-"}</td>
            <td>${row.supervisor || "-"}</td>
            <td>${row.executor || "-"}</td>
            <td>${row.activity_category || "-"}</td>
            <td>${row.activities || "-"}</td>
            <td>${row.detail_activities || "-"}</td>
            <td>${row.duration || 0}</td>
            <td>${row.jumlah_personil || 0}</td>
            <td>${(row.duration || 0) * (row.jumlah_personil || 0)}</td>
            <td>${row.status_persen || 0}%</td>
            <td>${row.status || "-"}</td>
            <td>
              ${row.foto_safety_talk
                ? `<img src="/uploads/${row.foto_safety_talk}" width="40">`
                : "-"}
            </td>
            <td>
              ${row.foto_check_sheet
                ? `<img src="/uploads/${row.foto_check_sheet}" width="40">`
                : "-"}
            </td>
            <td>${row.keterangan || "-"}</td>
            <td>${row.creator?.nama || "-"}</td>
            <td>
              <button class="edit" data-id="${row.id}">Edit</button>
              <button class="delete" data-id="${row.id}">Hapus</button>
            </td>
          </tr>
        `);
      });

      initSearch();
      initEdit();
      initDelete();
    })
    .catch(err => {
      console.error(err);
      tbody.innerHTML = `<tr><td colspan="18" style="color:red">Gagal memuat data</td></tr>`;
    });

  function initSearch() {
    if (!searchInput) return;
    searchInput.addEventListener("input", () => {
      const keyword = searchInput.value.toLowerCase();
      document.querySelectorAll("#tableBody tr").forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(keyword) ? "" : "none";
      });
    });
  }
  
  function initEdit() {
    document.querySelectorAll(".edit").forEach(btn => {
      btn.addEventListener("click", () => {
        window.location.href = `/dataBMCMPPI/edit/${btn.dataset.id}`;
      });
    });
  }

  function initDelete() {
  const modal = document.getElementById("deleteModal");
  const deleteBtn = document.getElementById("deleteBtn");
  const keepBtn = document.getElementById("keepBtn");

  let selectedId = null;

  document.querySelectorAll(".delete").forEach(btn => {
    btn.addEventListener("click", () => {
      selectedId = btn.dataset.id;
      modal.classList.add("show");
    });
  });

  keepBtn.addEventListener("click", () => {
    selectedId = null;
    modal.classList.remove("show");
  });

  deleteBtn.addEventListener("click", () => {
    if (!selectedId) return;

    fetch(`/dataBMCMPPI/${selectedId}`, {
      method: "DELETE"
    })
      .then(res => {
        if (!res.ok) throw new Error("Gagal hapus data");
        return res.json();
      })
      .then(() => {
        location.reload(); // refresh tabel
      })
      .catch(err => {
        alert("Gagal menghapus data");
        console.error(err);
      });
  });
}
});
