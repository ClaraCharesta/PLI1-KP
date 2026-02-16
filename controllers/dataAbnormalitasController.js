const db = require("../models");
const Abnormalitas = db.Abnormalitas;

// Helper Week (Disamakan logikanya dengan BMCM agar konsisten)
function getWeekNumber(dateStr) {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

// LIST DATA (API JSON)
exports.listApi = async (req, res) => {
    try {
        const data = await Abnormalitas.findAll({ order: [["createdAt", "DESC"]] });
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Gagal ambil data" });
    }
};

// PAGE INDEX
exports.index = async (req, res) => {
    res.render("dataAbnormalitas", {
        title: "Data Abnormalitas",
        active: "dataAbnormalitas"
    });
};

// FORM ADD
exports.formAdd = (req, res) => {
    res.render("formDataAbnormalitas", {
        title: "Add Data Abnormalitas",
        active: "dataAbnormalitas"
    });
};

// STORE DATA
exports.store = async (req, res) => {
    try {
        const weekNumber = getWeekNumber(req.body.abnormal_date);
        await Abnormalitas.create({
            ...req.body,
            week_number: weekNumber,
            foto_sebelum: req.files?.foto_sebelum?.[0]?.filename || null,
            foto_sesudah: req.files?.foto_sesudah?.[0]?.filename || null
        });
        res.redirect("/dataAbnormalitas");
    } catch (err) {
        res.status(500).send("Gagal simpan data");
    }
};

// FORM EDIT
exports.formEdit = async (req, res) => {
    try {
        const data = await Abnormalitas.findByPk(req.params.id);
        if (!data) return res.redirect("/dataAbnormalitas");

        // Format tanggal agar muncul di input type="date"
        const tanggalFormatted = data.abnormal_date 
            ? new Date(data.abnormal_date).toISOString().split("T")[0] 
            : "";

        res.render("formUpdateDataAbnormalitas", {
            title: "Update Data Abnormalitas",
            active: "dataAbnormalitas",
            data,
            tanggalFormatted
        });
    } catch (err) {
        res.redirect("/dataAbnormalitas");
    }
};

// UPDATE DATA
exports.update = async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;
        const row = await Abnormalitas.findByPk(id);

        if (!row) return res.status(404).send("Data tidak ditemukan");

        // Ambil file baru atau gunakan yang lama
        const foto_sebelum = req.files?.foto_sebelum?.[0]?.filename || row.foto_sebelum;
        const foto_sesudah = req.files?.foto_sesudah?.[0]?.filename || row.foto_sesudah;

        await row.update({
            ...body,
            week_number: getWeekNumber(body.abnormal_date),
            foto_sebelum,
            foto_sesudah
        });

        res.redirect("/dataAbnormalitas");
    } catch (err) {
        console.error(err);
        res.status(500).send("Gagal update data");
    }
};

// DELETE DATA
exports.delete = async (req, res) => {
    try {
        const row = await Abnormalitas.findByPk(req.params.id);
        if (!row) return res.status(404).json({ message: "Data tidak ditemukan" });

        await row.destroy();
        res.json({ message: "Data berhasil dihapus" });
    } catch (err) {
        res.status(500).json({ message: "Gagal hapus data" });
    }
};