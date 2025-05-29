// // server/db.js
// const mysql = require('mysql2/promise');

// // ✅ สร้าง pool เดียวและแชร์ทั่วระบบ
// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: '6461',
//   database: 'auth_db',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

// module.exports = pool;

// server/db.js

require("dotenv").config(); // ⬅️ ต้องอยู่บนสุด

const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log("DB HOST:", process.env.DB_HOST);
console.log("DB USER:", process.env.DB_USER);
console.log("DB PASS:", process.env.DB_PASS);

module.exports = pool;

