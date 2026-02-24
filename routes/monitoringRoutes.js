const express = require("express");
const router = express.Router();
const monitoring = require("../controllers/monitoringController");

router.get("/kcm5/monitoring", monitoring.page);
router.post("/kcm5/monitoring/save", monitoring.store);

module.exports = router;