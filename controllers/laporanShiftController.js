
// controllers/laporanShiftController.js

const { Op } = require("sequelize");
const db = require("../models");

const LaporanShift = db.LaporanShift;
const TsKCM5 = db.TsKCM5;
const STT = db.STT;
const Catatan = db.Catatan;
const Monitoring = db.Monitoring;
const Maintenance = db.BasicMaintenance;



const { shiftMap } = require("../utils/shiftHelper");
const moment = require("moment");
const generateNoRefKCM5 = require("../utils/generateNoRefKCM5");
const generateNoRefRMFM5 = require("../utils/generateNoRefRMFM5");


// =======================================================
// LIST RMFM5
// =======================================================
// controllers/laporanShiftController.js
exports.listRMFM5Page = async (req, res) => {
  try {
    const rows = await LaporanShift.findAll({
      where: { area: "RMFM5" },
      order: [["tanggal", "DESC"]],
      raw: true
    });

    const tsRows = await TsKCM5.findAll({ raw: true });

    const tsMap = {};
    tsRows.forEach(ts => {
      const key = (ts.no_ref || "").trim();
      if (!tsMap[key]) tsMap[key] = [];
      tsMap[key].push(ts);
    });

    res.render("RMFM5", {  // <-- ganti file EJS
      data: rows,
      tsMap,
      active: "laporan",
      title: "Laporan Shift RMFM5"
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("ERROR LIST RMFM5");
  }
};

exports.listRMFM5JSON = async (req, res) => {
  try {
    const data = await LaporanShift.findAll({
      where: { area: "RMFM5" },
      order: [["tanggal", "DESC"]],
    });

    res.json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
};


//add edit :
// FORM CONTROLLER
// controllers/laporanShiftController.js

exports.formRMFM5 = async (req, res) => {
  try {
    const { id } = req.params;
    let formData = {};
    let mode = "add";

    if (id) {
      const data = await LaporanShift.findByPk(id);
      if (!data) return res.status(404).send("Data tidak ditemukan");

      formData = data.toJSON();

      // format tanggal untuk input date
      if (formData.tanggal) {
        const d = new Date(formData.tanggal);
        formData.tanggal = !isNaN(d) ? d.toISOString().split("T")[0] : '';
      }

      mode = "edit";
    }

    // 💡 Tambahkan shifts seperti di KCM5
    const shifts = ["01 (07:00-15:00)", "02 (15:00-22:00)", "03 (22:00-07:00)", "A (07:00-19:00)", "B (19:00-07:00)", "LIBUR"];

    res.render("laporanshiftRMFM5", {
      title: mode === "edit" ? "Edit Laporan Shift RMFM5" : "Tambah Laporan Shift RMFM5",
      user: req.session.user,
      active: "laporan",
      formData,
      mode,
      shifts  // <-- ini bikin EJS bisa pakai shifts.forEach
    });

  } catch (err) {
    console.error("ERROR FORM RMFM5:", err);
    res.status(500).send("Terjadi kesalahan saat memuat form RMFM5");
  }
};

exports.updateLaporanRMFM5 = async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  try {
    await LaporanShift.update(data, { where: { id } });  // <-- ganti LaporanRMFM5 jadi LaporanShift
    res.json({ success: true, message: "Data berhasil diupdate" });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Gagal update data" });
  }
};

exports.storeRMFM5 = async (req, res) => {
  try {
    const {
      id, tanggal, shift_kode,
      personil_851a, shift_851a,
      personil_851b, shift_851b,
      personil_852a, shift_852a,
      personil_852b, shift_852b
    } = req.body;

    const userLogin = req.session.user?.email || req.session.user?.nama;
    const m = moment(tanggal, "YYYY-MM-DD", true);
    if (!m.isValid())
      return res.status(400).json({ success: false, message: "Tanggal tidak valid" });

    const tanggalISO = m.format("YYYY-MM-DD");

    if (id) {
      const data = await LaporanShift.findByPk(id);
      if (!data)
        return res.status(404).json({ success: false, message: "Data tidak ditemukan" });

      await data.update({
        tanggal: tanggalISO, shift_kode,
        personil_851a, shift_851a,
        personil_851b, shift_851b,
        personil_852a, shift_852a,
        personil_852b, shift_852b
      });

    } else {
      const no_ref = await generateNoRefRMFM5();

      await LaporanShift.create({
        area: "RMFM5",
        tanggal: tanggalISO,
        shift_kode,
        no_ref,
        dibuat_oleh: userLogin,
        personil_851a, shift_851a,
        personil_851b, shift_851b,
        personil_852a, shift_852a,
        personil_852b, shift_852b,
        is_approved: false
      });
    }

    // 🔹 KIRIM JSON BUAT JS
    res.json({ success: true, message: "Data berhasil disimpan" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Terjadi kesalahan saat menyimpan data" });
  }
};

exports.detailRMFM5 = async (req,res)=>{
  try{
    const noRef = (req.query.noref || "").trim();
    if(!noRef) return res.send("No.Ref tidak diberikan");

    const data = await LaporanShift.findOne({ where: { no_ref: noRef } });
    if(!data) return res.send("Data tidak ditemukan");

    const row = data.toJSON();

    // data maintenance, monitoring, stt, catatan sama seperti detailKCM5
    const maintenance = await Maintenance.findAll({ where:{no_ref:noRef}, raw:true, order:[["id","ASC"]]});
    const monitoringData = await Monitoring.findAll({ where:{no_ref:noRef}, raw:true, order:[["id","ASC"]]});
    const sttData = await STT.findAll({ where:{no_ref:noRef}, raw:true, order:[["id","ASC"]]});
    const catatanData = await Catatan.findAll({ where:{no_ref:noRef}, raw:true, order:[["id","ASC"]]});
    
    res.render("laporanKCM5", {
      title: "Laporan Shift RMFM5",
      active: "laporan",
      row,
      maintenance,
      monitoring: monitoringData,
      stt: sttData,
      catatan: catatanData,
      ts: [] // RMFM5 mungkin tidak pakai TS?
    });

  } catch(err){
    console.error("DETAIL RMFM5 ERROR:", err);
    res.status(500).send("Server Error");
  }
}

// =======================================================
// DETAIL KCM5 ⭐⭐⭐ FULL FIX FINAL
// =======================================================
exports.detailKCM5 = async (req, res) => {
  try {

    const noRef = (req.query.noref || "").trim();


    if (!noRef)
      return res.send("No.Ref tidak diberikan");

    // ================= DATA UTAMA =================
    const data = await LaporanShift.findOne({
      where: { no_ref: noRef }
    });

    if (!data)
      return res.send("Data tidak ditemukan");

    const row = data.toJSON();


    // ================= TROUBLESHOOTING =================
    const tsData = await TsKCM5.findAll({
  where: { no_ref: noRef },
  include: [
    {
      model: db.Nomenclature,
      as: "nomenclature",
      attributes: ["name"]
    }
  ],
  order: [["id", "ASC"]],
  raw: false   // ⚠️ WAJIB FALSE!
});



    // ================= BASIC MAINTENANCE =================
    const maintenance = await Maintenance.findAll({
      where: { no_ref: noRef },
      order: [["id","ASC"]],
      raw: true
    });

   


    // ================= MONITORING =================
    const monitoringData = await Monitoring.findAll({
      where: { no_ref: noRef },
      order: [["id","ASC"]],
      raw: true
    });


    // ================= STT =================
    const sttData = await STT.findAll({
      where: { no_ref: noRef },
      order: [["id","ASC"]],
      raw: true
    });


    // ================= CATATAN =================
    const catatanData = await Catatan.findAll({
      where: { no_ref: noRef },
      order: [["id","ASC"]],
      raw: true
    });


    // ================= RENDER =================
    res.render("laporanKCM5", {
      title: "Laporan Shift KCM 5",
      active: "laporan",

      row,
      ts: tsData,
      maintenance,
      monitoring: monitoringData,
      stt: sttData,
      catatan: catatanData
    });

  } catch (err) {
    console.error("DETAIL KCM5 ERROR:", err);
    res.status(500).send("Server Error");
  }
};



// =======================================================
// LIST KCM5
// =======================================================
exports.listKCM5 = async (req, res) => {
  try {

    const rows = await LaporanShift.findAll({
      where: { area: "KCM5" },
      order: [["tanggal", "DESC"]],
      raw: true
    });

    const tsRows = await TsKCM5.findAll({ raw: true });

    const tsMap = {};
    tsRows.forEach(ts => {
      const key = (ts.no_ref || "").trim();
      if (!tsMap[key]) tsMap[key] = [];
      tsMap[key].push(ts);
    });

    res.render("kcm5", {
      data: rows,
      tsMap,
      active: "laporan",
      title: "Laporan Shift KCM5"
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("ERROR LIST KCM5");
  }
};


// =======================================================
// SEARCH JSON
// =======================================================
exports.listKCM5JSON = async (req, res) => {
  try {

    const keyword = req.query.keyword || "";

    const where = {
      area: "KCM5",
      [Op.or]: [
        { no_ref: { [Op.like]: `%${keyword}%` } },
        { dibuat_oleh: { [Op.like]: `%${keyword}%` } },
      ],
    };

    if (/^\d{4}-\d{2}-\d{2}$/.test(keyword)) {
      where[Op.or].push({ tanggal: keyword });
    }

    const data = await LaporanShift.findAll({
      where,
      order: [["tanggal", "DESC"]],
    });

    res.json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
};


// =======================================================
// FORM ADD / EDIT
// =======================================================
exports.formKCM5 = async (req, res) => {
  try {

    const { id } = req.params;
    let formData = {};
    let mode = "add";

    if (id) {
      const data = await LaporanShift.findByPk(id);
      if (!data) return res.status(404).send("Data tidak ditemukan");

      formData = data.toJSON();

      if (formData.tanggal) {
        const d = new Date(formData.tanggal);
        formData.tanggal = !isNaN(d)
          ? d.toISOString().split("T")[0]
          : '';
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


// =======================================================
// SAVE ADD / EDIT
// =======================================================
exports.saveKCM5 = async (req, res) => {
  try {

    const {
      id,
      tanggal,
      shift_kode,
      personil_841a,
      shift_841a,
      personil_842a,
      shift_842a,
      personil_842b,
      shift_842b,
      cuti
    } = req.body;

    const userEmail = req.session.user?.email || req.session.user?.nama;

    const m = moment(tanggal, "YYYY-MM-DD", true);
    if (!m.isValid())
      return res.status(400).send("Tanggal tidak valid");

    const tanggalISO = m.format("YYYY-MM-DD");

    if (id) {

      const data = await LaporanShift.findByPk(id);
      if (!data) return res.status(404).send("Data tidak ditemukan");

      await data.update({
      tanggal: tanggalISO,
      shift_kode,
      personil_841a,
      shift_841a,
      personil_842a,
      shift_842a,
      personil_842b,
      shift_842b,
      cuti
    });


    } else {

      const no_ref = await generateNoRefKCM5();

      await LaporanShift.create({
      area: "KCM5",
      tanggal: tanggalISO,
      shift_kode,
      no_ref,
      dibuat_oleh: userEmail,
      personil_841a,
      shift_841a,
      personil_842a,
      shift_842a,
      personil_842b,
      shift_842b,
      cuti
    });


    }

    res.redirect("/laporan-shift/kcm5");

  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal menyimpan data KCM5");
  }
};


// =======================================================
// DELETE
// =======================================================
exports.delete = async (req, res) => {
  try {

    const data = await LaporanShift.findByPk(req.params.id);
    if (!data)
      return res.status(404).json({ error: "Data tidak ditemukan" });

    await data.destroy();

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal menghapus data" });
  }
};


exports.deleteItem = async (req, res) => {
  const { type, id } = req.params;
  const { noref } = req.query;

  try {
    let model;

    switch (type) {
      case "ts":
        model = require("../models").TsKCM5;
        break;
      case "maintenance":
        model = require("../models").BasicMaintenance;
        break;
      case "stt":
        model = require("../models").STT;
        break;
      case "monitoring":
        model = require("../models").Monitoring;
        break;
      case "catatan":
        model = require("../models").Catatan;
        break;
      default:
        return res.status(400).json({ success: false, message: "Tipe data tidak dikenal" });
    }

    const item = await model.findByPk(id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Data tidak ditemukan" });
    }

    await item.destroy();

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



// =======================================================
// APPROVE
// =======================================================
exports.approve = async (req, res) => {
  try {

    const data = await LaporanShift.findByPk(req.params.id);
    if (!data)
      return res.status(404).json({ error: "Data tidak ditemukan" });

    await data.update({ is_approved: true });

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal approve data" });
  }
};

//TS 
// EDIT FORM TS
exports.formTSEdit = async (req,res)=>{
  try{
    const { id } = req.params;
    const data = await TsKCM5.findByPk(id);
    if(!data) return res.status(404).send("Data tidak ditemukan");

    res.render("form-ts-kcm5", {
      formData: data.toJSON(),
      mode: "edit",
      user: req.session.user
    });
  }catch(err){
    console.error(err);
    res.status(500).send("Gagal load form TS");
  }
};

// SAVE UPDATE TS
exports.saveTSEdit = async (req,res)=>{
  try{
    const { id } = req.params;
    const data = await TsKCM5.findByPk(id);
    if(!data) return res.status(404).send("Data tidak ditemukan");

    await data.update(req.body);
    res.redirect(`/laporan-shift/kcm5/detail?noref=${req.body.no_ref}`);
  }catch(err){
    console.error(err);
    res.status(500).send("Gagal update TS");
  }
};


