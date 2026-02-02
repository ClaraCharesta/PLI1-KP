// controllers/laporanShiftController.js
const { Op } = require("sequelize");
const LaporanShift = require("../models/LaporanShift");
const { shiftMap } = require("../utils/shiftHelper");



// ==============================
// LIST HALAMAN KCM5
// ==============================
exports.listKCM5 = async (req, res) => {
  try {
    const data = await LaporanShift.findAll({
      where: { area: "KCM5" },
      order: [["tanggal", "DESC"]],
    });
    res.render("kcm5", { 
      data, 
      active: "laporan",
      title: "Laporan Shift KCM5"
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal memuat data");
  }
};

// ==============================
// JSON SEARCH
// ==============================
exports.listKCM5JSON = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const data = await LaporanShift.findAll({
      where: {
        area: "KCM5",
        [Op.or]: [
          { no_ref: { [Op.like]: `%${keyword}%` } },
          { dibuat_oleh: { [Op.like]: `%${keyword}%` } },
          { tanggal: { [Op.like]: `%${keyword}%` } },
        ],
      },
      order: [["tanggal", "DESC"]],
    });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
};

// ==============================
// FORM ADD / EDIT
// ==============================
exports.formKCM5 = async (req, res) => {
  try {
    const { id } = req.params;
    let formData = {};
    let mode = "add";

    if (id) {
      const data = await LaporanShift.findByPk(id);
      if (!data) return res.status(404).send("Data tidak ditemukan");

      formData = data.toJSON();

      // Aman untuk <input type=date>
      if (formData.tanggal) {
        const d = new Date(formData.tanggal);
        formData.tanggal = !isNaN(d) ? d.toISOString().split("T")[0] : '';
      } else {
        formData.tanggal = '';
      }

      mode = "edit";
    }

    res.render("form-kcm5", {
      user: req.session.user,
      active: "laporan",
      mode,
      formData,
      shifts: ["01","02","03","A","B","LIBUR"]
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal memuat form KCM5");
  }
};


// ==============================
// SAVE ADD / EDIT
// ==============================
const moment = require("moment"); // pastikan ini di atas file

exports.saveKCM5 = async (req, res) => {
  try {
    const {
      id, tanggal,
      shift_kode, personil_841, shift_841,
      personil_842a, shift_842a, personil_842b, shift_842b,
      cuti
    } = req.body;

    const userEmail = req.session.user?.email || req.session.user?.nama;

    // Pastikan tanggal selalu ISO format
    const d = new Date(tanggal);
    if (isNaN(d)) {
      return res.status(400).send("Tanggal tidak valid");
    }
    const tanggalISO = d.toISOString().split("T")[0]; // YYYY-MM-DD

    if (id) {
      // EDIT
      const data = await LaporanShift.findByPk(id);
      if (!data) return res.status(404).send("Data tidak ditemukan");

      await data.update({
        tanggal: tanggalISO,
        shift_kode,
        personil_841a: personil_841,
        shift_841a: shift_841,
        personil_842a,
        shift_842a,
        personil_842b,
        shift_842b,
        cuti
      });
    } else {
      // ADD
      const no_ref = await generateNoRefKCM5();

      await LaporanShift.create({
        area: "KCM5",
        tanggal: tanggalISO,
        shift_kode,
        no_ref,
        dibuat_oleh: userEmail,
        personil_841a: personil_841,
        shift_841a: shift_841,
        personil_842a,
        shift_842a,
        personil_842b,
        shift_842b,
        cuti
      });
    }

    // redirect harus di sini, di dalam try
    res.redirect("/laporan-shift/kcm5");

  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal menyimpan data KCM5");
  }
};



// ==============================
// DELETE DATA
// ==============================
exports.delete = async (req, res) => {
  try {
    const data = await LaporanShift.findByPk(req.params.id);
    if (!data) return res.status(404).json({ error: "Data tidak ditemukan" });

    await data.destroy();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal menghapus data" });
  }
};

// ==============================
// APPROVE DATA
// ==============================
exports.approve = async (req, res) => {
  try {
    const data = await LaporanShift.findByPk(req.params.id);
    if (!data) return res.status(404).json({ error: "Data tidak ditemukan" });

    await data.update({ is_approved: true });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal approve data" });
  }
};
