const db = require("../models");

const Monitoring = db.Monitoring;
const LaporanShift = db.LaporanShift;


// =====================================
// PAGE FORM MONITORING
// =====================================
exports.page = async (req, res) => {
  try {

    const noRef = req.query.noref;

    if (!noRef)
      return res.send("No.Ref tidak diberikan");

    // pastikan no_ref ada di laporan
    const laporan = await LaporanShift.findOne({
      where: { no_ref: noRef }
    });

    if (!laporan)
      return res.send("No.Ref tidak ditemukan di Laporan Shift");

    res.render("pcKCM5", {
      title: "Monitoring KCM 5",
      no_ref: noRef,
      active: "laporan"
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal load halaman monitoring");
  }
};



// =====================================
// SIMPAN MONITORING
// =====================================
exports.store = async (req, res) => {
  try {

    const { no_ref, monitoring } = req.body;

    if (!no_ref || !monitoring)
      return res.send("Data tidak lengkap");

    await Monitoring.create({
  no_ref: no_ref.trim(),
  monitoring
});


    // balik ke detail laporan shift
    res.redirect(`/laporan-shift/kcm5/detail?noref=${no_ref}`);

  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal simpan monitoring");
  }
};
