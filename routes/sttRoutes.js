const express = require("express");
const router = express.Router();
const sttController = require("../controllers/sttController");

// SAVE
router.post(
  "/laporan-shift/kcm5/stt/save",
  sttController.store
);


module.exports = router;
