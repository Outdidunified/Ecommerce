const mysql = require('mysql2'); // Use mysql2 package
require('dotenv').config({ path: './config/.env' }); // Specify the path to your .env file

console.log(process.env.DB_HOST, process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_NAME);

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 3306,
  connectionLimit: 10, // Maximum number of connections in the pool
});

// Make the pool promise-based
const db = pool.promise(); // Use pool.promise() for promise-based queries

// Example: Checking the connection
db.getConnection()
  .then((connection) => {
    console.log('Connected to the database');
    connection.release(); // Release the connection back to the pool
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
  });

module.exports = db; // Export the pool promise-based connection
