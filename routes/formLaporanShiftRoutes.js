const express = require("express");
const router = express.Router();
const controller = require("../controllers/formLaporanShiftController");
const formController = require("../controllers/formLaporanShiftController");

// FORM
router.get("/form/kcm5", controller.formKCM5);

// SIMPAN
router.post("/kcm5", controller.storeKCM5);


router.get("/kcm5", controller.formKCM5);
router.post("/form-laporan-shift", formController.storeKCM5);
router.get("/form-laporan-shift", formController.formKCM5);

module.exports = router;
