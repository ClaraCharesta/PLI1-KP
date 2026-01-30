const express = require("express");
const router = express.Router();
const controller = require("../controllers/dataBMCMController");

// LIST
router.get("/", controller.list);

// DETAIL
router.get("/:id", controller.detail);

// CREATE  ←🔥 INI YANG HILANG / SALAH
// router.post("/", controller.create);
router.post(
  "/", 
  (req, res, next) => {
    console.log("✅ POST /data-bmcm MASUK ROUTE");
    console.log("📦 BODY:", req.body);
    next();
  },
  controller.create
);

// UPDATE
router.put("/:id", controller.update);

// DELETE
router.delete("/:id", controller.delete);

module.exports = router;
