document.addEventListener("DOMContentLoaded", () => {

  // -----------------------------
  // ENUM / NOMENCLATURE
  // -----------------------------
  const enumRute = {
    "Rute 1": "R001",
    "Rute 2": "R002",
    "Lainnya": "OTR"
  };

  const enumArea = {
    "5A1": "A1",
    "5C1": "C1",
    "5K1": "K1",
    "5R": "R",
    "5R1": "R1",
    "5R2": "R2",
    "5U1": "U1",
    "5W": "W",
    "5W1": "W1",
    "5Z": "Z",
    "5Z1": "Z1",
    "5Z2": "Z2",
    "KCM 5": "KCM5",
    "RM FM 5": "RM5",
    "PPI": "PPI"
  };

  const enumStatus = {
    "Terlaksana Semua": "TS",
    "Terlaksana Sebagian": "TSB",
    "Tidak Terlaksana": "TT"
  };

  // -----------------------------
  // Rute Lainnya show/hide
  // -----------------------------
  const ruteSelect = document.getElementById('ruteBM');
  const ruteLainnya = document.getElementById('ruteLainnya');

  ruteSelect.onchange = () => {
    ruteLainnya.hidden = ruteSelect.value !== "Lainnya";
  };

  // -----------------------------
  // Hitung DURASI otomatis
  // -----------------------------
  function hitungDurasi() {
    const mulai = document.getElementById('mulai').value;
    const selesai = document.getElementById('selesai').value;

    if (!mulai || !selesai) return;

    const t1 = new Date(`1970-01-01T${mulai}`);
    const t2 = new Date(`1970-01-01T${selesai}`);
    const diffJam = ((t2 - t1) / 3600000).toFixed(2);

    document.getElementById('durasi').value = diffJam;
  }

  document.getElementById('mulai').addEventListener('change', hitungDurasi);
  document.getElementById('selesai').addEventListener('change', hitungDurasi);

  // -----------------------------
  // SUBMIT via fetch / AJAX
  // -----------------------------
  const form = document.querySelector('.form-card');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const payload = {
      no_ref: form.no_ref.value,
      rute: ruteSelect.value === "Lainnya" ? ruteLainnya.value : enumRute[ruteSelect.value],
      tanggal: form.tanggal.value,
      mulai: form.mulai.value,
      selesai: form.selesai.value,
      durasi: form.durasi.value,
      area: enumArea[form.area.value],
      status: enumStatus[form.status.value],
      kendala: form.kendala.value
    };

    try {
      const res = await fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Gagal simpan maintenance");

      // Redirect ke detail page
      window.location.href = `/laporan-shift/kcm5/detail?noref=${payload.no_ref}`;
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  });

  // -----------------------------
  // Tombol Back
  // -----------------------------
  document.querySelector('.back').onclick = () => {
    window.location.href = "/laporan-shift/kcm5";
  };
});
