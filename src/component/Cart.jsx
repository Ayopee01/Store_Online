import React from 'react';
import { Minus, Plus, X, ShoppingCart, Trash2, Package, Heart } from 'lucide-react';

function Cart({
  cart,
  onRemove,
  onQuantityChange,
  onClear,
  onClose,
  onConfirmOrder,
  isOrdering
}) {
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative bg-white/95 backdrop-blur-lg shadow-2xl rounded-3xl w-96 max-h-[80vh] border border-gray-100 overflow-hidden">
        {/* Header*/}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 text-white relative overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
          <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-white/5 rounded-full blur-lg"></div>
          
          <div className="flex justify-between items-center relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg border border-white/20">
                <ShoppingCart className="w-6 h-6 text-white drop-shadow-sm" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white drop-shadow-sm">Shopping Cart</h2>
                <p className="text-white/80 text-sm font-medium">{totalItems} items</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="cursor-pointer w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/30 transition-all duration-200 border border-white/20 hover:scale-105"
              title="Close"
            >
              <X className="w-5 h-5 text-white drop-shadow-sm" />
            </button>
          </div>
        </div>

        {/* Cart Content */}
        <div className="max-h-[50vh] overflow-y-auto">
          {cart.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                <Package className="w-10 h-10 text-gray-400" strokeWidth={1.5} />
              </div>
              <p className="text-gray-600 font-semibold text-lg">Your cart is empty</p>
              <p className="text-gray-400 text-sm mt-2">Start picking your favorite items now</p>
              <div className="mt-4 flex justify-center">
                <Heart className="w-4 h-4 text-pink-300 animate-pulse" />
              </div>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {cart.map((item, index) => (
                <div key={item.id} className="group bg-gray-50 hover:bg-gray-100 rounded-2xl p-4 transition-all duration-200">
                  <div className="flex items-start gap-4">
                    {/* Product Image */}
                    <div className="relative group">
                      <img 
                        src={item.image_url} 
                        alt={item.name} 
                        className="w-16 h-16 rounded-2xl object-cover shadow-lg border-2 border-white group-hover:scale-105 transition-transform duration-200" 
                      />
                      <div className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg border-2 border-white">
                        {item.quantity}
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                      <p className="text-blue-600 font-bold text-lg">฿{item.price.toLocaleString()}</p>
                      <p className="text-xs text-gray-500 mt-1">Stock Left {item.stock} items</p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center bg-white rounded-2xl border-2 border-gray-100 shadow-md hover:shadow-lg transition-shadow duration-200">
                          <button
                            onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-l-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                          >
                            <Minus className="cursor-pointer w-4 h-4 group-hover:scale-110 transition-transform" strokeWidth={2.5} />
                          </button>
                          <input
                            type="number"
                            min={1}
                            max={item.stock}
                            value={item.quantity}
                            onChange={e => {
                              let val = Number(e.target.value);
                              if (isNaN(val) || val < 1) val = 1;
                              if (val > item.stock) val = item.stock;
                              onQuantityChange(item.id, val);
                            }}
                            className="w-14 text-center border-0 focus:outline-none text-sm font-bold bg-transparent py-2"
                          />
                          <button
                            onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                            className="cursor-pointer w-10 h-10 flex items-center justify-center text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-r-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                          >
                            <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" strokeWidth={2.5} />
                          </button>
                        </div>
                        <div className="text-sm font-bold text-gray-900 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                          ฿{(item.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Button Remove from Cart */}
                    <button
                      onClick={() => onRemove(item.id)}
                      className="cursor-pointer w-10 h-10 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:scale-110 shadow-md hover:shadow-lg"
                      title="Remove from Cart"
                    >
                      <Trash2 className="w-4 h-4" strokeWidth={2} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-gray-100 p-6 space-y-4 bg-white">
            {/* Total */}
            <div className="flex justify-between items-center py-2">
              <span className="text-lg font-semibold text-gray-900">Total Amount</span>
              <span className="text-2xl font-bold text-blue-600">฿{totalPrice.toLocaleString()}</span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                className="cursor-pointer w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                onClick={() => onConfirmOrder(cart)}
                disabled={isOrdering}
              >
                {isOrdering ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing order...
                  </div>
                ) : (
                  `Order Products • ฿${totalPrice.toLocaleString()}`
                )}
              </button>
              
              <button
                className="cursor-pointer w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                onClick={onClear}
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;