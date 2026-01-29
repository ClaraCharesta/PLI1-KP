module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("laporan_kcm5", [
      {
        tanggal: "2026-01-20",
        shift_kode: "01",
        no_ref: "REF001",
        dibuat_oleh: "admin@mail.com",
        personil_841: "Irsyad",
        shift_841: "01",
        personil_842a: "Rafki",
        shift_842a: "01",
        personil_842b: "Salman",
        shift_842b: "01",
        cuti: "Meri",
        is_approved: false
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("laporan_kcm5", null, {});
  }
};
