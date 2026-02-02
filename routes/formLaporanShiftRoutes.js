const router = require("express").Router();
const formController = require("../controllers/formLaporanShiftController");
const listController = require("../controllers/laporanShiftController");

// LIST
router.get("/laporan-shift/kcm5", listController.listKCM5);

// FORM ADD
router.get("/laporan-shift/kcm5/add", formController.formKCM5);

// FORM EDIT
router.get("/laporan-shift/kcm5/edit/:id", formController.formKCM5);

// SIMPAN ADD
router.post("/laporan-shift/kcm5/add", formController.storeKCM5);

// SIMPAN EDIT
router.post("/laporan-shift/kcm5/edit/:id", formController.storeKCM5);

module.exports = router;
