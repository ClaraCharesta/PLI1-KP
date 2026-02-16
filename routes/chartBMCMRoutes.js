const express = require("express");
const router = express.Router();
const chartBMCMController = require("../controllers/chartBMCMController");

// PERHATIKAN DI SINI: Gunakan "/" bukan "/chart-bmcm"
// Karena di app.js sudah didefinisikan app.use("/chart-bmcm", ...)
router.get("/", chartBMCMController.index);

module.exports = router;