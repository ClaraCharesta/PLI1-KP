module.exports = (sequelize, DataTypes) => {
  const TsKCM5 = sequelize.define("TsKCM5", {
    no_ref: {
      type: DataTypes.STRING,
      allowNull: false
    },

    tanggal: DataTypes.DATEONLY,
    week: DataTypes.INTEGER,
    area: DataTypes.STRING,

    nomenclature_id: DataTypes.INTEGER,

    mulai: DataTypes.TIME,
    selesai: DataTypes.TIME,
    durasi: DataTypes.FLOAT,

    alarm: DataTypes.STRING,
    indikasi: DataTypes.STRING,

    klasifikasi_peralatan: DataTypes.STRING,
    klasifikasi_pekerjaan: DataTypes.STRING,

    tindakan: DataTypes.STRING,
    pic: DataTypes.TEXT,

    status: DataTypes.STRING,
    keterangan: DataTypes.STRING,
    stop_alat: DataTypes.STRING
  },{
    tableName: "ts_kcm5"
  });

  return TsKCM5;
};
