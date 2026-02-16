const express = require("express");
const router = express.Router();
const catatanController = require("../controllers/catatanController");


// PAGE
router.get(
  "/laporan-shift/kcm5/catatan",
  catatanController.page
);


// SAVE
router.post(
  "/laporan-shift/kcm5/catatan/save",
  catatanController.store
);

module.exports = router;
