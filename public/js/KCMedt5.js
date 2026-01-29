// =====================
// KCMedt5.js - Edit via Form Bawah Tabel
// =====================

// Ambil elemen penting
const searchInput = document.getElementById('searchInput');
const btnSearch = document.getElementById('btnSearch');
const btnAdd = document.getElementById('btnAdd');
const tbody = document.querySelector('tbody');

// Form Edit
const editFormCard = document.getElementById('editFormCard');
const editTanggal = document.getElementById('editTanggal');
const editShiftUtama = document.getElementById('editShiftUtama');
const editNoRef = document.getElementById('editNoRef');
const editDibuatOleh = document.getElementById('editDibuatOleh');
const editPersonilContainer = document.getElementById('editPersonilContainer');
const btnCancelEdit = document.getElementById('btnCancelEdit');
const btnSaveEdit = document.getElementById('btnSaveEdit');

// Map shift
const shiftMap = {
  "01": "07:00-15:00",
  "02": "15:00-22:00",
  "03": "22:00-07:00",
  "A": "07:00-19:00",
  "B": "19:00-07:00",
  "LIBUR": "LIBUR"
};

// ---------------------
// Fungsi Search
// ---------------------
async function doSearch() {
  const keyword = searchInput.value.trim();
  const area = "KCM5";

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

    attachRowEvents();
  } catch (err) {
    console.error(err);
    alert("Gagal search, ada error server");
  }
}

// Event Search
btnSearch.addEventListener('click', doSearch);
searchInput.addEventListener('keypress', (e) => {
  if (e.key === "Enter") doSearch();
});

// Tombol Add
btnAdd.addEventListener('click', () => {
  window.location.href = "/form-laporan-shift/kcm5";
});

// ---------------------
// Attach Events
// ---------------------
function attachRowEvents() {
  // EDIT → buka form bawah tabel
  document.querySelectorAll('.btn-edit').forEach(btn => {
    btn.onclick = function(e) {
      e.stopPropagation();
      const row = this.closest('tr');

      const rowData = {
        id: row.dataset.id,
        tanggal: row.cells[1].innerText,
        shift_kode: row.cells[2].innerText,
        no_ref: row.cells[3].innerText,
        dibuat_oleh: row.cells[4].innerText,
        personil_841a: row.cells[5].innerText,
        shift_841a: row.cells[6].innerText,
        personil_842a: row.cells[7].innerText,
        shift_842a: row.cells[8].innerText,
        personil_842b: row.cells[9].innerText,
        shift_842b: row.cells[10].innerText,
        cuti: row.cells[11].innerText
      };

      openEditForm(rowData);
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
}

// ---------------------
// Form Bawah Tabel
// ---------------------
function populateShiftDropdown(selectEl, selected) {
  selectEl.innerHTML = '<option value="">-- Pilih Shift --</option>';
  for (const code in shiftMap) {
    const opt = document.createElement('option');
    opt.value = code;
    opt.textContent = `${code} (${shiftMap[code]})`;
    if (selected && selected === code) opt.selected = true;
    selectEl.appendChild(opt);
  }
}

function openEditForm(rowData) {
  editFormCard.style.display = "block";
  editFormCard.dataset.id = rowData.id;

  editTanggal.value = rowData.tanggal;
  editNoRef.value = rowData.no_ref;
  editDibuatOleh.value = rowData.dibuat_oleh;
  populateShiftDropdown(editShiftUtama, rowData.shift_kode);

  // Personil
  const personils = ['841a','842a','842b'];
  editPersonilContainer.innerHTML = '';

  personils.forEach(p => {
    const personValue = rowData[`personil_${p}`] || '';
    const shiftValue = rowData[`shift_${p}`] || '';

    const wrapper = document.createElement('div');
    wrapper.classList.add('form-group');

    wrapper.innerHTML = `
      <label>Personil (${p.toUpperCase()})</label>
      <input type="text" class="editPersonil" data-key="${p}" value="${personValue}">
      <label>Shift (${p.toUpperCase()})</label>
      <select class="editShift" data-key="${p}"></select>
    `;

    editPersonilContainer.appendChild(wrapper);
    const selectShift = wrapper.querySelector('.editShift');
    populateShiftDropdown(selectShift, shiftValue);
  });
}

// Cancel Edit
btnCancelEdit.onclick = () => {
  editFormCard.style.display = "none";
};

// Save Edit
btnSaveEdit.onclick = async () => {
  const id = editFormCard.dataset.id;
  const payload = {
    tanggal: editTanggal.value,
    shift_kode: editShiftUtama.value
  };

  document.querySelectorAll('.editPersonil').forEach(input => {
    payload[`personil_${input.dataset.key}`] = input.value;
  });

  document.querySelectorAll('.editShift').forEach(select => {
    payload[`shift_${select.dataset.key}`] = select.value;
  });

  try {
    const res = await fetch(`/laporan-shift/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await res.json();
    alert("Data berhasil diupdate");
    editFormCard.style.display = "none";
    doSearch(); // refresh tabel
  } catch (err) {
    console.error(err);
    alert("Gagal update data");
  }
};

// ---------------------
// Inisialisasi
// ---------------------
doSearch(); // tampilkan data awal
attachRowEvents();
