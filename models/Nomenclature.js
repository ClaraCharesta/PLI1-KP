module.exports = (sequelize, DataTypes) => {
  const Nomenclature = sequelize.define("Nomenclature", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: "nomenclatures",
    timestamps: false
  });

  return Nomenclature;
};
