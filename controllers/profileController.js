const bcrypt = require("bcrypt");
const db = require("../models");
const fs = require("fs");
const path = require("path");

exports.ubahPassword = async (req, res) => {
  try {
    const userId = req.session.user?.id;

    if (!userId) {
      console.error("❌ userId tidak ditemukan di session");
      return res.status(401).json({ success: false, message: "Sesi tidak valid" });
    }

    const { oldPassword, newPassword, confirmPassword } = req.body;

    // Validasi input
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, message: "Semua field harus diisi" });
    }

    console.log("🔍 Ubah password untuk userId:", userId);

    const user = await db.User.findByPk(userId);

    if (!user) {
      console.error("❌ User dengan ID", userId, "tidak ditemukan");
      return res.status(404).json({ success: false, message: "User tidak ditemukan" });
    }

    // cek password lama
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
      return res.status(400).json({ success: false, message: "Password lama salah" });
    }

    // cek konfirmasi
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Konfirmasi password tidak sesuai" });
    }

    // cek sama
    if (oldPassword === newPassword) {
      return res.status(400).json({ success: false, message: "Password baru tidak boleh sama dengan password lama" });
    }

    // hash password baru
    const hash = await bcrypt.hash(newPassword, 10);

    await user.update({
      password: hash
    });

    console.log("✅ Password berhasil diubah untuk userId:", userId);

    return res.json({ success: true, message: "Password berhasil diubah" });

  } catch (err) {
    console.error("❌ Error ubahPassword:", err);
    res.status(500).json({ success: false, message: "Terjadi kesalahan server: " + err.message });
  }
};

exports.deletePhoto = async (req, res) => {
  try {
    // Gunakan 'id' bukan 'user_id' - sesuai dengan session
    const userId = req.session.user.id || req.session.user.user_id;

    const user = await db.User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User tidak ditemukan" });
    }

    // Hapus file dari disk jika ada
    if (user.profile_picture) {
      const fileName = user.profile_picture.replace("/uploads/", "");
      const filePath = path.join(__dirname, "../public/uploads", fileName);
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Update database
    await user.update({
      profile_picture: null
    });

    // Update session
    req.session.user.profile_picture = null;

    return res.json({ success: true, message: "Foto profil berhasil dihapus" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Gagal hapus foto profil" });
  }
};