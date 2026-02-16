const express = require("express");
const router = express.Router();
const chartAbnormalitasController = require("../controllers/chartAbnormalitasController");

router.get("/", chartAbnormalitasController.index);

module.exports = router;
