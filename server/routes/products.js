const express = require('express');
const router = express.Router();

// 📦 ดึงสินค้าทั้งหมด
router.get('/', async (req, res) => {
  try {
    const [rows] = await req.pool.query('SELECT * FROM products');
    console.log("📦 Products:", rows); // ตรวจสอบข้อมูลที่ดึงได้
    res.json(rows);
  } catch (err) {
    console.error('❌ Error fetching products:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// ➕ เพิ่มสินค้า
router.post('/', async (req, res) => {
  const { name, price, stock, image_url } = req.body;
  try {
    await req.pool.execute(
      'INSERT INTO products (name, price, stock, image_url) VALUES (?, ?, ?, ?)',
      [name, price, stock, image_url]
    );
    res.json({ message: 'Product added successfully' });
  } catch (err) {
    console.error('❌ Error adding product:', err);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// ✏️ แก้ไขสินค้า
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price, stock, image_url } = req.body;
  try {
    await req.pool.execute(
      'UPDATE products SET name = ?, price = ?, stock = ?, image_url = ? WHERE id = ?',
      [name, price, stock, image_url, id]
    );
    res.json({ message: 'Product updated successfully' });
  } catch (err) {
    console.error('❌ Error updating product:', err);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// ❌ ลบสินค้า
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await req.pool.execute('DELETE FROM products WHERE id = ?', [id]);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting product:', err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
