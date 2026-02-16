module.exports = (sequelize, DataTypes) => {
  const Abnormalitas = sequelize.define("Abnormalitas", {
    abnormal_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    status: DataTypes.STRING,
    week_number: DataTypes.STRING,

    abnormal_date: DataTypes.DATEONLY,
    report_by: DataTypes.STRING,
    area: DataTypes.STRING,
    nomenclature: DataTypes.STRING,
    activity: DataTypes.STRING,

    prioritas: DataTypes.STRING,
    condition: DataTypes.STRING,
    action: DataTypes.STRING,
    abnormal: DataTypes.STRING,
    source: DataTypes.STRING,

    detail_info: DataTypes.TEXT,
    rencana_perbaikan: DataTypes.TEXT,
    notifikasi_unit: DataTypes.STRING,

    id_mso: DataTypes.STRING,

    foto_sebelum: DataTypes.STRING,
    foto_sesudah: DataTypes.STRING
  }, {
    tableName: "abnormalitas",
    timestamps: true
  });

  return Abnormalitas;
};
