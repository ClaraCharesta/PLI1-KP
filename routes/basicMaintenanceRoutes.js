// basicMaintenanceRoutes.js
const express = require("express");
const router = express.Router();
const maintenanceController = require("../controllers/basicMaintenanceController");

// FORM MAINTENANCE
router.get("/kcm5/maintenance", maintenanceController.formMaintenanceKCM5);

// SIMPAN DATA
router.post("/kcm5/maintenance/save", maintenanceController.storeMaintenanceKCM5);




module.exports = router;
