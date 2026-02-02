const searchInput = document.getElementById("searchInput");
const btnSearch = document.getElementById("btnSearch");
const btnAdd = document.getElementById("btnAdd");
const tbody = document.getElementById("tbodyData");

async function loadData(keyword="") {
  const res = await fetch(`/laporan-shift/kcm5/json?keyword=${keyword}`);
  const data = await res.json();

  tbody.innerHTML = "";
  if(data.length === 0){
    tbody.innerHTML = `<tr><td colspan="14" style="text-align:center;">Data belum tersedia</td></tr>`;
    return;
  }

  // Gunakan map + join untuk efisiensi + format tanggal
  tbody.innerHTML = data.map((row, index) => {
    const tgl = row.tanggal ? new Date(row.tanggal).toISOString().split("T")[0] : "-";
    return `
      <tr data-id="${row.id}">
        <td>${index+1}</td>
        <td>${tgl}</td>
        <td>${row.shift_kode}</td>
        <td>${row.no_ref}</td>
        <td>${row.dibuat_oleh}</td>
        <td>${row.personil_841a||"-"}</td>
        <td>${row.shift_841a||"-"}</td>
        <td>${row.personil_842a||"-"}</td>
        <td>${row.shift_842a||"-"}</td>
        <td>${row.personil_842b||"-"}</td>
        <td>${row.shift_842b||"-"}</td>
        <td>${row.cuti||"-"}</td>
        <td>
          <input type="checkbox" class="chk-approve" data-id="${row.id}" ${row.is_approved?"checked disabled":""}>
          <span>${row.is_approved?"Approved":"Belum di-approve"}</span>
        </td>
        <td>
          <button class="btn-edit">Edit</button>
          <button class="btn-del">Hapus</button>
        </td>
      </tr>
    `;
  }).join('');
}


// INIT
loadData();

// SEARCH
btnSearch.onclick = ()=> loadData(searchInput.value);

// ADD
btnAdd.onclick = ()=> window.location.href="/laporan-shift/kcm5/add";

// DELETE & EDIT & APPROVE (delegate)
tbody.addEventListener("click", async (e)=>{
  const tr = e.target.closest("tr");
  if(!tr) return;
  const id = tr.dataset.id;

  // DELETE
  if(e.target.classList.contains("btn-del")){
    if(!confirm("Hapus data?")) return;
    await fetch(`/laporan-shift/kcm5/${id}`, { method:"DELETE" });
    loadData(searchInput.value);
  }

  // EDIT
  if(e.target.classList.contains("btn-edit")){
    window.location.href=`/laporan-shift/kcm5/edit/${id}`;
  }

  // APPROVE
  if(e.target.classList.contains("chk-approve")){
    await fetch(`/laporan-shift/kcm5/approve/${id}`, { method:"POST" });
    loadData(searchInput.value);
  }
});
