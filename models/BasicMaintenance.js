module.exports = (sequelize, DataTypes) => {
  const BasicMaintenance = sequelize.define(
    "BasicMaintenance",
    {
      no_ref: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },

      tanggal: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },

      week: {
        type: DataTypes.STRING,
        allowNull: false
      },

      mulai: {
        type: DataTypes.TIME,
        allowNull: false
      },

      selesai: {
        type: DataTypes.TIME,
        allowNull: false
      },

      durasi: {
        type: DataTypes.STRING,
        allowNull: true
      },

      rute: {
        type: DataTypes.STRING,
        allowNull: false
      },

      area: {
        type: DataTypes.STRING,
        allowNull: false
      },

      status: {
        type: DataTypes.STRING,
        allowNull: false
      },

      kendala: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      tableName: "basic_maintenance",
      timestamps: true
    }
  );

  return BasicMaintenance;
};
