module.exports = (sequelize, DataTypes) => {
  const Monitoring = sequelize.define(
    "Monitoring",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      no_ref: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      monitoring: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: "monitoring",
      timestamps: true,
      underscored: true,
    }
  );

  return Monitoring;
};
