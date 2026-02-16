const { Op } = require("sequelize");
const db = require("../models");
const Nomenclature = db.Nomenclature;

exports.listAjax = async (req, res) => {
  try {
    const search = req.query.search || "";

    const data = await Nomenclature.findAll({
      where: {
        name: {
          [Op.like]: `%${search}%`
        }
      },
      limit: 20
    });

    res.json({
      results: data.map(n => ({
        id: n.id,
        text: n.name
      }))
    });
  } catch (err) {
    console.error("NOMENCLATURE AJAX ERROR:", err);
    res.status(500).json({ results: [] });
  }
};
