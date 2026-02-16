const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// MODEL LAMA
const LaporanShift = require("./LaporanShift");
const DataBMCM = require("./DataBMCM")(sequelize, DataTypes);
const STT = require("./STT")(sequelize, DataTypes);



// MODEL BARU
const TsKCM5 = require("./TsKCM5")(sequelize, DataTypes);
const Nomenclature = require("./Nomenclature")(sequelize, DataTypes);
const Monitoring = require("./Monitoring")(sequelize, DataTypes);
const Catatan = require("./Catatan")(sequelize, DataTypes);
const BasicMaintenance = require("./BasicMaintenance")(sequelize, DataTypes);


const db = {};

db.LaporanShift = LaporanShift;
db.DataBMCM = DataBMCM;

// BARU
db.TsKCM5 = TsKCM5;
db.Nomenclature = Nomenclature;
db.Monitoring = Monitoring;
db.STT = STT;
db.Catatan = Catatan;
db.BasicMaintenance = BasicMaintenance;



// ROLE SYSTEM
db.Role = require("./Role")(sequelize, DataTypes);
db.User = require("./User")(sequelize, DataTypes);
db.RolePermission = require("./RolePermission")(sequelize, DataTypes);


// RELASI
db.Role.hasMany(db.User, { foreignKey: "role_id" });
db.User.belongsTo(db.Role, { foreignKey: "role_id" });

// ===== MODEL TAMBAHAN =====
db.DataBMCMPPI = require("./DataBMCMPPI")(sequelize, DataTypes);  // dari index baru
db.Abnormalitas = require("./DataAbnormalitas")(sequelize, Sequelize);  // dari index baru

// ===== RELASI TAMBAHAN =====
db.User.hasMany(db.DataBMCMPPI, { foreignKey: "created_by", as: "bmcm_ppi" });
db.DataBMCMPPI.belongsTo(db.User, { foreignKey: "created_by", as: "creator" });


db.Role.hasMany(db.RolePermission, { foreignKey: "role_id" });
db.RolePermission.belongsTo(db.Role, { foreignKey: "role_id" });

// (OPSIONAL) RELASI TS
db.Nomenclature.hasMany(db.TsKCM5, { foreignKey: "nomenclature_id" });
db.TsKCM5.belongsTo(db.Nomenclature, { foreignKey: "nomenclature_id" });

db.TsKCM5.belongsTo(db.Nomenclature, {
  foreignKey: 'nomenclature_id',
  as: 'nomenclature'
});

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});


// EXPORT
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
