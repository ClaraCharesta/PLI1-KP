const db = require("../models");
const TsKCM5 = db.TsKCM5;
const Nomenclature = db.Nomenclature;

/**
 * ==============================
 * FORM TAMBAH TROUBLESHOOTING
 * ==============================
 */
exports.formTSKCM5 = async (req, res) => {
  try {
    const noRef = req.query.noref;

    if (!noRef) {
      return res.status(400).send("No.Ref wajib");
    }

    const nomenclatures = await Nomenclature.findAll({
      order: [["name", "ASC"]],
    });

    res.render("tsKCM5", {
      active: "laporan",
      title: "Tambah Troubleshooting KCM 5",
      no_ref: noRef,
      nomenclatures
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal load form troubleshooting");
  }
};


/**
 * ==============================
 * SIMPAN TROUBLESHOOTING
 * ==============================
 */
exports.store = async (req, res) => {
  try {
    const {
      no_ref,
      tanggal,
      week,
      area,
      nomenclature, // ini ID dari select
      mulai,
      selesai,
      durasi,
      alarm,
      indikasi,
      klasifikasi_peralatan,
      klasifikasi_pekerjaan,
      tindakan,
      pic,
      status,
      keterangan,
      stop_alat
    } = req.body;

    if (!no_ref) {
      return res.status(400).send("No.Ref wajib ada");
    }

    await TsKCM5.create({
      no_ref,
      tanggal,
      week,
      area,
      nomenclature_id: nomenclature || null, // ✅ FK AMAN
      mulai,
      selesai,
      durasi,
      alarm,
      indikasi,
      klasifikasi_peralatan,
      klasifikasi_pekerjaan,
      tindakan,
      pic,
      status,
      keterangan,
      stop_alat
    });

    // balik ke detail laporan
    res.redirect(`/laporan-shift/kcm5/detail?noref=${no_ref}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal simpan troubleshooting");
  }
};
