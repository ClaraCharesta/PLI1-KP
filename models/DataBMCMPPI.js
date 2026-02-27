module.exports = (sequelize, DataTypes) => {
  const DataBMCMPPI = sequelize.define(
    "DataBMCMPPI",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
      created_by: DataTypes.INTEGER, 
    },
    {
      tableName: "data_bmcm_ppi",
      timestamps: false,
    }
  );

  DataBMCMPPI.associate = (models) => {
    DataBMCMPPI.belongsTo(models.User, {
      foreignKey: "created_by",
      as: "creator_ppi",
      targetKey: "user_id"
    });
  };

  return DataBMCMPPI;
};