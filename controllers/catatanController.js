const db = require("../models");
const Catatan = db.Catatan;


// ======================================
// STORE CATATAN (TS STYLE)
// ======================================
exports.store = async (req, res) => {
  try {

    const no_ref = (req.body.no_ref || "").trim();
    const catatan = (req.body.catatan || "").trim();

    if (!no_ref || !catatan) {
      return res.status(400).send("Data tidak lengkap");
    }

    await Catatan.create({
      no_ref,
      catatan
    });

    // 🔥 REDIRECT SAMA SEPERTI TS & STT
    res.redirect(`/laporan-shift/kcm5/detail?noref=${no_ref}`);

  } catch (err) {
    console.error("CATATAN SAVE ERROR:", err);
    res.status(500).send("Gagal simpan catatan");
  }
};


// ======================================
// PAGE
// ======================================
exports.page = (req, res) => {
  const noRef = req.query.noref || "";

  res.render("catatanKCM5", {
    title: "Catatan KCM 5",
    no_ref: noRef,
    active: "catatan" // ✅ tambahkan ini
  });
};
