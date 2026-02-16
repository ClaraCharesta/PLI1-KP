// models/DataBMCM.js
module.exports = (sequelize, DataTypes) => {
  const DataBMCM = sequelize.define(
    "DataBMCM",
    {
      pk_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      week: DataTypes.STRING,
      tanggal: DataTypes.DATEONLY,
      area: DataTypes.STRING,
      supervisor: DataTypes.STRING,
      executor: DataTypes.STRING,
      activity_category: DataTypes.STRING,
      activities: DataTypes.STRING,
      detail_activities: DataTypes.TEXT,
      duration: DataTypes.STRING,
      jumlah_personil: DataTypes.INTEGER,
      main_hour: DataTypes.STRING,
      status_persen: DataTypes.INTEGER,
      status: DataTypes.STRING,
      foto_safety_talk: DataTypes.STRING,
      foto_check_sheet: DataTypes.STRING,
      keterangan: DataTypes.TEXT,
    },
    {
      tableName: "data_bmcm",
      timestamps: false,
    }
  );

  // ✅ RELASI
  DataBMCM.associate = (models) => {
    DataBMCM.belongsTo(models.User, {
      foreignKey: "created_by",
      as: "creator", // nanti dipakai di include
    });
  };

  return DataBMCM;
};
