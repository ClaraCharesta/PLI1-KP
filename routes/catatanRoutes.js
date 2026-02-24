const express = require("express");
const router = express.Router();
const catatanController = require("../controllers/catatanController");


router.get("/kcm5/catatan", catatanController.page);
router.post("/kcm5/catatan/save", catatanController.store);

module.exports = router;
