// db.js
require('dotenv').config();
const mysql = require('mysql2/promise');

const dbPool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4', // <-- Esta línea es crucial
  queueLimit: 0
});

module.exports = dbPool;
