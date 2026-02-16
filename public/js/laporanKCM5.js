// ================= NO REF =================
const noRef = window.NO_REF || "-";

const noRefText = document.getElementById("noRefText");
if (noRefText) {
  noRefText.textContent = noRef;
}

// ================= UNIVERSAL CLICK HANDLER =================
document.addEventListener("click", async (e) => {
  const target = e.target;

  // ================= EDIT =================
  if (target.classList.contains("edit")) {
    const id = target.dataset.id;
    const tableId = target.closest("table")?.id;

    let route = "";

    switch (tableId) {
      case "tsTable":
        route = `/laporan-shift/kcm5/troubleshooting/${id}/edit`;
        break;

      case "maintenanceKCM5":
        route = `/laporan-shift/kcm5/maintenance/${id}/edit`;
        break;

      case "sttKCM5":
        route = `/laporan-shift/kcm5/stt/${id}/edit`;
        break;

      case "catatanKCM5":
        route = `/laporan-shift/kcm5/catatan/${id}/edit`;
        break;

      case "pcKCM5":
        route = `/laporan-shift/kcm5/monitoring/${id}/edit`;
        break;

      default:
        alert("Route edit tidak ditemukan");
        return;
    }

    window.location.href = route;
    return;
  }

  // ================= DELETE =================
  if (target.classList.contains("delete")) {
    const id = target.dataset.id;
    const type = target.dataset.type;

    if (!id || !type) {
      alert("Data tidak valid");
      return;
    }

    const confirmDelete = confirm("Yakin mau hapus data ini?");
    if (!confirmDelete) return;

    // loading state
    target.disabled = true;
    const oldText = target.innerText;
    target.innerText = "Deleting...";

    try {
      const res = await fetch(
        `/laporan-shift/kcm5/delete/${type}/${id}?noref=${noRef}`,
        {
          method: "DELETE"
        }
      );

      const data = await res.json();

      if (data.success) {
        // hapus row tanpa reload
        const row = target.closest("tr");
        if (row) row.remove();

        alert("Data berhasil dihapus");
      } else {
        alert(data.message || "Gagal hapus data");

        target.disabled = false;
        target.innerText = oldText;
      }

    } catch (err) {
      console.error(err);

      alert("Server error");

      target.disabled = false;
      target.innerText = oldText;
    }

    return;
  }
});

// ================= PDF GENERATOR =================
const btnPdf = document.getElementById("btnPdf");

if (btnPdf) {
  btnPdf.addEventListener("click", () => {
    const content = document.querySelector(".content");

    if (!content) {
      alert("Konten tidak ditemukan");
      return;
    }

    html2pdf()
      .set({
        margin: 0.3,
        filename: `Laporan_${noRef.replaceAll("/", "_")}.pdf`,
        image: { type: "jpeg", quality: 0.95 },
        html2canvas: { scale: 2 },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "landscape"
        }
      })
      .from(content)
      .save();
  });
}
