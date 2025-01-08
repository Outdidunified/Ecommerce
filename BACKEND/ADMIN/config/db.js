const mysql = require('mysql');
require('dotenv').config({ path: './config/.env' }); // Specify the path to your .env file

console.log(process.env.DB_HOST, process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_NAME);

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 3308,
  connectionLimit: 10, // Maximum number of connections in the pool
});

// Example: Checking the connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to the database');
  connection.release(); // Release the connection back to the pool
});

module.exports = pool;
