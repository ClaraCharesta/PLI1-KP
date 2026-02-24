const db = require("../models");
const DataBMCM = db.DataBMCM;
const User = db.User;
const { Op } = require("sequelize");

// Helper: hitung ISO week seperti '2026-W04'
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
   GET /data-bmcm/page
===================================================== */





exports.list = async (req, res) => {
  const data = await DataBMCM.findAll();
  res.json(data);
};


/* =====================================================
   LIST / SEARCH
   GET /
===================================================== */
// PAGE (EJS)
exports.page = async (req, res) => {
  const data = await DataBMCM.findAll({
    include: [
      {
        model: User,
        as: "creator",
        attributes: ["user_id", "nama"],
      },
    ],
    order: [["tanggal", "ASC"]],
  });

  res.render("dataBMCM", {
    title: "Data BMCM",
    active: "dataBMCM",
    data
  });
};


/* =====================================================
   DETAIL
   GET /:id
===================================================== */
exports.detail = async (req, res) => {
  const id = req.params.id;

  try {
    const row = await DataBMCM.findByPk(id, {
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["nama"],
        },
      ],
    });

    if (!row) return res.status(404).send("Data tidak ditemukan");

    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).send("Terjadi kesalahan server");
  }
};

/* =====================================================
   CREATE
   POST /
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
      detail_activities: body.detailActivities,
      duration: String(duration),
      jumlah_personil,
      main_hour: String(duration * jumlah_personil),
      status_persen: toNumber(body.statusPersen),
      status: body.status,
      foto_safety_talk: fotoSafetyTalk,
      foto_check_sheet: fotoCheckSheet,
      keterangan: body.keterangan,
      created_by: req.session?.user?.id ?? null,
    };

    await DataBMCM.create(record);

    // ⬇⬇⬇ INI KUNCI NYA
    res.redirect("/dataBMCM/page");


  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal menyimpan data");
  }
};

/* =====================================================
    ADD PAGE
===================================================== */
exports.addPage = async (req, res) => {
  try {
    const nomenclatures = await db.Nomenclature.findAll();

    res.render("formDataBMCM", {
      title: "Add Realisasi PK Harian",
      nomenclatures,
      active: "dataBMCM"
    });

  } catch (err) {
    console.error(err);

    res.render("formDataBMCM", {
      title: "Add Realisasi PK Harian",
      nomenclatures: [],
      active: "dataBMCM"
    });
  }
};


  /* =====================================================
    UPDATE
===================================================== */
exports.update = async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;
        
        const row = await DataBMCM.findByPk(id);
        if (!row) return res.status(404).send("Data tidak ditemukan");

        // Ambil file atau gunakan foto lama
        const fotoSafetyTalk = req.files?.fotoSafetyTalk?.[0]?.filename || row.foto_safety_talk;
        const fotoCheckSheet = req.files?.fotoCheckSheet?.[0]?.filename || row.foto_check_sheet;

        await row.update({
            tanggal: body.tanggal,
            week: getWeekFromDate(body.tanggal),
            area: body.area,
            supervisor: body.supervisor,
            executor: body.executor,
            activity_category: body.activitiesCategory,
            activities: body.activities,
            detail_activities: body.detailActivities,
            duration: Number(body.duration) || 0,
            jumlah_personil: Number(body.jumlahPersonel) || 0,
            main_hour: (Number(body.duration) || 0) * (Number(body.jumlahPersonel) || 0),
            status_persen: Number(body.statusPersen) || 0,
            status: body.status,
            foto_safety_talk: fotoSafetyTalk,
            foto_check_sheet: fotoCheckSheet,
            keterangan: body.keterangan
        });

        res.redirect("/dataBMCM/page");
    } catch (err) {
        console.error("Controller Update Error:", err);
        res.status(500).send("Error: " + err.message);
    }
};
  /* =====================================================
    EDIT PAGE
    ===================================================== */
exports.editPage = async (req, res) => {
  try {
    const id = req.params.id;

    const data = await DataBMCM.findByPk(id, {
      include: [{
        model: User,
        as: "creator",
        attributes: ["nama"]
      }]
    });

    if (!data) {
      return res.redirect("/dataBMCM/page");
    }

    // ⭐ TAMBAHAN (ambil dropdown area)
    const nomenclatures = await db.Nomenclature.findAll();

    const tanggalFormatted = data.tanggal
      ? new Date(data.tanggal).toISOString().split("T")[0]
      : "";

    res.render("formUpdateDataBMCM", {
      data,
      tanggalFormatted,
      nomenclatures, // ⭐ WAJIB
      active: "dataBMCM"
    });

  } catch (error) {
    console.error(error);
    res.redirect("/dataBMCM/page");
  }
};



/* =====================================================
   DELETE
===================================================== */
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