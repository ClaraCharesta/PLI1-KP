/* ambil No.Ref dari URL */
const params = new URLSearchParams(window.location.search);
const noref = params.get("noref") || "0001/SHIFT.PLI1-KCM5/1.2026";

/* tampilkan No.Ref */
document.getElementById("noRefText").textContent = noref;

/* isi semua cell noref */
document.querySelectorAll(".noref-cell").forEach(td => {
  td.textContent = noref;
});

/* tombol ADD */
document.querySelectorAll(".btn-add").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.target;
    window.location.href = `/${target}?noref=${encodeURIComponent(noref)}`;
  });
});

/* tombol HAPUS (dummy) */
document.querySelectorAll(".delete").forEach(btn => {
  btn.addEventListener("click", () => {
    if (confirm("Yakin hapus data ini?")) {
      btn.closest("tr").remove();
    }
  });
});

/* tombol EDIT (dummy) */
document.querySelectorAll(".edit").forEach(btn => {
  btn.addEventListener("click", () => {
    alert("Mode edit (frontend only)");
  });
});
