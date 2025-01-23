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

    // console.log(results);

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

    const sqlReviews = `
        SELECT *
        FROM reviews
        WHERE property_id = ?`;
    connection.query(sqlReviews, [propertyId], (err, results) => {
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
      const reviews = results;
      console.log(results);
      
      res.json({property, reviews});
    });
  });

}

function store(req, res) {
  const {
    title,
    n_rooms,
    n_beds,
    n_bathrooms,
    square_meters,
    address,
    type,
    email,
  } = req.body;

  if (
    title.length > 3 &&
    !isNaN(n_rooms) &&
    !isNaN(n_beds) &&
    !isNaN(n_bathrooms) &&
    !isNaN(square_meters) &&
    address.length > 3 &&
    type.length > 3 &&
    email.includes("@", ".") &&
    email.length > 3 &&
    typeof title === "string" &&
    typeof address === "string" &&
    typeof email === "string" &&
    typeof type === "string" &&
    n_rooms > 0 &&
    n_rooms % 1 === 0 &&
    n_beds > 0 &&
    n_beds % 1 === 0 &&
    n_bathrooms > 0 &&
    n_bathrooms % 1 === 0 &&
    square_meters > 0
  ) {
    const sql = ` INSERT INTO properties (title, n_rooms, n_beds, n_bathrooms, square_meters, address, type, email) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);`;
    connection.query(
      sql,
      [
        title,
        n_rooms,
        n_beds,
        n_bathrooms,
        square_meters,
        address,
        type,
        email,
      ],
      (err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            status: "KO",
            message: "Database query failed",
          });
        }
        return res.status(200).json({
          status: "OK",
          message: "Property created",
        });
      }
    );
  } else {
    return res.status(400).json({
      status: "KO",
      message: "Invalid data",
    });
  }
}

function destroy(req, res) {
  const id = parseInt(req.params.id);

  const sqlProperty = `
    DELETE FROM properties
    WHERE id = ?
    `;
  connection.query(sqlProperty, [id], (err) => {
    if (err) return res.status(500).json({ error: "Database Query Failed" });
  });
  res.json({
    status: "OK",
    message: "Property deleted",
  });
}

module.exports = { index, show, store, destroy };
