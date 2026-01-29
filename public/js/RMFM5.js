// =====================
// RMFM5.js - Fully Functional
// =====================

document.addEventListener("DOMContentLoaded", () => {

  const searchInput = document.getElementById('searchInput');
  const btnSearch = document.getElementById('btnSearch');
  const btnAdd = document.getElementById('btnAdd');
  const tbody = document.querySelector('tbody');

  // ======================
  // Fetch data dari backend
  // ======================
  async function fetchData(keyword = "") {
    try {
      const res = await fetch(`/laporan-shift?keyword=${encodeURIComponent(keyword)}&area=RMFM5`);
      const data = await res.json();

      tbody.innerHTML = "";

      if (!Array.isArray(data) || data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="14" style="text-align:center;">Data belum tersedia</td></tr>`;
        return;
      }

      data.forEach((row, index) => {
        tbody.innerHTML += `
          <tr class="row-click" data-id="${row.id}" data-ref="${row.no_ref}">
            <td>${index + 1}</td>
            <td>${row.tanggal}</td>
            <td>${row.shift_kode}</td>
            <td>${row.no_ref}</td>
            <td>${row.dibuat_oleh}</td>
            <td>${row.personil_851a || "-"}</td>
            <td>${row.shift_851a || "-"}</td>
            <td>${row.personil_852a || "-"}</td>
            <td>${row.shift_852a || "-"}</td>
            <td>${row.personil_852b || "-"}</td>
            <td>${row.shift_852b || "-"}</td>
            <td>${row.cuti || "-"}</td>
            <td class="verifikasi">
              <input type="checkbox" class="chk-approve" data-id="${row.id}" ${row.is_approved ? "checked disabled" : ""}>
              <span class="status-text" style="${row.is_approved ? "color:green;font-weight:bold;" : ""}">
                ${row.is_approved ? "Approved" : "Belum di-approve"}
              </span>
            </td>
            <td>
              <button class="btn-edit">Edit</button>
              <button class="btn-del">Hapus</button>
            </td>
          </tr>
        `;
      });

      attachRowEvents(); // attach semua tombol
    } catch (err) {
      console.error(err);
      alert("Gagal mengambil data dari server");
    }
  }

  // ======================
  // SEARCH
  // ======================
  btnSearch.addEventListener('click', () => fetchData(searchInput.value.trim()));
  searchInput.addEventListener('keypress', e => {
    if (e.key === "Enter") fetchData(searchInput.value.trim());
  });

  // ======================
  // ADD
  // ======================
  btnAdd.addEventListener('click', () => {
    window.location.href = "/form-laporan-shift/rmfm5";
  });

  // ======================
  // Attach tombol Edit / Delete / Approve
  // ======================
  function attachRowEvents() {
    // EDIT
    document.querySelectorAll('.btn-edit').forEach(btn => {
      btn.onclick = function(e) {
        e.stopPropagation();
        const id = this.closest('tr').dataset.id;
        window.location.href = `/form-laporan-shift/${id}`;
      };
    });

    // DELETE
    document.querySelectorAll('.btn-del').forEach(btn => {
      btn.onclick = function(e) {
        e.stopPropagation();
        const row = this.closest('tr');
        const id = row.dataset.id;
        if (confirm("Apakah anda yakin ingin menghapus data ini?")) {
          fetch(`/laporan-shift/${id}`, { method: "DELETE" })
            .then(res => res.json())
            .then(res => {
              alert(res.message);
              row.remove();
            })
            .catch(err => {
              console.error(err);
              alert("Gagal menghapus data");
            });
        }
      };
    });

    // APPROVE
    document.querySelectorAll('.chk-approve').forEach(chk => {
      chk.addEventListener('change', function() {
        const id = this.dataset.id;
        fetch(`/laporan-shift/approve/${id}`, { method: "POST" })
          .then(res => res.json())
          .then(res => {
            alert(res.message);
            this.disabled = true;
            const statusText = this.nextElementSibling;
            statusText.innerText = "Approved";
            statusText.style.color = "green";
            statusText.style.fontWeight = "bold";
          })
          .catch(err => {
            console.error(err);
            alert("Gagal approve");
            this.checked = false;
          });
      });
    });

    // CLICK ROW → detail
    document.querySelectorAll('.row-click').forEach(row => {
      row.addEventListener('click', e => {
        if (e.target.tagName === "BUTTON" || e.target.type === "checkbox") return;
        const ref = row.dataset.ref;
        if (ref) window.location.href = `/laporanRMFM5?ref=${ref}`;
      });
    });
  }

  // ======================
  // INITIAL LOAD
  // ======================
  fetchData(); // ambil semua data RMFM5 saat halaman load

});

// Fungsi untuk enable inline edit
function enableInlineEdit(row) {
  const editableCols = [
    "personil_851a", "shift_851a",
    "personil_852a", "shift_852a",
    "personil_852b", "shift_852b",
    "cuti"
  ];

  editableCols.forEach((colName, i) => {
    const cellIndex = 5 + i; // kolom di table, sesuai urutan
    const cell = row.cells[cellIndex];
    const value = cell.innerText;
    cell.innerHTML = `<input type="text" value="${value}" style="width:100%"/>`;
  });

  // Ganti tombol Edit → Save + Cancel
  const aksiCell = row.cells[row.cells.length - 1];
  aksiCell.innerHTML = `
    <button class="btn-save">Save</button>
    <button class="btn-cancel">Cancel</button>
  `;

  // Save event
  aksiCell.querySelector(".btn-save").onclick = async function(e) {
    e.stopPropagation();
    const id = row.dataset.id;

    const inputs = row.querySelectorAll("input");
    const body = {
      personil_851a: inputs[0].value,
      shift_851a: inputs[1].value,
      personil_852a: inputs[2].value,
      shift_852a: inputs[3].value,
      personil_852b: inputs[4].value,
      shift_852b: inputs[5].value,
      cuti: inputs[6].value
    };

    try {
      const res = await fetch(`/laporan-shift/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (!data) throw new Error("Gagal update");

      // update table cells
      editableCols.forEach((colName, i) => {
        row.cells[5 + i].innerText = body[colName];
      });

      // Kembalikan tombol Edit/Hapus
      aksiCell.innerHTML = `
        <button class="btn-edit">Edit</button>
        <button class="btn-del">Hapus</button>
      `;
      attachRowEvents(); // attach ulang tombol

      alert("Data berhasil diupdate");
    } catch (err) {
      console.error(err);
      alert("Gagal update data");
    }
  };

  // Cancel event
  aksiCell.querySelector(".btn-cancel").onclick = function(e) {
    e.stopPropagation();
    // restore original values
    editableCols.forEach((colName, i) => {
      const cell = row.cells[5 + i];
      const originalValue = cell.querySelector("input").defaultValue;
      cell.innerText = originalValue;
    });
    // kembalikan tombol Edit/Hapus
    aksiCell.innerHTML = `
      <button class="btn-edit">Edit</button>
      <button class="btn-del">Hapus</button>
    `;
    attachRowEvents();
  };
}

// override tombol Edit
document.querySelectorAll(".btn-edit").forEach(btn => {
  btn.onclick = function(e) {
    e.stopPropagation();
    const row = this.closest("tr");
    enableInlineEdit(row);
  };
});

