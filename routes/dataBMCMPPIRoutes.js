const express = require("express");
const router = express.Router();
const controller = require("../controllers/dataBMCMPPIController");
const uploadPPI = require("../middlewares/dataBMCMPPIMiddleware");

// ================= PAGE =================
router.get("/", controller.page);
router.get("/add", controller.addPage);
router.get("/edit/:id", controller.editPage);


// ================= DATA (JSON) =================
router.get("/data", controller.list);

// ================= CREATE =================
router.post(
  "/",
  uploadPPI.fields([
    { name: "fotoSafetyTalk", maxCount: 1 },
    { name: "fotoCheckSheet", maxCount: 1 }
  ]),
  controller.create
);

// ================= UPDATE =================
router.post(
  "/update/:id",
  uploadPPI.fields([
    { name: "fotoSafetyTalk", maxCount: 1 },
    { name: "fotoCheckSheet", maxCount: 1 }
  ]),
  controller.update
);



// ================= DELETE =================
router.delete("/:id", controller.delete);


module.exports = router;
