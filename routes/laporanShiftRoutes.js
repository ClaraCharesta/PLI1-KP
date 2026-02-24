const express = require("express");
const router = express.Router();
const db = require("../models");

const laporanShiftController = require("../controllers/laporanShiftController");

const tsController = require("../controllers/tsKCM5Controller");
const sttController = require("../controllers/sttController");


// ===== LIST =====
router.get("/kcm5", laporanShiftController.listKCM5);
router.get("/kcm5/json", laporanShiftController.listKCM5JSON);
router.get("/rmfm5", laporanShiftController.listRMFM5Page);
router.get("/rmfm5/json", laporanShiftController.listRMFM5JSON);

// ===== FORM ADD & EDIT =====
// KCM5 pakai formController
//router.get("/kcm5/add", formController.formKCM5);
//router.get("/kcm5/edit/:id", formController.formKCM5);
router.get("/kcm5/add", laporanShiftController.formKCM5);
router.get("/kcm5/edit/:id", laporanShiftController.formKCM5);
router.get("/kcm5/detail", laporanShiftController.detailKCM5);
router.get("/rmfm5/detail", laporanShiftController.detailKCM5);


// RMFM5 pakai laporanShiftController
router.get("/rmfm5/add", laporanShiftController.formRMFM5);
router.get("/rmfm5/edit/:id", laporanShiftController.formRMFM5);

// ===== SIMPAN =====
// KCM5 pakai formController
//router.post("/kcm5/add", formController.storeKCM5);
//router.post("/kcm5/edit/:id", formController.storeKCM5);
router.post("/kcm5/add", laporanShiftController.saveKCM5);
router.post("/kcm5/edit/:id", laporanShiftController.saveKCM5);

// RMFM5 pakai laporanShiftController
router.post("/rmfm5/add", laporanShiftController.storeRMFM5);
//router.post("/rmfm5/edit/:id", laporanShiftController.storeRMFM5);
// Tambahkan route untuk edit
router.post("/rmfm5/edit/:id", laporanShiftController.updateLaporanRMFM5);

// ===== TROUBLESHOOTING KCM5 =====
router.get("/kcm5/troubleshooting", tsController.formTSKCM5);
router.post("/kcm5/troubleshooting", tsController.store);
router.get("/kcm5/stt", sttController.form);
router.post("/kcm5/stt/save", sttController.store);

// ===== DELETE & APPROVE =====
// KCM5
router.delete("/kcm5/:id", laporanShiftController.delete);
router.post("/kcm5/approve/:id", laporanShiftController.approve);




// ===== MAINTENANCE =====
router.get("/kcm5/maintenance", async (req, res) => {
  try {

    const nomenclatures = await db.Nomenclature.findAll();

    res.render("maintenanceKCM5", {
      title: "Maintenance KCM5",
      no_ref: req.query.noref,
      active: "laporan",
      nomenclatures
    });

  } catch (err) {
    console.error(err);

    res.render("maintenanceKCM5", {
      title: "Maintenance KCM5",
      no_ref: req.query.noref,
      active: "laporan",
      nomenclatures: []
    });
  }
});

router.post("/kcm5/maintenance/save", async (req,res)=>{
  try {

    const data = req.body;

    await require("../models").BasicMaintenance.create(data);

    // 🔥 redirect ke halaman detail KCM5
    res.redirect(`/laporan-shift/kcm5/detail?noref=${data.no_ref}`);

  } catch(err){

    console.error("===== ERROR ASLI =====");
    console.error(err.message);
    console.error(err.errors);
    console.error(err.parent?.sqlMessage);
    console.error("======================");

    res.send("Gagal simpan maintenance");

  }
});


router.delete("/kcm5/delete/:type/:id", laporanShiftController.deleteItem);


// RMFM5
router.delete("/rmfm5/:id", laporanShiftController.delete);
router.post("/rmfm5/approve/:id", laporanShiftController.approve);

module.exports = router;
