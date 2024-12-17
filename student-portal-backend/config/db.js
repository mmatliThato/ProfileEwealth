const mysql = require('mysql2');
require('dotenv').config();

console.log('Database Host:', process.env.DB_HOST);
console.log('Database User:', process.env.DB_USER);
console.log('Database Password:', process.env.DB_PASSWORD);
console.log('Database Name:', process.env.DB_NAME);

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('error connecting:', err.stack);
    return;
  }
  console.log('Connected to MySQL database');
});

module.exports = db;
