const express = require("express");
const router = express.Router();
const chartBMCMPPIController = require("../controllers/chartBMCMPPIController");

router.get("/", chartBMCMPPIController.index);

module.exports = router;
