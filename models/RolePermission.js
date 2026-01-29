module.exports = (sequelize, DataTypes) => {
  const RolePermission = sequelize.define("RolePermission", {
    role_id: DataTypes.INTEGER,
    module: DataTypes.STRING,
    can_view: DataTypes.BOOLEAN,
    can_create: DataTypes.BOOLEAN,
    can_edit: DataTypes.BOOLEAN,
    can_delete: DataTypes.BOOLEAN,
    own_data_only: DataTypes.BOOLEAN
  }, {
    tableName: "role_permissions",
    timestamps: false
  });

  return RolePermission;
};
