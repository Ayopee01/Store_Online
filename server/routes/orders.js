const express = require('express');
const router = express.Router();

router.post("/", async (req, res) => {
  const { items, user_id } = req.body;
  // ใช้ req.pool (ตาม middleware ใน server.js) 
  const conn = await req.pool.getConnection();
  try {
    await conn.beginTransaction();
    for (const item of items) {
      // เช็คสต็อกก่อน
      const [rows] = await conn.query("SELECT stock FROM products WHERE id=?", [item.id]);
      if (!rows.length || rows[0].stock < item.quantity) {
        throw new Error(`สินค้า ${item.name} คงเหลือไม่พอ`);
      }
      // ตัด stock
      await conn.query("UPDATE products SET stock = stock - ? WHERE id=?", [item.quantity, item.id]);
    }
    // เพิ่ม order
    const [orderResult] = await conn.query(
      "INSERT INTO orders (user_id, order_data) VALUES (?, ?)",
      [user_id || null, JSON.stringify(items)]
    );
    await conn.commit();
    res.json({ success: true, orderId: orderResult.insertId, items });
  } catch (e) {
    await conn.rollback();
    res.status(400).json({ success: false, message: e.message });
  } finally {
    conn.release();
  }
});

module.exports = router;
