const express = require("express");
const router = express.Router();
const pivot = require("../controllers/pivotController");

// GET utama /chart/pivot
router.get("/", pivot.page); // <-- harus ini, karena page() sudah mengirim charts

// POST filter
router.post("/filter", pivot.filter);

module.exports = router;
