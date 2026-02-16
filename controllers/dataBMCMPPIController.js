const db = require("../models");
const DataBMCMPPI = db.DataBMCMPPI;
const { Op } = require("sequelize");

// ================= HELPER =================
function getWeekFromDate(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

function toNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

/* =====================================================
   PAGE
   GET /dataBMCMPPI/page
===================================================== */
exports.page = async (req, res) => {
  try {
    const data = await db.DataBMCMPPI.findAll({
      order: [["tanggal", "ASC"]],
    });

    res.render("dataBMCMPPI", {
      title: "Data BM & CM PPI",
      active: "dataBMCMPPI",
      data
    });

  } catch (err) {
    console.error(err);
    res.send("Error ambil data");
  }
};


/* =====================================================
   ADD PAGE
===================================================== */
exports.addPage = (req, res) => {
  res.render("formDataBMCMPPI", {
    title: "Add Realisasi PK Harian PPI",
    active: "dataBMCMPPI"
  });
};

/* =====================================================
   LIST
===================================================== */
exports.list = async (req, res) => {
  const data = await DataBMCMPPI.findAll({
    order: [["tanggal", "ASC"]]
  });

  res.json(data);
};

/* =====================================================
   CREATE
===================================================== */
exports.create = async (req, res) => {
  try {
    const body = req.body;

    const fotoSafetyTalk =
      req.files?.fotoSafetyTalk?.[0]?.filename ?? null;

    const fotoCheckSheet =
      req.files?.fotoCheckSheet?.[0]?.filename ?? null;

    const tanggal = body.tanggal;
    const week = getWeekFromDate(tanggal);

    const duration = toNumber(body.duration);
    const jumlah_personil = toNumber(body.jumlahPersonel);

    const record = {
      week,
      tanggal,
      area: body.area,
      supervisor: body.supervisor,
      executor: body.executor,
      activity_category: body.activitiesCategory,
      activities: body.activities,
      detail_activities: body.detail_activities,
      duration: String(duration),
      jumlah_personil,
      main_hour: String(duration * jumlah_personil),
      status_persen: toNumber(body.status_persen),
      status: body.status,
      foto_safety_talk: fotoSafetyTalk,
      foto_check_sheet: fotoCheckSheet,
      keterangan: body.keterangan,
      created_by: req.session?.user?.id ?? null
    };

    await DataBMCMPPI.create(record);

    res.redirect("/dataBMCMPPI");

  } catch (err) {
    console.error("CREATE PPI ERROR:", err);
    res.status(500).send("Gagal menyimpan data PPI");
  }
};


/* =====================================================
   EDIT PAGE
===================================================== */
exports.editPage = async (req, res) => {
  try {
    const data = await DataBMCMPPI.findByPk(req.params.id);

    if (!data) return res.redirect("/dataBMCMPPI");

    const tanggalFormatted = data.tanggal
      ? new Date(data.tanggal).toISOString().split("T")[0]
      : "";

res.render('formUpdateDataBMCMPPI', {
  data,
  pk_id: data.pk_id, // optional
  tanggalFormatted
});


  } catch (err) {
    console.error(err);
    res.redirect("/dataBMCMPPI");
  }
};

/* =====================================================
   UPDATE
===================================================== */
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;

    const row = await DataBMCMPPI.findByPk(id);
    if (!row) return res.status(404).send("Data tidak ditemukan");

    // 🔧 PERBAIKAN: pakai nama field database
    const fotoSafetyTalk =
      req.files?.fotoSafetyTalk?.[0]?.filename || row.foto_safety_talk;

    const fotoCheckSheet =
      req.files?.fotoCheckSheet?.[0]?.filename || row.foto_check_sheet;

    await row.update({
      tanggal: body.tanggal,
      week: getWeekFromDate(body.tanggal),
      area: body.area,
      supervisor: body.supervisor,
      executor: body.executor,
      activity_category: body.activitiesCategory,
      activities: body.activities,

      // 🔧 PERBAIKAN: samakan dengan CREATE (snake_case)
      detail_activities: body.detail_activities,

      duration: toNumber(body.duration),
      jumlah_personil: toNumber(body.jumlahPersonel),
      main_hour: toNumber(body.duration) * toNumber(body.jumlahPersonel),
      status_persen: toNumber(body.statusPersen),
      status: body.status,
      foto_safety_talk: fotoSafetyTalk,
      foto_check_sheet: fotoCheckSheet,
      keterangan: body.keterangan
    });

    res.redirect("/dataBMCMPPI");
  } catch (err) {
    console.error("UPDATE PPI ERROR:", err);
    res.status(500).send("Gagal update data PPI");
  }
};

/* =====================================================
   DELETE
===================================================== */
exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const row = await DataBMCMPPI.findByPk(id);
    if (!row) return res.status(404).send("Data tidak ditemukan");

    await row.destroy();
    res.json({ message: "Data berhasil dihapus" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal menghapus data");
  }
};
