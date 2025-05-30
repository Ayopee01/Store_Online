const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

// 🔁 ตรวจสอบซ้ำ
router.post("/check-duplicate", async (req, res) => {
  const { username, email } = req.body;
  try {
    if (username) {
      const [rows] = await req.pool.query(
        "SELECT id FROM users WHERE username = ?",
        [username]
      );
      return res.json({ exists: rows.length > 0 });
    }
    if (email) {
      const [rows] = await req.pool.query(
        "SELECT id FROM users WHERE email = ?",
        [email]
      );
      return res.json({ exists: rows.length > 0 });
    }
    return res.status(400).json({ message: "Missing field" });
  } catch (err) {
    console.error("❌ Duplicate check error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// 🔒 Login endpoint
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await req.pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
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
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Register endpoint
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const [check] = await req.pool.execute(
      "SELECT id FROM users WHERE username = ? OR email = ?",
      [username, email]
    );
    if (check.length > 0) {
      return res
        .status(400)
        .json({ message: "Username or Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await req.pool.execute(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword]
    );

    res.json({ message: "User registered successfully!" });
  } catch (err) {
    console.error("❌ Register error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
