const db = require("../models");
const { Sequelize } = db;

exports.index = async (req, res) => {
  try {
    const activityChart = await db.sequelize.query(`
      SELECT activity_category AS label, COUNT(*) AS total
      FROM data_bmcm_ppi
      WHERE activity_category IS NOT NULL
      GROUP BY activity_category
    `, { type: Sequelize.QueryTypes.SELECT });

    const statusChart = await db.sequelize.query(`
      SELECT status AS label, COUNT(*) AS total
      FROM data_bmcm_ppi
      WHERE status IS NOT NULL
      GROUP BY status
    `, { type: Sequelize.QueryTypes.SELECT });

    const statusPersenChart = await db.sequelize.query(`
      SELECT CONCAT(status_persen, '%') AS label, COUNT(*) AS total
      FROM data_bmcm_ppi
      WHERE status_persen IS NOT NULL
      GROUP BY status_persen
    `, { type: Sequelize.QueryTypes.SELECT });

    res.render("chartBMCMPPI", {
      title: "Chart Data BM & CM PPI",
      active: "chart",
      activityChart,
      statusChart,
      statusPersenChart
    });
  } catch (error) {
    console.error(error);
    res.send("Error menampilkan chart");
  }
};
