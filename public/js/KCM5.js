// =====================
// KCM5.js - Fully Functional + Inline Edit
// =====================

// Ambil elemen penting
const searchInput = document.getElementById('searchInput');
const btnSearch = document.getElementById('btnSearch');
const btnAdd = document.getElementById('btnAdd');
const tbody = document.querySelector('tbody');

// ---------------------
// Fungsi Search
// ---------------------
async function doSearch() {
  const keyword = searchInput.value.trim();
  const area = "KCM5"; // karena halaman ini khusus KCM5

  try {
    const res = await fetch(`/laporan-shift?keyword=${encodeURIComponent(keyword)}&area=${area}`);
    const data = await res.json();

    if (!Array.isArray(data)) throw new Error("Data tidak valid");

    tbody.innerHTML = "";

    if (data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="14" style="text-align:center;">Data belum tersedia</td></tr>`;
    } else {
      data.forEach((row, index) => {
        tbody.innerHTML += `
          <tr class="row-click" data-id="${row.id}" data-ref="${row.no_ref}">
            <td>${index + 1}</td>
            <td>${row.tanggal}</td>
            <td>${row.shift_kode}</td>
            <td>${row.no_ref}</td>
            <td>${row.dibuat_oleh}</td>
            <td>${row.personil_841a || "-"}</td>
            <td>${row.shift_841a || "-"}</td>
            <td>${row.personil_842a || "-"}</td>
            <td>${row.shift_842a || "-"}</td>
            <td>${row.personil_842b || "-"}</td>
            <td>${row.shift_842b || "-"}</td>
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
    }

    attachRowEvents(); // attach event setelah rebuild tabel
  } catch (err) {
    console.error(err);
    alert("Gagal search, ada error server");
  }
}

// Event listener search
btnSearch.addEventListener('click', doSearch);
searchInput.addEventListener('keypress', (e) => {
  if (e.key === "Enter") doSearch();
});

// ---------------------
// Tombol Add
// ---------------------
btnAdd.addEventListener('click', () => {
  window.location.href = "/form-laporan-shift/kcm5";
});

// ---------------------
// Fungsi attach event untuk setiap row
// ---------------------
function attachRowEvents() {
  // INLINE EDIT
  document.querySelectorAll('.btn-edit').forEach(btn => {
    btn.onclick = function(e) {
      e.stopPropagation();
      const row = this.closest('tr');
      const id = row.dataset.id;

      // kolom yang bisa diedit
      const editableCols = [5,6,7,8,9,10,11]; // personil_841a, shift_841a, personil_842a, shift_842a, personil_842b, shift_842b, cuti
      const originalValues = [];

      editableCols.forEach(i => {
        const cell = row.cells[i];
        originalValues.push(cell.innerText);
        cell.innerHTML = `<input type="text" value="${cell.innerText}" style="width:100%">`;
      });

      // ganti tombol Edit/Hapus → Save / Cancel
      const aksiCell = row.cells[row.cells.length - 1];
      aksiCell.innerHTML = `
        <button class="btn-save">Save</button>
        <button class="btn-cancel">Cancel</button>
      `;

      // SAVE
      aksiCell.querySelector(".btn-save").onclick = async function(ev) {
        ev.stopPropagation();
        const inputs = row.querySelectorAll("input");
        const body = {
          personil_841a: inputs[0].value,
          shift_841a: inputs[1].value,
          personil_842a: inputs[2].value,
          shift_842a: inputs[3].value,
          personil_842b: inputs[4].value,
          shift_842b: inputs[5].value,
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

          // update table
          editableCols.forEach((colIndex,i) => {
            row.cells[colIndex].innerText = body[Object.keys(body)[i]];
          });

          // kembalikan tombol Edit/Hapus
          aksiCell.innerHTML = `
            <button class="btn-edit">Edit</button>
            <button class="btn-del">Hapus</button>
          `;
          attachRowEvents();
          alert("Data berhasil diupdate");
        } catch(err) {
          console.error(err);
          alert("Gagal update data");
        }
      };

      // CANCEL
      aksiCell.querySelector(".btn-cancel").onclick = function(ev) {
        ev.stopPropagation();
        editableCols.forEach((colIndex,i) => {
          row.cells[colIndex].innerText = originalValues[i];
        });
        aksiCell.innerHTML = `
          <button class="btn-edit">Edit</button>
          <button class="btn-del">Hapus</button>
        `;
        attachRowEvents();
      };
    };
  });

  // DELETE
  document.querySelectorAll('.btn-del').forEach(btn => {
    btn.onclick = function(e) {
      e.stopPropagation();
      const row = this.closest('tr');
      const id = row.dataset.id;
      if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
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

  // APPROVE checkbox
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

  // ROW CLICK → ke detail laporan
  document.querySelectorAll(".row-click").forEach(row => {
    row.addEventListener("click", (e) => {
      if (e.target.tagName === "BUTTON" || e.target.type === "checkbox") return;
      const ref = row.dataset.ref;
      if (ref) window.location.href = `/laporanKCM5?ref=${ref}`;
    });
  });
}



// ---------------------
// Inisialisasi
// ---------------------
attachRowEvents();
