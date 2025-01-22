const connection = require("../db/conn");

function index(req, res) {
  const sql = `
      SELECT *
      FROM properties`;
  connection.query(sql, (err, results) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        status: "KO",
        message: "Database query failed",
      });
    }

    console.log(results);

    res.json({
      message: "ok",
      results,
    });
  });
}

function show(req, res) {
  const propertyId = req.params.id;

  const sqlProperty = `
      SELECT *
      FROM properties
      WHERE id = ?`;
  connection.query(sqlProperty, [propertyId], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        status: "KO",
        message: "Database query failed",
      });
    }
    if (results.length === 0) {
      return res.status(404).json({
        status: "KO",
        message: "Property not found",
      });
    }
    const [property] = results;

    res.json(property);
  });
}

module.exports = { index, show};
