// RMFM5.js
const searchInput = document.getElementById("searchInput");
const btnSearch = document.getElementById("btnSearch");
const btnAdd = document.getElementById("btnAdd");
const tbody = document.getElementById("tbodyData");

// ================= LOAD DATA =================
async function loadData(keyword = "") {
  try {
    const res = await fetch(`/laporan-shift/rmfm5/json?keyword=${encodeURIComponent(keyword)}`);
    const data = await res.json();

    tbody.innerHTML = "";

    if (!data || data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="15" style="text-align:center;">Data belum tersedia</td></tr>`;
      return;
    }

data.forEach((row, index) => {
  tbody.innerHTML += `
    <tr data-id="${row.id}" data-noref="${row.no_ref}">
      <td>${index + 1}</td>
      <td>${row.tanggal}</td>
      <td>${row.shift_kode}</td>
      <td>${row.no_ref}</td>
      <td>${row.dibuat_oleh}</td>
      <td>${row.personil_851a || "-"}</td>
      <td>${row.shift_851a || "-"}</td>
      <td>${row.personil_851b || "-"}</td>  <!-- HARUS ADA -->
      <td>${row.shift_851b || "-"}</td>      <!-- HARUS ADA -->
      <td>${row.personil_852a || "-"}</td>
      <td>${row.shift_852a || "-"}</td>
      <td>${row.personil_852b || "-"}</td>
      <td>${row.shift_852b || "-"}</td>
      <td>${row.cuti || "-"}</td>
      <td>
        <input type="checkbox" class="chk-approve" data-id="${row.id}" ${row.is_approved ? "checked disabled" : ""}>
        <span>${row.is_approved ? "Approved" : "Belum di-approve"}</span>
      </td>
      <td>
        <button class="btn-edit">Edit</button>
        <button class="btn-del">Hapus</button>
      </td>
    </tr>
  `;
    });
  } catch (err) {
    console.error(err);
    tbody.innerHTML = `<tr><td colspan="15" style="text-align:center;">Gagal memuat data</td></tr>`;
  }
}

// ================= INIT =================
loadData();

// ================= SEARCH =================
btnSearch.addEventListener("click", () => loadData(searchInput.value));
searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") loadData(searchInput.value);
});

// ================= ADD =================
btnAdd.addEventListener("click", () => {
  window.location.href = "/laporan-shift/rmfm5/add";
});

// ================= EVENT DELEGATE =================
tbody.addEventListener("click", async (e) => {
  const tr = e.target.closest("tr");
  if (!tr) return;
  const id = tr.dataset.id;

  // ================= BUTTON ACTIONS =================
  // DELETE
  if (e.target.classList.contains("btn-del")) {
    if (!confirm("Hapus data?")) return;
    try {
      await fetch(`/laporan-shift/rmfm5/${id}`, { method: "DELETE" });
      loadData(searchInput.value);
    } catch (err) {
      alert("Gagal menghapus data");
      console.error(err);
    }
    return;
  }

  // EDIT
  if (e.target.classList.contains("btn-edit")) {
    window.location.href = `/laporan-shift/rmfm5/edit/${id}`;
    return;
  }

  // APPROVE
  if (e.target.classList.contains("chk-approve")) {
    try {
      await fetch(`/laporan-shift/rmfm5/approve/${id}`, { method: "POST" });
      loadData(searchInput.value);
    } catch (err) {
      alert("Gagal approve data");
      console.error(err);
    }
    return;
  }

  // ================= OPEN DETAIL =================
  // Klik row selain tombol
  if (!["BUTTON", "INPUT"].includes(e.target.tagName)) {
    const noRef = tr.dataset.noref;
    if (noRef) {
      window.location.href = `/laporan-shift/rmfm5/detail?noref=${encodeURIComponent(noRef)}`;
    }
  }
});