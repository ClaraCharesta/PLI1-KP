const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const LaporanShift = require("./LaporanShift");

const db = {};

db.Role = require("./Role")(sequelize, DataTypes);
db.User = require("./User")(sequelize, DataTypes);
db.RolePermission = require("./RolePermission")(sequelize, DataTypes);


// RELASI
db.Role.hasMany(db.User, { foreignKey: "role_id" });
db.User.belongsTo(db.Role, { foreignKey: "role_id" });

db.Role.hasMany(db.RolePermission, { foreignKey: "role_id" });
db.RolePermission.belongsTo(db.Role, { foreignKey: "role_id" });

// EXPORT
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
