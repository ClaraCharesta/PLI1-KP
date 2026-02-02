const LaporanShift = require("../models/LaporanShift");
const { Op } = require("sequelize");
const moment = require("moment");

/* ================================
   AUTO GENERATE NO.REF KCM5
================================ */
async function generateNoRefKCM5() {
  const now = new Date();
  const bulan = String(now.getMonth() + 1).padStart(2, "0");
  const tahun = now.getFullYear();

  const prefix = `SHIFT.PLI1-KCM5/${bulan}.${tahun}`;

  const last = await LaporanShift.findOne({
    where: { area: "KCM5", no_ref: { [Op.like]: `%${prefix}%` } },
    order: [["id", "DESC"]],
  });

  let nextNumber = 1;
  if (last && last.no_ref) {
    // ambil angka di awal no_ref
    const nomor = last.no_ref.split("/")[0];
    const parsed = parseInt(nomor);
    if (!isNaN(parsed)) nextNumber = parsed + 1;
  }

  return `${String(nextNumber).padStart(4, "0")}/${prefix}`;
}

/* ================================
   GET FORM KCM5 (ADD / EDIT)
================================ */
exports.formKCM5 = async (req, res) => {
  try {
    const { id } = req.params;
    let formData = {};
    let mode = "add";

    if (id) {
      const data = await LaporanShift.findByPk(id);
      if (!data) return res.status(404).send("Data tidak ditemukan");

      formData = data.toJSON();

      // Pastikan tanggal valid
      if (formData.tanggal) {
        const tgl = moment(formData.tanggal);
        formData.tanggal = tgl.isValid() ? tgl.format("YYYY-MM-DD") : '';
      }

      mode = "edit";
    }

    res.render("laporanshiftKCM5", {
      title: mode === "edit" ? "Edit Laporan Shift KCM5" : "Tambah Laporan Shift KCM5",
      user: req.session.user,
      active: "laporan",
      formData,
      mode
    });
  } catch (err) {
    console.error("ERROR FORM KCM5:", err);
    res.status(500).send("Terjadi kesalahan saat memuat form KCM5");
  }
};

/* ================================
   POST SIMPAN KCM5 (ADD / EDIT)
================================ */
exports.storeKCM5 = async (req, res) => {
  try {
    const {
      id,
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

    // Validasi tanggal
    if (!tanggal) return res.status(400).json({ success: false, message: "Tanggal wajib diisi" });

    const tgl = moment(tanggal, "YYYY-MM-DD", true);
    if (!tgl.isValid()) return res.status(400).json({ success: false, message: "Format tanggal tidak valid" });

    // ===== UPDATE DATA EXISTING =====
    if (id) {
      const data = await LaporanShift.findByPk(id);
      if (!data) return res.status(404).json({ success: false, message: "Data tidak ditemukan" });

      await data.update({
        tanggal: tgl.format("YYYY-MM-DD"),
        shift_kode: shiftUtama,
        personil_841a: personil_841,
        shift_841a: shift_841,
        personil_842a,
        shift_842a,
        personil_842b,
        shift_842b,
        cuti
      });

      return res.json({ success: true, message: "Laporan KCM5 berhasil diperbarui", data });
    }

    // ===== CREATE NEW DATA =====
    const no_ref = await generateNoRefKCM5();

    const newData = await LaporanShift.create({
      area: "KCM5",
      tanggal: tgl.format("YYYY-MM-DD"),
      shift_kode: shiftUtama,
      no_ref,
      dibuat_oleh: req.session.user?.email || req.session.user?.nama || "Unknown",
      personil_841a: personil_841,
      shift_841a: shift_841,
      personil_842a,
      shift_842a,
      personil_842b,
      shift_842b,
      cuti,
      is_approved: false
    });

    res.json({ success: true, message: "Laporan KCM5 berhasil disimpan", data: newData });

  } catch (err) {
    console.error("ERROR STORE KCM5:", err);
    res.status(500).json({ success: false, message: "Gagal menyimpan laporan KCM5" });
  }
};
