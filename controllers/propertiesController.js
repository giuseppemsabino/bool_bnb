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

function store(req, res){
    const {title, n_rooms, n_beds, n_bathrooms, square_meters, address, type, email} = req.body;
    
   const sql =` INSERT INTO properties (title, n_rooms, n_beds, n_bathrooms, square_meters, address, type, email) 
   VALUES (?, ?, ?, ?, ?, ?, ?, ?);`
    connection.query(sql, [title, n_rooms, n_beds, n_bathrooms, square_meters, address, type, email], (err, results) => {
         if(err){
              console.log(err);
              return res.status(500).json({
                status: "KO",
                message: "Database query failed"
              });
         }
         res.json({
              status: "OK",
              message: "Property created",
         });
    }); 

}

function destroy (req, res){
    const id = parseInt(req.params.id);

    const sqlProperty = `
    DELETE FROM properties
    WHERE id = ?
    `;
    connection.query(sqlProperty, [id], (err)=>{
    if (err) return res.status(500).json({ error: "Database Query Failed" });

    })
    res.json({
        status: "OK",
        message: "Property deleted",
   });
}

module.exports = { index, show, store, destroy};
