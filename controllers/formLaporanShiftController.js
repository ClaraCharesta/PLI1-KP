// controllers/formLaporanShiftController.js

const LaporanShift = require("../models/LaporanShift");
const { Op } = require("sequelize");

/* ================================
   AUTO GENERATE NO.REF KCM5
================================ */
async function generateNoRefKCM5() {
  const now = new Date();
  const bulan = now.getMonth() + 1;
  const tahun = now.getFullYear();

  const prefix = `SHIFT.PLI1-KCM5/${bulan}.${tahun}`;

  const last = await LaporanShift.findOne({
    where: {
      area: "KCM5",
      no_ref: {
        [Op.like]: `%/${prefix}`
      }
    },
    order: [["id", "DESC"]]
  });

  let nextNumber = 1;

  if (last && last.no_ref) {
    const nomor = last.no_ref.split("/")[0];
    nextNumber = parseInt(nomor) + 1;
  }

  return `${String(nextNumber).padStart(4, "0")}/${prefix}`;
}

/* ================================
   GET FORM KCM5
================================ */
exports.formKCM5 = (req, res) => {
  res.render("laporanshiftKCM5", {
    title: "Form Laporan Shift KCM 5",
    user: req.session.user, // pakai data user dari session
    active: "home"
  });
};

/* ================================
   POST SIMPAN KCM5
================================ */
exports.storeKCM5 = async (req, res) => {
  try {
    const {
      tanggal,
      shiftUtama,
      cuti,

      personil_841,
      shift_841,

      personil_842a,
      shift_842a,

      personil_842b,
      shift_842b
    } = req.body;

    const no_ref = await generateNoRefKCM5();
    console.log("SESSION:", req.session.user);

    const data = await LaporanShift.create({
      area: "KCM5",
      tanggal,
      shift_kode: shiftUtama,
      no_ref,
      dibuat_oleh: req.session.user?.email || req.session.user?.nama, // pakai email dari user yang login

      personil_841a: personil_841,
      shift_841a: shift_841,

      personil_842a,
      shift_842a,

      personil_842b,
      shift_842b,

      cuti,
      is_approved: false
    });

    // Mengembalikan response JSON seperti sebelumnya
    res.json({
      success: true,
      message: "Laporan KCM5 berhasil disimpan",
      data
    });

  } catch (err) {
    console.error("ERROR STORE KCM5:", err);
    res.status(500).json({
      success: false,
      message: "Gagal menyimpan laporan KCM5"
    });
  }
};
