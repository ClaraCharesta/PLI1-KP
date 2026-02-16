const express = require("express");
const router = express.Router();
const tsController = require("../controllers/tsKCM5Controller");
const nomenController = require("../controllers/nomenclatureController");

// SAVE FORM
router.post("/laporan-shift/kcm5/troubleshooting/save", tsController.store);

router.post(
  "/laporan-shift/kcm5/troubleshooting/save",
  tsController.store
);


// AJAX NOMENCLATURE
router.get("/api/nomenclatures", nomenController.listAjax);

module.exports = router;
