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

  module.exports = {index};