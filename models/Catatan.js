module.exports = (sequelize, DataTypes) => {
  const Catatan = sequelize.define(
    "Catatan",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      // ikut laporan shift
      no_ref: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      catatan: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: "catatan",
      timestamps: true,
      underscored: true,
    }
  );

  return Catatan;
};
