const connection = require("../db/conn");

function index(req, res) {
  const sql = `
      SELECT properties.*, types.name AS type_name, types.icon AS type_icon
      FROM properties
      INNER JOIN types
      ON properties.type_id = types.id`;

  connection.query(sql, (err, results) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        status: "KO",
        message: "Database query failed",
      });
    }

    const properties = results.map((property) => ({
      ...property,
      image: generateImage(property.image),
    }));

    res.json({
      message: "ok",
      properties,
    });
  });
}

function show(req, res) {
  const propertyId = req.params.id;

  const sqlProperty = `
      SELECT properties.*, types.name AS type_name, types.icon AS type_icon
      FROM properties
      INNER JOIN types
      ON properties.type_id=types.id
      WHERE properties.id = ?`;
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

    const property = {
      ...results[0],
      image: generateImage(results[0].image),
    };
    console.log(results);

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

      const reviews = results.map((review) => {
        return {
          ...review,
          user_img: generateImage(review.user_img),
        };
      });

      res.json({ property, reviews });
    });
  });
}

//* Create new Property and new Review
function storeProperty(req, res) {
  const {
    title,
    n_rooms,
    n_beds,
    n_bathrooms,
    square_meters,
    address,
    type_id,
    email,
    host_name,
    host_surname,
    description,
  } = req.body;

  if (
    title.length > 3 &&
    address.length > 3 &&
    host_name.length > 3 &&
    host_surname.length > 3 &&
    description.length > 3 &&
    email.length > 3 &&
    !isNaN(n_rooms) &&
    !isNaN(n_beds) &&
    !isNaN(n_bathrooms) &&
    !isNaN(square_meters) &&
    email.includes("@", ".") &&
    typeof title === "string" &&
    typeof address === "string" &&
    typeof email === "string" &&
    typeof host_name === "string" &&
    typeof host_surname === "string" &&
    typeof description === "string" &&
    n_rooms > 0 &&
    n_rooms % 1 === 0 &&
    n_beds > 0 &&
    n_beds % 1 === 0 &&
    n_bathrooms > 0 &&
    n_bathrooms % 1 === 0 &&
    square_meters > 0
  ) {
    const sql = ` INSERT INTO properties (title, n_rooms, n_beds, n_bathrooms, square_meters, address, type_id, email, host_name, host_surname, description) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ?);`;
    connection.query(
      sql,
      [
        title,
        n_rooms,
        n_beds,
        n_bathrooms,
        square_meters,
        address,
        type_id,
        email,
        host_name,
        host_surname,
        description,
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

function storeReview(req, res) {
  const propertyId = req.params.id;

  const { name, surname, content, start_date, stay_days } = req.body;

  const sql = `INSERT INTO reviews (
    name,
    surname,
    content,
    start_date,
    stay_days,
    property_id) 
  VALUES (?, ?, ?, ?, ?, ?);`;
  connection.query(
    sql,
    [name, surname, content, start_date, stay_days, propertyId],
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
        message: "Review created",
      });
    }
  );
}

function destroyProperty(req, res) {
  const id = parseInt(req.params.id);

  const sqlProperty = `
    DELETE FROM properties
    WHERE id = ?
    `;
  connection.query(sqlProperty, [id], (err) => {
    if (err) return res.status(500).json({ error: "Database Query Failed" });

    const sqlReview = `
      DELETE FROM reviews
      WHERE property_id = ?;
    `;

    connection.query(sqlReview, [id], (err) => {
      if (err) return res.status(500).json({ error: "Database Query Failed" });
    });
    res.json({
      status: "OK",
      message: "Property deleted",
    });
  });
}

function destroyReview(req, res) {
  const id = parseInt(req.params.id);

  const sql = `
    DELETE FROM reviews
    WHERE id = ?
    `;
  connection.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ error: "Database Query Failed" });

    res.json({
      status: "OK",
      message: "Review deleted",
    });
  });
}

const generateImage = (coverName) => {
  const { HOST_DOMAIN, HOST_PORT } = process.env;
  return `${HOST_DOMAIN}:${HOST_PORT}/public/img/${coverName}`;
};

module.exports = {
  index,
  show,
  storeProperty,
  storeReview,
  destroyProperty,
  destroyReview,
};
