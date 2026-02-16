const express = require("express");
const router = express.Router();
const monitoring = require("../controllers/monitoringController");

// PAGE
router.get(
  "/laporan-shift/kcm5/monitoring",
  monitoring.page
);


// SAVE
router.post(
  "/laporan-shift/kcm5/monitoring/save",
  monitoring.store
);

module.exports = router;
