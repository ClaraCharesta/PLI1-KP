// models/LaporanShift.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const LaporanShift = sequelize.define(
  "LaporanShift",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    area: { type: DataTypes.STRING, allowNull: false }, // KCM / RM FM
    tanggal: { type: DataTypes.DATEONLY, allowNull: false },
    shift_kode: DataTypes.STRING,
    no_ref: { type: DataTypes.STRING, unique: true },
    dibuat_oleh: DataTypes.STRING,

    // KCM 841 & 842
    personil_841a: DataTypes.STRING,
    shift_841a: DataTypes.STRING,
    personil_841b: DataTypes.STRING,
    shift_841b: DataTypes.STRING,
    personil_842a: DataTypes.STRING,
    shift_842a: DataTypes.STRING,
    personil_842b: DataTypes.STRING,
    shift_842b: DataTypes.STRING,

    // RM FM 851 & 852
    personil_851a: DataTypes.STRING,
    shift_851a: DataTypes.STRING,
    personil_851b: DataTypes.STRING,
    shift_851b: DataTypes.STRING,
    personil_852a: DataTypes.STRING,
    shift_852a: DataTypes.STRING,
    personil_852b: DataTypes.STRING,
    shift_852b: DataTypes.STRING,

    cuti: DataTypes.STRING,
    is_approved: { type: DataTypes.BOOLEAN, defaultValue: false },
    approved_by: DataTypes.STRING,
    approved_at: DataTypes.DATE,
  },
  {
    tableName: "laporan_shift",
    timestamps: false,
  }
);

module.exports = LaporanShift;
