const express = require("express");
const router = express.Router();
const laporanShiftController = require("../controllers/laporanShiftController");
const formController = require("../controllers/formLaporanShiftController");


// LIST KCM5
router.get("/kcm5", laporanShiftController.listKCM5);



router.get("/laporan-shift/kcm5/add", formController.formKCM5);         // add
router.get("/laporan-shift/kcm5/edit/:id", formController.formKCM5); 
router.post("/laporan-shift/kcm5/save", formController.storeKCM5);

// JSON SEARCH
router.get("/kcm5/json", laporanShiftController.listKCM5JSON);

// DELETE
router.delete("/kcm5/:id", laporanShiftController.delete);

// APPROVE
router.post("/kcm5/approve/:id", laporanShiftController.approve);

module.exports = router;
