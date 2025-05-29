// server/db.js
const mysql = require('mysql2/promise');

// ✅ สร้าง pool เดียวและแชร์ทั่วระบบ
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '6461',
  database: 'auth_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
