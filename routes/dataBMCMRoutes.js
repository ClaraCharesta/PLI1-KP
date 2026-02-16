const express = require("express");
const router = express.Router();
const dataBMCMController = require("../controllers/dataBMCMController");
const upload = require("../middlewares/dataBMCMMiddleware");

// PAGE
router.get("/page", dataBMCMController.page);
router.get("/add", dataBMCMController.addPage);
router.get("/edit/:id", dataBMCMController.editPage);
router.post('/dataBMCM/update/:id', dataBMCMController.update);

// DATA
router.get("/", dataBMCMController.page);
router.get("/json", dataBMCMController.list);


// CREATE
router.post(
  "/",
  upload.fields([
    { name: "fotoSafetyTalk", maxCount: 1 },
    { name: "fotoCheckSheet", maxCount: 1 }
  ]),
  dataBMCMController.create
);

// UPDATE
router.post(
  "/update/:id",
  upload.fields([
    { name: "fotoSafetyTalk", maxCount: 1 },
    { name: "fotoCheckSheet", maxCount: 1 }
  ]),
  dataBMCMController.update
);

// DELETE
router.delete("/:id", dataBMCMController.delete);

module.exports = router;
