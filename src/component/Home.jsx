import { useEffect, useState, useCallback } from "react";
// Import axios for API requests
import axios from "axios";
// Import components
import Cart from "./Cart";
import OrderSuccess from "./OrderSuccess";
import Navbar from "./Navbar";

function CartIcon({ count }) {
  return (
    <div className="cursor-pointer relative group">
      <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-3 shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 border border-white/20 backdrop-blur-sm">
        {/* Animated background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Cart icon */}
        <svg
          width={28}
          height={28}
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="relative z-10 drop-shadow-sm"
        >
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>

        {/* Item count badge */}
        {count > 0 && (
          <div className="absolute -top-2 -right-2 flex items-center justify-center">
            <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
            <div className="relative bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 shadow-lg border border-white/30">
              {count > 99 ? '99+' : count}
            </div>
          </div>
        )}

        {/* Floating particles effect */}
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-300 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-purple-300 rounded-full opacity-40 animate-pulse delay-1000"></div>
      </div>

      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-black/80 backdrop-blur-sm text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        {count > 0 ? `${count} item${count > 1 ? 's' : ''} in cart` : 'Cart is empty'}
        <div className="absolute top-full right-2 w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent border-t-black/80"></div>
      </div>
    </div>
  );
}
// Map colors to hex values
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

  // --- ดึงสินค้าใหม่ (ใช้ useCallback ป้องกัน warning)
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
      const existIndex = prevCart.findIndex(
        item => item.id === variant.id && item.color === variant.color
      );
      const stock = variant.stock;
      if (existIndex > -1) {
        if (prevCart[existIndex].quantity >= stock) {
          alert("You can't add more than the available stock.");
          return prevCart;
        }
        return prevCart.map((item, idx) =>
          idx === existIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
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

  // --- ส่ง order ไป backend พร้อม user
  const handleConfirmOrder = async (cartData) => {
    try {
      setIsOrdering(true);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/orders`, {
        items: cartData.map(({ id, name, color, quantity, price, image_url }) => ({
          id, name, color, quantity, price, image_url,
        })),
        user: { username: user.username, avatar: user.avatar }, // ส่ง user ไปด้วย (avatar optional)
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

  // ปิด OrderSuccess แล้วรีเฟรชสินค้าใหม่
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
      <button
        className="fixed bottom-6 right-6 z-50 focus:outline-none"
        onClick={() => setCartOpen(true)}
        title="Open Cart"
      >
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
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative z-10 text-center py-16 px-4">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent pb-6">
            Product Catalog
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Product Display Card Example.
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 pb-20">
        {Object.keys(productsByType).map(type => (
          <div key={type} className="mb-16">
            <div className="flex items-center mb-8">
              <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex-1 mr-6"></div>
              <h2 className="text-3xl font-bold text-white tracking-wide">{type}</h2>
              <div className="h-1 bg-gradient-to-l from-blue-500 to-purple-500 rounded-full flex-1 ml-6"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {Object.values(productsByType[type]).map(product => {
                const currentColor = selectedColors[product.name] || product.variants[0].color;
                const variant = product.variants.find(v => v.color === currentColor);
                const isOnSale = variant.color === "Black";
                return (
                  <div key={product.name} className="group relative">
                    <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
                      {isOnSale && (
                        <div className="absolute top-4 left-4 z-20">
                          <div className="relative">
                            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                              <span className="text-white font-bold text-xs">SALE</span>
                            </div>
                            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                              -30%
                            </div>
                          </div>
                        </div>
                      )}
                      <button
                        onClick={() => handleAddToCart(product, variant, isOnSale)}
                        disabled={
                          cart.find(
                            (item) =>
                              item.id === variant.id &&
                              item.color === variant.color &&
                              item.quantity >= variant.stock
                          ) || variant.stock <= 0
                        }
                        className={`cursor-pointer absolute top-4 right-4 z-20 bg-black/50 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:bg-black/70 hover:scale-110 group-hover:opacity-100 opacity-0
                          ${(cart.find(
                          (item) =>
                            item.id === variant.id &&
                            item.color === variant.color &&
                            item.quantity >= variant.stock
                        ) || variant.stock <= 0)
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                          }
                        `}
                        title="Add to Cart"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 5M7 13l-1.5 5m0 0h9m-9 0h9" />
                        </svg>
                      </button>
                      <div className="relative overflow-hidden bg-gradient-to-br from-white to-gray-100 h-64">
                        <img
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          src={variant.image_url}
                          alt={`${product.name} ${variant.color}`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <div className="p-6 space-y-4">
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-1">
                            {product.name}
                          </h3>
                          <span className="inline-block px-3 py-1 bg-white/10 text-white/80 text-sm rounded-full">
                            {variant.color}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          {isOnSale ? (
                            <>
                              <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                                ฿{(variant.price * 0.7).toFixed(2)}
                              </span>
                              <span className="text-lg text-gray-400 line-through">
                                ฿{variant.price}
                              </span>
                            </>
                          ) : (
                            <span className="text-2xl font-bold text-white">
                              ฿{variant.price}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${variant.stock > 10 ? 'bg-green-400' : variant.stock > 5 ? 'bg-yellow-400' : 'bg-red-400'}`}></div>
                          <span className="text-sm text-white/70">
                            {variant.stock > 0 ? `${variant.stock} left in stock` : 'Out of stock'}
                          </span>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <span className="text-sm text-white/70">Available Colors</span>
                          <div className="flex gap-2">
                            {product.variants.map(v => (
                              <button
                                key={v.color}
                                onClick={() => handleColorSelect(product.name, v.color)}
                                className={`cursor-pointer w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110 ${(selectedColors[product.name] || product.variants[0].color) === v.color
                                  ? 'border-blue-400 shadow-lg shadow-blue-400/50'
                                  : 'border-white/30 hover:border-white/60'
                                  }`}
                                style={{ background: colorMap[v.color] || v.color }}
                                title={v.color}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
