'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Seeder untuk mengisi created_by pada record Abnormalitas yang kosong
     * Menggunakan user_id = 1 (Admin) sebagai default
     */
    try {
      await queryInterface.sequelize.query(`
        UPDATE abnormalitas 
        SET created_by = 1 
        WHERE created_by IS NULL OR created_by = 0
      `);
      console.log('✅ Filled abnormalitas.created_by with admin user (user_id=1)');
    } catch (error) {
      console.error('❌ Error filling abnormalitas.created_by:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    // Rollback: set created_by back to NULL
    try {
      await queryInterface.sequelize.query(`
        UPDATE abnormalitas 
        SET created_by = NULL 
        WHERE created_by = 1
      `);
      console.log('✅ Rolled back abnormalitas.created_by to NULL');
    } catch (error) {
      console.error('❌ Error rolling back abnormalitas.created_by:', error);
      throw error;
    }
  }
};
