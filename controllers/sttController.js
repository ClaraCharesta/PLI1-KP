// controllers/sttController.js
const db = require("../models");
const STT = db.STT;

// ======================================
// FORM STT (tampilkan halaman)
// ======================================
exports.form = async (req, res) => {
  try {
    const no_ref = (req.query.noref || "").trim();

    if (!no_ref) {
      return res.status(400).send("No.Ref wajib ada");
    }

    res.render("sttKCM5", {
      title: "Serah Terima Tool KCM 5",
      active: "stt",
      no_ref: no_ref   // ⭐ INI YANG PENTING
    });

  } catch (err) {
    console.error("STT FORM ERROR:", err);
    res.status(500).send("Gagal load form STT");
  }
};


// ======================================
// STORE STT (POST)
// ======================================
exports.store = async (req, res) => {
  try {
    const {
      no_ref,
      radioComm,
      kunciMobil,
      kunciMotor,
      kunciSubst,
      toolset
    } = req.body;

    const cleanRef = (no_ref || "").trim();

    if (!cleanRef) {
      return res.status(400).send("No.Ref wajib ada");
    }

    await STT.create({
      no_ref: cleanRef,
      radio_comm: radioComm,
      kunci_mobil: kunciMobil,
      kunci_motor: kunciMotor,
      kunci_subst: kunciSubst,
      toolset: toolset
    });

    // Redirect ke detail KCM5 setelah simpan
    res.redirect(`/laporan-shift/kcm5/detail?noref=${cleanRef}`);

  } catch (err) {
    console.error("STT SAVE ERROR:", err);
    res.status(500).send("Gagal simpan STT");
  }
};


// ======================================
// LIST STT (JSON) - untuk debug/API
// ======================================
exports.listJSON = async (req, res) => {
  try {
    const no_ref = (req.query.noref || "").trim();

    if (!no_ref) {
      return res.status(400).json({ error: "No.Ref wajib" });
    }

    const data = await STT.findAll({
      where: { no_ref },
      order: [["id", "ASC"]]
    });

    res.json(data);

  } catch (err) {
    console.error("STT LIST JSON ERROR:", err);
    res.status(500).json({ error: "Gagal load data STT" });
  }
};
