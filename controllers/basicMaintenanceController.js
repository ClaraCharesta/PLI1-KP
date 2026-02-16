const db = require("../models");
const Maintenance = db.BasicMaintenance;
const Rute = db.Rute; // pastikan ada model Rute

// ======================
// Hitung week otomatis
// ======================
function getWeekFromDate(dateStr){
  const date = new Date(dateStr);
  const jan1 = new Date(date.getFullYear(),0,1);
  const dayOfYear = ((date - jan1 + 86400000)/86400000);
  return Math.ceil(dayOfYear/7).toString(); // jadi string
}

// ======================
// FORM MAINTENANCE
// ======================
exports.formMaintenanceKCM5 = async (req, res) => {
  try {
    const noRef = req.query.noref;
    if (!noRef) return res.send("NoRef kosong");

    const rutes = await Rute.findAll({
      attributes: ['id','name'],
      order: [['name','ASC']]
    });

    res.render("maintenanceKCM5", {
      title: "Tambah Basic Maintenance",
      no_ref: noRef,
      rutes, // ✅ HARUS ADA
      active: "laporan",
      user: req.session.user
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal load form maintenance");
  }
};


// ======================
// SIMPAN DATA MAINTENANCE
// ======================
exports.storeMaintenanceKCM5 = async (req,res) => {
  try {
    const {
      no_ref,
      rute,
      rute_lainnya,
      tanggal,
      mulai,
      selesai,
      durasi,
      area,
      status,
      kendala
    } = req.body;

    // Week otomatis
    const week = getWeekFromDate(tanggal);

    // Simpan ke DB
    await Maintenance.create({
      no_ref,
      rute: rute === "Lainnya" ? rute_lainnya : rute,
      tanggal,
      mulai,
      selesai,
      durasi,
      area,
      status,
      kendala,
      week
    });

    res.redirect(`/laporan-shift/kcm5/detail?noref=${no_ref}`);
  } catch(err) {
    console.error(err);
    res.status(500).send("Gagal simpan maintenance");
  }
};
