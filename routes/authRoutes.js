const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const profileController = require("../controllers/profileController");
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

router.post("/uploadProfile", upload.single("profile"), async (req, res) => {
  try {
    const userId = req.session.user.user_id;

    await User.update(
      { profile_picture: "/uploads/" + req.file.filename },
      { where: { user_id: userId } }
    );

    res.json({ success: true, path: "/uploads/" + req.file.filename });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

router.post("/profile/ubah-password", authMiddleware, profileController.ubahPassword);

module.exports = router;
