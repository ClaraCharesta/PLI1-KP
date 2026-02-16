const db = require("../models");
const LaporanShift = db.LaporanShift;
const { Op } = db.Sequelize;

module.exports = async function generateNoRefKCM5() {
  const now = new Date();

  const month = now.getMonth() + 1; // 1–12
  const year = now.getFullYear();

  // Ambil data terakhir BERDASARKAN no_ref (bukan createdAt)
  const last = await LaporanShift.findOne({
    where: {
      area: "KCM5",
      no_ref: {
        [Op.like]: `%/SHIFT.PLI1-KCM5/${month}.${year}`
      }
    },
    order: [["no_ref", "DESC"]] // ✅ FIX UTAMA
  });

  let urut = 1;

  if (last && last.no_ref) {
    const nomor = last.no_ref.split("/")[0]; // "0004"
    urut = parseInt(nomor, 10) + 1;
  }

  const nomorFormatted = String(urut).padStart(4, "0");

  return `${nomorFormatted}/SHIFT.PLI1-KCM5/${month}.${year}`;
};
