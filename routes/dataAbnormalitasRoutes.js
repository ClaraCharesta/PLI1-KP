const express = require("express");
const router = express.Router();
const controller = require("../controllers/dataAbnormalitasController");
const multer = require("multer");
const path = require("path");
const authMiddleware = require("../middlewares/authMiddleware");

// ================= UPLOAD CONFIG =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// ================= ROUTES =================

// LIST
router.get("/", controller.index);

// API LIST (JSON)
router.get("/api", controller.listApi);

// FORM ADD
router.get("/add", controller.formAdd);

// STORE
router.post(
  "/add",
  authMiddleware,
  upload.fields([
    { name: "foto_sebelum", maxCount: 1 },
    { name: "foto_sesudah", maxCount: 1 }
  ]),
  controller.store
);

// FORM EDIT
router.get("/edit/:id", controller.formEdit);

// UPDATE
router.post(
  "/update/:id",
  authMiddleware,
  upload.fields([
    { name: "foto_sebelum", maxCount: 1 },
    { name: "foto_sesudah", maxCount: 1 }
  ]),
  controller.update
);

// DELETE
router.delete("/:id", authMiddleware, controller.delete);

module.exports = router;
