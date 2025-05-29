const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const productRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const pool = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

// OPTIONAL: ใส่ req.pool ให้ใช้ pool ได้ในทุก router ที่ import
app.use((req, res, next) => {
  req.pool = pool;
  next();
});

// Product Routes
app.use('/products', productRouter);

// Orders Routes
app.use('/orders', ordersRouter);

// --- User/Register/Login API ---
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const [check] = await pool.execute(
      "SELECT id FROM users WHERE username = ? OR email = ?",
      [username, email]
    );
    if (check.length > 0) {
      return res.status(400).json({ message: "Username or Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.execute(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword]
    );

    res.json({ message: "User registered successfully!" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: "Email not found" });
    }
    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }
    res.json({
      success: true,
      message: "Login successful",
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post('/check-duplicate', async (req, res) => {
  const { username, email } = req.body;
  try {
    if (username) {
      const [result] = await pool.execute("SELECT id FROM users WHERE username = ?", [username]);
      return res.json({ exists: result.length > 0 });
    }
    if (email) {
      const [result] = await pool.execute("SELECT id FROM users WHERE email = ?", [email]);
      return res.json({ exists: result.length > 0 });
    }
    res.status(400).json({ message: "Missing field" });
  } catch (err) {
    console.error("Duplicate check error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Health Check
app.get('/', (req, res) => {
  res.send("✅ Backend is running!");
});

// Start server
const PORT = 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
