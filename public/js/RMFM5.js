document.addEventListener("DOMContentLoaded", () => {

  // ===== KLIK ROW KE HALAMAN LAPORAN =====
  document.querySelectorAll(".row-click").forEach(row => {
    row.addEventListener("click", (e) => {
      // kalau klik tombol, jangan ikut pindah halaman
      if (e.target.tagName === "BUTTON") return;

      const ref = row.dataset.ref;
      if (ref) {
        window.location.href = `/laporanRMFM5?ref=${ref}`;
      }
    });
  });

  // ===== BUTTON ADD =====
  const btnAdd = document.getElementById("btnAdd");
  if (btnAdd) {
    btnAdd.addEventListener("click", () => {
      window.location.href = "/laporanShiftRMFM5";
    });
  }

  // ===== BUTTON SEARCH =====
// ===== BUTTON SEARCH =====
const btnSearch = document.getElementById("btnSearch");
const searchInput = document.getElementById("searchInput");

if (btnSearch && searchInput) {
  btnSearch.addEventListener("click", () => {
    const keyword = searchInput.value.toLowerCase();

    document.querySelectorAll("tbody tr").forEach(row => {
      const noRef = row.cells[3].innerText.toLowerCase(); // kolom No.Ref
      row.style.display = noRef.includes(keyword) ? "" : "none";
    });
  });
}



  // ===== BUTTON EDIT =====
  document.querySelectorAll(".btn-edit").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation(); // biar ga ikut klik row
      alert("Mode edit (frontend dulu)");
    });
  });

  // ===== BUTTON HAPUS =====
  document.querySelectorAll(".btn-del").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation(); // biar ga ikut klik row
      if (confirm("Yakin hapus data ini?")) {
        btn.closest("tr").remove();
      }
    });
  });

});
