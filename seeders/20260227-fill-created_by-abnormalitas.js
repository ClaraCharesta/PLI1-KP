'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Update all abnormalitas records where created_by is NULL
      // Set created_by to 1 (assuming admin user has user_id = 1)
      await queryInterface.sequelize.query(
        `UPDATE abnormalitas 
         SET created_by = 1 
         WHERE created_by IS NULL`
      );
      console.log("✅ Seeder: Filled created_by for abnormalitas records");
    } catch (error) {
      console.error("❌ Seeder error:", error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      // Revert: set created_by back to NULL for records that were filled
      await queryInterface.sequelize.query(
        `UPDATE abnormalitas 
         SET created_by = NULL 
         WHERE created_by = 1`
      );
      console.log("✅ Seeder reverted: Reset created_by for abnormalitas records");
    } catch (error) {
      console.error("❌ Seeder revert error:", error);
      throw error;
    }
  }
};
