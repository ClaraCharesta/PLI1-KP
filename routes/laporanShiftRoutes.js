// routes/laporanShiftRoutes.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/laporanShiftController");

// GET all atau search
router.get("/", controller.list);

router.get("/KCM5", controller.listKCM5);
router.get("/RMFM5", controller.listRMFM5);


// GET detail
router.get("/:id", controller.detail);

// CREATE
router.post("/", controller.create);

// UPDATE
router.put("/:id", controller.update);

// DELETE
router.delete("/:id", controller.delete);

// APPROVE
router.post("/approve/:id", controller.approve);

module.exports = router;
