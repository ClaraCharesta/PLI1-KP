const db = require("../models");
const { Sequelize } = db;

exports.index = async (req, res) => {
  try {
    const areaChart = await db.sequelize.query(`
      SELECT area AS label, COUNT(*) AS total
      FROM abnormalitas
      WHERE area IS NOT NULL AND TRIM(area) != ''
      GROUP BY area
    `, { type: Sequelize.QueryTypes.SELECT });

    const nomenclatureChart = await db.sequelize.query(`
      SELECT nomenclature AS label, COUNT(*) AS total
      FROM abnormalitas
      WHERE nomenclature IS NOT NULL AND TRIM(nomenclature) != ''
      GROUP BY nomenclature
      ORDER BY total DESC
      LIMIT 20
    `, { type: Sequelize.QueryTypes.SELECT });

    const prioritasChart = await db.sequelize.query(`
      SELECT prioritas AS label, COUNT(*) AS total
      FROM abnormalitas
      WHERE prioritas IS NOT NULL AND TRIM(prioritas) != ''
      GROUP BY prioritas
    `, { type: Sequelize.QueryTypes.SELECT });

    const statusChart = await db.sequelize.query(`
      SELECT status AS label, COUNT(*) AS total
      FROM abnormalitas
      WHERE status IS NOT NULL AND TRIM(status) != ''
      GROUP BY status
    `, { type: Sequelize.QueryTypes.SELECT });

    const abnormalChart = await db.sequelize.query(`
      SELECT abnormal AS label, COUNT(*) AS total
      FROM abnormalitas
      WHERE abnormal IS NOT NULL AND TRIM(abnormal) != ''
      GROUP BY abnormal
    `, { type: Sequelize.QueryTypes.SELECT });

    res.render("chartAbnormalitas", {
      title: "Chart Abnormalitas",
      active: "chart",
      areaChart,
      nomenclatureChart,
      prioritasChart,
      statusChart,
      abnormalChart
    });
  } catch (error) {
    console.error(error);
    res.send("Error menampilkan chart abnormalitas");
  }
};
