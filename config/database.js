const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("pli1_kp", "root", "", {
  host: "localhost",
  dialect: "mysql",
  logging: false
});

module.exports = sequelize;
