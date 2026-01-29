const LaporanShift = require("../models/LaporanShift");
const { Op } = require("sequelize");
const { shiftMap } = require("../utils/shiftHelper");

// Fungsi mapping shift untuk semua kolom shift
function mapShiftData(data) {
  return data.map(row => {
    const obj = row.toJSON();
    Object.keys(obj).forEach(key => {
      if (key.startsWith("shift_") && obj[key]) {
        obj[key] = shiftMap[obj[key]] || obj[key];
      }
    });
    return obj;
  });
}

// ===================
// LIST / SEARCH ALL
// GET /
exports.list = async (req, res) => {
  const area = req.query.area || "KCM";
  const keyword = req.query.keyword || "";

  try {
    const data = await LaporanShift.findAll({
      where: {
        area,
        [Op.or]: [
          { no_ref: { [Op.like]: `%${keyword}%` } },
          { dibuat_oleh: { [Op.like]: `%${keyword}%` } },
          { tanggal: { [Op.like]: `%${keyword}%` } },
        ],
      },
      order: [["tanggal", "DESC"]],
    });

    res.json(mapShiftData(data));
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Gagal mengambil data" });
  }
};

// ===================
// LIST KHUSUS KCM5
// GET /kcm5
exports.listKCM5 = async (req, res) => {
  try {
    const data = await LaporanShift.findAll({
      where: { area: "KCM5" },
      order: [["tanggal", "DESC"]],
    });

    res.render("kcm5", {
      title: "Laporan Shift KCM 5",
      active: "laporan",
      data: mapShiftData(data),
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Terjadi kesalahan server");
  }
};

// ===================
// LIST KHUSUS RM FM5
// GET /RMFM5
exports.listRMFM5 = async (req, res) => {
  try {
    const data = await LaporanShift.findAll({
      where: { area: "RMFM5" },
      order: [["tanggal", "DESC"]],
    });

    res.render("rmfm5", {
      title: "Laporan Shift RM FM 5",
      active: "laporan",
      data: mapShiftData(data),
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Terjadi kesalahan server");
  }
};

// ===================
// GET DETAIL
// GET /:id
exports.detail = async (req, res) => {
  const id = req.params.id;

  try {
    const row = await LaporanShift.findByPk(id);
    if (!row) return res.status(404).send("Data tidak ditemukan");

    res.json(mapShiftData([row])[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Terjadi kesalahan server");
  }
};

// ===================
// CREATE
// POST /
exports.create = async (req, res) => {
  try {
    const newData = await LaporanShift.create(req.body);
    res.status(201).json(newData);
  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal membuat data baru");
  }
};

// ===================
// UPDATE
// PUT /:id
exports.update = async (req, res) => {
  const id = req.params.id;

  try {
    const row = await LaporanShift.findByPk(id);
    if (!row) return res.status(404).send("Data tidak ditemukan");

    await row.update(req.body);
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal mengupdate data");
  }
};

// ===================
// DELETE
// DELETE /:id
exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const row = await LaporanShift.findByPk(id);
    if (!row) return res.status(404).send("Data tidak ditemukan");

    await row.destroy();
    res.json({ message: "Data berhasil dihapus" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal menghapus data");
  }
};

// ===================
// APPROVE
// POST /approve/:id
exports.approve = async (req, res) => {
  const id = req.params.id;

  try {
    const row = await LaporanShift.findByPk(id);
    if (!row) return res.status(404).send("Data tidak ditemukan");

    row.is_approved = true;
    await row.save();

    res.json({ message: "Data berhasil di-approve", data: row });
  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal meng-approve data");
  }
};

exports.list = async (req, res) => {
  const area = req.query.area || "KCM";
  const keyword = req.query.keyword || "";

  try {
    const data = await LaporanShift.findAll({
      where: {
        area,
        [Op.or]: [
          { no_ref: { [Op.like]: `%${keyword}%` } },
          { dibuat_oleh: { [Op.like]: `%${keyword}%` } },
          { tanggal: { [Op.like]: `%${keyword}%` } },
        ],
      },
      order: [["tanggal", "DESC"]],
    });

    res.json(mapShiftData(data));
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Gagal mengambil data" });
  }
};
