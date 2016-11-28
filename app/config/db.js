const mysql = require('mysql');

module.exports = mysql.createConnection({
  host     : process.env.DB_HOST || 'localhost',
  user     : process.env.DB_USER || 'root',
  password : process.env.DB_PASSWORD,
  database : 'Hopverkefni'
});
