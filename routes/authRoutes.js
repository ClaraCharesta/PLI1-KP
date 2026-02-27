const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const profileController = require("../controllers/profileController");
const db = require("../models");
const User = db.User;
const multer = require("multer");
const path = require("path");

router.get("/logout", authController.logout);

router.get("/about", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  res.render("about", {
    active: "about",
    title: "About",        // ⭐ WAJIB → ini fix error
    user: req.session.user
  });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + path.extname(file.originalname);
    cb(null, unique);
  }
});

const upload = multer({ storage });

router.post("/uploadProfile", authMiddleware, upload.single("profile"), async (req, res) => {
  try {
    console.log("=== UPLOAD PROFILE DEBUG ===");
    console.log("Session User:", req.session.user);

    const userId = req.session.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "User ID tidak ditemukan di session" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Tidak ada file" });
    }

    console.log("Uploading file for userId:", userId);

    // fetch instance rather than static update so we can inspect and guarantee save
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User tidak ditemukan" });
    }

    const newPath = "/uploads/" + req.file.filename;
    user.profile_picture = newPath;
    await user.save();

    console.log("User after update:", user.profile_picture);

    // Update session juga – double check after save
    req.session.user.profile_picture = user.profile_picture;

    res.json({ success: true, path: user.profile_picture });
  } catch (err) {
    console.error("Upload Profile Error:", err);
    res.status(500).json({ success: false, message: "Gagal upload foto: " + err.message });
  }
});

router.post("/deleteProfile", authMiddleware, profileController.deletePhoto);

router.post("/profile/ubah-password", authMiddleware, profileController.ubahPassword);

module.exports = router;
