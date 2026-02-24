// models/User.js
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: false
    },
    profile_picture: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role_id: {
      type: DataTypes.INTEGER
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: "users",
    timestamps: false
  });

  
  // ✅ RELASI HARUS DI DALAM SINI
  User.associate = (models) => {
    User.hasMany(models.DataBMCM, {
      foreignKey: "created_by", // sesuaikan dengan kolom di tabel DataBMCM
      as: "dataBMCM"
    });
  };


  return User;
};

