import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Cart from "./Cart";
import OrderSuccess from "./OrderSuccess";
import Navbar from "./Navbar";

function CartIcon({ count }) {
  return (
    <div className="cursor-pointer relative group">
      <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-3 shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 border border-white/20 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 drop-shadow-sm">
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
        {count > 0 && (
          <div className="absolute -top-2 -right-2 flex items-center justify-center">
            <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
            <div className="relative bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 shadow-lg border border-white/30">
              {count > 99 ? '99+' : count}
            </div>
          </div>
        )}
      </div>
      <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-black/80 backdrop-blur-sm text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        {count > 0 ? `${count} item${count > 1 ? 's' : ''} in cart` : 'Cart is empty'}
        <div className="absolute top-full right-2 w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent border-t-black/80"></div>
      </div>
    </div>
  );
}

const colorMap = {
  Black: "#232b39",
  White: "#fff",
  Gray: "#808080",
};

function Home() {
  const [productsByType, setProductsByType] = useState({});
  const [selectedColors, setSelectedColors] = useState({});
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [isOrdering, setIsOrdering] = useState(false);

  const fetchProducts = useCallback(async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/products`);
    const group = {};
    res.data.forEach(item => {
      if (!group[item.type]) group[item.type] = {};
      if (!group[item.type][item.name]) {
        group[item.type][item.name] = { name: item.name, variants: [] };
      }
      group[item.type][item.name].variants.push({
        id: item.id,
        color: item.colors,
        price: item.price,
        stock: item.stock,
        image_url: item.image_url
      });
    });
    setProductsByType(group);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleColorSelect = (productName, color) => {
    setSelectedColors({ ...selectedColors, [productName]: color });
  };

  const handleAddToCart = (product, variant, isOnSale) => {
    setCart(prevCart => {
      const existIndex = prevCart.findIndex(item => item.id === variant.id && item.color === variant.color);
      const stock = variant.stock;
      if (existIndex > -1) {
        if (prevCart[existIndex].quantity >= stock) {
          alert("You can't add more than the available stock.");
          return prevCart;
        }
        return prevCart.map((item, idx) => idx === existIndex ? { ...item, quantity: item.quantity + 1 } : item);
      }
      if (stock < 1) {
        alert("Out of stock.");
        return prevCart;
      }
      return [
        ...prevCart,
        {
          id: variant.id,
          name: product.name,
          color: variant.color,
          price: isOnSale ? Number((variant.price * 0.7).toFixed(2)) : variant.price,
          image_url: variant.image_url,
          quantity: 1,
          stock: stock,
        },
      ];
    });
  };

  const handleRemoveFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const handleQuantityChange = (id, newQty) => {
    setCart(cart.map((item) =>
      item.id === id
        ? { ...item, quantity: Math.max(1, Math.min(newQty, item.stock)) }
        : item
    ));
  };

  const handleClearCart = () => setCart([]);

  const handleConfirmOrder = async (cartData) => {
    try {
      setIsOrdering(true);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/orders`, {
        items: cartData.map(({ id, name, color, quantity, price, image_url }) => ({
          id, name, color, quantity, price, image_url,
        })),
        user: { username: user.username, avatar: user.avatar },
      });
      setOrderResult(res.data);
      setCart([]);
      setCartOpen(false);
    } catch (err) {
      alert("Order failed: " + (err.response?.data?.message || err.message));
    } finally {
      setIsOrdering(false);
    }
  };

  const handleOrderSuccessClose = () => {
    setOrderResult(null);
    fetchProducts();
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      {orderResult && (
        <OrderSuccess
          order={orderResult}
          onBack={handleOrderSuccessClose}
        />
      )}
      <button className="fixed bottom-6 right-6 z-50 focus:outline-none" onClick={() => setCartOpen(true)} title="Open Cart">
        <CartIcon count={totalCartCount} />
      </button>
      {cartOpen && (
        <Cart
          cart={cart}
          onRemove={handleRemoveFromCart}
          onQuantityChange={handleQuantityChange}
          onClear={handleClearCart}
          onClose={() => setCartOpen(false)}
          onConfirmOrder={handleConfirmOrder}
          isOrdering={isOrdering}
        />
      )}
      {/* ... ที่เหลือของ UI catalog (ไม่ต้องแก้เพิ่มเติม) ... */}
    </div>
  );
}

export default Home;
