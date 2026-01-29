const { Sequelize } = require("sequelize");
const db = require("../models"); // pastikan path ini sesuai
const LaporanShift = db.LaporanShift;

async function seed() {
  try {
    // ===========================
    // Data KCM5
    // ===========================
    const kcm5Data = [
      {
        tanggal: new Date("2026-01-01"),
        shift_kode: "A",
        no_ref: "KCM5-001",
        dibuat_oleh: "Admin",
        personil_841: "John",
        shift_841: "Pagi",
        personil_842a: "Doe",
        shift_842a: "Sore",
        personil_842b: "Jane",
        shift_842b: "Malam",
        cuti: 0,
        area: "KCM5",
        is_approved: false
      },
      {
        tanggal: new Date("2026-01-02"),
        shift_kode: "B",
        no_ref: "KCM5-002",
        dibuat_oleh: "Admin",
        personil_841: "Alice",
        shift_841: "Malam",
        personil_842a: "Bob",
        shift_842a: "Pagi",
        personil_842b: "Eve",
        shift_842b: "Sore",
        cuti: 0,
        area: "KCM5",
        is_approved: true
      }
      // Bisa tambah lebih banyak
    ];

    // ===========================
    // Data RMFM5
    // ===========================
    const rmfm5Data = [
      {
        tanggal: new Date("2026-01-01"),
        shift_kode: "A",
        no_ref: "RMFM5-001",
        dibuat_oleh: "Admin",
        personil_841: "Charlie",
        shift_841: "Pagi",
        personil_842a: "Dave",
        shift_842a: "Sore",
        personil_842b: "Fay",
        shift_842b: "Malam",
        cuti: 0,
        area: "RMFM5",
        is_approved: false
      },
      {
        tanggal: new Date("2026-01-02"),
        shift_kode: "B",
        no_ref: "RMFM5-002",
        dibuat_oleh: "Admin",
        personil_841: "Grace",
        shift_841: "Malam",
        personil_842a: "Heidi",
        shift_842a: "Pagi",
        personil_842b: "Ivan",
        shift_842b: "Sore",
        cuti: 0,
        area: "RMFM5",
        is_approved: true
      }
    ];

    // Insert data
    await LaporanShift.bulkCreate([...kcm5Data, ...rmfm5Data]);

    console.log("✅ Seeder selesai: KCM5 & RMFM5 berhasil ditambahkan");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeder gagal:", err);
    process.exit(1);
  }
}

seed();
