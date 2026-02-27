'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Tambahkan kolom created_by ke tabel abnormalitas
    await queryInterface.addColumn('abnormalitas', 'created_by', {
      type: Sequelize.INTEGER,
      allowNull: true,
      after: 'abnormal_id'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Hapus kolom created_by jika perlu rollback
    await queryInterface.removeColumn('abnormalitas', 'created_by');
  }
};
