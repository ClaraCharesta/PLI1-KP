module.exports = (sequelize, DataTypes) => {
  const STT = sequelize.define(
    "STT",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      // 🔗 PENGIKAT KE LAPORAN SHIFT
      no_ref: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      radio_comm: DataTypes.STRING,
      kunci_mobil: DataTypes.STRING,
      kunci_motor: DataTypes.STRING,
      kunci_subst: DataTypes.STRING,
      toolset: DataTypes.STRING,
    },
    {
      tableName: "stt",
      timestamps: true,
      underscored: true,
    }
  );

  return STT;
};
