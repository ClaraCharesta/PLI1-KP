const DataBMCM = require("../models/DataBMCM");
const { Op } = require("sequelize");

// Helper: hitung ISO week seperti '2026-W04'
function getWeekFromDate(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  // Copy date so don't modify original
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1)/7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2,'0')}`;
}

function toNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

// LIST / SEARCH
// GET /
exports.list = async (req, res) => {
  const area = req.query.area || null;
  const keyword = req.query.keyword || "";

  const where = {};
  if (area) where.area = area;
  if (keyword) {
    where[Op.or] = [
      { supervisor: { [Op.like]: `%${keyword}%` } },
      { executor: { [Op.like]: `%${keyword}%` } },
      { activities: { [Op.like]: `%${keyword}%` } },
      { detail_activities: { [Op.like]: `%${keyword}%` } },
      { keterangan: { [Op.like]: `%${keyword}%` } },
      { week: { [Op.like]: `%${keyword}%` } },
      { tanggal: { [Op.like]: `%${keyword}%` } },
    ];
  }

  try {
    const data = await DataBMCM.findAll({ where, order: [["tanggal", "DESC"]] });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Gagal mengambil data" });
  }
};

// GET DETAIL
// GET /:id
exports.detail = async (req, res) => {
  const id = req.params.id;

  try {
    const row = await DataBMCM.findByPk(id);
    if (!row) return res.status(404).send("Data tidak ditemukan");

    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).send("Terjadi kesalahan server");
  }
};

// CREATE
// POST /
exports.create = async (req, res) => {
  try {
    const body = req.body || {};
    console.log('▶ POST /data-bmcm - session user:', req.session?.user ?? null, 'body:', body);

    // Server-side validation for required fields (accepts snake_case or camelCase)
    const required = ['tanggal','area','supervisor','executor','activity_category','activities','duration','jumlah_personil','status_persen','status'];
    const missing = required.filter(f => {
      const camel = f.replace(/_([a-z])/g, (m, g1) => g1.toUpperCase());
      return (body[f] === undefined || body[f] === null || body[f] === '') &&
             (body[camel] === undefined || body[camel] === null || body[camel] === '');
    });

    if (missing.length) return res.status(400).json({ success: false, error: 'Missing required fields: ' + missing.join(', ') });

    const tanggal = body.tanggal || body.tanggal;
    const week = getWeekFromDate(tanggal);

    const duration = toNumber(body.duration ?? body.duration);
    const jumlah_personil = toNumber(body.jumlah_personil ?? body.jumlahPersonel ?? body.jumlah_personel);
    const main_hour = String(duration * jumlah_personil);

    const userId = req.session?.user?.id ?? null;

    const record = {
      week,
      tanggal: tanggal || null,
      area: body.area || null,
      supervisor: body.supervisor || null,
      executor: body.executor || null,
      activity_category: body.activity_category || body.activitiesCategory || null,
      activities: body.activities || null,
      detail_activities: body.detail_activities || body.detailActivities || null,
      duration: duration ? String(duration) : null,
      jumlah_personil: jumlah_personil || null,
      main_hour,
      status_persen: toNumber(body.status_persen ?? body.statusPersen),
      status: body.status || null,
      foto_safety_talk: body.foto_safety_talk || body.fotoSafetyTalk || null,
      foto_check_sheet: body.foto_check_sheet || body.fotoCheckSheet || null,
      keterangan: body.keterangan || null,
      created_by: userId,
    };

    const newData = await DataBMCM.create(record);
    res.status(201).json(newData);
  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal membuat data baru");
  }
};

// UPDATE
// PUT /:id
exports.update = async (req, res) => {
  const id = req.params.id;

  try {
    const row = await DataBMCM.findByPk(id);
    if (!row) return res.status(404).send("Data tidak ditemukan");

    const body = req.body || {};

    const tanggal = body.tanggal ?? row.tanggal;
    const week = getWeekFromDate(tanggal);

    const duration = toNumber(body.duration ?? row.duration);
    const jumlah_personil = toNumber(body.jumlah_personil ?? body.jumlahPersonel ?? row.jumlah_personil);
    const main_hour = String(duration * jumlah_personil);

    const updates = {
      week,
      tanggal: tanggal || row.tanggal,
      area: body.area ?? row.area,
      supervisor: body.supervisor ?? row.supervisor,
      executor: body.executor ?? row.executor,
      activity_category: body.activity_category ?? body.activitiesCategory ?? row.activity_category,
      activities: body.activities ?? row.activities,
      detail_activities: body.detail_activities ?? body.detailActivities ?? row.detail_activities,
      duration: (duration !== undefined) ? String(duration) : row.duration,
      jumlah_personil: jumlah_personil || row.jumlah_personil,
      main_hour,
      status_persen: toNumber(body.status_persen ?? body.statusPersen ?? row.status_persen),
      status: body.status ?? row.status,
      foto_safety_talk: body.foto_safety_talk ?? body.fotoSafetyTalk ?? row.foto_safety_talk,
      foto_check_sheet: body.foto_check_sheet ?? body.fotoCheckSheet ?? row.foto_check_sheet,
      keterangan: body.keterangan ?? row.keterangan,
    };

    await row.update(updates);
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal mengupdate data");
  }
};

// DELETE
// DELETE /:id
exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const row = await DataBMCM.findByPk(id);
    if (!row) return res.status(404).send("Data tidak ditemukan");

    await row.destroy();
    res.json({ message: "Data berhasil dihapus" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal menghapus data");
  }
};
