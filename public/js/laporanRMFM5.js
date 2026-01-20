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

// ================= GENERATE PDF =================
const btnPdf = document.getElementById("btnPdf");

if (btnPdf) {
  btnPdf.addEventListener("click", () => {
    const content = document.querySelector(".content");
    const norefText = document.getElementById("noRefText")?.textContent || "laporan";

    const opt = {
      margin: 0.3,
      filename: `Laporan_${norefText.replaceAll("/", "_")}.pdf`,
      image: { type: "jpeg", quality: 0.95 },

      html2canvas: {
        scale: 2,
        useCORS: true
      },

      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "landscape"
      }
    };

    // hitung scaling otomatis
    const pdf = new window.jspdf.jsPDF("landscape", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();

    const contentWidth = content.scrollWidth;
    const scale = pageWidth / contentWidth;

    html2pdf()
      .set(opt)
      .from(content)
      .toPdf()
      .get("pdf")
      .then((pdf) => {
        pdf.internal.scaleFactor = 1 / scale;
      })
      .save();
  });
}
