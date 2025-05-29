
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
const productRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const userRouter = require('./routes/user'); // 👈 เพิ่ม

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Create MySQL pool using .env config
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ✅ Inject pool to all req
app.use((req, res, next) => {
  req.pool = pool;
  next();
});

// ✅ Routes
app.use('/products', productRouter);
app.use('/orders', ordersRouter);
app.use('/', userRouter); // ✅ รวม register, login, check-duplicate

// ✅ Health check
app.get('/', (req, res) => {
  res.send('✅ Backend is running!');
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
